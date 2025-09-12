import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import api from '../lib/api';
import { loginFormSchema } from './hooks/useFormLogic';
export default function UsersLoginForm() {
    const [error ,setErrors] = useState('');
    const InputField = ({name,placeholder,type='text'})=>(
        <div>
            <p className='capitalize'>{name}</p>
            <Field
                name={name}
                type={type}
                placeholder={placeholder}
                className="w-full rounded-xl border px-2 py-1 font-normal focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className='text-sm font-normal text-red-500'>
                <ErrorMessage component={'div'} name={name}/>
            </div>
        </div>
    )
    async function handleLogin(values, { setSubmitting }) {
        try {
          await api.post("/users/login", values); // ✅ use Formik values, not undefined `user`
          window.location.href = "/user";
        } catch (err) {
          setErrors(err?.response?.data?.message || "Invalid Credentials"); // ✅ improved error handling
        } finally {
          setSubmitting(false);
        }
      }
  return (
   <section className='max-w-[500px] mx-auto rounded-2xl shadow-xl px-3 py-5'>
         <div>
           <p className='font-bold text-3xl '>Hii Please Fill The Form For Login</p>
         </div>
         {error && <p className="text-red-600 mt-2">{error}</p>} {/* ✅ show API error */}
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
                 <InputField name='name' placeholder='Enter Your Name' />
                 <InputField name='password' placeholder='Enter Your Password' />
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
