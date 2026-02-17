import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="page">
      <article className="card empty-state not-found">
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p>The page you requested does not exist.</p>
        <Link to="/" className="btn btn-primary">
          Return home
        </Link>
      </article>
    </section>
  );
}
