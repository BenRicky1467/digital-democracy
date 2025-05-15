import { useState, useEffect } from 'react';
import axios from 'axios';
import useAuth from './hooks/useAuth';  // Import the useAuth hook
import { toast } from 'react-toastify'; // ✅ Toastify
import './VotingPage.css';

const VotingPage = () => {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [vote, setVote] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, isAuthenticated } = useAuth(); // Access user and authentication status from context
  const token = localStorage.getItem('token');

  const userFaculty = user?.faculty;

  useEffect(() => {
    const fetchElections = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3000/api/elections', {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log('API Response for Elections:', response.data);
        setElections(response.data.elections || []);
      } catch (error) {
        console.error('Error fetching elections:', error);
        toast.error('❌ Failed to load elections'); // ✅ Toast
      } finally {
        setLoading(false);
      }
    };
    fetchElections();
  }, [token]);

  useEffect(() => {
    if (!selectedElection) return;

    const fetchCandidates = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/elections/${selectedElection}/candidates`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        console.log('API Response for Candidates:', response.data);

        const allCandidates = response.data.candidates;
        const eligibleCandidates = allCandidates.filter(candidate =>
          candidate.faculty === 'ALL' || candidate.faculty === userFaculty
        );
        setCandidates(eligibleCandidates);
      } catch (error) {
        console.error('Error fetching candidates:', error);
        toast.error('❌ Failed to load candidates'); // ✅ Toast
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, [selectedElection, userFaculty, token]);

  const handleVote = async () => {
    if (!vote || !selectedElection) {
      toast.warning('❌ Please select both an election and a candidate!'); // ✅ Toast
      return;
    }

    if (!token) {
      toast.error('❌ Token is missing or expired. Please log in again.'); // ✅ Toast
      return;
    }

    try {
      await axios.post(
        'http://localhost:3000/api/vote',
        { electionId: selectedElection, candidateId: vote },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('✅ Vote submitted successfully!'); // ✅ Toast
    } catch (error) {
      console.error('Error submitting vote:', error);
      if (error.response && error.response.data) {
        toast.error(`❌ ${error.response.data.message || 'Error submitting vote.'}`); // ✅ Toast
      } else {
        toast.error('❌ Error submitting vote. You may have already voted or the election is closed.'); // ✅ Toast
      }
    }
  };

  return (
    <div>
      <h2>🗳️ Cast Your Vote</h2>

      {loading && <p>Loading...</p>}

      <select onChange={e => setSelectedElection(e.target.value)} value={selectedElection} disabled={loading}>
        <option value="">-- Select Election --</option>
        {elections.map(election => (
          <option key={election.id} value={election.id}>
            {election.title} ({election.faculty})
          </option>
        ))}
      </select>

      <select onChange={e => setVote(e.target.value)} value={vote} disabled={!selectedElection || loading}>
        <option value="">-- Select Candidate --</option>
        {candidates.map(candidate => (
          <option key={candidate.id} value={candidate.id}>
            {candidate.name}
          </option>
        ))}
      </select>

      <button onClick={handleVote} disabled={!vote || !selectedElection || loading}>
        Submit Vote
      </button>
    </div>
  );
};

export default VotingPage;
