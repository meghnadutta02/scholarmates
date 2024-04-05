import React, { useRef, useState,useEffect } from 'react';
import { useSession } from '@/app/(components)/SessionProvider'
import {  toast } from 'react-toastify';
const CreatePost = () => {
  const {session,request}=useSession();

  const inputFileRef = useRef(null);
  const [images, setImages] = useState([]);
  const[description,setDescription]=useState('');
  const [userId, setUserId] = useState();
const [img,setImg]=useState([]);

  const handleImageUpload = (e) => {
    console.log(e.target.file);
    const files = Array.from(e.target.files);
    console.log("files",files);
    setImg(files);
    const promises = [];
  
    files.forEach((file) => {
      const reader = new FileReader();
      const promise = new Promise((resolve) => {
        reader.onload = () => {
          resolve(reader.result);
        };
      });
      reader.readAsDataURL(file);
      promises.push(promise);
    });
  
    Promise.all(promises).then((results) => {
      setImages([...images, ...results]);
    });
  };

  const handleIconClick = () => {
    inputFileRef.current.click();
  };

  useEffect(() => {
    if(session){
     console.log("this is lll:",session)
     // console.log("request is:",request);
      setUserId(session.db_id);
    }
 
   }, [userId]);
//======== API FETCH======
const formData = new FormData();
formData.append('description', description);

      img.forEach((image, index) => {
        formData.append(`image${index}`, image);
      });


  const uploadpost = async () => {
    console.log("img",img);
    console.log(Object.fromEntries(formData))
    try {
      

      const data = await fetch(`/api/posts/${userId}`,
      {
        method: "POST",
        body: formData,
        cache: 'no-cache',
      });
      if (data);
      const res = await data.json();
      console.log("response i get:",res.success)
      if (res.success==true) {
        // Reset form fields
        setDescription('');
        setImages([]);
        setImg([]);
  
        // Show toast notification
        // You can use your preferred toast library here
        toast.success("Post Uploaded SucessFully");
  
        // Refresh page
        window.location.reload();
      } else {
        // Handle other response codes if necessary
        console.error("Error submitting post:", response.statusText);
      }
    } catch (error) {
      console.log(error)
    }
  }
  

  return (
    <>
      <form className="max-w-sm mx-auto w-full relative">
        <div className="flex flex-wrap">
        {images.map((image, index) => (
          <div key={index} className="w-1/4 px-2 mb-4">
            <img
              src={image}
              alt="Uploaded Image"
              className="w-full h-auto max-w-xs"
            />
          </div>
        ))}
        </div>
        <textarea
          id="message"
          rows="4"
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Share Your thoughts..."
        ></textarea>
        <div className="absolute bottom-2 right-2">
          <input
            type="file"
            ref={inputFileRef}
            style={{ display: 'none' }}
            accept="image/*"
            multiple
            onChange={handleImageUpload}
          />
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={handleIconClick}
            style={{ cursor: 'pointer' }}
          >
            <path
              d="M2.5 1H12.5C13.3284 1 14 1.67157 14 2.5V12.5C14 13.3284 13.3284 14 12.5 14H2.5C1.67157 14 1 13.3284 1 12.5V2.5C1 1.67157 1.67157 1 2.5 1ZM2.5 2C2.22386 2 2 2.22386 2 2.5V8.3636L3.6818 6.6818C3.76809 6.59551 3.88572 6.54797 4.00774 6.55007C4.12975 6.55216 4.24568 6.60372 4.32895 6.69293L7.87355 10.4901L10.6818 7.6818C10.8575 7.50607 11.1425 7.50607 11.3182 7.6818L13 9.3636V2.5C13 2.22386 12.7761 2 12.5 2H2.5ZM2 12.5V9.6364L3.98887 7.64753L7.5311 11.4421L8.94113 13H2.5C2.22386 13 2 12.7761 2 12.5ZM12.5 13H10.155L8.48336 11.153L11 8.6364L13 10.6364V12.5C13 12.7761 12.7761 13 12.5 13ZM6.64922 5.5C6.64922 5.03013 7.03013 4.64922 7.5 4.64922C7.96987 4.64922 8.35078 5.03013 8.35078 5.5C8.35078 5.96987 7.96987 6.35078 7.5 6.35078C7.03013 6.35078 6.64922 5.96987 6.64922 5.5ZM7.5 3.74922C6.53307 3.74922 5.74922 4.53307 5.74922 5.5C5.74922 6.46693 6.53307 7.25078 7.5 7.25078C8.46693 7.25078 9.25078 6.46693 9.25078 5.5C9.25078 4.53307 8.46693 3.74922 7.5 3.74922Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
      </form>
      <button onClick={uploadpost} type="button" class="m-5 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Post</button>
    </>
  );
};

export default CreatePost;
