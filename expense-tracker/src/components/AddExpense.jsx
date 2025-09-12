import React, { useEffect, useState } from "react";
import api from "../lib/api";

export default function AddExpense() {
  const [id, setId] = useState();
  const [expense, setExpense] = useState({
    title: "",
    amount: 0,
    user: { id: null },
  });

  useEffect(() => {
    const storedId = localStorage.getItem("User_id");
    if (storedId) {
      setId(Number(storedId));
      setExpense((prev) => ({
        ...prev,
        user: { id: Number(storedId) },
      }));
    }
  }, []);

  // 🔹 Handle input changes using spread operator
  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value, // ensure amount is number
    }));
  };

  // 🔹 Add expense function
  const addExpense = async (e) => {
    e.preventDefault();
    try {
      await api.post("Expense", expense);
      alert("Expense added successfully ✅");
      setExpense({
        title: "",
        amount: 0,
        user: { id: id },
      });
    } catch (err) {
      console.error("Error Occurred While Adding Expenses", err);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Add Expense</h2>
      <form onSubmit={addExpense} className="space-y-4">
        <div>
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={expense.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter expense title"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Amount</label>
          <input
            type="number"
            name="amount"
            value={expense.amount}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter expense amount"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
}
