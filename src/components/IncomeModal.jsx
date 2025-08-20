import React, { useState } from "react";
import { useFirebase } from "../context/Firebase";
import "./Modal.css";
import { toast } from "react-toastify";

function IncomeModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  const { user, addIncome } = useFirebase();
  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const handleAddIncome = async (event) => {
    event.preventDefault();
    if (!user) {
      toast.error("Please login to add income");
      return;
    }
    const incomeData = {
      source,
      amount: parseFloat(amount),
      date,
      category,
    };
    const result = await addIncome(user.uid, incomeData);
    if (result.success) {
      toast.success("Income added successfully");
      setSource("");
      setAmount("");
      setDate("");
      setCategory("");
      onClose();
    } else {
      toast.error(`Error adding income: ${result.error}`);
      console.error("Error adding income:", result.error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add Income</h2>
        <form onSubmit={handleAddIncome}>
          <input 
          type="text" 
          placeholder="Source" 
          className="modal-input" 
          value={source}
          onChange={e => setSource(e.target.value)}
          />
          <input
          type="number" 
          placeholder="Amount" 
          className="modal-input" 
          value={amount}
          onChange={e => setAmount(e.target.value)}
          />
          <input 
          type="date" 
          className="modal-input" 
          value={date}
          onChange={e => setDate(e.target.value)}
          />

          <select 
          className="modal-input"
          value={category}
          onChange={e => setCategory(e.target.value)}>
            <option value="">Select Category</option>
            <option value="salary">Salary</option>
            <option value="freelance">Freelance</option>
            <option value="business">Business</option>
            <option value="other">Other</option>
          </select>
          <button type="submit" className="modal-btn">
            Add
          </button>
        </form>
        <button className="modal-close" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default IncomeModal;
