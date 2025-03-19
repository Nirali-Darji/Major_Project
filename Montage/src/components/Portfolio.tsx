import React, { useState } from "react";
import Leftbar from "./PortfolioLeftBar";
import Navbar from "./PortfolioNavBar";
import Toolbar from "./Toolbar";
import PortfolioContent from "./PortfolioContent";

function Portfolio() {
  // const [selectedPortfolio, setSelectedPortfolio] = useState("");

  return (
    <div className="overflow-hidden">
      {/* <Navbar />
      <div className="flex">
      <Leftbar 
          selectedPortfolio={selectedPortfolio} 
          setSelectedPortfolio={setSelectedPortfolio} 
        />
        <div className="w-full flex flex-col gap-4 m-4">
          <Toolbar selectedPortfolio={selectedPortfolio}/>
          <PortfolioContent selectedPortfolio={selectedPortfolio} />
        </div>
      </div> */}

      <Navbar />
      <div className="flex">
        <Leftbar
         
        />
        <div className="w-full flex flex-col gap-4 m-4">
          <Toolbar />
          <PortfolioContent  />
        </div>
      </div>
    </div>
  );
}

export default Portfolio;
