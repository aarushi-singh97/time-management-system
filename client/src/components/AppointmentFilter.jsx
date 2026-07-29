import { useState } from 'react';

function AppointmentFilter({ onFilter, onClear }) {
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('');

  function applyFilter(event) {
    event.preventDefault();
    onFilter(date, status);
  }

  function clearFilter() {
    setDate('');
    setStatus('');
    onClear();
  }

  return <form className="flex flex-wrap gap-2" onSubmit={applyFilter}><input className="rounded border p-2" type="date" value={date} onChange={(event) => setDate(event.target.value)} /><select className="rounded border p-2" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All statuses</option><option value="scheduled">Scheduled</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select><button className="rounded border px-4">Filter</button><button type="button" className="rounded border px-4" onClick={clearFilter}>Clear</button></form>;
}

export default AppointmentFilter;
