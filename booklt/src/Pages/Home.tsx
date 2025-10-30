import React from "react";
import Experiences from "../Components/Experiences";
import Navbar from "../Components/Navbar";

const Home: React.FC = () => {
  return (
    <div>
      <Navbar />
      <Experiences />
    </div>
  );
};

export default Home;
