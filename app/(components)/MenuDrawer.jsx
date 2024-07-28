import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerDescription,
} from "@/components/ui/drawer";
import { IoMdMenu } from "react-icons/io";
import Link from "next/link";
import { MessageSquareIcon } from "lucide-react";
import { MdOutlineConnectWithoutContact, MdGroupAdd } from "react-icons/md";
import { TrendingUp } from "lucide-react";
import { useState } from "react";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { HiOutlineRectangleGroup } from "react-icons/hi2";

const MenuDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeDrawer = () => {
    setIsOpen(false);
  };
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <IoMdMenu
          onClick={() => setIsOpen(true)}
          className="w-6 h-6 text-white cursor-pointer"
        />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Menu</DrawerTitle>
          <DrawerDescription className="sr-only">
            Menu Drawer for mobile screens
          </DrawerDescription>
        </DrawerHeader>
        <nav className="flex flex-col items-start gap-4 p-4">
          <Link
            onClick={closeDrawer}
            href="/chats"
            className="flex w-full items-center gap-3 rounded-lg p-2 text-gray-700 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          >
            <MessageSquareIcon className="h-4 w-4" />
            <span>Messages</span>
          </Link>
          <Link
            onClick={closeDrawer}
            href="/discussions"
            className="flex w-full items-center gap-3 rounded-lg p-2 text-gray-700 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          >
            <HiOutlineRectangleGroup className="h-5 w-5" />
            <span>Discussions</span>
          </Link>
          <Link
            onClick={closeDrawer}
            href="/find-people"
            className="flex w-full items-center gap-3 rounded-lg p-2 text-gray-700 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          >
            <MdOutlineConnectWithoutContact className="h-5 w-5" />
            <span>Find People</span>
          </Link>
          <Link
            onClick={closeDrawer}
            className="flex w-full items-center gap-3 rounded-lg p-2 text-gray-700 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            href="/my-engagements"
          >
            <UsersIcon className="h-5 w-5" />
            Engagements
          </Link>
          <Link
            onClick={closeDrawer}
            href="/requests"
            className="flex w-full items-center gap-3 rounded-lg p-2 text-gray-700 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          >
            <MdGroupAdd className="h-5 w-5" />
            <span>Requests</span>
          </Link>
          <Link
            onClick={closeDrawer}
            className="flex w-full items-center gap-3 rounded-lg p-2 text-gray-700 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            href="/discussions/trending"
          >
            <TrendingUp className="mt-1 h-5 w-5" />
            Trending
          </Link>
        </nav>
        <DrawerFooter>
          <DrawerClose className="place-content-center">
            <span className="flex mt-[-12px] justify-center">
              <CrossCircledIcon className="h-10 w-10 text-gray-600" />
            </span>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default MenuDrawer;

function UsersIcon(props) {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
