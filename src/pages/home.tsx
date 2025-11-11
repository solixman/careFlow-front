import React from "react";
import Header from "../components/layout/comon/header";
import Footer from "../components/layout/comon/footer";
import "../index.css"
import Hero from "../components/layout/comon/hero";
const Home: React.FC = () => {
  return (
    <div>
      <Header />
      <main>
        <Hero />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
