import * as React from "react";
import { Link } from "react-router-dom";
import "./css/header.css";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo">
          CareFlow
        </Link>
      </div>

      <nav className={`nav-links ${isMenuOpen ? "open" : ""}`}>
        <Link to="/#" onClick={() => setIsMenuOpen(false)}>Accueil</Link>
        <a href="#about" onClick={() => setIsMenuOpen(false)}>About us</a>
        <a href="#features" onClick={() => setIsMenuOpen(false)}> features</a>
        <a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a>
      </nav>

      <div className="auth-buttons">
        <Link to="/login" className="btn btn-primary">Connexion</Link>
        <Link to="/register" className="btn btn-outline">Inscription</Link>
      </div>

      {/* Hamburger button for mobile */}
      <button
        className="hamburger"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </header>
  );
};

export default Header;
