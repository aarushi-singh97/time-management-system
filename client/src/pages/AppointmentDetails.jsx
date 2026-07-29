import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import DashboardLayout from '../layouts/DashboardLayout';
import { getAppointment } from '../services/appointmentService';

function AppointmentDetails() {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => { async function loadAppointment() { try { const data = await getAppointment(id); setAppointment(data.appointment); } catch (error) { setErrorMessage(error.response?.data?.message || 'Could not load appointment.'); } } loadAppointment(); }, [id]);

  if (errorMessage) return <DashboardLayout><p className="text-red-600">{errorMessage}</p></DashboardLayout>;
  if (!appointment) return <DashboardLayout><p>Loading appointment...</p></DashboardLayout>;

  return <DashboardLayout><PageHeader title="Appointment Details" description="View your appointment information." /><section className="max-w-2xl rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200"><dl className="space-y-4"><div><dt className="font-medium">Title</dt><dd>{appointment.title}</dd></div><div><dt className="font-medium">Date and time</dt><dd>{appointment.appointment_date}, {appointment.start_time}–{appointment.end_time}</dd></div><div><dt className="font-medium">Venue</dt><dd>{appointment.venue || 'Not provided'}</dd></div><div><dt className="font-medium">Status</dt><dd className="capitalize">{appointment.status}</dd></div><div><dt className="font-medium">Description</dt><dd>{appointment.description || 'Not provided'}</dd></div></dl><div className="mt-6 flex gap-3"><Link className="rounded bg-blue-700 px-4 py-2 text-white" to={`/appointments/edit/${appointment.id}`}>Edit</Link><Link className="rounded border px-4 py-2" to="/appointments">Back to appointments</Link></div></section></DashboardLayout>;
}

export default AppointmentDetails;
