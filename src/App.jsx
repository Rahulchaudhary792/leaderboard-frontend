import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './App.css'
Modal.setAppElement('#root'); 
function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [claimedPoints, setClaimedPoints] = useState(null);
  const [history, setHistory] = useState([]);
  const [newUserName, setNewUserName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    fetchUsers();
  }, []);
  useEffect(() => {
    const getHistory = async () => {
      try {
        const response = await axios.get('https://leaderboard-backend-11.onrender.com/api/history');
        setHistory(response.data); 
    }
    catch(error) {
      console.log(error);
    }
  }
  getHistory();
  }, [history]);
  const fetchUsers = async () => {
    const response = await axios.get('https://leaderboard-backend-11.onrender.com/api/users');
    setUsers(response.data);
  };
  const addUser = async () => {
    await axios.post('https://leaderboard-backend-11.onrender.com/api/users', { name: newUserName });
    fetchUsers();
    setNewUserName('');
  };
  const claimPoints = async () => {
    if (!selectedUser) return;
    const response = await axios.post('https://leaderboard-backend-11.onrender.com/api/claim', { userId: selectedUser });
    setClaimedPoints(response.data.points);
    fetchUsers();
  };
  return (
    <div className="body">
    <div className="container">
        <div className="header">
         <h2>Claim Points and Lead the Board!</h2>
      <select onChange={(e) => setSelectedUser(e.target.value)} value={selectedUser}>
        <option value="">Pick One</option>
        {users.map(user => (
          <option key={user._id} value={user._id}>{user.name}</option>
        ))}
      </select>
      <button onClick={claimPoints}>Claim Points</button>
      {claimedPoints && <p className="claimPoints">Claimed {claimedPoints} points!</p>}
      <h2>Add a Competitor!</h2>
      <input value={newUserName} required onChange={(e) => setNewUserName(e.target.value)} placeholder="Enter name" />
      <button onClick={addUser}>Add User</button>
            <h2>Leaderboard</h2>
        </div>
        <div className="leaderboard-tabs">
            <button className="active">Daily</button>
            <button>Weekly</button>
            <button>Monthly</button>
        </div>
        
        {users.map((user) => (
          <div className="leaderboard-item">
            <img src="https://tse2.mm.bing.net/th?id=OIP.OWHqt6GY5jrr7ETvJr8ZXwHaHa&pid=Api&P=0&h=180" alt="Profile Picture"/>
            <div className="details">
                <span><strong>{user.name}</strong></span>
                <span>Points: {user.points}</span>
            </div>
        </div>
        ))
    }
    <div className="viewHistory-div">
      <button className="viewHistory" onClick={() => setIsModalOpen(true)}>View history</button>
    </div>
    </div>
    <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Points History Modal"
        style={{
          content: {
            padding: '20px',
          },
          overlay: { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
        }}
      >
        <h2 className="pointsHistory-h2">Score Story!</h2>
        <ul>
          {history.map((entry, index) => (
            <div className="history-item">
            <div className="details">
                <span><strong><b className="emoji">&#127881;</b> Claimed {entry.points} points for {entry.user}</strong></span>
            </div>
        </div>
          ))}
        </ul>
        <button onClick={() => setIsModalOpen(false)} className="close-button">Close</button>
      </Modal>
    </div>
  );
}
export default App;