import RegisterForm from '../components/RegisterForm';

function Register() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <section className="w-full max-w-md rounded-lg bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-blue-700">Create a TMS account</h1>
        <div className="mt-6"><RegisterForm /></div>
        <p className="mt-4 text-sm">Already registered? <a className="text-blue-700 underline" href="/login">Login</a></p>
      </section>
    </main>
  );
}

export default Register;
