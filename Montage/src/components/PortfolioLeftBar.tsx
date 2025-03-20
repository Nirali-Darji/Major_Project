import React, { useState, useEffect } from "react";
import { FaRegFolder, FaSearch } from "react-icons/fa";
import ApiFetcher from "../utils/ApiFetcher";
import generalStore from "../stores/GeneralStore";
import { observer } from "mobx-react-lite";

function Leftbar({setShowModal}) {
  const { data, loading, error } = ApiFetcher({
    endpoint: `${import.meta.env.VITE_API_BASE_URL}/portfolios`, 
  });

  useEffect(() => {
    if (data?.portFolios?.length > 0) {
      generalStore.setSelectedPortfolio(generalStore.selectedPortfolio || data.portFolios[0].name);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading portfolios.</p>;

  const handleOnchange= (e) => {
    const selectedValue = e.target.value;
    if(selectedValue === "Create portfolio") {
      setShowModal(true);
    }else {
      generalStore.setSelectedPortfolio(selectedValue);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-1/5 p-2 border-r border-[#DCDCDC] min-h-screen">
      <div className="flex justify-between pb-2  mx-2">
        {/* Dropdown for Portfolios */}
        <select
          value={generalStore.selectedPortfolio}
          onChange={handleOnchange}
          className=" rounded-lg p-1 bg-white outline-none w-full"
        >
          {data?.portFolios?.map((portfolio) => (
            <option key={portfolio.id} value={portfolio.name}>
              {portfolio.name}
            </option>
          ))}
          <option value= "Create portfolio" className="text-gray-500">Create Portfolio</option>
        </select>
        {/* <FaRegFolder className="mt-auto mb-auto" /> */}
      </div>
      <div className="flex items-center border rounded-lg p-2 bg-[#fff] border border-[#E0E0E0] mx-2">
        <FaSearch className="mr-2" size={15} />
        <input
          type="text"
          placeholder="Find a portfolio or design"
          className="outline-none text-gray-500 w-full"
        />
      </div>
      <div className="flex flex-col m-3">
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

export default observer(Leftbar);



