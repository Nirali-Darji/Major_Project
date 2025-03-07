// import React from 'react'
// // makw the navbar  right sidebar

// function RightDesignBar() {
//   return (
//     <div>
//       <div>
//         <div>
//             <span></span><span></span>
//         </div>
//         <div><span></span><span></span></div>
//         <div><span></span><span></span></div>
//       </div>

//       <div></div>


//     </div>
//   )
// }
// export default RightDesignBar


import { useState, useEffect } from 'react';

const data ={
      "bed": 0,
      "bath": 0.5,
      "sqft": 256,
      "exteriorFinish": [
        { "name": "Renne Accoya", "textureUrl": "/textures/renne-accoya.jpg", "selected": true },
        { "name": "Cedar", "textureUrl": "/textures/cedar.jpg", "selected": false },
        { "name": "Steel", "textureUrl": "/textures/steel.jpg", "selected": false },
        { "name": "Charcoal", "textureUrl": "/textures/charcoal.jpg", "selected": false }
      ],
      "selectedFinish": "Renne Accoya",
      "exteriorAccent": [
        { "color": "#FFFFFF", "selected": true },
        { "color": "#F0F0F0", "selected": false },
        { "color": "#000000", "selected": false }
      ],
      "selectedAccent": "Chalk"
    }

const TinyHomeSelector = () => {
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     // Simulate API call
//     fetch('/api/tiny-home') 
//       .then((res) => res.json())
//       .then((data) => setData(data));
//   }, []);

//   if (!data) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold">
          {data.bed} Bed {data.bath} Bath {data.sqft} sqft
        </h2>
      </div>
      <div className="flex justify-center">
        <div className="w-32 h-32 bg-gray-100"></div> {/* Placeholder for image */}
      </div>
      <div>
        <h3 className="font-semibold">Exterior Finish</h3>
        <div className="flex space-x-2 mt-2">
          {data.exteriorFinish.map((finish, index) => (
            <div
              key={index}
              className={`w-12 h-12 rounded cursor-pointer border-2 ${
                finish.selected ? 'border-blue-500' : 'border-transparent'
              }`}
            >
              <img
                src={finish.textureUrl}
                alt={finish.name}
                className="w-full h-full rounded object-cover"
              />
            </div>
          ))}
        </div>
        <p className="mt-2">{data.selectedFinish} Included</p>
      </div>
      <div>
        <h3 className="font-semibold">Exterior Accent</h3>
        <div className="flex space-x-2 mt-2">
          {data.exteriorAccent.map((accent, index) => (
            <div
              key={index}
              className={`w-12 h-12 rounded cursor-pointer border-2 ${
                accent.selected ? 'border-blue-500' : 'border-transparent'
              }`}
              style={{ backgroundColor: accent.color }}
            ></div>
          ))}
        </div>
        <p className="mt-2">{data.selectedAccent} Included</p>
      </div>
    </div>
  );
};

export default TinyHomeSelector;
