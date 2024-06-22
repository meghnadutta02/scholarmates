import { getServerSession } from "next-auth";
import { options } from "./api/auth/[...nextauth]/options";
import Hero from "./(components)/Hero";
import Services from "./(components)/Services";
import { redirect } from "next/navigation";
import Footer from "./(components)/Footer";

const Home = async () => {
  const session = await getServerSession(options);
  {
    session ? redirect("/discussions") : null;
  }

  return (
    <div className="flex flex-col space-y-7 md:space-y-12 items-center bg-blue-50 bg-opacity-85">
      <Hero />
      <Services />
      <Footer />
    </div>
  );
};

export default Home;
