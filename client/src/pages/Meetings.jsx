import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import PageHeader from '../components/PageHeader';
import { cancelMeeting, getMeetings } from '../services/meetingService';
import { getSavedUser } from '../services/authService';

function Meetings() {
  const [meetings, setMeetings] = useState([]); const [error, setError] = useState(''); const user = getSavedUser();
  async function loadMeetings() { try { setMeetings((await getMeetings()).meetings); } catch (err) { setError(err.response?.data?.message || 'Could not load meetings.'); } }
  useEffect(() => { loadMeetings(); }, []);
  async function cancel(id) { if (window.confirm('Cancel this meeting?')) { try { await cancelMeeting(id); loadMeetings(); } catch (err) { setError(err.response?.data?.message || 'Could not cancel meeting.'); } } }
  return <DashboardLayout><div className="flex justify-between gap-4"><PageHeader title="Meetings" description="Meetings you can access." />{user.role !== 'executive' && <Link className="rounded bg-blue-700 px-4 py-2 text-white" to="/meetings/create">Schedule Meeting</Link>}</div>{error && <p className="text-red-600">{error}</p>}<div className="overflow-x-auto rounded-lg bg-white shadow-sm"><table className="w-full text-left text-sm"><thead className="bg-slate-50"><tr><th className="p-4">Title</th><th className="p-4">Time</th><th className="p-4">Venue</th><th className="p-4">Status</th><th className="p-4">Action</th></tr></thead><tbody>{meetings.map((meeting) => <tr className="border-t" key={meeting.id}><td className="p-4">{meeting.title}</td><td className="p-4">{new Date(meeting.start_time).toLocaleString()}</td><td className="p-4">{meeting.venue || '—'}</td><td className="p-4 capitalize">{meeting.status}</td><td className="p-4"><Link className="text-blue-700" to={`/meetings/${meeting.id}`}>View</Link>{user.role !== 'executive' && meeting.status === 'scheduled' && <button className="ml-3 text-red-600" onClick={() => cancel(meeting.id)}>Cancel</button>}</td></tr>)}</tbody></table>{!meetings.length && <p className="p-5 text-slate-500">No meetings found.</p>}</div></DashboardLayout>;
}
export default Meetings;
