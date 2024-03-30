import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io();

function JoinNotification() {
  const [joinRequests, setJoinRequests] = useState([]);

  useEffect(() => {
    socket.on("joinRequest", handleJoinRequest);

    return () => {
      socket.off("joinRequest", handleJoinRequest);
    };
  }, []);

  const handleJoinRequest = (data) => {
    console.log("Received join request:", data);

    setJoinRequests((prevRequests) => [...prevRequests, data]);
  };

  return (
    <div>
      <h2>Join Requests</h2>
      <ul>
        {joinRequests.map((request, index) => (
          <li
            key={index}
          >{`User ${request.userId} wants to join Group ${request.groupId}`}</li>
        ))}
      </ul>
    </div>
  );
}

export default JoinNotification;
