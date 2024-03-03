'use client'
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

let socket;

const Page = () => {
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState("");

    useEffect(()=>{
     socket=io("http://localhost:5000",{transports:['websocket']});
      socket.on('connect', () => {
        console.log('Successfully connected!');
      });
      socket.on("connect_error", (err) => {
        // the reason of the error, for example "xhr poll error"
        console.log(err.message);
      
        // some additional description, for example the status code of the initial HTTP response
        console.log(err.description);
      
        // some additional context, for example the XMLHttpRequest object
        console.log(err.context);
      });

      return () => {
        socket.disconnect();
      };
    },[])

    return (
        <div>
            <h1>Chat app</h1>
            <h1>Enter a username</h1>

            <input value={username} onChange={(e) => setUsername(e.target.value)} />

            <div>
                <form >
                    <input
                        name="message"
                        placeholder="enter your message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        autoComplete={"off"}
                    />
                </form>
            </div>
        </div>
    );
};

export default Page;