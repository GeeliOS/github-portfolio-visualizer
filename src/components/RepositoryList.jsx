import React, { useState, useMemo } from 'react';
import RepositoryCard from './RepositoryCard';
import Pagination from './Pagination';
import { FaSearch, FaSortAlphaDown, FaSortAlphaUp, FaCalendarAlt, FaStar, FaCodeBranch } from 'react-icons/fa';

const RepositoryList = ({ repositories }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortType, setSortType] = useState('updated-desc');

  const filteredAndSortedRepos = useMemo(() => {
    let filtered = repositories || [];
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(repo => {
        if (!repo) return false;
        const nameMatch = repo.name && repo.name.toLowerCase().includes(query);
        const descMatch = repo.description && repo.description.toLowerCase().includes(query);
        const langMatch = repo.language && repo.language.toLowerCase().includes(query);
        return nameMatch || descMatch || langMatch;
      });
    }
    
    // Сортировка
    const sortedRepos = [...filtered];
    const [field, direction] = sortType.split('-');
    
    switch (field) {
      case 'name':
        sortedRepos.sort((a, b) => {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          return direction === 'asc' 
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
        });
        break;
        
      case 'updated':
        sortedRepos.sort((a, b) => {
          const dateA = new Date(a.updated_at);
          const dateB = new Date(b.updated_at);
          return direction === 'asc' 
            ? dateA - dateB
            : dateB - dateA;
        });
        break;
        
      case 'created':
        sortedRepos.sort((a, b) => {
          const dateA = new Date(a.created_at);
          const dateB = new Date(b.created_at);
          return direction === 'asc' 
            ? dateA - dateB
            : dateB - dateA;
        });
        break;
        
      case 'stars':
        sortedRepos.sort((a, b) => {
          return direction === 'asc' 
            ? a.stargazers_count - b.stargazers_count
            : b.stargazers_count - a.stargazers_count;
        });
        break;
        
      case 'forks':
        sortedRepos.sort((a, b) => {
          return direction === 'asc' 
            ? a.forks_count - b.forks_count
            : b.forks_count - a.forks_count;
        });
        break;
        
      default:
        break;
    }
    
    return sortedRepos;
  }, [repositories, searchQuery, sortType]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRepos = filteredAndSortedRepos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAndSortedRepos.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const repositoriesSection = document.querySelector('.repositories-section');
    if (repositoriesSection) {
      window.scrollTo({
        top: repositoriesSection.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleSortChange = (type) => {
    const [currentField] = sortType.split('-');
    const [newField] = type.split('-');
    
    if (currentField === newField) {
      const currentDir = sortType.split('-')[1];
      const newDir = currentDir === 'asc' ? 'desc' : 'asc';
      setSortType(`${newField}-${newDir}`);
    } else {
      const defaultDir = newField === 'name' ? 'asc' : 'desc';
      setSortType(`${newField}-${defaultDir}`);
    }
    setCurrentPage(1);
  };

  const getSortIcon = (type) => {
    const [field] = type.split('-');
    const isActive = sortType.startsWith(field);
    
    if (!isActive) {
      switch(field) {
        case 'name': return <FaSortAlphaDown />;
        case 'updated': return <FaCalendarAlt />;
        case 'created': return <FaCalendarAlt />;
        case 'stars': return <FaStar />;
        case 'forks': return <FaCodeBranch />;
        default: return <FaSortAlphaDown />;
      }
    }
    
    const [, direction] = sortType.split('-');
    if (field === 'name') {
      return direction === 'asc' ? <FaSortAlphaDown /> : <FaSortAlphaUp />;
    }
    return <FaCalendarAlt />;
  };

  const getSortLabel = (type) => {
    const [field] = type.split('-');
    const labels = {
      'name': 'По имени',
      'updated': 'По обновлению',
      'created': 'По созданию',
      'stars': 'По звездам',
      'forks': 'По форкам'
    };
    return labels[field];
  };

  const getSortDirectionLabel = () => {
    const [, direction] = sortType.split('-');
    const currentField = sortType.split('-')[0];
    
    if (currentField === 'name') {
      return direction === 'asc' ? 'А→Я' : 'Я→А';
    }
    return direction === 'asc' ? '▲' : '▼';
  };

  if (!repositories || repositories.length === 0) {
    return (
      <div className="no-data">
        <p>Нет доступных репозиториев</p>
      </div>
    );
  }

  return (
    <div className="repository-list-container">
      <div className="repo-controls">
        <div className="search-control">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Поиск репозиториев..."
              className="repo-search-input"
            />
            {searchQuery && (
              <button 
                className="clear-search"
                onClick={() => setSearchQuery('')}
              >
                ×
              </button>
            )}
          </div>
          {searchQuery && (
            <div className="search-info">
              Найдено: {filteredAndSortedRepos.length} из {repositories.length}
            </div>
          )}
        </div>
        
        <div className="sort-controls">
          <div className="sort-buttons">
            {['name', 'updated', 'created', 'stars', 'forks'].map((type) => (
              <button
                key={type}
                className={`sort-button ${sortType.startsWith(type) ? 'active' : ''}`}
                onClick={() => handleSortChange(type)}
                title={`${getSortLabel(type)} (клик для сортировки)`}
              >
                {getSortIcon(type)}
                <span>{getSortLabel(type)}</span>
                {sortType.startsWith(type) && (
                  <span className="sort-direction-indicator" title="Направление сортировки">
                    {getSortDirectionLabel()}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="repository-list">
        {currentRepos.length > 0 ? (
          currentRepos.map((repo) => (
            <RepositoryCard key={repo.id} repository={repo} />
          ))
        ) : (
          <div className="no-results">
            <p>Репозитории не найдены. Попробуйте изменить запрос поиска.</p>
          </div>
        )}
      </div>
      
      {filteredAndSortedRepos.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}
      
      <div className="pagination-stats">
        Показано {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredAndSortedRepos.length)} из {filteredAndSortedRepos.length} репозиториев
      </div>
    </div>
  );
};

export default RepositoryList;