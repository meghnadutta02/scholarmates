'use client'
import React from 'react'
import MyDiscussionList from '@/app/(components)/MyDiscussionList'
const page = () => {
    return (
        <>

<div>
      
       

        {/* discussion list */}
        <div className="flex-1 md:pt-5 pt-0  md:px-6 px-4 ">
          {/* search button */}
          <MyDiscussionList />
          

         
        </div>
      </div>
    
           
        </>
    )
}

export default page