import { DownloadIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import React from "react";
import { FaFilePdf } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IoIosDocument } from "react-icons/io";
import { FileArchiveIcon } from "lucide-react";
import { SiMicrosoftexcel } from "react-icons/si";

const FileItem = ({ fileType, fileName, url, onClick }) => {
  let icon;

  switch (fileType) {
    case "image":
      return (
        <Dialog>
          <DialogTrigger>
            <Image
              className="rounded-md"
              src={url}
              alt="Media"
              height={200}
              width={200}
              objectFit="cover"
            />
          </DialogTrigger>
          <DialogContent className="fixed top-1/2 left-1/2 w-screen flex items-center justify-center">
            <DialogTitle className="sr-only">Media</DialogTitle>
            <DialogDescription className="sr-only">
              Zoomed on screen image media
            </DialogDescription>
            <Image
              className="rounded-md w-[100vw]"
              height={2000}
              width={2000}
              src={url}
              alt="Media"
            />
          </DialogContent>
        </Dialog>
      );
    case "pdf":
      icon = <FaFilePdf className="text-red-400" size={24} />;
      break;
    case "doc":
      icon = <IoIosDocument className="text-blue-400" size={24} />;
      break;
    case "excel":
      icon = <SiMicrosoftexcel className="text-green-400" size={24} />;
      break;
    default:
      icon = <FileArchiveIcon className="text-blue-400" size={24} />;
      break;
  }

  return (
    <div className="flex justify-between items-center my-2 px-1 w-60">
      <div className="flex">
        {icon}
        <p className="ml-2 w-32 truncate">{fileName}</p>
      </div>
      <button
        className="p-2 ml-8 mr-2 rounded-full bg-gray-300"
        onClick={() => onClick(url, fileName)}
      >
        <DownloadIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

const DisplayMedia = ({ fileUrl }) => {
  const getFileType = (url) => {
    if (typeof url !== "string") {
      console.error("fileUrl must be a string", url);
      return null;
    }
    const extension = url.split(".").pop().toLowerCase();
    switch (extension) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "image";
      case "pdf":
        return "pdf";
      case "doc":
      case "docx":
        return "doc";
      case "xls":
      case "xlsx":
        return "excel";
      default:
        return "other";
    }
  };

  const getFileName = (url) => {
    const decodedUrl = decodeURIComponent(url);
    const fullFileName = decodedUrl.substring(decodedUrl.lastIndexOf("/") + 1);
    const uuidRegex =
      /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}-/i;
    return fullFileName.replace(uuidRegex, "");
  };

  const downloadFile = (url, fileName) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
  };

  const fileType = getFileType(fileUrl);
  const fileName = getFileName(fileUrl);

  return (
    <div>
      <FileItem
        fileType={fileType}
        fileName={fileName}
        url={fileUrl}
        onClick={downloadFile}
      />
    </div>
  );
};

export default DisplayMedia;
