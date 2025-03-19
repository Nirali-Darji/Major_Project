// import React, { useState } from "react";
// import ApiFetcher from "../utils/ApiFetcher";
// import store from "../stores/ConfiguratorStore";
// import { BsThreeDots } from "react-icons/bs";


// function PortfolioContent() {
//     const [dropdownOpen, setDropdownOpen] = useState(false);

//   return (
//     <div>
//       <div className="flex gap-6 mb-4">
//         <h2>My designs</h2>
//         <button className="p-2 rounded-full hover:bg-gray-100"
//               onClick={() => setDropdownOpen(!dropdownOpen)}>
//           <BsThreeDots className="text-gray-600" />
//         </button>
//         {dropdownOpen && (
//               <div className="relative top-0  mt-2 bg-white shadow-md rounded-md py-2 border border-gray-200">
//                 <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Rename</button>
//                 <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Leave</button>
//               </div>
//             )}
//       </div>

//       <div className="flex gap-4">
//         <PortfolioCard />
//       </div>
//     </div>
//   );
// }

// function PortfolioCard() {
//     const [dropdownOpen, setDropdownOpen] = useState(false);
//     const { data, loading, error } = ApiFetcher({
//       endpoint: `${import.meta.env.VITE_API_BASE_URL}/portfolios`,
//     });
//     console.log(data);
  
//     if (loading) return <p>Loading...</p>;
//     if (error) return <p>Error loading data</p>;
  
 
  
//     return (
//       <div className="w-80 bg-white shadow-lg rounded-2xl p-4 flex flex-col gap-3 border border-gray-200 relative">
//         <div className="w-60 h-60 overflow-hidden rounded-xl">
//           <img
//             src={data?.portFolios[0]?.designs[0].monogramImage}
//             alt="Portfolio Design"
//             className="w-full h-full object-cover"
//           />
//         </div>
//         <div className="flex justify-between items-center relative">
//           <div className="flex flex-col">
//             <h2 className="text-lg font-semibold text-gray-800">
//               {data?.portFolios[0]?.designs[0].name}
//             </h2>
//             <p className="text-sm text-gray-500">Models: {store.models.length}</p>
//           </div>
//           <div className="relative">
//             <button
//               className="p-2 rounded-full hover:bg-gray-100"
//               onClick={() => setDropdownOpen(!dropdownOpen)}
//             >
//               <BsThreeDots className="text-gray-600" />
//             </button>
//             {dropdownOpen && (
//               <div className="absolute top-0 left-full mt-2 w-32 bg-white shadow-md rounded-md py-2 border border-gray-200">
//                 <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Rename</button>
//                 <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Leave</button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   }
  

// export default PortfolioContent;


import React, { useState } from "react";
import ApiFetcher from "../utils/ApiFetcher";
import store from "../stores/ConfiguratorStore";
import { BsThreeDots } from "react-icons/bs";

function PortfolioContent() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data, loading, error } = ApiFetcher({
    endpoint: `${import.meta.env.VITE_API_BASE_URL}/portfolios`,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  return (
    <div>
      <div className="flex gap-6 mb-4">
        <h2>My designs</h2>
        <button
          className="p-2 rounded-full hover:bg-gray-100"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <BsThreeDots className="text-gray-600" />
        </button>
       
        {dropdownOpen && (
          <div className="absolute top-0 left-full mt-2 bg-white shadow-md rounded-md py-2 border border-gray-200 z-10">
            <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Rename
            </button>
            <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Leave
            </button>
          </div>
        )}
        
      </div>

      <div className="flex gap-4 flex-wrap">
        {data?.portFolios?.map((portfolio) =>
          portfolio.designs?.map((design) => (
            <PortfolioCard key={design.id} design={design} />
          ))
        )}
      </div>
    </div>
  );
}

function PortfolioCard({ design }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(design.monogramImage);

  return (
    <div className="w-80 bg-white shadow-lg rounded-2xl p-4 flex flex-col gap-3 border border-gray-200 relative">
      <div className="w-60 h-60 overflow-hidden rounded-xl" 
      onMouseEnter={() => setImageSrc(design.designImage)} 
      onMouseLeave={() => setImageSrc(design.monogramImage)}> 
        <img
          src={imageSrc}
          alt={design.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex justify-between items-center relative">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-gray-800">{design.name}</h2>
          <p className="text-sm text-gray-500">Models: {store.models.length}</p>
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

export default PortfolioContent;
