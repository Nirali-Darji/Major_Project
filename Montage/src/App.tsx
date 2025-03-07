import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Portfolio from "./components/Portfolio";
import LeftDesignBar from "./components/LeftDesignBar";
import RightDesignBar from "./components/RightDesignBar";
import DesignModel from "./components/DesignModel";

function App() {
  return (
    <>
      <div>
        {/* <Navbar />
        <div className="flex">
          <Leftbar />
          <div className="w-full"><Toolbar /></div>
        </div>
        <LeftDesignBar /> */}
        {/* <Register />
        <Login /> */}
        {/* <LeftDesignBar/> */}
        {/* <RightDesignBar /> */}
        <DesignModel/>
        {/* <Router>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Portfolio />} />
          </Routes>
        </Router> */}
      </div>
    </>
  );
}

export default App;
