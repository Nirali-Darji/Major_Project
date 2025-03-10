import React from "react";
import { FaRegFolder, FaSearch } from "react-icons/fa";

function Leftbar() {
  return (
    <div className=" flex flex-col gap-4 w-1/5 p-2 border-r-1 border-[#DCDCDC] min-h-screen">
      <div className="flex justify-between pb-2 border-b-2 border-[#DCDCDC] mx-2">
        <h3>My Portfolios</h3>
        <FaRegFolder className="mt-auto mb-auto" />
      </div>
      <div className="flex items-center border rounded-lg p-2 bg-[#fff] border border-[#E0E0E0] mx-2">
        <FaSearch className="mr-2 " size={15} />
        <input
          type="text"
          placeholder="Find a portfolio or design"
          className="outline-none text-gray-500 w-full"
        />
      </div>
      <div className=" flex flex-col m-3">
        <div className="flex justify-between px-4 py-2 mb-2 hover:bg-[#DCDCDC] rounded-lg">
          <div>All Designs</div>
          <div>3</div>
        </div>
        <div className="flex justify-between px-4 py-2 hover:bg-[#DCDCDC] rounded-lg">
          <div>My Designs</div>
          <div>3</div>
        </div>
      </div>
    </div>
  );
}

export default Leftbar;
