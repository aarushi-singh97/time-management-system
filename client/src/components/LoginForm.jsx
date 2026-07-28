import { useState } from 'react';
import { loginUser, saveSession } from '../services/authService';
import { getDashboardPath } from '../utils/authRoutes';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Email and password are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      const loginData = await loginUser({ email, password });
      saveSession(loginData);
      window.location.assign(getDashboardPath(loginData.role));
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <label className="block text-sm font-medium">
        Email
        <input className="mt-1 w-full rounded border p-2" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <label className="block text-sm font-medium">
        Password
        <input className="mt-1 w-full rounded border p-2" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      </label>
      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
      <button className="w-full rounded bg-blue-700 p-2 font-medium text-white disabled:bg-slate-400" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

export default LoginForm;
