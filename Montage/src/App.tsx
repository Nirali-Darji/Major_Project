// App.tsx (updated with multi-selection and synchronized view changes)
import { Canvas} from '@react-three/fiber'
import { observer } from 'mobx-react-lite'
import store from './stores/ConfiguratorStore'
import CanvasSetup from './components/CanvasSetup';



const SelectionBar = observer(() => {
  // Example list of available models (you can fetch this from an API or local storage)
  const availableModels = [
    { name: 'Model 1', url: '/assets/Annex_tag.glb' },
    { name: 'Model 2', url: '/assets/Lifestyle_tag.glb' },
    { name: 'Model 3', url: '/assets/Dwelling_tag.glb' },
  ];

  // Handle drag start for a model
  const handleDragStart = (e: React.DragEvent, url: string) => {
    e.dataTransfer.setData('text/plain', url);
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg mb-4">
      <h3 className="text-lg font-semibold mb-2">Available Models</h3>
      <ul>
        {availableModels.map((model, index) => (
          <li
            key={index}
            draggable
            onDragStart={(e) => handleDragStart(e, model.url)}
            className="p-2 mb-2 bg-white border border-gray-200 rounded-md cursor-grab hover:bg-gray-100"
          >
            {model.name}
          </li>
        ))}
      </ul>
    </div>
  );
});


// View Mode Toggle Component
const ViewModeToggle = observer(() => {
  return (
    <div className="mb-6">
      <button
        className={`px-4 py-2 mr-2 rounded-md ${
          store.viewMode === '3D' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
        }`}
        onClick={() => store.setViewMode('3D')}
      >
        3D View
      </button>
      <button
        className={`px-4 py-2 rounded-md ${
          store.viewMode === '2D' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
        }`}
        onClick={() => store.setViewMode('2D')}
      >
        2D View
      </button>
    </div>
  );
});



// Screenshot functionality
const ScreenshotButton = () => {
  const takeScreenshot = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `configurator-${store.viewMode}-view.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Portfolio from "./components/Portfolio";
// import LeftDesignBar from "./components/LeftDesignBar";
// import RightDesignBar from "./components/DesignRightBar";
import DesignModel from "./components/DesignModel";

function App() {
  return (
    <button
      className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      onClick={takeScreenshot}
    >
      Take Screenshot
    </button>
  );
};

// Main App component
const App = observer(() => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 p-6 bg-white border-r border-gray-200 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">3D Configurator</h2>
        <ViewModeToggle />
        <SelectionBar />
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Models ({store.models.length})</h3>
            {store.selectedModelIds.size > 0 && (
              <button
                className="px-3 py-1 text-sm text-red-600 bg-red-50 rounded-md hover:bg-red-100"
                onClick={() => store.removeSelectedModels()}
              >
                Remove Selected ({store.selectedModelIds.size})
              </button>
            )}
          </div>
          <ul>
            {store.models.map((model) => (
              <li
                key={model.id}
                className={`p-2 mb-2 flex justify-between items-center rounded-md cursor-pointer ${
                  store.isSelected(model.id) ? 'bg-blue-50' : 'bg-gray-50'
                }`}
                onClick={() => store.selectModel(model.id)}
              >
                <span>Model {model.id.substring(0, 4)}</span>
                <button
                  className="px-2 py-1 text-sm text-red-600 bg-red-50 rounded-md hover:bg-red-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    store.removeModel(model.id);
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
        <ScreenshotButton />
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
        {/* <DesignModel/> */}
        <Router>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Portfolio />} />
            <Route path="/designmodel" element={<DesignModel />} />
          </Routes>
        </Router>
      </div>

      {/* Canvas Container */}
      <div className="flex-1">
        <Canvas>
          <CanvasSetup />
        </Canvas>
      </div>
    </div>
  );
});

export default App;
