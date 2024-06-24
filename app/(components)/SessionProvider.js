"use client";
import { useState, useEffect, useContext, createContext } from "react";
import { getSession } from "next-auth/react";
import io from "socket.io-client";
import { toast } from "react-toastify";
const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [request, setRequest] = useState();
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState([]);
  const [socket, setSocket] = useState(null);
  const [seenNotifications, setSeenNotifications] = useState(new Set());

  const removeDuplicates = (array) => {
    const uniqueSet = new Set(array.map((item) => JSON.stringify(item)));
    return Array.from(uniqueSet).map((item) => JSON.parse(item));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const session = await getSession();
        if (session) {
          setSession(session.user);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const newSocket = io("http://localhost:5001");

    newSocket.on("connect", () => {
      console.log("Successfully connected in socket context!");
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  ///NOTIFICATION FOR INCOMING REQUEST BY:-JYOTIRADITYA STARTED

  useEffect(() => {
    if (socket && session) {
      const data = session.db_id;

      socket.emit("setup", data);

      socket.on("connectionRequest", (data) => {
        console.log("Received connection request:", data);
        if (data) {
          setNotification((prev) => {
            const newNotifications = removeDuplicates([...prev, data]);
            return newNotifications;
          });
          const dataString = JSON.stringify(data);
          if (!seenNotifications.has(dataString)) {
            setSeenNotifications((prev) => new Set(prev).add(dataString));
            toast("you get a connection request");
          }
        }
        // Handle the data received from the server
      });
      socket.on("friendRequestAccepted", (data) => {
        console.log("my data", data);
      });
    }
  }, [socket, session, seenNotifications]);

  ///NOTIFICATION FOR INCOMING REQUEST BY:-JYOTIRADITYA ENDED
  return (
    <SessionContext.Provider
      value={{ session, request, setRequest, socket, notification }}
    >
      {!loading && children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  return useContext(SessionContext);
};
