
import { observer } from 'mobx-react-lite'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Portfolio from "./components/Portfolio";
import DesignModel from "./components/DesignModel";
import DesignCard from './components/DesignCard';
import SelectedModelDetails from './components/SelectedModelDetails';


const App = observer(() => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/" element={<Portfolio />} /> */}
        <Route path="/design" element={<DesignModel />} />
        <Route path="/details" element={<SelectedModelDetails  />} />
        </Routes>
    </Router>
  );
});

export default App;
