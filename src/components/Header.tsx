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
    padding: '1.5rem 2rem',
    backgroundColor: '#2d1f4a',
    borderBottom: '3px solid #483292',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    margin: 0,
    color: '#ffffff',
    letterSpacing: '0.5px',
  },
  logoButton: {
    background: 'none',
    border: '2px solid #483292',
    borderRadius: '8px',
    cursor: 'pointer',
    padding: '4px',
    transition: 'all 0.2s',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  logo: {
    height: '60px',
    width: 'auto',
    display: 'block',
    borderRadius: '4px',
  },
};

export default Header;
