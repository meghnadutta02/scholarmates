// Client-side code (e.g., in your React component)

import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io(); // Assuming you're connecting to the same server

function JoinNotification() {
  const [joinRequests, setJoinRequests] = useState([]);

  useEffect(() => {
    // Listen for 'joinRequest' event from the server
    socket.on("joinRequest", handleJoinRequest);

    // Clean up the event listener when component unmounts
    return () => {
      socket.off("joinRequest", handleJoinRequest); // Remove the event listener
    };
  }, []); // Only run once on component mount

  const handleJoinRequest = (data) => {
    // Handle the join request notification
    console.log("Received join request:", data);
    // Update state to display the join request notification
    setJoinRequests((prevRequests) => [...prevRequests, data]);
  };

  return (
    <div>
      {/* Display join request notifications */}
      <h2>Join Requests</h2>
      <ul>
        {joinRequests.map((request, index) => (
          <li
            key={index}
          >{`User ${request.userId} wants to join Group ${request.groupId}`}</li>
        ))}
      </ul>
      {/* Your other component JSX */}
    </div>
  );
}

export default JoinNotification;
