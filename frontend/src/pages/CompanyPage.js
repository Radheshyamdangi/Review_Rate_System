import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReviewCard from '../components/ReviewCard';
import StarRating from '../components/StarRating';
import { useAuth } from '../context/AuthContext';
import { companiesApi, reviewsApi } from '../services/api';

const initialReviewForm = {
  subject: '',
  reviewText: '',
  rating: 5,
  profilePicture: '',
};

const extractReviewUserId = (review) => review?.user?._id || review?.user?.id || review?.user;

export default function CompanyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, isAuthenticated, isAdmin } = useAuth();

  const [company, setCompany] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [sort, setSort] = useState('newest');
  const [reviewForm, setReviewForm] = useState(initialReviewForm);
  const [loadingCompany, setLoadingCompany] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [likingReviewId, setLikingReviewId] = useState('');
  const [deletingReviewId, setDeletingReviewId] = useState('');
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchCompany = useCallback(async () => {
    setLoadingCompany(true);
    try {
      const response = await companiesApi.getById(id);
      setCompany(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingCompany(false);
    }
  }, [id]);

  const fetchReviews = useCallback(async () => {
    setLoadingReviews(true);
    try {
      const response = await reviewsApi.listByCompany(id, sort);
      setReviews(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingReviews(false);
    }
  }, [id, sort]);

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleReviewChange = (event) => {
    const { name, value } = event.target;
    setReviewForm((current) => ({ ...current, [name]: value }));
  };

  const handleCreateReview = async (event) => {
    event.preventDefault();
    setFormError('');
    setSuccessMessage('');

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/companies/${id}` } } });
      return;
    }

    setSubmittingReview(true);
    try {
      await reviewsApi.create(
        {
          ...reviewForm,
          rating: Number(reviewForm.rating),
          company: id,
        },
        token
      );
      setReviewForm(initialReviewForm);
      setSuccessMessage('Review submitted.');
      await Promise.all([fetchReviews(), fetchCompany()]);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleLike = async (reviewId) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/companies/${id}` } } });
      return;
    }

    setLikingReviewId(reviewId);
    try {
      await reviewsApi.like(reviewId, token);
      await fetchReviews();
    } catch (err) {
      setError(err.message);
    } finally {
      setLikingReviewId('');
    }
  };

  const handleDelete = async (reviewId) => {
    const isConfirmed = window.confirm('Delete this review?');
    if (!isConfirmed) return;

    setDeletingReviewId(reviewId);
    try {
      await reviewsApi.remove(reviewId, token);
      await Promise.all([fetchReviews(), fetchCompany()]);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingReviewId('');
    }
  };

  if (loadingCompany) {
    return <section className="page-loading">Loading company details...</section>;
  }

  if (!company) {
    return (
      <section className="page">
        <article className="card empty-state">
          <h2>Company unavailable</h2>
          <p>{error || 'This company could not be loaded.'}</p>
          <Link to="/" className="btn btn-primary">
            Back to companies
          </Link>
        </article>
      </section>
    );
  }

  return (
    <section className="page">
      <article className="card detail-header">
        <div>
          <p className="eyebrow">Company profile</p>
          <h1 className="detail-title">{company.name}</h1>
          <p className="detail-meta">
            {company.location}, {company.city}
          </p>
          <p className="detail-description">{company.description || 'No description available.'}</p>
        </div>
        <div className="detail-rating">
          <p>Average rating</p>
          <strong>{company.averageRating?.toFixed(1) || '0.0'}</strong>
          <StarRating readOnly value={company.averageRating || 0} />
          <small>{company.totalReviews || 0} total reviews</small>
        </div>
      </article>

      <div className="detail-layout">
        <article className="card review-form-card">
          <h2>Write a review</h2>
          <p>Share your experience with {company.name}.</p>
          <form className="stack-form" onSubmit={handleCreateReview}>
            <label className="field-group">
              <span>Subject</span>
              <input
                type="text"
                name="subject"
                value={reviewForm.subject}
                onChange={handleReviewChange}
                required
              />
            </label>

            <label className="field-group">
              <span>Rating</span>
              <StarRating
                value={Number(reviewForm.rating)}
                onChange={(nextRating) =>
                  setReviewForm((current) => ({ ...current, rating: nextRating }))
                }
              />
            </label>

            <label className="field-group">
              <span>Review</span>
              <textarea
                name="reviewText"
                value={reviewForm.reviewText}
                onChange={handleReviewChange}
                rows={5}
                required
              />
            </label>

            <label className="field-group">
              <span>Profile picture URL (optional)</span>
              <input
                type="url"
                name="profilePicture"
                value={reviewForm.profilePicture}
                onChange={handleReviewChange}
                placeholder="https://..."
              />
            </label>

            {formError && <p className="feedback error">{formError}</p>}
            {successMessage && <p className="feedback success">{successMessage}</p>}

            <button type="submit" className="btn btn-primary" disabled={submittingReview}>
              {submittingReview ? 'Submitting...' : isAuthenticated ? 'Post review' : 'Login to review'}
            </button>
          </form>
        </article>

        <article className="review-panel">
          <div className="review-panel-head">
            <h2>Community reviews</h2>
            <label className="field-group inline-field">
              <span>Sort by</span>
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="rating-high">Rating high to low</option>
                <option value="rating-low">Rating low to high</option>
              </select>
            </label>
          </div>

          {error && <p className="feedback error">{error}</p>}
          {loadingReviews && <p className="page-loading">Loading reviews...</p>}
          {!loadingReviews && reviews.length === 0 && (
            <article className="card empty-state">
              <h3>No reviews yet</h3>
              <p>Be the first to review this company.</p>
            </article>
          )}

          <div className="review-list">
            {reviews.map((review) => {
              const reviewUserId = extractReviewUserId(review);
              const canDelete = isAuthenticated && (isAdmin || reviewUserId === user?.id);

              return (
                <ReviewCard
                  key={review._id}
                  review={review}
                  canDelete={canDelete}
                  onLike={() => handleLike(review._id)}
                  onDelete={() => handleDelete(review._id)}
                  liking={likingReviewId === review._id}
                  deleting={deletingReviewId === review._id}
                />
              );
            })}
          </div>
        </article>
      </div>
    </section>
  );
}
