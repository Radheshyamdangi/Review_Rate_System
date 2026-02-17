import StarRating from './StarRating';

const formatDate = (value) => {
  if (!value) return '';
  return new Date(value).toLocaleString();
};

export default function ReviewCard({
  review,
  canDelete,
  onLike,
  onDelete,
  liking = false,
  deleting = false,
}) {
  return (
    <article className="card review-card">
      <div className="review-header">
        <div className="review-user">
          {review.profilePicture ? (
            <img src={review.profilePicture} alt={review.fullName} className="avatar" />
          ) : (
            <div className="avatar avatar-fallback">{review.fullName.slice(0, 1)}</div>
          )}
          <div>
            <p className="review-name">{review.fullName}</p>
            <small>{formatDate(review.createdAt)}</small>
          </div>
        </div>
        <StarRating readOnly value={review.rating} />
      </div>

      <h4 className="review-subject">{review.subject}</h4>
      <p className="review-text">{review.reviewText}</p>

      <div className="review-actions">
        <button type="button" className="btn btn-outline btn-sm" onClick={onLike} disabled={liking}>
          {liking ? 'Liking...' : `Helpful (${review.likes || 0})`}
        </button>
        {canDelete && (
          <button type="button" className="btn btn-danger btn-sm" onClick={onDelete} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        )}
      </div>
    </article>
  );
}
