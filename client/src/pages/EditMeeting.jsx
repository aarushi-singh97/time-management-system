import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import PageHeader from '../components/PageHeader';
import { getExecutives, getMeeting, updateMeeting } from '../services/meetingService';

function EditMeeting() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [executives, setExecutives] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState(null);

  useEffect(() => {
    Promise.all([getExecutives(), getMeeting(id)]).then(([people, details]) => {
      const meeting = details.meeting;
      setExecutives(people.executives);
      setForm({ title: meeting.title, purpose: meeting.agenda || '', venue: meeting.venue || '', meeting_date: String(meeting.start_time).slice(0, 10), start_time: String(meeting.start_time).slice(11, 16), end_time: String(meeting.end_time).slice(11, 16), participant_ids: details.participants.map((person) => person.id) });
    }).catch((err) => setError(err.response?.data?.message || 'Could not load meeting.'));
  }, [id]);

  function update(event) { setForm({ ...form, [event.target.name]: event.target.value }); }
  function toggleExecutive(userId) { setForm({ ...form, participant_ids: form.participant_ids.includes(userId) ? form.participant_ids.filter((item) => item !== userId) : [...form.participant_ids, userId] }); }
  async function submit(event) { event.preventDefault(); try { await updateMeeting(id, form); navigate(`/meetings/${id}`); } catch (err) { setError(err.response?.data?.message || 'Could not update meeting.'); } }

  if (!form) return <DashboardLayout><p>{error || 'Loading meeting...'}</p></DashboardLayout>;
  return <DashboardLayout><PageHeader title="Edit Meeting" description="Update the meeting details and invited executives." /><form className="space-y-4 rounded-lg bg-white p-6 shadow-sm" onSubmit={submit}><input required className="w-full rounded border p-2" placeholder="Meeting title" name="title" value={form.title} onChange={update} /><textarea className="w-full rounded border p-2" placeholder="Purpose" name="purpose" value={form.purpose} onChange={update} /><div className="grid gap-3 sm:grid-cols-3"><input required className="rounded border p-2" type="date" name="meeting_date" value={form.meeting_date} onChange={update} /><input required className="rounded border p-2" type="time" name="start_time" value={form.start_time} onChange={update} /><input required className="rounded border p-2" type="time" name="end_time" value={form.end_time} onChange={update} /></div><input className="w-full rounded border p-2" placeholder="Venue" name="venue" value={form.venue} onChange={update} /><div><p className="mb-2 font-medium">Invite executives</p>{executives.map((executive) => <label className="mr-4 inline-flex gap-2" key={executive.id}><input type="checkbox" checked={form.participant_ids.includes(executive.id)} onChange={() => toggleExecutive(executive.id)} />{executive.full_name}</label>)}</div>{error && <p className="text-red-600">{error}</p>}<button className="rounded bg-blue-700 px-4 py-2 text-white">Save Changes</button></form></DashboardLayout>;
}

export default EditMeeting;
