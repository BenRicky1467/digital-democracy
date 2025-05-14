// src/pages/AdminElectionManager.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import CandidateList from '../CandidateList';
import './AdminElectionManager.css';

const AdminElectionManager = () => {
  const [elections, setElections] = useState([]);
  const [selectedElectionId, setSelectedElectionId] = useState(null);
  const [error, setError] = useState('');
  const [newElection, setNewElection] = useState({ title: '', faculty: '' });
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  const fetchElections = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/elections', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setElections(res.data.elections || []);
    } catch {
      setError('❌ Failed to load elections');
    }
  };

  useEffect(() => {
    fetchElections();
  }, []);

  const handleCreateElection = async (e) => {
    e.preventDefault();
    if (!newElection.title || !newElection.faculty) {
      setMessage('❌ Title and faculty are required');
      return;
    }

    try {
      await axios.post(
        'http://localhost:3000/api/elections',
        newElection,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage('✅ Election created successfully');
      setNewElection({ title: '', faculty: '' });
      fetchElections();
    } catch {
      setMessage('❌ Failed to create election');
    }
  };

  const handleDeleteElection = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/elections/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('✅ Election deleted');
      if (selectedElectionId === id) setSelectedElectionId(null);
      fetchElections();
    } catch {
      setMessage('❌ Failed to delete election');
    }
  };

  return (
    <div className="admin-election-manager">
      <h2>🗳️ Manage Elections and Candidates</h2>

      {error && <p className="error-message">{error}</p>}
      {message && <p className="message">{message}</p>}

      {/* Create Election Form */}
      <form onSubmit={handleCreateElection} className="create-election-form">
        <input
          type="text"
          placeholder="Election Title"
          value={newElection.title}
          onChange={(e) => setNewElection({ ...newElection, title: e.target.value })}
        />
        <select
          value={newElection.faculty}
          onChange={(e) => setNewElection({ ...newElection, faculty: e.target.value })}
        >
          <option value="">-- Select Faculty --</option>
          <option value="BCS">BCS</option>
          <option value="BFIT">BFIT</option>
          <option value="BAED">BAED</option>
          <option value="LAW">LAW</option>
          <option value="ALL">ALL</option>
        </select>
        <button type="submit">➕ Create Election</button>
      </form>

      {/* Select and Manage Candidates */}
      <select
        onChange={(e) => setSelectedElectionId(e.target.value)}
        value={selectedElectionId || ''}
      >
        <option value="" disabled>Select an election</option>
        {elections.map((election) => (
          <option key={election.id} value={election.id}>
            {election.title} ({election.faculty})
          </option>
        ))}
      </select>

      {/* Delete Button */}
      {selectedElectionId && (
        <button
          className="delete-election-btn"
          onClick={() => handleDeleteElection(selectedElectionId)}
        >
          🗑️ Delete This Election
        </button>
      )}

      {/* Candidate Manager */}
      {selectedElectionId && (
        <CandidateList selectedElection={selectedElectionId} />
      )}
    </div>
  );
};

export default AdminElectionManager;
