function AppointmentModal({ appointment, onConfirm, onCancel, isDeleting }) {
  if (!appointment) return null;

  return <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/40 p-4"><section className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg"><h2 className="text-lg font-bold">Delete appointment?</h2><p className="mt-2 text-slate-600">Are you sure you want to delete “{appointment.title}”? This action cannot be undone.</p><div className="mt-6 flex justify-end gap-3"><button className="rounded border px-4 py-2" onClick={onCancel}>Cancel</button><button className="rounded bg-red-600 px-4 py-2 text-white disabled:bg-red-300" onClick={onConfirm} disabled={isDeleting}>{isDeleting ? 'Deleting...' : 'Delete'}</button></div></section></div>;
}

export default AppointmentModal;
