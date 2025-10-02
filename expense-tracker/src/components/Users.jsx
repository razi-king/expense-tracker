import React, { useEffect, useState } from 'react'
import api from '../lib/api'

export default function Users() {
    const [user, setUser] = useState([])
    
    useEffect(() => {
       const fetchUser = async () => {
        try {
            const response = await api.get("/users");
            console.log("Response Is ", response);
            setUser(response)
            console.log('Data', user)
            localStorage.setItem("User_id", response.id);
            console.log("Id is", user.id);
        } catch(err) {
            console.error("Error fetching users:", err);
        }
       };
       fetchUser();
    }, [])
   
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">User Details</h1>
                    <div className="w-20 h-1 bg-indigo-600 mx-auto rounded-full"></div>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    {/* Welcome Banner */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                        <h2 className="text-2xl font-semibold text-white">
                            Welcome {user.name || 'User'}
                        </h2>
                        <p className="text-indigo-100 text-sm mt-1">
                            Here are your account details
                        </p>
                    </div>

                    {/* User Details */}
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Email */}
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-blue-100 p-2 rounded-lg">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Email</p>
                                        <p className="text-gray-800 font-semibold">{user.email || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Roles */}
                            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-purple-100 p-2 rounded-lg">
                                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Roles</p>
                                        <p className="text-gray-800 font-semibold">{user.roles || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Expense */}
                            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-green-100 p-2 rounded-lg">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Expense</p>
                                        <p className="text-gray-800 font-semibold">{user.expense || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Password - Hidden for security */}
                            <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-red-100 p-2 rounded-lg">
                                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Password</p>
                                        <p className="text-gray-800 font-semibold">••••••••</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                        <a 
                            href='/expense/add-expense'
                            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Expense
                        </a>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        User ID: <span className="font-mono text-gray-700">{user.id || 'Loading...'}</span>
                    </p>
                </div>
            </div>
        </div>
    )
}