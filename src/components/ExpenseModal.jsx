import React,{useState} from "react";
import { useFirebase } from "../context/Firebase";
import { toast } from "react-toastify";
import "./Modal.css";

function ExpenseModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  const { user, addExpense } = useFirebase();
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const handleAddExpense = async (event) => {
    event.preventDefault();
    if (!user) {
      toast.error("Please login to add expense");
      return;
    }
    const expenseData = {
      category,
      amount: parseFloat(amount),
      description,
      date,
      paymentMethod,
    };
    const result = await addExpense(user.uid, expenseData);
    if (result.success) {
      toast.success("Expense added successfully");
      setCategory("");
      setAmount("");
      setDescription("");
      setDate("");
      setPaymentMethod("");
      onClose();
    } else {
      toast.error(`Error adding expense: ${result.error}`);
      console.error("Error adding expense:", result.error);
    }
  };
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add Expense</h2>
        <form onSubmit={handleAddExpense}>
          <input
            type="text"
            placeholder="Category (e.g., Food, Travel)"
            className="modal-input"
            value={category}
            onChange={e => setCategory(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            className="modal-input"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            className="modal-input"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <input
            type="date"
            className="modal-input"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
          <select 
          className="modal-input"
           value={paymentMethod}
  onChange={e => setPaymentMethod(e.target.value)}
  >
            <option value="">Select Payment Method</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="upi">UPI</option>
            <option value="bank">Bank Transfer</option>
          </select>
          <button type="submit" className="modal-btn">
            Add Expense
          </button>
        </form>
        <button className="modal-close" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default ExpenseModal;
