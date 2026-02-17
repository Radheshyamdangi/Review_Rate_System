import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navClassName = ({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link');

export default function Layout() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <NavLink to="/" className="brand">
            Review Radar
          </NavLink>

          <nav className="top-nav">
            <NavLink to="/" className={navClassName}>
              Companies
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin/companies" className={navClassName}>
                Admin
              </NavLink>
            )}
          </nav>

          <div className="top-actions">
            {isAuthenticated ? (
              <>
                <span className="user-chip">
                  {user?.name}
                  <small>{user?.role}</small>
                </span>
                <button type="button" className="btn btn-outline btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="btn btn-outline btn-sm">
                  Login
                </NavLink>
                <NavLink to="/signup" className="btn btn-primary btn-sm">
                  Sign up
                </NavLink>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
