import { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import PageHeader from '../components/PageHeader';
import { cancelLeave, createLeave, getLeaves } from '../services/leaveService';

function Leave() {
  const [leaves, setLeaves] = useState([]); const [error, setError] = useState(''); const [form, setForm] = useState({ leave_type: 'annual', reason: '', start_date: '', end_date: '' });
  async function load() { try { setLeaves((await getLeaves()).leaves); } catch (err) { setError(err.response?.data?.message || 'Could not load leave requests.'); } }
  useEffect(() => { load(); }, []);
  function update(event) { setForm({ ...form, [event.target.name]: event.target.value }); }
  async function submit(event) { event.preventDefault(); try { await createLeave(form); setForm({ leave_type: 'annual', reason: '', start_date: '', end_date: '' }); load(); } catch (err) { setError(err.response?.data?.message || 'Could not submit leave request.'); } }
  async function cancel(id) { try { await cancelLeave(id); load(); } catch (err) { setError(err.response?.data?.message || 'Could not cancel leave request.'); } }
  return <DashboardLayout><PageHeader title="My Leave" description="Apply for leave and view request status." /><form className="grid gap-3 rounded-lg bg-white p-5 shadow-sm md:grid-cols-4" onSubmit={submit}><select className="rounded border p-2" name="leave_type" value={form.leave_type} onChange={update}><option value="annual">Annual</option><option value="sick">Sick</option><option value="personal">Personal</option><option value="other">Other</option></select><input className="rounded border p-2" type="date" name="start_date" value={form.start_date} onChange={update} /><input className="rounded border p-2" type="date" name="end_date" value={form.end_date} onChange={update} /><input className="rounded border p-2" placeholder="Reason" name="reason" value={form.reason} onChange={update} /><button className="rounded bg-blue-700 px-4 py-2 text-white">Apply Leave</button></form>{error && <p className="mt-3 text-red-600">{error}</p>}<div className="mt-6 overflow-x-auto rounded-lg bg-white shadow-sm"><table className="w-full text-left text-sm"><thead className="bg-slate-50"><tr><th className="p-4">Type</th><th className="p-4">Dates</th><th className="p-4">Reason</th><th className="p-4">Status</th><th className="p-4">Action</th></tr></thead><tbody>{leaves.map((leave) => <tr className="border-t" key={leave.id}><td className="p-4 capitalize">{leave.leave_type}</td><td className="p-4">{String(leave.start_date).slice(0, 10)} – {String(leave.end_date).slice(0, 10)}</td><td className="p-4">{leave.reason || '—'}</td><td className="p-4 capitalize">{leave.status}</td><td className="p-4">{leave.status === 'pending' && <button className="text-red-600" onClick={() => cancel(leave.id)}>Cancel</button>}</td></tr>)}</tbody></table></div></DashboardLayout>;
}
export default Leave;
