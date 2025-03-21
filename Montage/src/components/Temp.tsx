import { Canvas } from '@react-three/fiber';
import CanvasSetup from './CanvasSetup';
import store from '../stores/ConfiguratorStore';
import ViewModeToggle from './ViewModeToggle';
import SelectionBar from './SelectionBar';
import { observer } from 'mobx-react-lite';


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
  
    return (
      <button
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        onClick={takeScreenshot}
      >
        Take Screenshot
      </button>
    );
  };

const Temp = observer(() => {
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
        </div>
  
        {/* Canvas Container */}
        <div className="flex-1">
            <CanvasSetup />
        </div>
      </div>
    );
  });

export default Temp
