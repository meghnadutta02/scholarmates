import Spinnersvg from "@/public/Spinner.svg";
import Image from "next/image";

const Loading = () => {
  return (
    <div className="flex  justify-center h-full">
      <Image src={Spinnersvg} alt="Loading..." className="md:h-28 h-24" />
    </div>
  );
};

export default Loading;
