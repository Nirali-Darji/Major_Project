// import React, { useState } from "react";
// import Leftbar from "./PortfolioLeftBar";
// import Navbar from "./PortfolioNavBar";
// import Toolbar from "./Toolbar";
// import PortfolioContent from "./PortfolioContent";

// function Portfolio() {
//   const [showModal, setShowModal] = useState(false);
//   return (
//     <div className="overflow-hidden">


//       <Navbar />
//       <div className="flex">
//         <Leftbar setShowModal={setShowModal}
//         />
//         <div className="w-full flex flex-col gap-4 m-4">
//           <Toolbar />
//           <PortfolioContent  />
//         </div>
//       </div>
//       {/* Modal should be at the top level to overlay everything */}
//       {showModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//             <h2 className="text-lg font-semibold">Create a new Portfolio</h2>
//             <input
//               type="text"
//               placeholder="Portfolio name"
//               className="w-full p-2 border rounded-lg mt-2"
//             />
//             <div className="flex justify-end mt-4">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="px-4 py-2 bg-gray-200 rounded-lg mr-2"
//               >
//                 Cancel
//               </button>
//               <button
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Portfolio;


import React, { useState } from "react";
import Leftbar from "./PortfolioLeftBar";
import Navbar from "./PortfolioNavBar";
import Toolbar from "./Toolbar";
import PortfolioContent from "./PortfolioContent";

function Portfolio() {
  const [showModal, setShowModal] = useState(false);
  const [portfolioName, setPortfolioName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!portfolioName.trim()) {
      alert("Portfolio name cannot be empty!");
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/portfolio`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: portfolioName }),
      });

      if (!response.ok) {
        throw new Error("Failed to create portfolio");
      }

      const newPortfolio = await response.json();
      console.log("Portfolio created:", newPortfolio);

      // Close the modal
      setShowModal(false);
      setPortfolioName("");

      // You might need to update the portfolio list here
      // Example: setPortfolios([...portfolios, newPortfolio]);

    } catch (error) {
      console.error("Error creating portfolio:", error);
      alert("Error creating portfolio. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-hidden">
      <Navbar />
      <div className="flex">
        <Leftbar setShowModal={setShowModal} />
        <div className="w-full flex flex-col gap-4 m-4">
          <Toolbar />
          <PortfolioContent />
        </div>
      </div>

      {/* Modal should be at the top level to overlay everything */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-md z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold">Create a new Portfolio</h2>
            <input
              type="text"
              placeholder="Portfolio name"
              className="w-full p-2 border rounded-lg mt-2"
              value={portfolioName}
              onChange={(e) => setPortfolioName(e.target.value)}
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Portfolio;
