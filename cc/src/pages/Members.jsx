import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUsers } from 'react-icons/fi'; 
import { auth, rtdb } from '../config/firebase';
import '../styles/members.css';

export default function Members() {
  const [currentUser, setCurrentUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login');
        return;
      }
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const presenceRef = ref(rtdb, 'presence');

    const unsubscribe = onValue(presenceRef, (snapshot) => { 
      const data = snapshot.val() || {};
      setOnlineUsers(data);
    });

    return () => unsubscribe(); 
  }, []);

  if (loading) return <div className="loading">Loading users...</div>;

  const totalOnline = Object.keys(onlineUsers).length;

  return (
    <div className="members-container">

      {/* HEADER */}
      <div className="members-header">
        <div className="header-top">
          <button className="btn-back" onClick={() => navigate('/dashboard')}>
            <FiArrowLeft /> Quay lại
          </button>

          <h2><FiUsers /> Members</h2>
        </div>

        <div className="header-title">
          <h1>Thành viên hoạt động</h1>
          <p>Đang online: {totalOnline} người</p>
        </div>

      </div>

      <div className="members-list">
        {totalOnline === 0 && (
          <div className="empty">Không có ai online</div>
        )}

        {Object.entries(onlineUsers)
          .sort(([a], [b]) => (a === currentUser?.uid ? -1 : b === currentUser?.uid ? 1 : 0)) 
          .map(([uid, user]) => {
            const isMe = uid === currentUser?.uid;

            return (
              <div key={uid} className={`member-item ${isMe ? 'me' : ''}`}>
                
                <img
                  src={
                    user.photo ||
                    `https://ui-avatars.com/api/?name=${user.name}`
                  }
                  alt="avatar"
                  className="avatar"
                />

                <div className="member-info">
                  <h4>
                    {user.name || user.email || 'Unknown'} 
                    {isMe && <span className="you-badge"> (You)</span>}
                  </h4>
                  <p className="sub-text">Đang hoạt động</p>
                </div>

                <div className="status">
                  <span className="dot online"></span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}