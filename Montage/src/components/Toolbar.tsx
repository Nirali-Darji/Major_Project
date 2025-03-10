import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { LuLayoutGrid } from "react-icons/lu";
import { FaList } from "react-icons/fa6";
import { FaCaretRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function Toolbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="flex justify-between w-full p-2">
      <div>
        <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-sm shadow hover:bg-gray-800 transition" onClick={() => navigate("/design")}>
          <FaPlus />
          <span className="text-base font-medium">New Design</span>
        </button>
      </div>
      <div className="flex gap-2 items-center">
        <div className="flex">
          <div className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-200 rounded-lg transition">
            <LuLayoutGrid className="text-xl" />
            <span className="text-base font-medium">Grid</span>
          </div>

          <div className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-200 rounded-lg transition">
            <FaList className="text-xl" />
            <span className="text-base font-medium">List</span>
          </div>
        </div>

        <div className="relative">
          <button
            className="h-10 w-48 rounded-2xl bg-gray-200 text-gray-700 flex justify-between items-center px-4 shadow hover:bg-gray-300 transition"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span>Date Created</span>
            <FaCaretRight className="text-gray-500" />
          </button>
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
              <ul className="py-2">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b-2 border-[#DCDCDC]">
                  Date Created
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b-2 border-[#DCDCDC]">
                  Last Updated
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b-2 border-[#DCDCDC]">
                  Alphabetical
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Toolbar;
