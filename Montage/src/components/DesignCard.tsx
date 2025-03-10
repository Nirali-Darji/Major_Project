
import { BsThreeDotsVertical } from "react-icons/bs";

const DesignCard = () => {
  return (
    <div className="relative max-full bg-white rounded-2xl shadow-lg overflow-hidden group hover:border-2 border-black">
      {/* Three dots (visible on hover) */}
      <div className="absolute top-3 right-3 text-gray-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
        <BsThreeDotsVertical size={20} />
      </div>

      {/* Card Image */}
      <img
        src="https://via.placeholder.com/300"
        alt="Card Image"
        className="w-full h-48 object-cover"
      />

      {/* Card Content */}
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800">Card Heading</h2>
        <p className="text-gray-600 mt-1">This is a short description of the card.</p>
      </div>
    </div>
  );
};

export default DesignCard;
