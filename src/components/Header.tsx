import React from 'react';
import bikeSDLogo from '../assets/bikeSDLogo.jpg';

const Header: React.FC = () => {
  const handleLogoClick = (): void => {
    window.open('https://www.bikesd.org', '_blank', 'noopener,noreferrer');
  };

  return (
    <header style={styles.header}>
      <h1 style={styles.title}>San Diego Vision Zero Progress Tracker</h1>
      <button
        onClick={handleLogoClick}
        style={styles.logoButton}
        aria-label="Visit BikeSd website"
      >
        <img
          src={bikeSDLogo}
          alt="BikeSd Logo"
          style={styles.logo}
        />
      </button>
    </header>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#f8f9fae8',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: 0,
    color: '#212529',
  },
  logoButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    transition: 'opacity 0.2s',
  },
  logo: {
    border: 'solid grey',
    height: '75px',
    width: 'auto',
  },
};

export default Header;
