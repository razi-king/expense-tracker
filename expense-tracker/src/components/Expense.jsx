import React, { useEffect, useState } from 'react';
import api from '../lib/api';

export default function Expense() {
  const [expense, setExpense] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      const storedId = Number(localStorage.getItem('User_id'));
      console.log("User ID is", storedId);

      if (!storedId) return; // stop if no id found

      try {
        const response = await api.get(`/Expense/getUserExpense/${storedId}`);
        console.log("Response is", response);
        // If api.js interceptor returns only data, use response
        // If it returns full axios response, use response.data
        setExpense(response.data || response);
      } catch (err) {
        console.error("Error fetching expenses:", err);
      }
    };

    fetchExpenses();
  }, []); // run once when component mounts

  return (
    <div>
      <ul>
        {expense.length > 0 ? (
          expense.map((e) => (
            <li key={e.id}>
              {e.title} ({e.date}) - {e.amount}
            </li>
          ))
        ) : (
          <p>No expenses found.</p>
        )}
      </ul>
    </div>
  );
}
