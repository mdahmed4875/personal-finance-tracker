import React, { useState, useEffect } from "react";
import { useFirebase } from "../context/Firebase";
import { toast } from "react-toastify";
import "./Expense.css";
function EditExpense({ transaction, isopen, onclose }) {
  const firebase = useFirebase();

  // ✅ Single object state for all form fields
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    description: "",
    date: "",
    paymentMethod: "",
  });

  // ✅ Fill the form when modal opens
  useEffect(() => {
    if (transaction && isopen) {
      setFormData({
        category: transaction.category || "",
        amount: transaction.amount || "",
        description: transaction.description || "",
        date: transaction.date ? transaction.date.split("T")[0] : "",
        paymentMethod: transaction.paymentMethod || "",
      });
    }
  }, [transaction, isopen]);

  // ✅ Update the corresponding field in formData
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Handle submit and update in Firebase
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await firebase.editExpense(transaction.id, formData);
      onclose();
      toast.success("Expense updated successfully!");
    } catch (error) {
      toast.error("Failed to update expense. Please try again.");
    }
  };

  if (!isopen) return null;

  return (
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="modal bg-white p-6 rounded-lg shadow-md w-[90%] max-w-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Edit Expense</h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category"
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
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            placeholder="Payment Method (Cash / Card)"
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
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditExpense;
