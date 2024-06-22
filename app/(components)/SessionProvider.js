"use client";
import { useState, useEffect, useContext, createContext } from "react";
import { getSession } from "next-auth/react";
import io from "socket.io-client";

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState();
  const [request, setRequest] = useState();
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

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
  }, []);

  return (
    <SessionContext.Provider value={{ session, request, setRequest, socket }}>
      {!loading && children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  return useContext(SessionContext);
};
