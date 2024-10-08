import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./(components)/Navbar";
import RightSidebar from "./(components)/RightSidebar";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "./(components)/AuthProvider";
import LeftSidebar from "./(components)/LeftSidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SessionProvider } from "@/app/(components)/SessionProvider";
const inter = Inter({ subsets: ["latin"] });
import { getServerSession } from "next-auth";
import { options } from "./api/auth/[...nextauth]/options";
import Header from "./(components)/Header";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
TimeAgo.addDefaultLocale(en);

export const metadata = {
  title: "ScholarMates",
  description: "Checkmate your goals. Together.",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(options);
  return (
    <html lang="en">
      <body className={inter.className}>
        <div>
          <SessionProvider>
            <AuthProvider>
              {session ? <Navbar /> : <Header />}

              {session ? (
                <div className="flex justify-center md:mt-[69px] mt-[75px] ">
                  <LeftSidebar />
                  <div className="flex justify-center min-h-screen md:w-[70%] w-[95%] scrollbar-hide">
                    {children}
                  </div>
                  <RightSidebar />
                </div>
              ) : (
                <>{children}</>
              )}
              <ToastContainer />
            </AuthProvider>
          </SessionProvider>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
