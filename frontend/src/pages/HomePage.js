import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import CompanyCard from '../components/CompanyCard';
import { useAuth } from '../context/AuthContext';
import { companiesApi } from '../services/api';

const initialFilters = {
  search: '',
  location: '',
  city: '',
};

export default function HomePage() {
  const { isAdmin } = useAuth();
  const [filters, setFilters] = useState(initialFilters);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCompanies = async (query = {}) => {
    setLoading(true);
    setError('');

    try {
      const response = await companiesApi.list(query);
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

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    fetchCompanies(filters);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    fetchCompanies();
  };

  const stats = useMemo(() => {
    const totalCompanies = companies.length;
    const totalReviews = companies.reduce((sum, company) => sum + (company.totalReviews || 0), 0);
    const ratedCompanies = companies.filter((company) => company.averageRating > 0).length;
    return { totalCompanies, totalReviews, ratedCompanies };
  }, [companies]);

  return (
    <section className="page">
      <div className="hero">
        <div>
          <p className="eyebrow">Review Analytics Platform</p>
          <h1 className="hero-title">Find trusted company feedback before you decide.</h1>
          <p className="hero-subtitle">
            Search companies by name, location, or city. View real user reviews and detailed ratings.
          </p>
        </div>
        {isAdmin && (
          <Link to="/admin/companies" className="btn btn-primary">
            Manage companies
          </Link>
        )}
      </div>

      <div className="hero-stats">
        <div className="stat-pill">
          <small>Companies</small>
          <strong>{stats.totalCompanies}</strong>
        </div>
        <div className="stat-pill">
          <small>Reviews</small>
          <strong>{stats.totalReviews}</strong>
        </div>
        <div className="stat-pill">
          <small>Rated profiles</small>
          <strong>{stats.ratedCompanies}</strong>
        </div>
      </div>

      <form className="card search-panel" onSubmit={handleSearch}>
        <div className="search-grid">
          <label className="field-group">
            <span>Company</span>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="e.g. Apex Labs"
            />
          </label>
          <label className="field-group">
            <span>Location</span>
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="e.g. Downtown"
            />
          </label>
          <label className="field-group">
            <span>City</span>
            <input
              type="text"
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              placeholder="e.g. New York"
            />
          </label>
        </div>

        <div className="inline-actions">
          <button type="submit" className="btn btn-primary">
            Search
          </button>
          <button type="button" className="btn btn-muted" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>

      {error && <p className="feedback error">{error}</p>}
      {loading && <p className="page-loading">Loading companies...</p>}

      {!loading && !error && companies.length === 0 && (
        <article className="card empty-state">
          <h3>No companies found</h3>
          <p>Try broadening your filters.</p>
        </article>
      )}

      {!loading && companies.length > 0 && (
        <div className="company-grid">
          {companies.map((company) => (
            <CompanyCard key={company._id} company={company} />
          ))}
        </div>
      )}
    </section>
  );
}
