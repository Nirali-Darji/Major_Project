import React from "react";
import { CgProfile } from "react-icons/cg";

function DesignNavbar() {
  return (
    <div className="flex justify-between w-full items-center bg-gray-100 border-b-2 border-[#DCDCDC] p-3 z-10">
      <div className="flex items-center gap-10">
        <h2 className="text-2xl">Montage</h2>
        <button className="bg-black text-white px-8 py-2 rounded-lg hover:bg-gray-600">Save</button>
      </div>
      <button className="h-10 w-10 mr-4 flex justify-center items-center">
        <CgProfile className="" size={30} />
      </button>
    </div>
  );
}

export default DesignNavbar;
