"use client"

import React, { useEffect, useState } from "react";
import ToastNotification from "@/app/(components)/ToastNotification"
import { useSession } from "@/app/(components)/SessionProvider";

const Page = () => {
    const {notification } = useSession();
    

    return (
        <>
           {notification.length==0 ? "No Notification":(
            <div className="flex flex-col ">
                <div className="pb-3">
                    {notification?.map((item, index) => (
                        <ToastNotification key={index} data={item} />
                    )
                    )}
                   
                </div>
               
            </div>
           )}
        </>
    );
};

export default Page;