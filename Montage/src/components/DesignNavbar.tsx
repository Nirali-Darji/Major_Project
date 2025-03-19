import React from "react";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import generalStore from "../stores/GeneralStore";
import ApiFetcher from "../utils/ApiFetcher";
import { observer } from "mobx-react-lite";

const designInfo = {
  name: generalStore.currentDesignName,
  configuredStyle: [
    
  ],
};

function DesignNavbar() {
  const navigate = useNavigate();
  const { data, loading, error } = ApiFetcher({
    endpoint: `${import.meta.env.VITE_API_BASE_URL}/portfolios`,
  });
  if (loading) return <>loading....</>;
  if (error) return <div>Error loading data!</div>;
  console.log("Data", data);
  const portfolio = data?.portFolios?.find(
    (p) => p.name === generalStore.selectedPortfolio
  );
  console.log(portfolio);
  const portfolioId = portfolio?.portfolioId;
  console.log(portfolioId);
  const handleSavedesign = () => {
    const endpoint = `${
      import.meta.env.VITE_API_BASE_URL
    }/design?portfolioId=${portfolioId}`;
    const { data, loading, error } = ApiFetcher({
      endpoint,
      method: "POST",
      body,
    });
  };
  return (
    <div className="flex justify-between w-full items-center bg-gray-100 border-b-2 border-[#DCDCDC] p-3 z-10">
      <div className="flex items-center gap-10">
        <h2 className="text-2xl">Montage</h2>
        <button className="text-2xl" onClick={() => navigate("/")}>
          {generalStore.selectedPortfolio}
        </button>
        <input
          type="text"
          placeholder="Design Name"
          required
          value={generalStore.currentDesignName}
          onChange={(e) => generalStore.setCurrentDesignName(e.target.value)}
          className="border border-gray-300 rounded-md p-2 focus:outline-none"
        />
        <button className="bg-black text-white px-8 py-2 rounded-lg hover:bg-gray-600">
          Save
        </button>
      </div>
      <button className="h-10 w-10 mr-4 flex justify-center items-center">
        <CgProfile className="" size={30} />
      </button>
    </div>
  );
}

export default observer(DesignNavbar);
