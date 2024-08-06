import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const denied = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center w-full">
        <div className="relative w-full lg:w-[35vw] h-[60vh]">
          <Image
            src="https://img.freepik.com/free-vector/403-error-forbidden-with-police-concept-illustration_114360-1935.jpg?t=st=1722841685~exp=1722845285~hmac=09f76b150c8ecb14f86e340f66322b31cb613132f4c2db51ff7332b199a2364c&w=740"
            fill={true}
            alt="403 Forbidden"
          />
        </div>
        <p className="font-bold text-3xl text-gray-600">Access Denied !!</p>
        <p className="font-semibold text-gray-500">
          We can&apos;t let you go out of your bounds.
        </p>
        <Link href="/discussions">
          <Button className="mt-4">Back home</Button>
        </Link>
      </div>
    </div>
  );
};

export default denied;
