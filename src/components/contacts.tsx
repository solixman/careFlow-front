import React from "react";
import ContactForm from "./contactForm";
import "./css/Contacts.css";

const Contacts: React.FC = () => {
  return (
    <section id="contact" className="ContactSection">
      <div className="contactForm">
        <ContactForm />
      </div>

      <div className="rightDiv">
        <h2 className="contacts-title">
           Your health, your data — <span> we’re here to support you </span> 
           every step of the way.
          </h2>

        <div className="locationImage">
          <a href="https://maps.app.goo.gl/4eaG7M62TnFbpJJfA">
            <img
              src="Capture d'écran 2025-11-12 095954.png"
              alt="location dyal sbitar"
            />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contacts;
