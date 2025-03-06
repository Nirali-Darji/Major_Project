import React from 'react';
import { CgProfile } from "react-icons/cg";

function Navbar() {
  return (
    <div className='flex justify-between w-full items-center border-b-2 border-[#DCDCDC] p-2 m-2'>
      <h2 className='text-2xl'>Montage</h2>
      <button className='h-10 w-10 mr-4 flex justify-center items-center'>
        <CgProfile className='' size={30}/>
      </button>
    </div>
  );
}

export default Navbar;

