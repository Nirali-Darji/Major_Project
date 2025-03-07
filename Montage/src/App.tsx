import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Portfolio from "./components/Portfolio";

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
        <Router>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Portfolio />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
