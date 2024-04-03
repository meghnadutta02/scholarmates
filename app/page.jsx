'use client'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
// import CreatePost from "@/app/(components)/NewPost";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { Heading1 } from "lucide-react";
export default function Home() {
const [data,setData]=useState([]);
  const datafxn=async()=>{
    try{
      const data=await fetch("/api/posts",
      {method: "GET"}
      ,{
        cache:'no-cache'
      });
      if(data);
      const res = await data.json();
      console.log(res)
     setData(res.result);
    }catch(error){
      console.log(error)
    }
  }
useEffect(()=>{
if(data.length==0){
  datafxn()
}
console.log(data)
},[data]);
  return (
    <div className="flex flex-col ">
      {/* <aside className="flex flex-row p-4 gap-4 md:p-6 justify-evenly">
        <CreatePost />
      </aside> */}
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:py-8 md:px-16">
        {/* Discussions Feed container */}
        <div className="grid gap-4">
          {/* Discussion card */}
          <Card className="flex items-start p-8 gap-4 rounded-xl shadow-md mx-auto">
            <Image
              alt="Avatar"
              className="rounded-full"
              height="48"
              src="/placeholder.svg"
              style={{
                aspectRatio: "48/48",
                objectFit: "cover",
              }}
              width="48"
            />
            <div className="flex-1 grid gap-2">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-base">Discussion Title</h4>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  @alicej
                </span>
              </div>
              <div className="prose max-w-none">
                <p>
                  Hey everyone! Just wanted to share my latest blog post about
                  the future of AI. I think were on the cusp of some really
                  amazing developments. What do you think?
                </p>
              </div>
              <div className="grid w-full grid-cols-3 items-center gap-4 text-center md:gap-8">
                <Button className="h-10" size="icon" variant="icon">
                  <ThumbsUpIcon className="w-4 h-4" />
                  <span className="sr-only">Like</span>
                  <span className="ml-2">12</span>
                </Button>
                <Button className="h-10" size="icon" variant="icon">
                  <ThumbsDownIcon className="w-4 h-4" />
                  <span className="sr-only">Dislike</span>
                  <span className="ml-2">3</span>
                </Button>
                <Button className="h-10" size="icon" variant="icon">
                  <TrendingUpIcon className="w-4 h-4" />
                  <span className="sr-only">Popularity</span>
                  <span className="ml-2">High</span>
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Posts Feed */}
        {
  !data ? (
    // Render loader while data is being fetched
    <div>Loading...</div>
  ) : (
    // Render cards when data is available
    data.map((value, index) => (
      <Card
        key={index}
        className="mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
      >
        <div className="md:flex justify-center">
          <div className="md:flex-shrink-0">
            <span className="object-cover md:w-48 rounded-md bg-muted w-[192px] h-[192px]" />
          </div>
          <div className="p-8 w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Image
                  alt="Profile picture"
                  className="rounded-full"
                  height="40"
                  src={value.image}
                  style={{
                    aspectRatio: "40/40",
                    objectFit: "cover",
                  }}
                  width="40"
                />
                <div className="ml-4">
                  <div className="uppercase tracking-wide text-sm text-black dark:text-white font-semibold">
                    Chamath Palihapitiya
                  </div>
                  <div className="text-gray-400 dark:text-gray-300">
                    @chamath
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-4 text-gray-500 dark:text-gray-300">
              {value.description}
            </p>
            <Carousel>
              <CarouselContent>
                <CarouselItem>
                  <div className="p-4 flex justify-center">
                    <Image
                      alt="post"
                      height={400}
                      width={400}
                      src={value.image}
                    />
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="ml-8" />
              <CarouselNext className="mr-8" />
            </Carousel>

            <div className="flex mt-6 justify-between items-center">
              <div className="flex space-x-4 text-gray-400 dark:text-gray-300">
                <Button variant="icon" className="flex items-center">
                  <HeartIcon className="h-6 w-6 text-red-500" />
                  <span className="ml-1 text-red-500">{value.likes}</span>
                </Button>
                <Button variant="icon" className="flex items-center">
                  <MessageCircleIcon className="h-6 w-6 text-green-500" />
                  <span className="ml-1 text-green-500">241</span>
                </Button>
                {/* <div className="flex items-center">
                  <RepeatIcon className="h-6 w-6 text-blue-500" />
                  <span className="ml-1 text-blue-500">487</span>
                </div> */}
              </div>
              <div className="text-gray-400 dark:text-gray-300">
                7:22 AM · Aug 22, 2023
              </div>
            </div>
          </div>
        </div>
      </Card>
    ))
  )
}

      </main>
    </div>
  );
}

function ThumbsDownIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 14V2" />
      <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
    </svg>
  );
}

function ThumbsUpIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 10v12" />
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
    </svg>
  );
}

function TrendingUpIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

function HeartIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function MessageCircleIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
    </svg>
  );
}

function RepeatIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m17 2 4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
      <path d="m7 22-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

function TwitterIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}
