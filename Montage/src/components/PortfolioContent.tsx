import React, { useEffect, useState } from "react";
import ApiFetcher from "../utils/ApiFetcher";
import store from "../stores/ConfiguratorStore";
import { BsThreeDots } from "react-icons/bs";
import generalStore from "../stores/GeneralStore";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

function PortfolioContent() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data, loading, error } = ApiFetcher({
    endpoint: `${import.meta.env.VITE_API_BASE_URL}/portfolios`,
  });
  const { data: moduleData, loading: moduleLoading, error: moduleError } = ApiFetcher({
    endpoint: `${import.meta.env.VITE_API_BASE_URL}/modules`,
  });


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

  return (
    <div>
      {/* <div className="flex gap-6 mb-4">
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
      </div> */}

      {updatedPortfolio ? (
        <div className="w-full">
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
  // const [dropdownOpen, setDropdownOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(design.monogramImage);
  const navigate= useNavigate();
const portfolioId = localStorage.getItem('portfolioId');
  const handleDelete = async () => {
    const API_URL = `${import.meta.env.VITE_API_BASE_URL}/portfolio/${portfolioId}/design?designId=${design.id}`;
  
    try {
      const response = await fetch(API_URL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_AUTH_TOKEN}`,
        },
        body: JSON.stringify({
          designIds: [design.id], // Sending the design ID in the body
        }),
      });
  
      if (response.ok) {
        alert("Design deleted successfully!");
      
      } else {
        throw new Error("Failed to delete design");
      }
    } catch (error) {
      console.error("Error deleting design:", error);
      alert("Failed to delete design. Please try again.");
    }
  };
  

  const handleLoadDesign = () => {
    store.loadModels(design.moduleArr);
    store.setViewMode("2D");
    generalStore.currentDesignName = design.name;
    generalStore.setDesignId(design.id);
    navigate("/design");
  }

  return (
    <div className="w-80 bg-white shadow-lg rounded-2xl p-4 flex flex-col gap-3 border border-gray-200 relative">
      <div
        className="w-60 h-60 overflow-hidden rounded-xl"
        onMouseEnter={() => setImageSrc(design.designImage)}
        onMouseLeave={() => setImageSrc(design.monogramImage)}
        onClick={handleLoadDesign}
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
            onClick={handleDelete}
          >
            <button  className="bg-black text-white px-8 py-2 rounded-lg hover:bg-gray-600">Delete</button>
          </button>
          {/* {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white shadow-md rounded-md py-2 border border-gray-200">
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Rename
              </button>
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Leave
              </button>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}

export default observer(PortfolioContent);


// import  { useEffect } from "react";
// import ApiFetcher from "../utils/ApiFetcher";
// // import generalStore from "../stores/GeneralStore";
// import { observer } from "mobx-react-lite";

// function PortfolioContent() {
//   const [portfolios, setPortfolios] = useState([]);
//   const { data, loading, error } = ApiFetcher({
//     endpoint: `${import.meta.env.VITE_API_BASE_URL}/portfolios`,
//   });

//   useEffect(() => {
//     if (data?.portFolios) {
//       setPortfolios(data.portFolios);
//     }
//   }, [data]);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error loading data</p>;

//   const portfolio = portfolios.find(
//     (portfolio) => portfolio.name === generalStore.selectedPortfolio
//   );

//   const handleDesignDelete = (deletedDesignId) => {
//     setPortfolios((prevPortfolios) =>
//       prevPortfolios.map((p) =>
//         p.name === generalStore.selectedPortfolio
//           ? {
//               ...p,
//               designs: p.designs.filter((d) => d.id !== deletedDesignId),
//             }
//           : p
//       )
//     );
//   };

//   return (
//     <div>
//       {portfolio ? (
//         <div className="w-full">
//           <div className="flex gap-4 flex-wrap">
//             {portfolio.designs?.map((design) => (
//               <PortfolioCard
//                 key={design.id}
//                 design={design}
//                 onDelete={handleDesignDelete}
//               />
//             ))}
//           </div>
//         </div>
//       ) : (
//         <p>No designs found for the selected portfolio.</p>
//       )}
//     </div>
//   );
// }
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import store from "../stores/ConfiguratorStore";
// import generalStore from "../stores/GeneralStore";

// function PortfolioCard({ design, onDelete }) {
//   const [imageSrc, setImageSrc] = useState(design.monogramImage);
//   const navigate = useNavigate();
//   const portfolioId = localStorage.getItem("portfolioId");

//   const handleDelete = async () => {
//     const API_URL = `${import.meta.env.VITE_API_BASE_URL}/portfolio/${portfolioId}/design?designId=${design.id}`;

//     try {
//       const response = await fetch(API_URL, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${import.meta.env.VITE_AUTH_TOKEN}`,
//         },
//         body: JSON.stringify({ designIds: [design.id] }),
//       });

//       if (response.ok) {
//         alert("Design deleted successfully!");
//         onDelete(design.id); // Instantly remove from UI
//       } else {
//         throw new Error("Failed to delete design");
//       }
//     } catch (error) {
//       console.error("Error deleting design:", error);
//       alert("Failed to delete design. Please try again.");
//     }
//   };

//   const handleLoadDesign = () => {
//     store.loadModels(design.moduleArr);
//     store.setViewMode("2D");
//     generalStore.currentDesignName = design.name;
//     generalStore.setDesignId(design.id);
//     navigate("/design");
//   };

//   return (
//     <div className="w-80 bg-white shadow-lg rounded-2xl p-4 flex flex-col gap-3 border border-gray-200 relative">
//       <div
//         className="w-60 h-60 overflow-hidden rounded-xl"
//         onMouseEnter={() => setImageSrc(design.designImage)}
//         onMouseLeave={() => setImageSrc(design.monogramImage)}
//         onClick={handleLoadDesign}
//       >
//         <img src={imageSrc} alt={design.name} className="w-full h-full object-cover" />
//       </div>
//       <div className="flex justify-between items-center">
//         <div className="flex flex-col">
//           <h2 className="text-lg font-semibold text-gray-800">{design.name}</h2>
//           <p className="text-sm text-gray-500">Models: {design.moduleArr.length}</p>
//         </div>
//         <button
//           className="bg-black text-white px-8 py-2 rounded-lg hover:bg-gray-600"
//           onClick={handleDelete}
//         >
//           Delete
//         </button>
//       </div>
//     </div>
//   );
// }




// export default observer(PortfolioContent);
