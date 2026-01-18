import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ onSearch, currentUsername }) => {
  const [inputValue, setInputValue] = useState(currentUsername);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-bar">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Введите имя пользователя GitHub..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          <FaSearch /> Поиск
        </button>
      </form>
    </div>
  );
};

export default SearchBar;