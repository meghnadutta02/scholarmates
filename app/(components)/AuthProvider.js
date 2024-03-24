"use client";
//only for client side authentication
import { SessionProvider } from "@/app/(components)/SessionProvider";
export const AuthProvider = ({ children }) => {
  return <SessionProvider> {children} </SessionProvider>;
};
