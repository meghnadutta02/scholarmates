import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { IoMdMenu } from "react-icons/io";
import Link from "next/link";
import { MdPeopleAlt } from "react-icons/md";
import { MessageSquareIcon, UsersIcon } from "lucide-react";
import { MdOutlineConnectWithoutContact, MdGroupAdd } from "react-icons/md";
import { TrendingUp } from "lucide-react";
import { useState } from "react";

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
        </DrawerHeader>
        <nav className="flex flex-col items-start gap-4 p-4">
          <Link
            onClick={closeDrawer}
            href="/chats"
            className="flex items-center gap-2 rounded-lg px-2 py-2 text-gray-700 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          >
            <MessageSquareIcon className="h-4 w-4" />
            <span>Chats</span>
          </Link>
          <Link
            onClick={closeDrawer}
            href="/discussions"
            className="flex items-center gap-2 rounded-lg px-2 py-2 text-gray-700 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          >
            <UsersIcon className="h-4 w-4" />
            <span>Discussions</span>
          </Link>
          <Link
            onClick={closeDrawer}
            href="/find-people"
            className="flex items-center gap-3 rounded-lg px-2 py-2 text-gray-700 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          >
            <MdOutlineConnectWithoutContact className="h-4 w-4" />
            <span>Find People</span>
          </Link>
          <Link
            onClick={closeDrawer}
            className="flex items-center gap-3 rounded-lg px-2 py-2 text-gray-700 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            href="/my-engagements"
          >
            <MdPeopleAlt className="mt-1 h-5 w-5" />
            Engagements
          </Link>
          <Link
            onClick={closeDrawer}
            href="/requests"
            className="flex items-center gap-3 rounded-lg px-2 py-2 text-gray-700 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          >
            <MdGroupAdd className="h-4 w-4" />
            <span>Requests</span>
          </Link>
          <Link
            onClick={closeDrawer}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            href="/discussions/trending"
          >
            <TrendingUp className="mt-1 h-5 w-5" />
            Trending
          </Link>
        </nav>
        <DrawerFooter>
          <DrawerClose>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default MenuDrawer;
