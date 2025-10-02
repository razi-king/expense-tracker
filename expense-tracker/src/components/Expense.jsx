import React, { useEffect, useState } from 'react';
import api from '../lib/api';

export default function Expense() {
  const [expense, setExpense] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      const storedId = Number(localStorage.getItem('User_id'));
      console.log("User ID is", storedId);

      if (!storedId) {
        setLoading(false);
        return; // stop if no id found
      }

      try {
        const response = await api.get(`/Expense/getUserExpense/${storedId}`);
        console.log("Response is", response);
        setExpense(response.data || response);
      } catch (err) {
        console.error("Error fetching expenses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Calculate total expenses
  const totalExpenses = expense.reduce((sum, item) => sum + (item.amount || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Expense Tracker</h1>
          <p className="text-gray-600">Manage and track your expenses</p>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <p className="text-sm font-medium text-gray-500 mb-1">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalExpenses)}</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                <p className="text-sm font-medium text-gray-500 mb-1">Number of Expenses</p>
                <p className="text-2xl font-bold text-gray-800">{expense.length}</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <p className="text-sm font-medium text-gray-500 mb-1">Average per Expense</p>
                <p className="text-2xl font-bold text-gray-800">
                  {expense.length > 0 ? formatCurrency(totalExpenses / expense.length) : formatCurrency(0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Expenses List */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Your Expenses</h2>
          </div>

          {/* Expenses List */}
          <div className="p-6">
            {expense.length > 0 ? (
              <div className="space-y-4">
                {expense.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-indigo-100 p-3 rounded-lg">
                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg">{e.title}</h3>
                        <p className="text-gray-500 text-sm flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(e.date)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-red-600">{formatCurrency(e.amount)}</p>
                      <p className="text-sm text-gray-500">Amount</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-12">
                <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses found</h3>
                <p className="text-gray-500 mb-6">Start tracking your expenses by adding your first one.</p>
                <a
                  href="/expense/add-expense"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Your First Expense
                </a>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {expense.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{expense.length}</span> expenses
                </p>
                <a
                  href="/expense/add-expense"
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add New Expense
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}