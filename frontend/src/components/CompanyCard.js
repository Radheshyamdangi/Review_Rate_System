import { Link } from 'react-router-dom';
import StarRating from './StarRating';

const formatDate = (value) => {
  if (!value) return 'N/A';
  return new Date(value).toLocaleDateString();
};

export default function CompanyCard({ company }) {
  return (
    <article className="card company-card">
      <div className="company-heading">
        {company.logo ? (
          <img src={company.logo} alt={`${company.name} logo`} className="company-logo" />
        ) : (
          <div className="company-logo company-logo-fallback">{company.name.slice(0, 1)}</div>
        )}

        <div>
          <h3>{company.name}</h3>
          <p className="company-meta">
            {company.location}, {company.city}
          </p>
        </div>
      </div>

      <p className="company-description">{company.description || 'No description available.'}</p>

      <div className="company-stats">
        <div>
          <small>Average rating</small>
          <div className="rating-inline">
            <StarRating readOnly value={company.averageRating || 0} size="sm" />
            <span>{company.averageRating?.toFixed(1) || '0.0'}</span>
          </div>
        </div>
        <div>
          <small>Total reviews</small>
          <p>{company.totalReviews || 0}</p>
        </div>
        <div>
          <small>Founded</small>
          <p>{formatDate(company.foundedOn)}</p>
        </div>
      </div>

      <Link to={`/companies/${company._id}`} className="btn btn-primary">
        View details
      </Link>
    </article>
  );
}
