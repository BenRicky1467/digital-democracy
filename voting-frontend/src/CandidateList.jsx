import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './CandidateList.css';
import { toast } from 'react-toastify'; // ✅ Toast import

const CandidateList = ({ selectedElection }) => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCandidate, setNewCandidate] = useState({ name: '', faculty: '' });

  const token = localStorage.getItem('token');

  const isAdmin = () => {
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      return decoded.role === 'admin';
    } catch {
      return false;
    }
  };

  const fetchCandidates = async () => {
    if (!selectedElection) return;
    setLoading(true);

    try {
      const res = await axios.get(
        `http://localhost:3000/api/elections/${selectedElection}/candidates`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCandidates(res.data.candidates || []);
    } catch {
      toast.error('❌ Failed to load candidates');
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [selectedElection]);

  const handleCreateCandidate = async (e) => {
    e.preventDefault();
    if (!newCandidate.name || !newCandidate.faculty || !selectedElection) {
      toast.error('❌ All fields are required');
      return;
    }

    try {
      await axios.post(
        'http://localhost:3000/api/candidates',
        {
          name: newCandidate.name,
          faculty: newCandidate.faculty,
          electionId: selectedElection,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('✅ Candidate added successfully');
      setNewCandidate({ name: '', faculty: '' });
      fetchCandidates();
    } catch {
      toast.error('❌ Failed to add candidate');
    }
  };

  const deleteCandidate = async (candidateId) => {
    try {
      await axios.delete(`http://localhost:3000/api/candidates/${candidateId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCandidates(candidates.filter((c) => c.id !== candidateId));
      toast.success('✅ Candidate deleted successfully');
    } catch {
      toast.error('❌ Failed to delete candidate');
    }
  };

  return (
    <div className="candidate-list-container">
      <h3>👥 Candidate List</h3>

      {isAdmin() && selectedElection && (
        <form onSubmit={handleCreateCandidate} className="create-form">
          <input
            type="text"
            placeholder="Candidate Name"
            value={newCandidate.name}
            onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
          />
          <select
            value={newCandidate.faculty}
            onChange={(e) => setNewCandidate({ ...newCandidate, faculty: e.target.value })}
          >
            <option value="">-- Select Faculty --</option>
            <option value="BCS">BCS</option>
            <option value="BFIT">BFIT</option>
            <option value="BAED">BAED</option>
            <option value="LAW">LAW</option>
            <option value="ALL">ALL</option>
          </select>
          <button type="submit">➕ Add Candidate</button>
        </form>
      )}

      {loading && <p>Loading candidates...</p>}

      {!loading && candidates.length === 0 && (
        <p>No candidates available for this election.</p>
      )}

      <ul>
        {candidates.map((candidate) => (
          <li key={candidate.id}>
            <strong>{candidate.name}</strong> - {candidate.faculty}
            {isAdmin() && (
              <button onClick={() => deleteCandidate(candidate.id)} className="delete-btn">
                Delete Candidate
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CandidateList;
