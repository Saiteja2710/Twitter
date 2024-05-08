import React from 'react'
import Side from './sidebar'
export default function welcome() {
  return (
    <div>
      <div className='row'>
        <div className='col-2'>
            <Side/>
        </div>
        <div className='col-10 welcome-text'>
            Welcome To Twitter
        </div>
    </div>
    </div>
  )
}
