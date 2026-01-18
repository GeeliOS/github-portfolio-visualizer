import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import UserProfile from './components/UserProfile';
import RepositoryList from './components/RepositoryList';
import LanguageCharts from './components/LanguageCharts';
import SearchBar from './components/SearchBar';
import Loader from './components/Loader';
import { getGitHubUser, getAllUserRepos } from './services/githubAPI';
import './styles/App.css';

function App() {
  const [username, setUsername] = useState('github');
  const [userData, setUserData] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserData = async (user = username) => {
    setLoading(true);
    setError(null);
    
    try {
      const userData = await getGitHubUser(user);
      setUserData(userData);
      
      const repos = await getAllUserRepos(user);
      setRepositories(repos);
      
    } catch (err) {
      setError('Не удалось загрузить данные. Проверьте имя пользователя и попробуйте снова.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleSearch = (newUsername) => {
    setUsername(newUsername);
    fetchUserData(newUsername);
  };

  if (loading && !userData) {
    return <Loader />;
  }

  return (
    <div className="App">
      <Header />
      <div className="container">
        <SearchBar onSearch={handleSearch} currentUsername={username} />
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {userData && (
          <>
            <UserProfile userData={userData} />
            
            {/* Добавляем секцию с графиками языков */}
            <LanguageCharts repositories={repositories} />
            
            <div className="repositories-section">
              <h2 className="section-title">
                Репозитории 
                <span className="repo-count-badge">({repositories.length})</span>
              </h2>
              <RepositoryList repositories={repositories} />
            </div>
          </>
        )}
      </div>
      
      <footer className="footer">
        <p>GitHub Portfolio Visualizer &copy; {new Date().getFullYear()}</p>
        <p>Использует официальное GitHub REST API</p>
      </footer>
    </div>
  );
}

export default App;
