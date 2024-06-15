'use client'
import React, { useState } from 'react';
import {
  PlusIcon
} from '@radix-ui/react-icons';
// import './styles.css';
import CreatePost from './CreatePost';
const Post = () => {
    const [isOpen,setIsOpen]=useState(false);  
    const handleButtonClick = () => {
        if(isOpen==true){
            setIsOpen(false)
        }
        else{
            setIsOpen(true);
        } // set the state to true when the button is clicked
      };
return (
<>
<div class="flex flex-col">
<div class="flex m-3" style={{ width: 500, height: 50 }}>
    <span class="inline-block flex w-1/4 h-full items-center justify-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
    <button className="IconButton" onClick={handleButtonClick}>
            <PlusIcon />
          </button>

    </span>
    <span class="inline-block flex w-3/4 h-full items-center justify-center px-3 text-sm text-black bg-white border  border-gray-300  dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
        <h1>CREATE POST</h1>
    </span>
  </div>
  {isOpen && <CreatePost/>}
</div>
</>)};

export default Post;