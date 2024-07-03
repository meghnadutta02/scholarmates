import Spinnersvg from "@/public/Spinner.svg";
import Image from "next/image";
const Loading = () => {
  return (
    <div>
      <div className="flex justify-center items-center  z-50">
        <Image src={Spinnersvg} alt="Loading..." className="h-24" />
      </div>
    </div>
  );
};

export default Loading;
