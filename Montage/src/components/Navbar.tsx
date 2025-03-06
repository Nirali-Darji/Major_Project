import React from 'react'
import { CgProfile } from "react-icons/cg";

function Navbar() {
  return (
    <div className='flex justify-between w-full'>
      <h2>Montage</h2>
      <div className='h-10 w-10 rounded-full bg-[#DCDCDC]'>
        <button className='h-full w-full flex justify-center items-center'><CgProfile /></button>
      </div>
      <hr />
    </div>
  )
}

export default Navbar;
