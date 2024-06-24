import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { Label } from "@/components/ui/label";
import { PlusIcon } from "@radix-ui/react-icons";
import { toast } from "react-toastify";
import { interests } from "../interests";
import CreatePost from "./CreatePost";
function NewDiscussion() {
  let formData = new FormData();

  const [title, setTitle] = useState("");
  const [groupTitle, setGroupTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [privacy, setPrivacy] = useState("public");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  // ----------jr-----------
  const inputFileRef = useRef(null);
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState("");
  const [userId, setUserId] = useState();
  const [img, setImg] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleImageUpload = (e) => {
    console.log(e.target.file);
    const files = Array.from(e.target.files);
    console.log("files", files);
    setImg(files);
    const promises = [];

    files.forEach((file) => {
      const reader = new FileReader();
      const promise = new Promise((resolve) => {
        reader.onload = () => {
          resolve(reader.result);
        };
      });
      reader.readAsDataURL(file);
      promises.push(promise);
    });

    Promise.all(promises).then((results) => {
      setImages([...images, ...results]);
    });
  };
  img.forEach((image, index) => {
    formData.append(`image${index}`, image);
  });

  const handleIconClick = () => {
    inputFileRef.current.click();
  };
  // const formData = new FormData();
  // formData.append("description", description);

  const handleButtonClick = () => {
    // Prevent default form submission
    setIsOpen((prevIsOpen) => !prevIsOpen); // set the state to true when the button is clicked
  };
  // -------------jr end-------

  const categories = interests.flatMap(
    (categoryObject) => Object.values(categoryObject)[0]
  );

  const categoryOptions = categories.map((category) => ({
    label: category,
    value: category,
  }));

  const handleCategoryChange = (selectedCategory) => {
    setSelectedCategory(selectedCategory);

    const newSubcategories =
      interests.find((interest) => interest.category === selectedCategory.value)
        ?.subcategories || [];

    const newSubcategoryOptions = newSubcategories.map((subcategory) => ({
      label: subcategory,
      value: subcategory,
    }));

    setSubCategoryOptions(newSubcategoryOptions);
  };

  const typeOptions = [
    "general",
    "urgent",
    "announcement",
    "collaboration",
    "event",
    "support",
  ];

  const handleImageChange = (event) => {
    setImageURL(URL.createObjectURL(event.target.files?.[0]));
    setSelectedImage(event.target.files?.[0]);
  };
  const handleSubCategoryChange = (selectedSubCategories) => {
    setSelectedSubCategories(selectedSubCategories);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    formData.append("groupTitle", groupTitle);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("type", type);
    formData.append("privacy", privacy);

    if (!selectedCategory) {
      return toast.error("Please select a category");
    }
    selectedSubCategories.forEach((subcategory) => {
      formData.append("subcategories", subcategory.value);
    });

    try {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/discussion`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (result.ok) {
        toast.success("Discussion created and chat room started. Go to chat!");
      }
    } catch (error) {
      console.error("Error uploading discussion:", error);
      toast.error("Error uploading discussion");
    }
    setImg([]);
    setTitle("");
    setType("");
    setSelectedCategories([]);
    setSelectedSubCategories([]);
    setSelectedCategory(null);
    setContent("");
    setPrivacy("public");
    setSelectedImage(null);
  };

  return (
    <div className="w-full flex flex-col bg-white p-4 shadow rounded-lg">
      <form>
        <div className="my-3">
          <Input
            placeholder="Discussion Title"
            value={title}
            maxLength={50}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="my-3">
          <Textarea
            placeholder="Start a discussion"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="flex ">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-1/2 py-2 px-4 border border-gray-300 bg-white rounded-md shadow-sm text-base text-gray-700"
          >
            <option value="">Select a type</option>
            {typeOptions.map((option, index) => (
              <option key={index} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="w-1/2 my-3">
          <Label htmlFor="interests">Categories</Label>
          <Select
            name="interests"
            options={categoryOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            value={selectedCategory}
            onChange={handleCategoryChange}
          />
        </div>
        <div className="grid gap-2 mb-3">
          <Label htmlFor="interests">Subcategories</Label>
          <Select
            isMulti
            name="interests"
            options={subCategoryOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            value={selectedSubCategories}
            onChange={handleSubCategoryChange}
            placeholder="Select a category first"
          />
        </div>
        <div className="">
          <Label htmlFor="privacy">Configure Group Preferences</Label>
          <RadioGroup
            defaultValue={privacy}
            name="privacy"
            className="flex items-center space-x-2 mt-[5px]"
            onChange={(e) => setPrivacy(e.target.value)}
          >
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <RadioGroupItem value="public" id="privacyPublic" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Users can join directly.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Label htmlFor="privacyPublic">Public</Label>
            </div>
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <RadioGroupItem value="private" id="privacyPrivate" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Users can send requests to join, which must be approved.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Label htmlFor="privacyPrivate">Private</Label>
            </div>
          </RadioGroup>
          <div className="mt-3">
            <Input
              placeholder="Group Title"
              value={groupTitle}
              maxLength={50}
              onChange={(e) => setGroupTitle(e.target.value)}
            />
          </div>
        </div>
      </form>

      <div class="flex flex-col">
        <div class="flex m-3" style={{ width: 500, height: 50 }}>
          <span class=" inline-block w-1/4 h-full items-center justify-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
            <button className="IconButton" onClick={handleButtonClick}>
              <PlusIcon />
            </button>
          </span>
          <span class=" inline-block w-3/4 h-full items-center justify-center px-3 text-sm text-black bg-white border  border-gray-300  dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
            <h1>CREATE POST</h1>
          </span>
        </div>
        {isOpen && (
          <form className="max-w-sm mx-auto w-full relative">
            <div className="flex flex-wrap">
              {images.map((image, index) => (
                <div key={index} className="w-1/4 px-2 mb-4">
                  <Image
                    src={image}
                    alt="Uploaded Image"
                    className="w-full h-auto max-w-xs"
                    height={200}
                    width={200}
                  />
                </div>
              ))}
            </div>
            <textarea
              id="message"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="upload images"
            ></textarea>

            <div className="absolute bottom-2 right-2">
              <input
                type="file"
                ref={inputFileRef}
                style={{ display: "none" }}
                accept="image/*"
                multiple
                onChange={handleImageUpload}
              />
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onClick={handleIconClick}
                style={{ cursor: "pointer" }}
              >
                <path
                  d="M2.5 1H12.5C13.3284 1 14 1.67157 14 2.5V12.5C14 13.3284 13.3284 14 12.5 14H2.5C1.67157 14 1 13.3284 1 12.5V2.5C1 1.67157 1.67157 1 2.5 1ZM2.5 2C2.22386 2 2 2.22386 2 2.5V8.3636L3.6818 6.6818C3.76809 6.59551 3.88572 6.54797 4.00774 6.55007C4.12975 6.55216 4.24568 6.60372 4.32895 6.69293L7.87355 10.4901L10.6818 7.6818C10.8575 7.50607 11.1425 7.50607 11.3182 7.6818L13 9.3636V2.5C13 2.22386 12.7761 2 12.5 2H2.5ZM2 12.5V9.6364L3.98887 7.64753L7.5311 11.4421L8.94113 13H2.5C2.22386 13 2 12.7761 2 12.5ZM12.5 13H10.155L8.48336 11.153L11 8.6364L13 10.6364V12.5C13 12.7761 12.7761 13 12.5 13ZM6.64922 5.5C6.64922 5.03013 7.03013 4.64922 7.5 4.64922C7.96987 4.64922 8.35078 5.03013 8.35078 5.5C8.35078 5.96987 7.96987 6.35078 7.5 6.35078C7.03013 6.35078 6.64922 5.96987 6.64922 5.5ZM7.5 3.74922C6.53307 3.74922 5.74922 4.53307 5.74922 5.5C5.74922 6.46693 6.53307 7.25078 7.5 7.25078C8.46693 7.25078 9.25078 6.46693 9.25078 5.5C9.25078 4.53307 8.46693 3.74922 7.5 3.74922Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </form>
        )}
      </div>

      <Button onClick={handlePostSubmit}>Post</Button>
    </div>
  );
}

export default NewDiscussion;
