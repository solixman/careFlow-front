import React from "react";
import { Link } from "react-router-dom";
import "../css/footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
      
        <div className="footer-section">
          <h2 className="footer-logo">CareFlow</h2>
          <p className="footer-text">
            Une solution moderne pour la gestion des dossiers médicaux, 
            des rendez-vous et la communication entre patients et professionnels de santé.
          </p>
        </div>


        <div className="footer-section">
          <h4>Navigation</h4>
          <ul>
            <li><Link to="/">Accueil</Link></li>
            <li><a href="#features">Fonctionnalités</a></li>
            <li><a href="#about">À propos</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        
        <div className="footer-section">
          <h4>Contact</h4>
          <ul>
            <li>Email : <a href="mailto:contact@careflow.com">contact@careflow.com</a></li>
            <li>Téléphone : +212 6 00 00 00 00</li>
            <li>Adresse : Casablanca, Maroc</li>
          </ul>
        </div>
      </div>

      
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} CareFlow. Tous droits réservés.</p>
        <div className="footer-links">
          <Link to="/terms">Mentions légales</Link>
          <Link to="/privacy">Politique de confidentialité</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
