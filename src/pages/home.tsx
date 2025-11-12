import React from "react";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import "../index.css"
import Hero from "../components/hero";
import About from "../components/about";
import Features from "../components/features";
const Home: React.FC = () => {
  return (
    <div>
      <Header/>

      <main>
        <Hero/>
        <About/>
        <Features/>
      </main>
      <Footer/>
    </div>
  );
};

export default Home;
