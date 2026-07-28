import LoginForm from '../components/LoginForm';

function Login() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <section className="w-full max-w-md rounded-lg bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-blue-700">Login to TMS</h1>
        <p className="mt-2 text-sm text-slate-600">Manage your appointments, meetings, and tasks.</p>
        <div className="mt-6"><LoginForm /></div>
        <p className="mt-4 text-sm">New user? <a className="text-blue-700 underline" href="/register">Create an account</a></p>
      </section>
    </main>
  );
}

export default Login;
