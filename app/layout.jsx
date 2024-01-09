import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./(components)/Navbar";
import Footer from "./(components)/Footer";
import { AuthProvider } from "./(components)/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AlikeMinds",
  description: "By Half Prayash",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={inter.className}>
          <Navbar />

          <div className="min-h-screen mt-10">{children}</div>

          <Footer />
        </body>
      </AuthProvider>
    </html>
  );
}
