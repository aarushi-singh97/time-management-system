import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppointmentCard from '../components/AppointmentCard';
import AppointmentFilter from '../components/AppointmentFilter';
import AppointmentModal from '../components/AppointmentModal';
import AppointmentSearch from '../components/AppointmentSearch';
import AppointmentTable from '../components/AppointmentTable';
import PageHeader from '../components/PageHeader';
import DashboardLayout from '../layouts/DashboardLayout';
import { deleteAppointment, filterAppointments, getAppointments, searchAppointments } from '../services/appointmentService';

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  async function loadAppointments() {
    try { setIsLoading(true); setErrorMessage(''); const data = await getAppointments(); setAppointments(data.appointments); }
    catch (error) { setErrorMessage(error.response?.data?.message || 'Could not load appointments.'); }
    finally { setIsLoading(false); }
  }

  useEffect(() => { loadAppointments(); }, []);

  async function runSearch(keyword) {
    try { setErrorMessage(''); const data = await searchAppointments(keyword); setAppointments(data.appointments); }
    catch (error) { setErrorMessage(error.response?.data?.message || 'Could not search appointments.'); }
  }

  async function runFilter(date, status) {
    try { setErrorMessage(''); const data = await filterAppointments(date, status); setAppointments(data.appointments); }
    catch (error) { setErrorMessage(error.response?.data?.message || 'Could not filter appointments.'); }
  }

  async function confirmDelete() {
    try { setIsDeleting(true); await deleteAppointment(selectedAppointment.id); setSuccessMessage('Appointment deleted successfully.'); setSelectedAppointment(null); loadAppointments(); }
    catch (error) { setErrorMessage(error.response?.data?.message || 'Could not delete appointment.'); }
    finally { setIsDeleting(false); }
  }

  return <DashboardLayout><div className="flex flex-wrap items-start justify-between gap-4"><PageHeader title="Appointments" description="Manage your personal appointments." /><Link className="rounded bg-blue-700 px-4 py-2 text-white" to="/appointments/add">Add Appointment</Link></div><div className="grid gap-3 rounded-lg bg-white p-4 shadow-sm md:grid-cols-2"><AppointmentSearch onSearch={runSearch} onClear={loadAppointments} /><AppointmentFilter onFilter={runFilter} onClear={loadAppointments} /></div>{successMessage && <p className="mt-4 text-green-700">{successMessage}</p>}{errorMessage && <p className="mt-4 text-red-600">{errorMessage}</p>}{isLoading ? <p className="mt-6">Loading appointments...</p> : <><div className="mt-6 hidden md:block"><AppointmentTable appointments={appointments} onDelete={setSelectedAppointment} /></div><div className="mt-6 grid gap-4 md:hidden">{appointments.length ? appointments.map((appointment) => <AppointmentCard key={appointment.id} appointment={appointment} onDelete={setSelectedAppointment} />) : <p className="text-slate-500">No appointments found.</p>}</div></>}<AppointmentModal appointment={selectedAppointment} onConfirm={confirmDelete} onCancel={() => setSelectedAppointment(null)} isDeleting={isDeleting} /></DashboardLayout>;
}

export default Appointments;
