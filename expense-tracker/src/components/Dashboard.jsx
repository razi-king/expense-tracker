import { useCallback, useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ExpenseDialog from './ExpenseDialog';
import { request, session } from '../lib/api';
import { to } from '../lib/paths';
import { CATEGORIES, category, dateLabel, money, moneyShort, monthLabel, shiftMonth, thisMonth } from '../lib/format';

function Stat({ label, value, sub }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">{value}</p>
      {sub && <p className="mt-1 text-sm text-slate-500">{sub}</p>}
    </div>
  );
}

function Empty({ onAdd, filtered }) {
  return (
    <div className="px-6 py-14 text-center">
      <p className="font-medium text-slate-900">{filtered ? 'No expenses in this category' : 'No expenses this month'}</p>
      <p className="mt-1 text-sm text-slate-500">
        {filtered ? 'Try another category or clear the filter.' : 'Add your first one to see your spending breakdown.'}
      </p>
      {!filtered && (
        <button onClick={onAdd} className="mt-5 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700">
          Add expense
        </button>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [month, setMonth] = useState(thisMonth());
  const [filter, setFilter] = useState('');
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [slow, setSlow] = useState(false);
  const [editing, setEditing] = useState(null); // null = closed, {} = new, expense = edit
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!session.token()) {
      window.location.replace(to('/login'));
      return;
    }
    setUser(session.user());
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const q = `month=${month}${filter ? `&category=${filter}` : ''}`;
      const [list, sum] = await Promise.all([
        request(`/api/expenses?${q}`, { onSlow: () => setSlow(true) }),
        request(`/api/expenses/summary?month=${month}`),
      ]);
      setItems(list);
      setSummary(sum);
    } catch (err) {
      setError(err.message);
    } finally {
      setSlow(false);
      setLoading(false);
    }
  }, [month, filter]);

  useEffect(() => {
    if (session.token()) load();
  }, [load]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  async function save(values) {
    const isEdit = Boolean(editing?.id);
    await request(isEdit ? `/api/expenses/${editing.id}` : '/api/expenses', { method: isEdit ? 'PUT' : 'POST', body: values });
    setEditing(null);
    setToast(isEdit ? 'Expense updated' : 'Expense added');
    if (values.date.slice(0, 7) !== month) setMonth(values.date.slice(0, 7));
    else load();
  }

  async function remove(e) {
    if (!window.confirm(`Delete "${e.title}" (${money(e.amount)})?`)) return;
    try {
      await request(`/api/expenses/${e.id}`, { method: 'DELETE' });
      setToast('Expense deleted');
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  function logout() {
    session.clear();
    window.location.href = to('/login');
  }

  const pieData = useMemo(
    () => (summary?.byCategory || []).map((c) => ({ ...c, total: Number(c.total), label: category(c.category).label })),
    [summary],
  );
  const barData = useMemo(
    () => (summary?.lastSixMonths || []).map((m) => ({ ...m, total: Number(m.total), label: monthLabel(m.month, 'short') })),
    [summary],
  );
  const isCurrent = month === thisMonth();
  const top = summary?.topCategory;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-600 font-bold text-white">₹</span>
            <span className="font-semibold text-slate-900">Expense Tracker</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-slate-600 sm:inline">{user?.name}</span>
            <button onClick={logout} className="rounded-lg px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100">Log out</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button onClick={() => setMonth(shiftMonth(month, -1))} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-slate-700 hover:bg-slate-100" aria-label="Previous month">‹</button>
            <h1 className="min-w-44 text-center text-xl font-semibold text-slate-900">{monthLabel(month)}</h1>
            <button onClick={() => setMonth(shiftMonth(month, 1))} disabled={isCurrent} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-slate-700 hover:bg-slate-100 disabled:opacity-40" aria-label="Next month">›</button>
          </div>
          <button onClick={() => setEditing({})} className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white shadow-sm hover:bg-emerald-700">
            + Add expense
          </button>
        </div>

        {slow && <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">Waking up the server. On free hosting the first load can take up to a minute.</p>}
        {error && (
          <p role="alert" className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
            <button onClick={load} className="font-semibold underline">Try again</button>
          </p>
        )}

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4" aria-label="Summary">
          <Stat label="Spent this month" value={summary ? money(summary.total) : '—'} />
          <Stat label="Expenses" value={summary ? summary.count : '—'} />
          <Stat label="Daily average" value={summary ? money(summary.dailyAverage) : '—'} sub={isCurrent ? 'so far this month' : undefined} />
          <Stat label="Top category" value={top ? category(top.category).label : '—'} sub={top ? money(top.total) : undefined} />
        </section>

        <section className="grid gap-4 lg:grid-cols-5">
          <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2">
            <h2 className="font-semibold text-slate-900">Where it went</h2>
            {pieData.length ? (
              <div className="mt-2 flex flex-col items-center gap-4 sm:flex-row">
                <div className="h-44 w-44 shrink-0">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={pieData} dataKey="total" nameKey="label" innerRadius={48} outerRadius={80} paddingAngle={2} stroke="none">
                        {pieData.map((d) => <Cell key={d.category} fill={category(d.category).color} />)}
                      </Pie>
                      <Tooltip formatter={(v) => money(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <ul className="w-full flex-1 space-y-1.5 text-sm">
                  {pieData.map((d) => (
                    <li key={d.category} className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-slate-700">
                        <i className="h-2.5 w-2.5 rounded-full" style={{ background: category(d.category).color }} />
                        {d.label}
                      </span>
                      <span className="tabular-nums text-slate-900">{money(d.total)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-6 text-sm text-slate-500">Your category breakdown appears here.</p>
            )}
          </div>

          <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 lg:col-span-3">
            <h2 className="font-semibold text-slate-900">Last 6 months</h2>
            <div className="mt-4 h-48">
              <ResponsiveContainer>
                <BarChart data={barData} margin={{ left: -8 }}>
                  <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickFormatter={moneyShort} tickLine={false} axisLine={false} fontSize={12} width={64} />
                  <Tooltip formatter={(v) => money(v)} cursor={{ fill: '#f1f5f9' }} />
                  <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                    {barData.map((d) => <Cell key={d.month} fill={d.month === month ? '#059669' : '#a7f3d0'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold text-slate-900">Expenses</h2>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              Category
              <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-slate-900">
                <option value="">All</option>
                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </label>
          </div>
          {loading ? (
            <p className="px-5 py-10 text-center text-sm text-slate-500">Loading…</p>
          ) : items.length === 0 ? (
            <Empty onAdd={() => setEditing({})} filtered={Boolean(filter)} />
          ) : (
            <ul className="divide-y divide-slate-100">
              {items.map((e) => {
                const c = category(e.category);
                return (
                  <li key={e.id} className="flex items-center gap-3 px-4 py-3.5 sm:gap-4 sm:px-5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-sm font-semibold text-white" style={{ background: c.color }} aria-hidden="true">
                      {c.label[0]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-slate-900">{e.title}</p>
                      <p className="truncate text-sm text-slate-500">
                        {c.label} · {dateLabel(e.date)}{e.note ? ` · ${e.note}` : ''}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-0.5 sm:flex-row sm:items-center sm:gap-3">
                    <p className="font-semibold tabular-nums text-slate-900">{money(e.amount)}</p>
                    <div className="flex gap-1">
                      <button onClick={() => setEditing(e)} className="rounded-md px-2 py-1 text-sm text-slate-600 hover:bg-slate-100" aria-label={`Edit ${e.title}`}>Edit</button>
                      <button onClick={() => remove(e)} className="rounded-md px-2 py-1 text-sm text-red-600 hover:bg-red-50" aria-label={`Delete ${e.title}`}>Delete</button>
                    </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>

      {editing && <ExpenseDialog expense={editing.id ? editing : null} onClose={() => setEditing(null)} onSave={save} />}
      {toast && (
        <div role="status" className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
