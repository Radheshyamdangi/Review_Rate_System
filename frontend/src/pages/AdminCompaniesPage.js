import { useEffect, useMemo, useState } from 'react';
import { companiesApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const initialForm = {
  name: '',
  location: '',
  city: '',
  foundedOn: '',
  logo: '',
  description: '',
};

const toDateInput = (value) => {
  if (!value) return '';
  return new Date(value).toISOString().slice(0, 10);
};

export default function AdminCompaniesPage() {
  const { token } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [form, setForm] = useState(initialForm);
  const [editingCompanyId, setEditingCompanyId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchCompanies = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await companiesApi.list();
      setCompanies(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const filteredCompanies = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) return companies;

    return companies.filter((company) =>
      `${company.name} ${company.location} ${company.city}`.toLowerCase().includes(normalizedSearch)
    );
  }, [companies, search]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingCompanyId('');
  };

  const beginEdit = (company) => {
    setEditingCompanyId(company._id);
    setForm({
      name: company.name || '',
      location: company.location || '',
      city: company.city || '',
      foundedOn: toDateInput(company.foundedOn),
      logo: company.logo || '',
      description: company.description || '',
    });
    setError('');
    setSuccess('');
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (editingCompanyId) {
        await companiesApi.update(editingCompanyId, form, token);
        setSuccess('Company updated successfully.');
      } else {
        await companiesApi.create(form, token);
        setSuccess('Company created successfully.');
      }

      resetForm();
      await fetchCompanies();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm('Delete this company? This action cannot be undone.');
    if (!isConfirmed) return;

    setDeletingId(id);
    setError('');
    setSuccess('');

    try {
      await companiesApi.remove(id, token);
      setSuccess('Company deleted successfully.');
      await fetchCompanies();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId('');
    }
  };

  return (
    <section className="page">
      <div className="hero">
        <div>
          <p className="eyebrow">Admin Console</p>
          <h1 className="hero-title">Manage company profiles</h1>
          <p className="hero-subtitle">Create, update, and remove companies available in the directory.</p>
        </div>
      </div>

      <div className="detail-layout">
        <article className="card admin-form-card">
          <h2>{editingCompanyId ? 'Edit company' : 'Create company'}</h2>
          <form className="stack-form" onSubmit={handleSave}>
            <label className="field-group">
              <span>Name</span>
              <input type="text" name="name" value={form.name} onChange={handleFormChange} required />
            </label>

            <label className="field-group">
              <span>Location</span>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleFormChange}
                required
              />
            </label>

            <label className="field-group">
              <span>City</span>
              <input type="text" name="city" value={form.city} onChange={handleFormChange} required />
            </label>

            <label className="field-group">
              <span>Founded on</span>
              <input
                type="date"
                name="foundedOn"
                value={form.foundedOn}
                onChange={handleFormChange}
                required
              />
            </label>

            <label className="field-group">
              <span>Logo URL</span>
              <input type="url" name="logo" value={form.logo} onChange={handleFormChange} />
            </label>

            <label className="field-group">
              <span>Description</span>
              <textarea
                name="description"
                rows={4}
                value={form.description}
                onChange={handleFormChange}
              />
            </label>

            {error && <p className="feedback error">{error}</p>}
            {success && <p className="feedback success">{success}</p>}

            <div className="inline-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : editingCompanyId ? 'Update company' : 'Create company'}
              </button>
              {editingCompanyId && (
                <button type="button" className="btn btn-muted" onClick={resetForm}>
                  Cancel edit
                </button>
              )}
            </div>
          </form>
        </article>

        <article className="admin-list-panel">
          <div className="review-panel-head">
            <h2>Existing companies</h2>
            <label className="field-group inline-field">
              <span>Filter</span>
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, city, location"
              />
            </label>
          </div>

          {loading && <p className="page-loading">Loading companies...</p>}
          {!loading && filteredCompanies.length === 0 && (
            <article className="card empty-state">
              <h3>No companies available</h3>
              <p>Create a company profile to get started.</p>
            </article>
          )}

          <div className="admin-company-list">
            {filteredCompanies.map((company) => (
              <article className="card admin-company-card" key={company._id}>
                <div>
                  <h3>{company.name}</h3>
                  <p className="company-meta">
                    {company.location}, {company.city}
                  </p>
                  <small>Founded {toDateInput(company.foundedOn)}</small>
                </div>
                <div className="inline-actions">
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => beginEdit(company)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    disabled={deletingId === company._id}
                    onClick={() => handleDelete(company._id)}
                  >
                    {deletingId === company._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
