// import { FaPlus, FaList, FaCaretRight, FaHome, FaCubes, FaBookmark } from 'react-icons/fa';
import { LuLayoutGrid } from "react-icons/lu";
import { useState } from "react";
import { TbRectangleVertical, TbRectangleVerticalFilled } from "react-icons/tb";
import { FaRegBookmark, FaBookmark, FaCubes } from "react-icons/fa";
import { FaList } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

export default function LeftDesignBar() {
  const [activeTab, setActiveTab] = useState("templates");

  const renderContent = () => {
    switch (activeTab) {
      case "design":
        return (
          <div >
            <DesignContent />
          </div>
        );
      case "modules":
        return (
          <div>
            <ModulesContent />
          </div>
        );
      case "saved":
        return (
          <div>
            <SavedContent />
          </div>
        );
      default:
        return <div>Select an option</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-25 bg-white border-r-1 border-[#DCDCDC] shadow-lg flex flex-col gap-2 items-center py-6">
        <button
          className={`p-2 w-20 flex flex-col items-center hover:bg-gray-200 rounded-lg ${
            activeTab === "design" && "bg-gray-300"
          }`}
          onClick={() => setActiveTab("design")}
        >
          <TbRectangleVertical className="text-xl" />
          <span className="ml-2">Design</span>
        </button>
        <button
          className={`p-2 w-20 flex flex-col items-center hover:bg-gray-200 rounded-lg ${
            activeTab === "modules" && "bg-gray-300"
          }`}
          onClick={() => setActiveTab("modules")}
        >
          <FaCubes className="text-xl" />
          <span className="ml-2">Modules</span>
        </button>
        <button
          className={`p-2 w-20 flex flex-col items-center hover:bg-gray-200 rounded-lg ${
            activeTab === "saved" && "bg-gray-300"
          }`}
          onClick={() => setActiveTab("saved")}
        >
          <FaRegBookmark className="text-xl" />
          <span className="ml-2">Saved</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-2 w-70">{renderContent()}</div>
    </div>
  );
}

function DesignContent() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between border-b-1 border-[#DCDCDC]">
        <h3 className="text-lg font-semibold ">Design</h3>

        <div className="flex">
          <div className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-200 rounded-lg transition">
            <LuLayoutGrid className="text-lg font-semibold" />
          </div>

          <div className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-200 rounded-lg transition">
            <FaList className="text-lg font-semibold" />
          </div>
        </div>
      </div>

      <div>Designs</div>
    </div>
  );
}

function ModulesContent() {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-semibold border-b-1 border-[#DCDCDC]">
        Modules
      </h3>
      <div className="flex items-center border rounded-lg p-2 bg-[#fff] border border-[#E0E0E0]">
        <FaSearch className="mr-2 " size={15} />
        <input
          type="text"
          placeholder="Find a portfolio or design"
          className="outline-none text-gray-500 w-full"
        />
      </div>

      <div className="flex gap-4 border-y-1 border-[#DCDCDC] py-2">
        <button className="bg-white text-black px-2 py-1 rounded-lg border border-gray-300 hover:bg-gray-200 transition">
          Annex
        </button>
        <button className="bg-white text-black px-2 py-1 rounded-lg border border-gray-300 hover:bg-gray-200 transition">
          Dwelling
        </button>
        <button className="bg-white text-black px-2 py-1 rounded-lg border border-gray-300 hover:bg-gray-200 transition">
          Lifestyle
        </button>
      </div>

      <div className="flex flex-col gap-2">Modules</div>
    </div>
  );
}

function SavedContent() {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-semibold border-b-1 border-[#DCDCDC]">
        Bookmarks
      </h3>
    </div>
  );
}
