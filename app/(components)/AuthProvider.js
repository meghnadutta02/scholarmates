"use client";
//only for client side authentication
import { SessionProvider } from "next-auth/react";
export const AuthProvider = ({ children }) => {
  return <SessionProvider> {children} </SessionProvider>;
};
