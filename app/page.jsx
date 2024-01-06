// "use client"; for client-side components
import { Button } from "@/components/ui/button";
import Image from "next/image";

//homepage

export default function Home() {
  return (
    <h1>
      Home Page
      {/* <Button>Click me</Button> */}
      <Image
        src="https://cdn.pixabay.com/photo/2015/04/19/08/32/marguerite-729510_640.jpg"
        alt=""
        width={500}
        height={500}
      />
    </h1>
  );
}
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <h1>
      Home Page
      {/* <Button>Click me</Button> */}
      <Image
        src="https://cdn.pixabay.com/photo/2015/04/19/08/32/marguerite-729510_640.jpg"
        alt=""
        width={500}
        height={500}
      />
    </h1>
  );
}
