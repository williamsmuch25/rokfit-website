import React from "react";
import Hero from "../components/Hero";
import WhyJumia from "../components/WhyJumia";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <WhyJumia />
      <ProductCard />
      <Footer />
    </>
  );
};

export default Home;
