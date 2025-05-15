import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResultsPage = () => {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState('');
  const [results, setResults] = useState([]);

  // Load elections on mount
  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/elections', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setElections(response.data.elections || []);
      } catch (err) {
        toast.error('❌ Failed to load elections.');
      }
    };
    fetchElections();
  }, []);

  // Load results when an election is selected
  useEffect(() => {
    if (!selectedElection) return;

    const fetchResults = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/elections/${selectedElection}/results`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }
        );
        setResults(response.data.results || []);
      } catch (err) {
        toast.error('❌ Failed to load results.');
      }
    };
    fetchResults();
  }, [selectedElection]);

  return (
    <div>
      <h2>📊 View Election Results</h2>

      <select onChange={e => setSelectedElection(e.target.value)} value={selectedElection}>
        <option value="">-- Select Election --</option>
        {elections.map(e => (
          <option key={e.id} value={e.id}>
            {e.title} ({e.faculty})
          </option>
        ))}
      </select>

      {results.length > 0 && (
        <div>
          <h3>Results</h3>
          <ul>
            {results.map(result => (
              <li key={result.candidateId}>
                {result.candidateName} — 🗳️ {result.voteCount} votes
              </li>
            ))}
          </ul>
        </div>
      )}

      {results.length === 0 && selectedElection && (
        <p>No votes have been cast yet.</p>
      )}
    </div>
  );
};

export default ResultsPage;
