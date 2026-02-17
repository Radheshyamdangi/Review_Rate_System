const stars = [1, 2, 3, 4, 5];

export default function StarRating({
  value = 0,
  onChange,
  readOnly = false,
  className = '',
  size = 'md',
}) {
  return (
    <div className={`star-rating ${size} ${className}`.trim()}>
      {stars.map((star) => {
        const isFilled = star <= value;

        if (readOnly) {
          return (
            <span key={star} className={isFilled ? 'star filled' : 'star'}>
              ★
            </span>
          );
        }

        return (
          <button
            key={star}
            type="button"
            className={isFilled ? 'star-btn filled' : 'star-btn'}
            onClick={() => onChange?.(star)}
            aria-label={`Set rating to ${star}`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
