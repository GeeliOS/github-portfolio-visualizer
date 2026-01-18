import React from 'react';
import { 
  FaUsers, 
  FaMapMarkerAlt, 
  FaLink, 
  FaTwitter,
  FaBuilding,
  FaEnvelope,
  FaCode
} from 'react-icons/fa';

const UserProfile = ({ userData }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="user-profile">
      <div className="avatar-container">
        <img 
          src={userData.avatar_url} 
          alt={`${userData.login} avatar`} 
          className="avatar"
        />
      </div>
      
      <div className="user-info">
        <h1 className="user-name">{userData.name || userData.login}</h1>
        <p className="user-login">@{userData.login}</p>
        
        {userData.bio && (
          <p className="user-bio">{userData.bio}</p>
        )}
        
        <div className="user-stats">
          <div className="stat">
            <FaUsers className="stat-icon" />
            <span className="stat-label">Подписчики:</span>
            <span className="stat-value">{userData.followers}</span>
          </div>
          
          <div className="stat">
            <FaUsers className="stat-icon" />
            <span className="stat-label">Подписки:</span>
            <span className="stat-value">{userData.following}</span>
          </div>
          
          <div className="stat">
            <FaCode className="stat-icon" />
            <span className="stat-label">Репозитории:</span>
            <span className="stat-value">{userData.public_repos}</span>
          </div>
          
          {userData.created_at && (
            <div className="stat">
              <span className="stat-label">На GitHub с:</span>
              <span className="stat-value">{formatDate(userData.created_at)}</span>
            </div>
          )}
        </div>
        
        <div className="user-links">
          {userData.location && (
            <div className="user-link">
              <FaMapMarkerAlt /> {userData.location}
            </div>
          )}
          
          {userData.company && (
            <div className="user-link">
              <FaBuilding /> {userData.company}
            </div>
          )}
          
          {userData.blog && (
            <a 
              href={userData.blog.startsWith('http') ? userData.blog : `https://${userData.blog}`}
              target="_blank"
              rel="noopener noreferrer"
              className="user-link"
            >
              <FaLink /> Веб-сайт
            </a>
          )}
          
          {userData.twitter_username && (
            <a 
              href={`https://twitter.com/${userData.twitter_username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="user-link"
            >
              <FaTwitter /> Twitter
            </a>
          )}
          
          {userData.email && (
            <a 
              href={`mailto:${userData.email}`}
              className="user-link"
            >
              <FaEnvelope /> Email
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
