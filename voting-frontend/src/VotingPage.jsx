import { useState, useEffect } from 'react';
import axios from 'axios';
import useAuth from './hooks/useAuth';  // Import the useAuth hook
import './VotingPage.css';

const VotingPage = () => {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [vote, setVote] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, isAuthenticated } = useAuth(); // Access user and authentication status from context
  const token = localStorage.getItem('token');

  // Use userFaculty from the user context
  const userFaculty = user?.faculty;

  // Log to check if the necessary values are correct
  console.log('📥 Selected election:', selectedElection);
  console.log('🎓 User faculty:', userFaculty);
  console.log('🔐 Token available:', !!token);

  useEffect(() => {
    const fetchElections = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3000/api/elections', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Check the API response for elections
        console.log('API Response for Elections:', response.data);

        setElections(response.data.elections || []);
        setMessage('');
      } catch (error) {
        setMessage('❌ Failed to load elections');
        console.error('Error fetching elections:', error);
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

        // Log the response to check the candidates API result
        console.log('API Response for Candidates:', response.data);

        const allCandidates = response.data.candidates;  // Accessing candidates property directly
        const eligibleCandidates = allCandidates.filter(candidate =>
          candidate.faculty === 'ALL' || candidate.faculty === userFaculty
        );
        setCandidates(eligibleCandidates);
        setMessage('');
      } catch (error) {
        setMessage('❌ Failed to load candidates');
        console.error('Error fetching candidates:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, [selectedElection, userFaculty, token]);

  const handleVote = async () => {
    if (!vote || !selectedElection) {
      setMessage('❌ Please select both an election and a candidate!');
      return;
    }

    // Log the request body before submitting the vote
    console.log('Vote Request Body:', { electionId: selectedElection, candidateId: vote });

    // Token expiration check
    if (!token) {
      setMessage('❌ Token is missing or expired. Please log in again.');
      return;
    }

    setMessage('Submitting vote...');
    try {
      await axios.post(
        'http://localhost:3000/api/vote',
        { electionId: selectedElection, candidateId: vote },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('✅ Vote submitted successfully!');
    } catch (error) {
      console.error('Error submitting vote:', error); // Log the error details
      if (error.response && error.response.data) {
        setMessage(`❌ ${error.response.data.message || 'Error submitting vote.'}`);
      } else {
        setMessage('❌ Error submitting vote. You may have already voted or the election is closed.');
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

      {message && <p>{message}</p>}
    </div>
  );
};

export default VotingPage;
