import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import api from '../lib/api';
import { to } from '../lib/paths';
import { registerFormSchema } from './hooks/useFormLogic';

export default function UserLoginForm() {
  const [error, setErrors] = useState('');

  async function handleLogin(values, { setSubmitting }) {
    try {
      await api.post("/users/register", values); // ✅ use Formik values, not undefined `user`
      window.location.href = to('/login');
    } catch (err) {
      setErrors(err?.response?.data?.message || "Invalid Credentials"); // ✅ improved error handling
    } finally {
      setSubmitting(false);
    }
  }

  const InputField = ({ name, placeholder, type = 'text' }) => (
    <div>
      {name === 'roles' ? (
        <div>
          <p className='capitalize text-xl text-gray-300'>{name}</p>
          <div className='flex flex-col gap-4'>
            <label className='block mb-2 font-medium'>
              <Field type="checkbox" name={name} value="USER" />
              <span className='ml-2'>USER</span>
            </label>
            <label className='block mb-2 font-medium'>
              <Field type="checkbox" name={name} value="ADMIN" />
              <span className='ml-2'>ADMIN</span>
            </label>
            <label className='block mb-2 font-medium'>
              <Field type="checkbox" name={name} value="MANAGER" />
              <span className='ml-2'>MANAGER</span>
            </label>
          </div>
          <div className='mt-1 text-xs text-red-600' style={{ minHeight: `1.5em` }}>
            <ErrorMessage name={name} component='div' />
          </div>
        </div>
      ) : (
        <div>
          <p className='capitalize text-xl text-gray-300 '>{name}</p>
          <Field
            type={type}
            name={name}
            placeholder={placeholder}
            className="w-full rounded-xl border px-2 py-1 font-normal focus:ring-indigo-500 focus:border-indigo-500"
          />
          <div className='mt-1 text-xs text-red-600' style={{ minHeight: `1.5em` }}>
            <ErrorMessage name={name} component='div' />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <section className='max-w-[500px] mx-auto rounded-2xl shadow-xl px-3 py-5'>
      <div>
        <p className='font-bold text-3xl '>Hii Please Fill The Form For Register</p>
      </div>
      {error && <p className="text-red-600 mt-2">{error}</p>} {/* ✅ show API error */}
      <Formik
        initialValues={{
          name: '',
          email: '',
          password: '',
          roles: []
        }}
        validationSchema={registerFormSchema}
        onSubmit={handleLogin}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <InputField name='name' placeholder='Enter Your Name' />
              <InputField name='email' type='email' placeholder='Enter Your Email' />
              <InputField name='password' placeholder='Enter Your Password' />
              <InputField name='roles' placeholder='Enter Your Roles' />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </Form>
        )}
      </Formik>
    </section>
  )
}
