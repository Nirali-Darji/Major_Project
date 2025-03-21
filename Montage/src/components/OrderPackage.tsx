// import { useState } from "react";
// import ApiFetcher from "../utils/ApiFetcher";

// const OrderPackage: React.FC = () => {
//   const [selectedPackage, setSelectedPackage] = useState("Premium");

//   //   const packages = [
//   //     { name: "Explore Package", price: 83, value: "Explore" },
//   //     { name: "Premium Package", price: 665, value: "Premium" },
//   //     { name: "Pro Package", price: 1993, value: "Pro" },
//   //   ];
//   const {
//     data: packages,
//     loading,
//     error,
//   } = ApiFetcher({
//     endpoint: `${import.meta.env.VITE_API_BASE_URL}/packages`,
//   });

//   return (
//     <div className="p-6 max-w-md mx-auto bg-white shadow-md">
//       {/* Back Button */}
//       <button className="flex items-center text-gray-600 mb-4">
//         <span className="mr-2">&larr;</span> Edit your design
//       </button>

//       {/* Title */}
//       <h2 className="text-2xl font-bold">Your Montage</h2>
//       <p className="text-gray-500 text-sm mb-4">
//         Estimated delivery: Apr 04, 2025
//       </p>

//       {/* Details */}
//       <div className="flex justify-center space-x-4 text-lg font-bold mb-6">
//         <span>
//           1 <span className="text-gray-500">Bed</span>
//         </span>
//         <span>
//           1 <span className="text-gray-500">Bath</span>
//         </span>
//         <span>
//           1152 <span className="text-gray-500">sqft</span>
//         </span>
//       </div>

//       {/* Package Selection */}
//       {packages?.length > 0 ? (
//         packages?.map((pkg) => (
//           <div
//             key={pkg.value}
//             className={`border rounded-lg p-4 mb-2 flex justify-between items-center cursor-pointer ${
//               selectedPackage === pkg.value ? "border-black" : "border-gray-300"
//             }`}
//             onClick={() => setSelectedPackage(pkg.value)}
//           >
//             <span>{pkg.name}</span>
//             <span className="font-bold">${pkg.price}</span>
//           </div>
//         ))
//       ) : (
//         <p>No packages available</p>
//       )}

//       {/* Button */}
//       <button className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg mt-4">
//         Learn More
//       </button>

//       {/* Order Summary */}
//       <h3 className="mt-6 text-xl font-bold">
//         Order {selectedPackage} Package
//       </h3>
//     </div>
//   );
// };

// export default OrderPackage;
import { useState } from "react";
import ApiFetcher from "../utils/ApiFetcher";

const OrderPackage: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState("Premium");

  const { data: packages, loading, error } = ApiFetcher({
    endpoint: `${import.meta.env.VITE_API_BASE_URL}/packages`,
  });

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error fetching packages!</p>;

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md">
      {/* Back Button */}
      <button className="flex items-center text-gray-600 mb-4">
        <span className="mr-2">&larr;</span> Edit your design
      </button>

      {/* Title */}
      <h2 className="text-2xl font-bold">Your Montage</h2>
      <p className="text-gray-500 text-sm mb-4">
        Estimated delivery: Apr 04, 2025
      </p>

      {/* Details */}
      <div className="flex justify-center space-x-4 text-lg font-bold mb-6">
        <span>1 <span className="text-gray-500">Bed</span></span>
        <span>1 <span className="text-gray-500">Bath</span></span>
        <span>1152 <span className="text-gray-500">sqft</span></span>
      </div>

      {/* Package Selection */}
      {packages?.length > 0 ? (
        packages.map((pkg) => (
          <div
            key={pkg.id || pkg.name}
            className={`border rounded-lg p-4 mb-2 flex justify-between items-center cursor-pointer ${
              selectedPackage === pkg.value ? "border-black" : "border-gray-300"
            }`}
            onClick={() => setSelectedPackage(pkg.value)}
          >
            <span>{pkg.name}</span>
            <span className="font-bold">${pkg.price}</span>
          </div>
        ))
      ) : (
        <p>No packages available</p>
      )}

      {/* Button */}
      <button className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg mt-4">
        Learn More
      </button>

      {/* Order Summary */}
      <h3 className="mt-6 text-xl font-bold">Order {selectedPackage} Package</h3>
    </div>
  );
};

export default OrderPackage;
