import { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { apiConfigured, request, session, wakeServer } from '../lib/api';
import { to } from '../lib/paths';

const schemas = {
  login: Yup.object({
    name: Yup.string().trim().required('Username is required'),
    password: Yup.string().required('Password is required'),
  }),
  register: Yup.object({
    name: Yup.string()
      .trim()
      .min(3, 'Username must be 3 to 40 characters')
      .max(40, 'Username must be 3 to 40 characters')
      .matches(/^[A-Za-z0-9_]+$/, 'Use letters, numbers and underscores only')
      .required('Username is required'),
    email: Yup.string().trim().email('Email address is not valid').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').max(64).required('Password is required'),
  }),
};

function Input({ name, label, type = 'text', autoComplete, hint }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-medium text-slate-700">{label}</label>
      <Field
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
      />
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
      <ErrorMessage name={name} component="p" className="text-sm text-red-600" />
    </div>
  );
}

export default function AuthForm({ mode }) {
  const isLogin = mode === 'login';
  const [banner, setBanner] = useState('');
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    if (session.token()) window.location.replace(to('/dashboard'));
    if (new URLSearchParams(location.search).has('expired')) setBanner('Your session expired. Please log in again.');
    wakeServer();
  }, []);

  async function submit(values, { setSubmitting, setErrors }) {
    setBanner('');
    setSlow(false);
    try {
      const res = await request(isLogin ? '/api/auth/login' : '/api/auth/register', {
        method: 'POST',
        body: values,
        onSlow: () => setSlow(true),
      });
      session.save(res);
      window.location.href = to('/dashboard');
    } catch (err) {
      setErrors(err.fields || {});
      setBanner(err.message);
    } finally {
      setSlow(false);
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <a href={to('/')} className="mb-8 flex items-center justify-center gap-2 text-slate-900">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-600 font-bold text-white">₹</span>
          <span className="text-lg font-semibold">Expense Tracker</span>
        </a>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">{isLogin ? 'Log in' : 'Create your account'}</h1>
          <p className="mt-1 text-sm text-slate-600">
            {isLogin ? 'Track where your money goes, month by month.' : 'It takes 20 seconds. No card needed.'}
          </p>

          {!apiConfigured && (
            <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              The backend isn&apos;t connected yet, so logging in won&apos;t work on this deployment.
            </p>
          )}
          {banner && (
            <p role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{banner}</p>
          )}

          <Formik
            initialValues={isLogin ? { name: '', password: '' } : { name: '', email: '', password: '' }}
            validationSchema={schemas[mode]}
            onSubmit={submit}
          >
            {({ isSubmitting }) => (
              <Form className="mt-6 space-y-5" noValidate>
                <Input name="name" label="Username" autoComplete="username" />
                {!isLogin && <Input name="email" label="Email" type="email" autoComplete="email" />}
                <Input
                  name="password"
                  label="Password"
                  type="password"
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  hint={isLogin ? undefined : 'At least 8 characters.'}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-progress disabled:opacity-70"
                >
                  {isSubmitting ? (isLogin ? 'Logging in…' : 'Creating account…') : isLogin ? 'Log in' : 'Create account'}
                </button>
                {slow && (
                  <p className="text-center text-sm text-slate-500">
                    Waking up the server. On free hosting this can take up to a minute.
                  </p>
                )}
              </Form>
            )}
          </Formik>

          <p className="mt-6 text-center text-sm text-slate-600">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <a href={to(isLogin ? '/register' : '/login')} className="font-semibold text-emerald-700 hover:text-emerald-800">
              {isLogin ? 'Sign up' : 'Log in'}
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
