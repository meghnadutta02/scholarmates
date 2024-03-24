// components/SessionProvider.js
'use client'
import { useState, useEffect, useContext,createContext } from 'react';
import { getSession } from 'next-auth/react';

 const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState();
  const [request, setRequest] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const session = await getSession();
        if (session) {
         await setSession(session.user);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      }finally{
        setLoading(false)
      }
    };
  
    fetchData();
  }, []);

  return (
    <SessionContext.Provider value={{session,request,setRequest}}>
      {!loading && children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  return useContext(SessionContext);
  
};
