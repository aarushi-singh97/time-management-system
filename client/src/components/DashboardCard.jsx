function DashboardCard({ title, value, detail }) {
  return (
    <article className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-slate-800">{value}</p>
      {detail && <p className="mt-2 text-sm text-slate-500">{detail}</p>}
    </article>
  );
}

export default DashboardCard;
