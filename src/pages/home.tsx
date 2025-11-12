import React from "react";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import "../index.css"
import Hero from "../components/sections/hero";
import About from "../components/sections/about";
import Features from "../components/sections/features";
import Contacts from "../components/sections/contacts";
const Home: React.FC = () => {
  return (
    <div>
      <Header/>

      <main>
        <Hero/>
        <About/>
        <Features/>
        <Contacts/>
      </main>
      <Footer/>
    </div>
  );
};

export default Home;
