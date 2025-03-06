import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { LuLayoutGrid } from "react-icons/lu";
import { FaList } from "react-icons/fa6";
import { FaCaretRight } from "react-icons/fa6";

function Toolbar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex justify-between">
      <div>
        <div>
          <button className="flex ">
            <span><FaPlus /></span> <div>New Design</div>
          </button>
        </div>
      </div>
      <div>
        <div>
          <div>
            <LuLayoutGrid /> Grid
          </div>
          <div>
            <FaList /> List
          </div>
        </div>

        <div className="relative">
          <button
            className="h-10 w-10 rounded-full bg-[#DCDCDC] mr-4 flex justify-center items-center"
            onClick={() => setIsOpen(!isOpen)}
          >
            <FaCaretRight /> Date Created
          </button>
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
              <ul className="py-2">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Date Created
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Last Updated
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
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
