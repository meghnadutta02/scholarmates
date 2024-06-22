"use client"

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {io} from "socket.io-client";
import Notification from "@/app/(components)/Notification";
import { useSession } from "@/app/(components)/SessionProvider";

const Page = () => {
    const { session, request, setRequest } = useSession();
    const [userId, setUserId] = useState();
    const [requestdata, setRequestData] = useState([]);
    const [data, setData] = useState([]);
    const [requestnot,setRequestNot]=useState([]);
    const [check,setCheck]=useState(false);

    useEffect(() => {

        if (session) {
            console.log("this is lll:", session.db_id)
            console.log("request is:", request);
            setUserId(session.db_id);
        }

    }, [userId]);

    
    useEffect(() => {
        const storedData = localStorage.getItem('request');
        const parsedData = storedData ? JSON.parse(storedData) : null;
        console.log("pasr:", parsedData);
        if(parsedData){
            setData(parsedData);
        }
       
    }, [check]);

    // notification call
    const dataExistsInLocalStorage = (id) => {
        const storedData = localStorage.getItem('request');
        const parsedData = storedData ? JSON.parse(storedData) : [];
        return parsedData.some(item => item.id === id);
    };

    const requestnoti=async()=>{
        try{
            const response=await fetch(`http://localhost:5001/notification/${userId}`,
            {
                method: "GET",
                headers: {
                  "Content-Type": "application/json"
                }
            }
            );
            if (response.ok) {
                const data  = await response.json();
                // console.log(data.data);
                const newData = data.data.filter(item => !dataExistsInLocalStorage(item.id)); // Filter out items already in local storage
                console.log("new data:",newData)
                setRequestNot(prevData => [...prevData, ...newData]);
            } else {
                console.log("Error:", response.statusText);
            }
        }catch(error){
            console.log(error)
        }
    }

    useEffect(()=>{
       
        if(userId){
            requestnoti();
        }
            },[userId])

            useEffect(() => {
                if (requestnot.length > 0) {
                  localStorage.setItem('request', JSON.stringify(requestnot));
                  setCheck(true);
                }
              }, [requestnot]);

    return (
        <>
            <div>
                {data?.map((item, index) => (
                    <Notification key={index} data={item.requestData } sender={item.requestData.user}
                        receive={item.requestData.requestTo}  frndId={item.requestData._id} user={item.userData} />
                ))}
            </div>
        </>
    );
};

export default Page;