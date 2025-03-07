// import { FaPlus, FaList, FaCaretRight, FaHome, FaCubes, FaBookmark } from 'react-icons/fa';
import { LuLayoutGrid } from 'react-icons/lu';
import { useState } from 'react';
import { TbRectangleVertical ,TbRectangleVerticalFilled} from "react-icons/tb";
import { FaRegBookmark,FaBookmark,FaCubes  } from "react-icons/fa";

export default function LeftDesignBar() {
  const [activeTab, setActiveTab] = useState('templates');

  const renderContent = () => {
    switch (activeTab) {
      case 'design':
        return <div className="p-4">Design Content</div>;
      case 'templates':
        return <div className="p-4">Templates Content</div>;
      case 'modules':
        return <div className="p-4">Modules Content</div>;
      case 'saved':
        return <div className="p-4">Saved Content</div>;
      default:
        return <div className="p-4">Select an option</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-30 bg-white border-r shadow-lg flex flex-col gap-2 items-center py-6">
        <button 
          className={`p-4 w-20 flex flex-col items-center hover:bg-gray-200 rounded-lg ${activeTab === 'design' && 'bg-gray-300'}`}
          onClick={() => setActiveTab('design')}
        >
          <TbRectangleVertical className="text-2xl"/>
          <span className="ml-2">Design</span>
        </button>
        <button 
          className={`p-4 w-20 flex flex-col items-center hover:bg-gray-200 rounded-lg ${activeTab === 'modules' && 'bg-gray-300'}`}
          onClick={() => setActiveTab('modules')}
        >
          <FaCubes className="text-2xl" />
          <span className="ml-2">Modules</span>
        </button>
        <button 
          className={`p-4 w-20 flex flex-col items-center hover:bg-gray-200 rounded-lg ${activeTab === 'saved' && 'bg-gray-300'}`}
          onClick={() => setActiveTab('saved')}
        >
          <FaRegBookmark className="text-2xl"/>
          <span className="ml-2">Saved</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6">
        {renderContent()}
      </div>
    </div>
  );
}

