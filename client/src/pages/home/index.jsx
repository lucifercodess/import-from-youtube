import React from "react";
import Right from "../components/right";
import Sidebar from "../components/sidebar";

const Home = () => {
  return (
    <div className="flex ">
      <div className="w-1/4">
        <Sidebar />
      </div>
      <div className="w-3/4">
        <Right />
      </div>
    </div>
  );
};

export default Home;
