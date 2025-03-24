import React from 'react';
import { CgProfile } from "react-icons/cg";

function Navbar() {
  return (
    <div className='flex justify-between w-full items-center border-b-2 border-[#DCDCDC] p-2 mx-2'>
      {/* <h2 className='text-2xl'>Montage</h2> */}
      <img src="http://montage-prod.s3-website.ap-south-1.amazonaws.com/assets/logo/logo-icon.svg" alt="" />
      <button className='h-10 w-10 mr-4 flex justify-center items-center'>
        <CgProfile className='' size={30}/>
      </button>
    </div>
  );
}

export default Navbar;

