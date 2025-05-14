import React, { useState } from 'react';
import axios from 'axios';
import './AdminCreateElection.css';
import CandidateList from './CandidateList';

const AdminCreateElection = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [electionDate, setElectionDate] = useState('');
  const [faculty, setFaculty] = useState('');
  const [message, setMessage] = useState('');
  const [electionId, setElectionId] = useState(null); // New state for created election ID

  // Handle election creation
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:3000/api/elections',
        { title, description, electionDate, faculty },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setMessage('✅ Election created successfully!');
      setTitle('');
      setDescription('');
      setElectionDate('');
      setFaculty('');
      setElectionId(response.data.electionId); // Save the election ID
    } catch (error) {
      setMessage('❌ Failed to create election');
      setElectionId(null);
    }
  };

  // Handle election deletion
  const handleDeleteElection = async () => {
    if (!electionId) return;

    const confirmation = window.confirm('Are you sure you want to delete this election?');

    if (confirmation) {
      try {
        await axios.delete(
          `http://localhost:3000/api/elections/${electionId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setMessage('✅ Election deleted successfully!');
        setElectionId(null); // Reset election ID after deletion
      } catch (error) {
        setMessage('❌ Failed to delete election');
      }
    }
  };

  return (
    <div className="election-creation-container">
      <h2>📋 Create Election</h2>
      <form onSubmit={handleSubmit} className="election-form">
        <label htmlFor="title">Election Title:</label>
        <input
          type="text"
          id="title"
          placeholder="Election Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label htmlFor="description">Election Description:</label>
        <textarea
          id="description"
          placeholder="Election Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <label htmlFor="electionDate">Election Date & Time:</label>
        <input
          type="datetime-local"
          id="electionDate"
          value={electionDate}
          onChange={(e) => setElectionDate(e.target.value)}
          required
        />

        <label htmlFor="faculty">Faculty:</label>
        <select
          id="faculty"
          value={faculty}
          onChange={(e) => setFaculty(e.target.value)}
          required
        >
          <option value="">Select Faculty</option>
          <option value="ALL">ALL</option>
          <option value="BCS">BCS</option>
          <option value="BFIT">BFIT</option>
          <option value="BAED">BAED</option>
          <option value="LAW">LAW</option>
        </select>

        <button type="submit" className="submit-btn">Create</button>
      </form>

      {message && (
        <p className={`message ${message.startsWith('❌') ? 'error' : 'success'}`}>{message}</p>
      )}

      {electionId && (
        <div>
          <CandidateList selectedElection={electionId} />
          <button onClick={handleDeleteElection} className="delete-election-btn">
            Delete Election
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminCreateElection;
