import React from 'react';
import { FaStar, FaCodeBranch, FaCircle, FaCalendarAlt } from 'react-icons/fa';
import { GoLock, GoGlobe } from 'react-icons/go';

const RepositoryCard = ({ repository }) => {
  const getLanguageColor = (language) => {
    const colors = {
      'JavaScript': '#f1e05a',
      'TypeScript': '#2b7489',
      'Python': '#3572A5',
      'Java': '#b07219',
      'C++': '#f34b7d',
      'C#': '#178600',
      'PHP': '#4F5D95',
      'Ruby': '#701516',
      'Go': '#00ADD8',
      'Rust': '#dea584',
      'HTML': '#e34c26',
      'CSS': '#563d7c',
      'Vue': '#2c3e50',
      'React': '#61dafb',
      'Swift': '#ffac45',
      'Kotlin': '#F18E33',
      'Dart': '#00B4AB',
      'Shell': '#89e051',
      'PowerShell': '#012456',
      'SCSS': '#c6538c',
      'Less': '#1d365d',
    };
    
    return colors[language] || '#ccc';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="repository-card">
      <div className="repo-header">
        <a 
          href={repository.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="repo-name"
        >
          {repository.name}
        </a>
        <span className="repo-visibility">
          {repository.private ? (
            <>
              <GoLock /> Private
            </>
          ) : (
            <>
              <GoGlobe /> Public
            </>
          )}
        </span>
      </div>
      
      {repository.description && (
        <p className="repo-description">{repository.description}</p>
      )}
      
      <div className="repo-footer">
        {repository.language && (
          <div className="repo-language">
            <FaCircle 
              className="language-color" 
              style={{ color: getLanguageColor(repository.language) }}
            />
            <span>{repository.language}</span>
          </div>
        )}
        
        {repository.stargazers_count > 0 && (
          <div className="repo-stars">
            <FaStar />
            <span>{repository.stargazers_count}</span>
          </div>
        )}
        
        {repository.forks_count > 0 && (
          <div className="repo-forks">
            <FaCodeBranch />
            <span>{repository.forks_count}</span>
          </div>
        )}
        
        {repository.created_at && (
          <div className="repo-created">
            <FaCalendarAlt />
            <span>Создан: {formatDate(repository.created_at)}</span>
          </div>
        )}
        
        {repository.updated_at && (
          <div className="repo-updated">
            <FaCalendarAlt />
            <span>Обновлен: {formatDate(repository.updated_at)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RepositoryCard;