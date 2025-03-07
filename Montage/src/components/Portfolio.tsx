import React from 'react'
import Leftbar from "./Leftbar";
import Navbar from "./Navbar";
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
