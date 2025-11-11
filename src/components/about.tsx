import React from "react";
import "./css/about.css";

const About: React.FC = () => {
  return (
    <section className="about">
      <div className="about-container">

        <div className="about-text">
          <h2 className="about-title">About CareFlow</h2>
          <p className="about-description">
            CareFlow is a web application designed to streamline appointment scheduling and medical record management for clinics.  
            Patients can book appointments online, doctors can manage their calendars, and administrative staff can oversee clinic operations efficiently.
          </p>

        
        </div>

        
        <div className="about-image">
          <img
            src="0_881a36a3367d4a587f76c6c3ffe93d08_1762903470985.jpeg"
            alt="Healthcare illustration"
          />
        </div>
      </div>
    </section>
  );
};

export default About;
