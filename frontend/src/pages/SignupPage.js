import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const initialForm = {
  name: '',
  email: '',
  password: '',
  profilePicture: '',
  role: 'user',
  adminKey: '',
};

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, isAuthenticated } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        ...form,
        adminKey: form.role === 'admin' ? form.adminKey : '',
      };
      await signup(payload);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page auth-page">
      <article className="card auth-card">
        <p className="eyebrow">Join Review Radar</p>
        <h1>Create your account</h1>
        <p>Sign up to publish reviews and manage your profile.</p>

        <form onSubmit={handleSubmit} className="stack-form">
          <label className="field-group">
            <span>Full name</span>
            <input type="text" name="name" value={form.name} onChange={handleChange} required />
          </label>

          <label className="field-group">
            <span>Email</span>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>

          <label className="field-group">
            <span>Password</span>
            <input
              type="password"
              name="password"
              minLength={6}
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          <label className="field-group">
            <span>Profile picture URL (optional)</span>
            <input
              type="url"
              name="profilePicture"
              value={form.profilePicture}
              onChange={handleChange}
              placeholder="https://..."
            />
          </label>

          <label className="field-group">
            <span>Account type</span>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          {form.role === 'admin' && (
            <label className="field-group">
              <span>Admin registration key</span>
              <input
                type="password"
                name="adminKey"
                value={form.adminKey}
                onChange={handleChange}
                required
              />
            </label>
          )}

          {error && <p className="feedback error">{error}</p>}

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <p className="auth-switch">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </article>
    </section>
  );
}
