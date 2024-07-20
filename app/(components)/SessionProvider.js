"use client";
import { useState, useEffect, useContext, createContext } from "react";
import { getSession } from "next-auth/react";
import io from "socket.io-client";

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [request, setRequest] = useState();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState([]);
  const [socket, setSocket] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const clearUnreadCount = () => {
    setUnreadCount(0);
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

    const newSocket = io(`${process.env.NEXT_PUBLIC_NODE_SERVER}`);

    newSocket.on("connect", () => {
      console.log("Successfully connected in socket context!");
      newSocket.emit("setup", session?.db_id);
    });

    const handleNewNotification = (data) => {
      if (data) {
        setNotification((prev) => [...prev, data]);
        setUnreadCount((prev) => prev + 1);
      }
    };

    newSocket.on("connectionRequest", handleNewNotification);
    newSocket.on("receiveRequest", handleNewNotification);
    newSocket.on("discussionNotification", handleNewNotification);
    newSocket.on("joinRequestNotification", handleNewNotification);

    setSocket(newSocket);

    return () => {
      newSocket.off("connectionRequest", handleNewNotification);
      newSocket.off("receiveRequest", handleNewNotification);
      newSocket.off("discussionNotification", handleNewNotification);
      newSocket.off("joinRequestNotification", handleNewNotification);
      newSocket.close();
    };
  }, [session?.db_id]);

  return (
    <SessionContext.Provider
      value={{
        setSession,
        session,
        request,
        setRequest,
        socket,
        notification,
        setNotification,
        setUnreadCount,
        unreadCount,
        clearUnreadCount,
        user,
        setUser,
      }}
    >
      {!loading && children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  return useContext(SessionContext);
};
