import { observer } from "mobx-react-lite";
import store from "../stores/ConfiguratorStore";

const ViewModeToggle= observer(() => {

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
export default ViewModeToggle
