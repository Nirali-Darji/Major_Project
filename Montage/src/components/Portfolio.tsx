import React from 'react'
import Leftbar from "./PortfolioLeftBar";
import Navbar from "./PortfolioNavBar";
import Toolbar from "./Toolbar";

function Portfolio() {
  return (
    <div>
     <Navbar />
        <div className="flex">
          <Leftbar />
          <div className="w-full"><Toolbar /></div>
        </div>
    </div>
  )
}

export default Portfolio
