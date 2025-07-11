import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';

import Register from './register';
import Login from './login';
import VotingPage from './VotingPage';
import AdminCreateElection from './AdminCreateElection';
import AdminDashboard from './AdminDashboard';
import AdminElectionManager from './pages/AdminElectionManager';
import ResultsPage from './ResultsPage';

import './App.css';
import useAuth from './hooks/useAuth.jsx';
import { UserProvider } from './context/UserContext.jsx';

// ✅ Toastify imports
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isAdmin } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.info("Logged out successfully!"); // ✅ Toast on logout
    navigate('/login');
  };

  return (
    <div className="app-container">
      {/* ✅ Global Toast Handler */}
      <ToastContainer position="top-right" autoClose={3000} />

      {location.pathname === '/register' && (
        <>
          <h1>Welcome to Online Voting System</h1>
          <p className="marquee">YOUR VOTE!         YOUR RIGHT!          YOUR LEADERSHIP!</p>
        </>
      )}

      <nav>
        <Link to="/register">Register</Link> | 
        <Link to="/login">Login</Link> | 
        <Link to="/vote">Vote</Link> | 
        <Link to="/results">Results</Link>
        {isAdmin && (
          <>
            {' '}| <Link to="/admin">Admin Dashboard</Link>
            {' '}| <Link to="/admin/create-election">Admin Panel</Link>
            {' '}| <Link to="/admin/manage-elections">Manage Elections</Link>
          </>
        )}
        {isAuthenticated && (
          <>
            {' '}| <button
              onClick={handleLogout}
              style={{
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                color: 'blue',
                textDecoration: 'none'
              }}
            >
              Logout
            </button>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/vote"
          element={isAuthenticated ? <VotingPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/results"
          element={isAuthenticated ? <ResultsPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/admin/create-election"
          element={isAuthenticated && isAdmin ? <AdminCreateElection /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/admin"
          element={isAuthenticated && isAdmin ? <AdminDashboard /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/admin/manage-elections"
          element={isAuthenticated && isAdmin ? <AdminElectionManager /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <UserProvider>
      <Router>
        <App />
      </Router>
    </UserProvider>
  );
}
