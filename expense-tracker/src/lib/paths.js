// Prefix app routes with the deploy base path (e.g. /Expense-Tracker on GitHub Pages).
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

export const to = (path) => `${BASE}${path}`
