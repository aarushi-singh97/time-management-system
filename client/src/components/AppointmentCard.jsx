import { Link } from 'react-router-dom';

const statusColors = {
  scheduled: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

function AppointmentCard({ appointment, onDelete }) {
  return (
    <article className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-semibold text-slate-800">{appointment.title}</h2>
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[appointment.status]}`}>{appointment.status}</span>
      </div>
      <p className="mt-2 text-sm text-slate-600">{appointment.appointment_date} · {appointment.start_time}–{appointment.end_time}</p>
      <p className="mt-1 text-sm text-slate-500">{appointment.venue || 'No venue provided'}</p>
      <div className="mt-4 flex gap-3 text-sm font-medium text-blue-700">
        <Link to={`/appointments/${appointment.id}`}>View</Link>
        <Link to={`/appointments/edit/${appointment.id}`}>Edit</Link>
        <button className="text-red-600" onClick={() => onDelete(appointment)}>Delete</button>
      </div>
    </article>
  );
}

export default AppointmentCard;
