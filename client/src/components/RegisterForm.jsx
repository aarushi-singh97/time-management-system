import { useState } from 'react';
import { registerUser } from '../services/authService';

function RegisterForm() {
  const [formData, setFormData] = useState({ full_name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setErrorMessage('');

    if (!formData.full_name.trim() || !formData.email.trim() || !formData.password) {
      setErrorMessage('Full name, email, and password are required.');
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await registerUser(formData);
      setMessage(`${response.message} You can now log in.`);
      setFormData({ full_name: '', email: '', password: '' });
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <label className="block text-sm font-medium">
        Full name
        <input className="mt-1 w-full rounded border p-2" name="full_name" value={formData.full_name} onChange={updateField} />
      </label>
      <label className="block text-sm font-medium">
        Email
        <input className="mt-1 w-full rounded border p-2" type="email" name="email" value={formData.email} onChange={updateField} />
      </label>
      <label className="block text-sm font-medium">
        Password
        <input className="mt-1 w-full rounded border p-2" type="password" name="password" value={formData.password} onChange={updateField} />
      </label>
      {message && <p className="text-sm text-green-700">{message}</p>}
      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
      <button className="w-full rounded bg-blue-700 p-2 font-medium text-white disabled:bg-slate-400" disabled={isSubmitting}>
        {isSubmitting ? 'Creating account...' : 'Register'}
      </button>
    </form>
  );
}

export default RegisterForm;
