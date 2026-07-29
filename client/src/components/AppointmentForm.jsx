import { useState } from 'react';

function getTodayDate() {
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  return today.toISOString().slice(0, 10);
}

function AppointmentForm({ initialData, onSubmit, submitText, isSubmitting }) {
  const [formData, setFormData] = useState(initialData || {
    title: '', description: '', venue: '', appointment_date: getTodayDate(), start_time: '', end_time: '', status: 'scheduled',
  });
  const [errorMessage, setErrorMessage] = useState('');

  function updateField(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');
    if (!formData.title.trim() || !formData.appointment_date || !formData.start_time || !formData.end_time) {
      setErrorMessage('Title, date, start time, and end time are required.');
      return;
    }
    if (formData.end_time <= formData.start_time) {
      setErrorMessage('End time must be later than start time.');
      return;
    }
    onSubmit(formData, setErrorMessage);
  }

  return (
    <form className="space-y-4 rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200" onSubmit={handleSubmit}>
      <label className="block text-sm font-medium">Title<input className="mt-1 w-full rounded border p-2" name="title" value={formData.title} onChange={updateField} /></label>
      <label className="block text-sm font-medium">Description<textarea className="mt-1 w-full rounded border p-2" name="description" rows="3" value={formData.description || ''} onChange={updateField} /></label>
      <label className="block text-sm font-medium">Venue<input className="mt-1 w-full rounded border p-2" name="venue" value={formData.venue || ''} onChange={updateField} /></label>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-sm font-medium">Date<input className="mt-1 w-full rounded border p-2" type="date" name="appointment_date" value={formData.appointment_date} onChange={updateField} /></label>
        <label className="block text-sm font-medium">Start time<input className="mt-1 w-full rounded border p-2" type="time" name="start_time" value={formData.start_time} onChange={updateField} /></label>
        <label className="block text-sm font-medium">End time<input className="mt-1 w-full rounded border p-2" type="time" name="end_time" value={formData.end_time} onChange={updateField} /></label>
      </div>
      <label className="block text-sm font-medium">Status<select className="mt-1 w-full rounded border p-2" name="status" value={formData.status} onChange={updateField}><option value="scheduled">Scheduled</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></label>
      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
      <button className="rounded bg-blue-700 px-4 py-2 font-medium text-white disabled:bg-slate-400" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : submitText}</button>
    </form>
  );
}

export default AppointmentForm;
