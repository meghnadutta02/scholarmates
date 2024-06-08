import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./(components)/Navbar";
import Footer from "./(components)/Footer";
import { AuthProvider } from "./(components)/AuthProvider";
import Sidebar from "./(components)/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SessionProvider } from "@/app/(components)/SessionProvider";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AlikeMinds",
  description: "By Half Prayash",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div>
          <SessionProvider>
            <AuthProvider>
              <Navbar />
              <div className="flex justify-center mt-16">
                <Sidebar />
                <div className="flex justify-center min-h-screen md:w-[70%]">
                  {children}
                </div>
                <Footer />
              </div>
              <ToastContainer />
            </AuthProvider>
          </SessionProvider>
        </div>
      </body>
    </html>
  );
}
