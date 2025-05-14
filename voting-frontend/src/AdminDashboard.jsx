import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

function AdminDashboard() {
  const [elections, setElections] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await axios.get('/api/elections', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setElections(response.data.elections || []);
      } catch (err) {
        console.error('Error fetching elections:', err);
      }
    };

    const fetchCandidates = async () => {
      try {
        const response = await axios.get('/api/candidates', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setCandidates(response.data.candidates || []);
      } catch (err) {
        console.error('Error fetching candidates:', err);
      }
    };

    fetchElections();
    fetchCandidates();
  }, []);

  const deleteElection = async (electionId) => {
    try {
      await axios.delete(`/api/elections/${electionId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setElections(elections.filter(election => election.id !== electionId));
    } catch (err) {
      console.error('Error deleting election:', err);
    }
  };

  const deleteCandidate = async (candidateId) => {
    try {
      await axios.delete(`/api/candidates/${candidateId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCandidates(candidates.filter(candidate => candidate.id !== candidateId));
    } catch (err) {
      console.error('Error deleting candidate:', err);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <h2>Admin Dashboard</h2>
      <p>Welcome, Admin! You have full control over the elections.</p>

      <div className="admin-buttons">
        <Link to="/admin/create-election">
          <button>Create New Election</button>
        </Link>
        <Link to="/results">
          <button>View Results</button>
        </Link>
      </div>

      <h3>Manage Elections</h3>
      <ul>
        {elections.map((election) => (
          <li key={election.id}>
            <span>{election.title}</span>
            <button onClick={() => deleteElection(election.id)}>Delete Election</button>
          </li>
        ))}
      </ul>

      <h3>Manage Candidates</h3>
      <ul>
        {candidates.map((candidate) => (
          <li key={candidate.id}>
            <span>{candidate.name}</span>
            <button onClick={() => deleteCandidate(candidate.id)}>Delete Candidate</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;
