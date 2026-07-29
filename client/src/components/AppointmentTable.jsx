import { Link } from 'react-router-dom';

function AppointmentTable({ appointments, onDelete }) {
  if (appointments.length === 0) return <p className="rounded-lg bg-white p-6 text-slate-500 shadow-sm">No appointments found.</p>;

  return (
    <div className="overflow-x-auto rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-600"><tr><th className="p-4">Title</th><th className="p-4">Date & Time</th><th className="p-4">Venue</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead>
        <tbody>{appointments.map((appointment) => <tr className="border-t" key={appointment.id}><td className="p-4 font-medium">{appointment.title}</td><td className="p-4">{appointment.appointment_date}<br />{appointment.start_time}–{appointment.end_time}</td><td className="p-4">{appointment.venue || '—'}</td><td className="p-4 capitalize">{appointment.status}</td><td className="p-4"><div className="flex gap-3"><Link className="text-blue-700" to={`/appointments/${appointment.id}`}>View</Link><Link className="text-blue-700" to={`/appointments/edit/${appointment.id}`}>Edit</Link><button className="text-red-600" onClick={() => onDelete(appointment)}>Delete</button></div></td></tr>)}</tbody>
      </table>
    </div>
  );
}

export default AppointmentTable;
