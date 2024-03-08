'use client'
import React from 'react'
import {Avatar} from "@/components/ui/avatar";
import {Card} from "@/components/ui/card";
import { Flex, Text ,Box,Image} from '@radix-ui/themes';
import { Button } from "@/components/ui/button";
const notification = ({sender,receive,name}) => {

  const data=async()=>{
    try{
      if(sender && receive){
          
      }else{
        console.log("NO SENDER AND RECEIVER ID'S PRESENT");
      }
    }
    catch(error){
      console.log(error.message);
    }
  }

  console.log(sender,name);
  return (
    <>
    <Flex gap="3" direction="column">
    <Card size="3" style={{ width: 500 }}>
    <Flex gap="4" align="center">
    <Avatar
      size="3"
      src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
      radius="full"
      fallback="T"
    />
      <Box>
        <Text as="div" size="4" weight="bold">
          {name}
        </Text>
        <Text as="div" size="4" color="gray">
          Engineering
        </Text>
      </Box>
      <Button>Accept</Button>
      <Button backgroundcolor="red">Decline</Button>
    </Flex>
  </Card>
</Flex>
    </>
  )
}

export default notification