import React from 'react'
import DesignNavbar from './DesignNavBar'
import LeftDesignBar from './LeftDesignBar'
import RightDesignBar from './DesignRightBar'

function DesignModel() {
  return (
    <div>
      <DesignNavbar/>
      <div className='flex justify-between'>
        <LeftDesignBar/>
        <div className='flex-grow'>
          <div className='p-4'>Design Model Content</div>
        </div>
        <RightDesignBar/>
      </div>
    </div>
  )
}

export default DesignModel
