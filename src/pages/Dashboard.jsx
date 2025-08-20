import React, { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import IncomeModal from "../components/IncomeModal";
import ExpenseModal from "../components/ExpenseModal";
import { useFirebase } from "../context/Firebase";
import "./DashBoard.css";
import IncomeExpenseAreaChart from "../components/IncomeExpenseAreaChart";
import ExpensesChart from "../components/ExpensesChart";
import TransactionsTable from "../components/TransactionsTable";
import { toast } from "react-toastify";

function Dashboard() {
  const [showIncome, setShowIncome] = useState(false);
  const [showExpense, setShowExpense] = useState(false);
  const [userData, setUserData] = useState(null);
  const { user, firestoreDB } = useFirebase();

  const handleReset = async () => {
    if (!user) return;
    const confirmed = window.confirm("Are you sure you want to reset all transactions?");
    if (!confirmed) return;
    try {
      const userRef = doc(firestoreDB, "users", user.uid);
      await updateDoc(userRef, {
        incomes: [],
        expenses: []
      });
      toast.success("All transactions have been reset!");
    } catch (error) {
      console.error("Reset error:", error);
      toast.error("Failed to reset transactions.");
    }
  };

  useEffect(() => {
    if (!user) return;
    const userRef = doc(firestoreDB, "users", user.uid);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) setUserData(doc.data());
    });
    return () => unsubscribe();
  }, [user, firestoreDB]);

  const totalIncome = userData?.incomes?.reduce((sum, i) => sum + (i.amount || 0), 0) || 0;
  const totalExpense = userData?.expenses?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0;
  const totalBalance = totalIncome - totalExpense;

  return (
    <div className="dashboard">
      <Navbar />

      {/* Cards Section */}
      <div className="cards-container">
        <Card title="Total Balance" number={totalBalance} buttonName="Reset" onButtonClick={handleReset} />
        <Card title="Total Income" number={totalIncome} buttonName="Add Income" onButtonClick={() => setShowIncome(true)} />
        <Card title="Total Expense" number={totalExpense} buttonName="Add Expense" onButtonClick={() => setShowExpense(true)} />
      </div>

      {/* Charts Section */}
      <div className="charts-container">
        <div className="chart-item">
          <h3>Expenses Chart</h3>
          <ExpensesChart incomes={userData?.incomes || []} expenses={userData?.expenses || []} />
        </div>
        <div className="chart-item">
          <h3>Income vs Expense Area Chart</h3>
          <IncomeExpenseAreaChart incomes={userData?.incomes || []} expenses={userData?.expenses || []} />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="transactions-container">
        <TransactionsTable incomes={userData?.incomes || []} expenses={userData?.expenses || []} />
      </div>

      {/* Modals */}
      <IncomeModal isOpen={showIncome} onClose={() => setShowIncome(false)} />
      <ExpenseModal isOpen={showExpense} onClose={() => setShowExpense(false)} />
    </div>
  );
}

export default Dashboard;
