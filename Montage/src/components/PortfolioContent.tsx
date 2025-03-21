import React, { useState } from "react";
import ApiFetcher from "../utils/ApiFetcher";
import store from "../stores/ConfiguratorStore";
import { BsThreeDots } from "react-icons/bs";
import generalStore from "../stores/GeneralStore";
import { observer } from "mobx-react-lite";

function PortfolioContent() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data, loading, error } = ApiFetcher({
    endpoint: `${import.meta.env.VITE_API_BASE_URL}/portfolios`,
  });
  const { data: moduleData, loading: moduleLoading, error: moduleError } = ApiFetcher({
    endpoint: `${import.meta.env.VITE_API_BASE_URL}/modules`,
  });

  console.log("Portfolios :", data);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;
  const portfolio = data?.portFolios?.find(
    (portfolio) => portfolio.name === generalStore.selectedPortfolio
  );
  const updatedPortfolio = portfolio
    ? {
        ...portfolio,
        designs: portfolio.designs.map((design) => ({
          ...design,
          moduleArr: design.moduleArr.map((module) => ({
            ...module,
            glbFile: moduleData?.find((m) => m.id === module.moduleId)?.glbFile || null,
          })),
        })),
      }
    : null;
    console.log(updatedPortfolio);

  return (
    <div>
      <div className="flex gap-6 mb-4">
        {/* <h2>My designs</h2>
        <button
          className="p-2 rounded-full hover:bg-gray-100"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <BsThreeDots className="text-gray-600" />
        </button> */}

        {dropdownOpen && (
          <div className="absolute top-0 left-full mt-2 bg-white shadow-md rounded-md py-2 border border-gray-200">
            <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Rename
            </button>
            <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Leave
            </button>
          </div>
        )}
      </div>

      {updatedPortfolio ? (
        <div className="w-full">
          {/* <h2 className="text-xl font-semibold mb-4">{updatedPortfolio.name}</h2> */}
          <div className="flex gap-4 flex-wrap">
            {updatedPortfolio.designs?.map((design) => (
              <PortfolioCard key={design.id} design={design} />
            ))}
          </div>
        </div>
      ) : (
        <p>No designs found for the selected portfolio.</p>
      )}
    </div>
  );
}

function PortfolioCard({ design }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(design.monogramImage);
  console.log('ModuleArr',design.moduleArr)
  return (
    <div className="w-80 bg-white shadow-lg rounded-2xl p-4 flex flex-col gap-3 border border-gray-200 relative">
      <div
        className="w-60 h-60 overflow-hidden rounded-xl"
        onMouseEnter={() => setImageSrc(design.designImage)}
        onMouseLeave={() => setImageSrc(design.monogramImage)}
        // onClick={() => store.setDesign(design.moduleArr)}
      >
        <img
          src={imageSrc}
          alt={design.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex justify-between items-center relative">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-gray-800">{design.name}</h2>
          <p className="text-sm text-gray-500">Models: {design.moduleArr.length}</p>
        </div>
        <div className="relative">
          <button
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <BsThreeDots className="text-gray-600" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white shadow-md rounded-md py-2 border border-gray-200">
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Rename
              </button>
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Leave
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default observer(PortfolioContent);
