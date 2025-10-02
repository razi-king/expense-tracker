import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import api from '../lib/api';
import { loginFormSchema } from './hooks/useFormLogic';

export default function UsersLoginForm() {
    const [error, setErrors] = useState('');
    
    const InputField = ({ name, placeholder, type = 'text' }) => (
        <div className="mb-6">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                {name}
            </label>
            <Field
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md"
            />
            <div className='text-sm font-normal text-red-500 mt-1'>
                <ErrorMessage component={'div'} name={name} />
            </div>
        </div>
    )

    async function handleLogin(values, { setSubmitting }) {
        try {
            await api.post("/users/login", values);
            window.location.href = "/user";
        } catch (err) {
            setErrors(err?.response?.data?.message || "Invalid Credentials");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <section className='w-full max-w-md'>
                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8 text-center">
                        <div className="bg-white/20 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className='font-bold text-2xl text-white mb-2'>Welcome Back</h1>
                        <p className='text-indigo-100 text-sm'>Please fill the form to login to your account</p>
                    </div>

                    {/* Form Section */}
                    <div className="px-6 py-8">
                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-red-600 text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <Formik
                            initialValues={{
                                name: '',
                                password: '',
                            }}
                            validationSchema={loginFormSchema}
                            onSubmit={handleLogin}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <div>
                                        <InputField 
                                            name='name' 
                                            placeholder='Enter your username' 
                                        />
                                        <InputField 
                                            name='password' 
                                            placeholder='Enter your password' 
                                            type='password'
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center justify-center space-x-2">
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Logging in...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center space-x-2">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                                </svg>
                                                <span>Login to Account</span>
                                            </div>
                                        )}
                                    </button>
                                </Form>
                            )}
                        </Formik>

                        {/* Additional Links */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{' '}
                                <a href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                                    Sign up here
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                        Secure login with encrypted credentials
                    </p>
                </div>
            </section>
        </div>
    )
}