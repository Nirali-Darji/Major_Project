import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import generalStore from "../stores/GeneralStore";
import { observer } from "mobx-react-lite";
import ApiFetcher from "../utils/ApiFetcher";
import saveDesign from "../utils/saveDesign";



function DesignNavbar() {
  const navigate = useNavigate();
  const portfolioId = localStorage.getItem("portfolioId");
  const portfolioName = localStorage.getItem("portfolioName");
  console.log(portfolioId)
  const handleSaveDesign = async () => {
   saveDesign(portfolioId);
  };

  return (
    <div className="flex justify-between w-full items-center bg-gray-100 border-b-2 border-[#DCDCDC] p-3 z-10">
      <div className="flex items-center gap-10">
        <h2 className="text-2xl">Montage</h2>
        <button className="text-2xl" onClick={() => navigate("/")}>
          {portfolioName}
        </button>
        <input
          type="text"
          placeholder="Design Name"
          required
          value={generalStore.currentDesignName}
          onChange={(e) => generalStore.setCurrentDesignName(e.target.value)}
          className="border border-gray-300 rounded-md p-2 focus:outline-none"
        />
        <button
          className="bg-black text-white px-8 py-2 rounded-lg hover:bg-gray-600"
          onClick={handleSaveDesign}
        >
          Save
        </button>
      </div>
      <button className="h-10 w-10 mr-4 flex justify-center items-center">
        <CgProfile size={30} />
      </button>
    </div>
  );
}

export default observer(DesignNavbar);
