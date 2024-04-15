"use client";
import React, { useEffect, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Flex, Text, Box, Image } from "@radix-ui/themes";
import { useSession } from "./SessionProvider";
const Connection = () => {
    const session=useSession();
  const [isVisible, setIsVisible] = useState(true);
    const[userId,setUserId]=useState(); 
    const [data,setData]=useState([]);
    const [dataFetched, setDataFetched] = useState(false);
    useEffect(()=>{
        if(session){
            setUserId(session.session.db_id);
            console.log(session);
        }
    },[userId])
  const acceptHandle = async () => {
    

    try {
        const res = await fetch(`/api/users/connection/${userId}`, 
        {
          method: "GET",
          cache: "no-cache",
        }
      );
      if(res){
        const data = await res.json();
        const dattaa=data.result;
       setData((prevdata)=>[...prevdata,...dattaa]);
        
        setDataFetched(true);
        console.log(data.result);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
useEffect(()=>{
if (userId && !dataFetched) { // Only fetch data if userId is set and data is not fetched
    acceptHandle();
    
  }
}),[userId,dataFetched]
  
  return (
    <>
       
       
     {
        data?.map((user)=>{
          return(
            <Flex gap="3" direction="column" key={user.index}>
            <Card size="3" style={{ width: 500 }} >
              <Flex gap="4" align="center" className="flex">
                <img
                  size="3"
                  src={user.profilePic}
                  className="rounded-full"
                  fallback="T"
                />
                <Box>
                  <Text as="div" size="4 font-bold text-xl" className="cursor-pointer hover:color-blue" weight="bold" onClick={()=>profile(user._id)}>
                    {user.name}
                  </Text>
                  <Text as="div" size="4" color="gray" >
                    {user.collegeName}
                  </Text>
                  <Text as="div" size="4" color="gray">
                    {user.degree}
                  </Text>
  
                </Box>
  
              </Flex>
             
            </Card>
          </Flex>
          )
        })
     }
    </>
  );
};

export default Connection;
