export const EXPENSE_CATEGORIES = [
  { name: 'Food', emoji: '🍽️' },
  { name: 'Travel', emoji: '🚌' },
  { name: 'Bills', emoji: '🧾' },
  { name: 'Shopping', emoji: '🛍️' },
  { name: 'Entertainment', emoji: '🎬' },
  { name: 'Health', emoji: '🏥' },
  { name: 'Education', emoji: '🎓' },
  { name: 'Rent', emoji: '🏠' },
  { name: 'Utilities', emoji: '💡' },
  { name: 'Miscellaneous', emoji: '🔖' },
]

export const INCOME_CATEGORIES = [
  { name: 'Salary', emoji: '💼' },
  { name: 'Freelance', emoji: '🧑‍💻' },
  { name: 'Investments', emoji: '📈' },
  { name: 'Gifts', emoji: '🎁' },
  { name: 'Other', emoji: '➕' },
]

export const TRANSACTION_TYPES = [
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
]

export const CATEGORY_EMOJI = Object.fromEntries(
  [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES].map((c) => [c.name, c.emoji]),
)

