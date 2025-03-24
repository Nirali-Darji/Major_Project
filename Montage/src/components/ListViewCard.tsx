import { GoHomeFill } from "react-icons/go";
import { BsThreeDotsVertical } from "react-icons/bs";
import store from "../stores/ConfiguratorStore";
import { observer } from "mobx-react-lite";

const ListViewCard = ({ design, modelId, index }) => {
  // const baseModelId = store.models.find((m) => m.id === store.baseModel);
  // const isBaseModel = baseModelId?.gltfId === design?.id; // Compare gltfId with design.id

  return (
    <div
      className={`flex items-center justify-between w-full mx-2 p-4 rounded-lg bg-white shadow-sm hover:shadow-md border border-transparent hover:border-black transition relative group ${
        store.isSelected(modelId)
          ? "border-yellow-500 border-2"
          : "border-black"
      }`}
      onClick={() => store.selectModel(modelId)}
    >
      {/* Left: Index & Name */}
      <div className="flex items-center gap-4">
        <div className="bg-[#0A192F] text-white font-semibold px-3 py-2 rounded-md">
          {index}
        </div>
        <span className="text-lg font-medium">{design.name}</span>
      </div>

      {/* Right: Hover Actions */}
      <div className="hidden group-hover:flex items-center gap-4">
        {modelId === store.baseModel && (
          <div className="absolute right-9 bg-transparent p-1">
            <GoHomeFill size={20} />
          </div>
        )}
        <button className="text-gray-600 hover:text-black">
          <BsThreeDotsVertical />
        </button>
      </div>
    </div>
  );
};

export default observer(ListViewCard);
