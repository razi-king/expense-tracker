import { useEffect, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { CATEGORIES, today } from '../lib/format';

const schema = Yup.object({
  title: Yup.string().trim().max(60, 'At most 60 characters').required('Title is required'),
  amount: Yup.number()
    .typeError('Enter an amount')
    .positive('Amount must be greater than zero')
    .test('2dp', 'At most 2 decimal places', (v) => v == null || /^\d+(\.\d{1,2})?$/.test(String(v)))
    .required('Amount is required'),
  category: Yup.string().required('Pick a category'),
  date: Yup.string()
    .required('Date is required')
    .test('past', 'Date cannot be in the future', (v) => !v || v <= today()),
  note: Yup.string().max(200, 'At most 200 characters'),
});

const field =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30';

/** Add or edit an expense in a native <dialog> (focus trap and Esc for free). */
export default function ExpenseDialog({ expense, onClose, onSave }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);

  const initial = expense
    ? { ...expense, amount: String(expense.amount), note: expense.note || '' }
    : { title: '', amount: '', category: 'FOOD', date: today(), note: '' };

  async function submit(values, { setErrors, setStatus, setSubmitting }) {
    setStatus(null);
    try {
      await onSave({ ...values, title: values.title.trim(), amount: Number(values.amount) });
    } catch (err) {
      setErrors(err.fields || {});
      setStatus(err.message);
      setSubmitting(false);
    }
  }

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className="m-auto w-full max-w-lg rounded-2xl p-0 shadow-2xl backdrop:bg-slate-900/40"
      aria-labelledby="expense-dialog-title"
    >
      <Formik initialValues={initial} validationSchema={schema} onSubmit={submit}>
        {({ isSubmitting, status }) => (
          <Form className="space-y-4 p-6" noValidate>
            <div className="flex items-start justify-between">
              <h2 id="expense-dialog-title" className="text-lg font-semibold text-slate-900">
                {expense ? 'Edit expense' : 'Add expense'}
              </h2>
              <button type="button" onClick={() => ref.current.close()} className="rounded p-1 text-slate-500 hover:bg-slate-100" aria-label="Close">
                ✕
              </button>
            </div>
            {status && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{status}</p>}

            <div className="space-y-1">
              <label htmlFor="title" className="text-sm font-medium text-slate-700">Title</label>
              <Field id="title" name="title" className={field} placeholder="Groceries" autoFocus />
              <ErrorMessage name="title" component="p" className="text-sm text-red-600" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="amount" className="text-sm font-medium text-slate-700">Amount (₹)</label>
                <Field id="amount" name="amount" inputMode="decimal" className={field} placeholder="0.00" />
                <ErrorMessage name="amount" component="p" className="text-sm text-red-600" />
              </div>
              <div className="space-y-1">
                <label htmlFor="date" className="text-sm font-medium text-slate-700">Date</label>
                <Field id="date" name="date" type="date" max={today()} className={field} />
                <ErrorMessage name="date" component="p" className="text-sm text-red-600" />
              </div>
            </div>

            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-slate-700">Category</legend>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <label key={c.id} className="cursor-pointer">
                    <Field type="radio" name="category" value={c.id} className="peer sr-only" />
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-700 peer-checked:border-slate-900 peer-checked:bg-slate-900 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-500">
                      <i className="h-2 w-2 rounded-full" style={{ background: c.color }} aria-hidden="true" />
                      {c.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="space-y-1">
              <label htmlFor="note" className="text-sm font-medium text-slate-700">
                Note <span className="font-normal text-slate-500">(optional)</span>
              </label>
              <Field id="note" name="note" as="textarea" rows={2} className={field} />
              <ErrorMessage name="note" component="p" className="text-sm text-red-600" />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => ref.current.close()} className="rounded-lg px-4 py-2 font-medium text-slate-700 hover:bg-slate-100">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700 disabled:opacity-70">
                {isSubmitting ? 'Saving…' : expense ? 'Save changes' : 'Add expense'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </dialog>
  );
}
