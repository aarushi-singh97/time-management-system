function DashboardList({ title, items, renderItem }) {
  return (
    <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <h2 className="font-semibold text-slate-800">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">No records available.</p>
      ) : (
        <ul className="mt-3 divide-y">
          {items.map((item) => <li className="py-3 text-sm text-slate-600" key={item.id}>{renderItem(item)}</li>)}
        </ul>
      )}
    </section>
  );
}

export default DashboardList;
