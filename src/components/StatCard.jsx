export default function StatCard({ label, value, caption, accent = 'primary' }) {
  const colorClasses =
    accent === 'danger'
      ? 'text-danger bg-danger/10'
      : accent === 'success'
        ? 'text-success bg-success/10'
        : 'text-primary bg-primary/10'

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{value}</p>
      {caption ? (
        <span
          className={`mt-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${colorClasses}`}
        >
          {caption}
        </span>
      ) : null}
    </div>
  )
}

