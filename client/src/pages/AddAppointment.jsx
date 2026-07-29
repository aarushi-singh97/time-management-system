import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppointmentForm from '../components/AppointmentForm';
import PageHeader from '../components/PageHeader';
import DashboardLayout from '../layouts/DashboardLayout';
import { createAppointment } from '../services/appointmentService';

function AddAppointment() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function saveAppointment(formData, setFormError) {
    try { setIsSubmitting(true); setErrorMessage(''); await createAppointment(formData); navigate('/appointments'); }
    catch (error) { const message = error.response?.data?.message || 'Could not create appointment.'; setErrorMessage(message); setFormError(message); }
    finally { setIsSubmitting(false); }
  }

  return <DashboardLayout><PageHeader title="Add Appointment" description="Create a new personal appointment." />{errorMessage && <p className="mb-4 text-red-600">{errorMessage}</p>}<AppointmentForm onSubmit={saveAppointment} submitText="Create Appointment" isSubmitting={isSubmitting} /></DashboardLayout>;
}

export default AddAppointment;
