import React, { useState, useEffect } from "react";
import { useFirebase } from "../context/Firebase";
import { toast } from "react-toastify";
import "./Expense.css";
function EditIncome({transaction, isopen, onclose}) {
  const firebase = useFirebase();

  // Step 1: Initialize empty form data
  const [formData, setFormData] = useState({
    source: "",
    amount: "",
    date: "",
    category: "",
    description: "",
  });

  // Step 2: When the modal opens with a transaction, fill formData
  useEffect(() => {
    if (transaction && isopen) {
      setFormData({
        source: transaction.source || "",
        amount: transaction.amount || "",
        date: transaction.date ? transaction.date.split("T")[0] : "", // Convert timestamp to yyyy-mm-dd
        category: transaction.category || "",
        description: transaction.description || "",
      });
    }
  }, [transaction, isopen]);

  // Step 3: Handle changes in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Step 4: Handle form submit (update Firebase)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await firebase.editIncome(transaction.id, formData); // 🔹 call your Firebase update function
      onclose();
      toast
    } catch (error) {
      toast.error("Failed to update income. Please try again.");
    }
  };

  // Step 5: Don’t render if modal is closed
  if (!isopen) return null;

  // Step 6: Render form fields
  return (
    <div className="modal-overlay">
      <div className="modal bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Edit Income</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            name="source"
            value={formData.source}
            onChange={handleChange}
            placeholder="Source"
            className="border p-2 rounded"
          />
          <input
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Amount"
            className="border p-2 rounded"
          />
          <input
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category"
            className="border p-2 rounded"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="border p-2 rounded"
          />
          <div className="flex justify-end gap-3 mt-3">
            <button
              type="button"
              onClick={onclose}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditIncome;
