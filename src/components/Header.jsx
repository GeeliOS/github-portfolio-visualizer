import React from 'react';
import { FaGithub } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="header">
      <div className="container header-content">
        <div className="logo">
          <FaGithub />
          <span>GitHub Portfolio</span>
        </div>
        <nav>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="user-link"
          >
            GitHub.com
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;