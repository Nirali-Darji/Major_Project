import { BsThreeDotsVertical } from "react-icons/bs";

const DesignCard = ({ design, type, index }) => {
  const handleDragStart = (e: React.DragEvent, url: string, id: string) => {
    const payload = JSON.stringify({ url, gltfId: id });
    e.dataTransfer.setData("application/json", payload);
  };
  return (
    <div className="relative w-full mx-2 bg-white rounded-2xl shadow-lg overflow-hidden group hover:border-2 border-black">
      {/* Three dots (visible on hover) */}
      <div className="absolute top-3 right-3 text-gray-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
        <BsThreeDotsVertical size={20} />
      </div>

      {/* Card Image */}
      <img
        src={design?.moduleImage}
        alt="Card Image"
        className="w-[80%] m-auto object-cover p-4"
        // draggable
        // onDragStart={(e) => handleDragStart(e, design.glbFile, design.id)}
        draggable={type === "module"}
        onDragStart={(e) =>
          type === "module" && handleDragStart(e, design.glbFile, design.id)
        }
      />

      {/* Card Content */}
      {type === "module" && (
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {design?.name}
          </h2>
          <div className="text-gray-600 mt-1 flex justify-between text-xs">
            <div>{design?.pricePerSqft}</div>
            <div>{design?.noOfBathrooms} Bathroom</div>
            <div>{design?.noOfBedrooms} Bedroom</div>
            <div>{design?.size} sqft</div>
          </div>
        </div>
      )}

      {type === "design" && (
        <div className="p-4 flex justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            {design?.name}
          </h2>
          <p className="text-sm text-gray-500">{index}</p>
        </div>
      )}
    </div>
  );
};

export default DesignCard;
