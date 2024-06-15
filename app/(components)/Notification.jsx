"use client";
import React, { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Flex, Text, Box, Image } from "@radix-ui/themes";
import { Button } from "@/components/ui/button";
const Notification = ({ sender, receive, name, frndId ,user,data}) => {
  const [isVisible, setIsVisible] = useState(true);

  const acceptHandle = async (x) => {
    console.log(x);

    try {
      if (sender && receive) {
        const res = await fetch(
          "http://localhost:5001/sendconnection/receive",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              friendshipId: data._id,
              userId: data.requestTo,
              action: x,
            }),
            cache: "no-cache",
          }
        );
        if (res.status == 200) {
          console.log(res);
          localStorage.removeItem("request");
          setIsVisible(false);
        }
      } else {
        console.log("NO SENDER AND RECEIVER ID'S PRESENT");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const profile=(id)=>{
    alert(id);
  }

  console.log(sender, name, frndId, receive,user,data);
  return (
    <>
      {isVisible && (
        <Flex gap="3" direction="column">
          <Card size="3" style={{ width: 500 }} >
            <Flex gap="4" align="center" className="flex">
              <img
                size="3"
                src={user.profilePic}
                className="rounded-full"
                fallback="T"
              />
              <Box>
                <Text as="div" size="4" className="cursor-pointer hover:color-blue" weight="bold" onClick={()=>profile(user._id)}>
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
            <Button onClick={() => acceptHandle("accept")}>Accept</Button>
              <Button
                backgroundcolor="red"
                onClick={() => acceptHandle("decline")}
              >
                Decline
              </Button>
          </Card>
        </Flex>
      )}
    </>
  );
};

export default Notification;
