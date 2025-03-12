import { LuLayoutGrid } from "react-icons/lu";
import { useState } from "react";
import { TbRectangleVertical } from "react-icons/tb";
import { FaPlus } from "react-icons/fa";
import ApiFetcher from "../utils/ApiFetcher";
import store from "../stores/ConfiguratorStore";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import {
  FaRegBookmark,
  FaCubes,
  FaList,
  FaSearch,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import DesignCard from "./DesignCard";
export default function DesignLeftBar() {
  const [activeTab, setActiveTab] = useState("design");
  const [isContentVisible, setIsContentVisible] = useState(true);

  const renderContent = () => {
    switch (activeTab) {
      case "design":
        return <DesignContent handleClick={() => setActiveTab("modules")} />;
      case "modules":
        return <ModulesContent />;
      case "saved":
        return <SavedContent />;
      default:
        return <div>Select an option</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 z-10">
      {/* Sidebar */}
      <div className="w-25 bg-gray-100 border-r-1 border-[#DCDCDC] shadow-lg flex flex-col gap-2 items-center py-6">
        <button
          className={`p-2 w-20 flex flex-col items-center hover:bg-gray-200 rounded-lg ${
            activeTab === "design" && "border-2 border-blue-500"
          }`}
          onClick={() => setActiveTab("design")}
        >
          <TbRectangleVertical className="text-xl" />
          <span className="ml-2">Design</span>
        </button>
        <button
          className={`p-2 w-20 flex flex-col items-center hover:bg-gray-200 rounded-lg ${
            activeTab === "modules" && "border-2 border-blue-500"
          }`}
          onClick={() => setActiveTab("modules")}
        >
          <FaCubes className="text-xl" />
          <span className="ml-2">Modules</span>
        </button>
        <button
          className={`p-2 w-20 flex flex-col items-center hover:bg-gray-200 rounded-lg ${
            activeTab === "saved" && "border-2 border-blue-500"
          }`}
          onClick={() => setActiveTab("saved")}
        >
          <FaRegBookmark className="text-xl" />
          <span className="ml-2">Saved</span>
        </button>
        <div
          className={`fixed bottom-4 z-10 ${
            isContentVisible ? "left-110" : "left-30"
          }`}
        >
          <button
            onClick={() => setIsContentVisible((prev) => !prev)}
            className="bg-green-500 text-white p-2 rounded-full"
          >
            {isContentVisible ? (
              <FaArrowLeft size={15} />
            ) : (
              <FaArrowRight size={15} />
            )}
          </button>
        </div>
      </div>

      {/* Content Area */}
      {isContentVisible && (
        <div className="flex-1 p-2 w-80">{renderContent()}</div>
      )}
    </div>
  );
}

const DesignContent = observer(({ handleClick }) =>{
  const { data, loading, error } = ApiFetcher({
    endpoint: `${import.meta.env.VITE_API_BASE_URL}/modules`,
  });
  const models = store.models;
  console.log(toJS(models))
  console.log(data)
  const dataArray = Array.isArray(data) ? data : [data];
  console.log(dataArray)
  const filteredDesigns = models
  .map((model) => dataArray?.find((item) => item?.id === model.gltfId))
  .filter(Boolean); 
  console.log(filteredDesigns)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between border-b-1 border-[#DCDCDC]">
        <h3 className="text-lg font-semibold">Design</h3>
        <div className="flex">
          <div className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-200 rounded-lg transition">
            <LuLayoutGrid className="text-lg font-semibold" />
          </div>
          <div className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-200 rounded-lg transition">
            <FaList className="text-lg font-semibold" />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 max-h-[] overflow-y-auto ">
        {/* <DesignCard type={'design'} /> */}
        {filteredDesigns.map((design, index) => (
          <DesignCard
            design={design}
            type="design"
            index={index+1}
          />
        ))}
        <div className="w-full bg-white rounded-2xl shadow-lg group hover:border-2 border-black flex items-center justify-center h-64">
          <button
            className="flex justify-center items-center rounded-full bg-gray-200 p-3 hover:bg-gray-400"
            onClick={() => {
              handleClick();
            }}
          >
            <FaPlus color="white" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
});

function ModulesContent() {
  const { data, loading, error } = ApiFetcher({
    endpoint: `${import.meta.env.VITE_API_BASE_URL}/modules`,
  });

  const [selectedType, setSelectedType] = useState<string | null>('Annex');
  const [searchTerm, setSearchTerm] = useState<string>("");
  const filteredModules = data
    ?.filter((module) =>
      selectedType ? module.moduleType.name === selectedType : true
    )
    .filter((module) =>
      module.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  console.log(loading);
  console.log(error);
  console.log(data);
  if (loading) return <div>Loading modules...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-semibold border-b-1 border-[#DCDCDC]">
        Modules
      </h3>
      <div className="flex items-center border rounded-lg p-2 bg-[#fff] border border-[#E0E0E0]">
        <FaSearch className="mr-2" size={15} />
        <input
          type="text"
          placeholder="Find a portfolio or design"
          className="outline-none text-gray-500 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex gap-4  m-auto border-y-1 border-[#DCDCDC] py-2">
        {["Annex", "Dwelling", "Lifestyle"].map((type) => (
          <button
            key={type}
            className={`px-2 py-1 rounded-lg border border-gray-300 transition ${
              selectedType === type
                ? "bg-gray-200 "
                : "bg-white text-black hover:bg-gray-200"
            }`}
            onClick={() => setSelectedType(type)}
          >
            {type}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-4 max-h-screen overflow-y-auto">
        {filteredModules && filteredModules.length > 0 ? (
          filteredModules.map((module) => (
            <DesignCard design={module} key={module.id} type={'module'}/>
          ))
        ) : (
          <div>No modules found</div>
        )}
      </div>
    </div>
  );
}

function SavedContent() {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-semibold border-b-1 border-[#DCDCDC]">
        Bookmarks
      </h3>
      <div className="flex flex-col gap-2">
        <DesignCard />
      </div>
    </div>
  );
}
