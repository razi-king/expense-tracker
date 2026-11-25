export const CATEGORIES = [
  { id: 'FOOD', label: 'Food', color: '#f97316' },
  { id: 'TRANSPORT', label: 'Transport', color: '#0ea5e9' },
  { id: 'SHOPPING', label: 'Shopping', color: '#d946ef' },
  { id: 'BILLS', label: 'Bills', color: '#ef4444' },
  { id: 'ENTERTAINMENT', label: 'Entertainment', color: '#8b5cf6' },
  { id: 'HEALTH', label: 'Health', color: '#10b981' },
  { id: 'EDUCATION', label: 'Education', color: '#eab308' },
  { id: 'TRAVEL', label: 'Travel', color: '#14b8a6' },
  { id: 'OTHER', label: 'Other', color: '#64748b' },
];
export const category = (id) => CATEGORIES.find((c) => c.id === id) || CATEGORIES.at(-1);

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });
export const money = (n) => inr.format(Number(n || 0));
export const moneyShort = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', notation: 'compact', maximumFractionDigits: 1 }).format(Number(n || 0));

export const thisMonth = () => new Date().toISOString().slice(0, 7);
export const today = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};
export const monthLabel = (ym, style = 'long') =>
  new Date(`${ym}-01T00:00:00`).toLocaleDateString('en-IN', { month: style, year: style === 'long' ? 'numeric' : undefined });
export const shiftMonth = (ym, delta) => {
  const [y, m] = ym.split('-').map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};
export const dateLabel = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
