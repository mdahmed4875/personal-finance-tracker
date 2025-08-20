import React, { useState, useMemo } from "react";
import "./TransactionsTable.css"; 

const TransactionsTable = ({ incomes = [], expenses = [] }) => {
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });

  // Merge incomes and expenses into one array
  const transactions = useMemo(() => {
    const merged = [
      ...incomes.map(i => ({ ...i, type: "Income" })),
      ...expenses.map(e => ({ ...e, type: "Expense" })),
    ];

    if (sortConfig.key) {
      merged.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (sortConfig.key === "date") {
          aVal = new Date(aVal);
          bVal = new Date(bVal);
        }

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return merged;
  }, [incomes, expenses, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  return (
    <div className="transactions-table">
      <h2>All Transactions</h2>
      <div className="sort-buttons">
        <button onClick={() => handleSort("date")}>
          Sort by Date {sortConfig.key === "date" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
        </button>
        <button onClick={() => handleSort("amount")}>
          Sort by Amount {sortConfig.key === "amount" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Category / Source</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Description / Payment Method</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td>{tx.type}</td>
              <td>{tx.type === "Income" ? tx.source : tx.category}</td>
              <td>{tx.amount}</td>
              <td>{new Date(tx.date).toLocaleDateString()}</td>
              <td>{tx.type === "Income" ? tx.category : tx.paymentMethod || tx.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;
