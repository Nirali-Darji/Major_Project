import React from "react";
import Leftbar from "./PortfolioLeftBar";
import Navbar from "./PortfolioNavBar";
import Toolbar from "./Toolbar";
import PortfolioContent from "./PortfolioContent";

function Portfolio() {
  return (
    <div>
      <Navbar />
      <div className="flex">
        <Leftbar />
        <div className="w-full flex flex-col gap-4 m-4">
          <Toolbar />
          <PortfolioContent />
        </div>
      </div>
    </div>
  );
}

export default Portfolio;
