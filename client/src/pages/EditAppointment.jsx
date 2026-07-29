import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppointmentForm from '../components/AppointmentForm';
import PageHeader from '../components/PageHeader';
import DashboardLayout from '../layouts/DashboardLayout';
import { getAppointment, updateAppointment } from '../services/appointmentService';

function EditAppointment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { async function loadAppointment() { try { const data = await getAppointment(id); setAppointment(data.appointment); } catch (error) { setErrorMessage(error.response?.data?.message || 'Could not load appointment.'); } } loadAppointment(); }, [id]);

  async function saveChanges(formData, setFormError) {
    try { setIsSubmitting(true); await updateAppointment(id, formData); navigate('/appointments'); }
    catch (error) { const message = error.response?.data?.message || 'Could not update appointment.'; setErrorMessage(message); setFormError(message); }
    finally { setIsSubmitting(false); }
  }

  return <DashboardLayout><PageHeader title="Edit Appointment" description="Update your appointment details." />{errorMessage && <p className="mb-4 text-red-600">{errorMessage}</p>}{appointment ? <AppointmentForm initialData={appointment} onSubmit={saveChanges} submitText="Save Changes" isSubmitting={isSubmitting} /> : !errorMessage && <p>Loading appointment...</p>}</DashboardLayout>;
}

export default EditAppointment;
