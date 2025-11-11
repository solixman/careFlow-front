import React from "react";
import { useNavigate } from "react-router-dom";
import "./css/hero.css";
import BackVideo from "../../../assets/videos/vecteezy_global-network-medical-healthcare-system-protection-concept_4747818.mp4";

const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <video className="hero-video" autoPlay loop muted playsInline>
        <source src={BackVideo} type="video/mp4" />
      </video>

      <div className="hero-overlay"></div>

      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            Your <span>whole medical life</span> within your hands
          </h1>
          <p className="hero-subtitle">
            We care for your health journey. Book appointments, access your
            medical records, and stay connected with your doctors securely
            online.
          </p>

          <div className="hero-buttons">
            <button
              className="btn-primary"
              onClick={() => navigate("/register")}
            >
              Start now
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate("/login")}
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
