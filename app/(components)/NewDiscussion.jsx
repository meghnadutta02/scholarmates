import React, { useState } from "react";
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
import Select from "react-select";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { interests } from "../(data)/interests";
import { useSession } from "@/app/(components)/SessionProvider";
import { PaperclipIcon } from "lucide-react";
import { FaInfoCircle } from "react-icons/fa";

function NewDiscussion({ setDiscussions }) {
  const { session, socket } = useSession();
  let formData = new FormData();
  const [isDisabled, setIsDisabled] = useState(false);
  const [title, setTitle] = useState("");
  const [groupTitle, setGroupTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [privacy, setPrivacy] = useState("public");
  const [selectedImage, setSelectedImage] = useState(null);
  const [subCategoryError, setSubCategoryError] = useState(false);

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
  ].map((type) => ({
    label: type[0].toUpperCase() + type.slice(1),
    value: type,
  }));

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files?.[0]);
  };

  const handleSubCategoryChange = (selectedSubCategories) => {
    if (selectedSubCategories.length > 10) {
      setSubCategoryError(true);
      return;
    } else {
      setSubCategoryError(false);
    }

    setSelectedSubCategories(selectedSubCategories);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setIsDisabled(true);

    formData.append("groupTitle", groupTitle);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("type", type?.value);
    formData.append("privacy", privacy);
    formData.append("coverImage", selectedImage);

    if (
      !title ||
      !content ||
      !type ||
      !selectedCategory ||
      !selectedSubCategories.length ||
      !groupTitle
    ) {
      setIsDisabled(false);
      return toast.error("Please fill out all fields", {
        autoClose: 4000,
        closeOnClick: true,
      });
    }

    selectedSubCategories.forEach((subcategory) => {
      formData.append("subcategories", subcategory.value);
    });

    const toastId = toast.loading("Creating discussion...", {
      autoClose: 4000,
      closeOnClick: true,
    });

    try {
      const result = await fetch(`/api/discussion`, {
        method: "POST",
        body: formData,
      });

      if (result.ok) {
        const discussion = await result.json();

        socket.emit("discussionCreated", {
          discussion: discussion.result,
          user: session,
        });

        setDiscussions((prevDiscussions) => [
          discussion.result,
          ...prevDiscussions,
        ]);

        toast.update(toastId, {
          render: "Discussion created! Go to chat room.",
          type: "success",
          isLoading: false,
          autoClose: 4000,
          closeOnClick: true,
        });
      }
    } catch (error) {
      console.error("Error uploading discussion:", error);
      toast.update(toastId, {
        render: "Error creating discussion",
        type: "error",
        isLoading: false,
        autoClose: 4000,
        closeOnClick: true,
      });
    }

    setSelectedImage("");
    setTitle("");
    setType(null); // Reset type to null
    setIsDisabled(false);
    setGroupTitle("");
    setSelectedCategories([]);
    setSelectedSubCategories([]);
    setSelectedCategory(null);
    setContent("");
    setPrivacy("public");
    setSelectedImage(null);
  };

  return (
    <div className="w-full flex flex-col bg-white p-4 shadow rounded-lg">
      <form onSubmit={handlePostSubmit}>
        <div className="mb-3">
          <Input
            placeholder="Discussion Title"
            value={title}
            maxLength={60}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="my-3">
          <Textarea
            placeholder="Write a description"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={800}
          />
        </div>
        <div className="w-1/2 my-3">
          <Label htmlFor="type">Select a type</Label>
          <Select
            name="type"
            options={typeOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            value={type}
            onChange={(selectedType) => setType(selectedType)}
          />
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
          {subCategoryError && (
            <div className="text-red-500 flex items-center mt-2 text-sm">
              <FaInfoCircle className="mr-1" />
              You can only select up to 10 subcategories
            </div>
          )}
        </div>
        <div className="">
          <Label htmlFor="privacy">Configure Group Preferences</Label>
          <RadioGroup
            defaultValue="public"
            name="privacy"
            className="flex items-center space-x-2 mt-[5px]"
            onChange={(e) => {
              setPrivacy(e.target.value);
            }}
          >
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger type="button">
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
                  <TooltipTrigger type="button">
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
        </div>
        <div className="mt-3">
          <Input
            placeholder="Group Title"
            value={groupTitle}
            maxLength={30}
            onChange={(e) => setGroupTitle(e.target.value)}
          />
        </div>

        <div className="flex justify-start my-3 p-[10px] border rounded  items-center">
          <Label className="flex  cursor-pointer text-gray-500 font-normal ">
            Add a cover image
            <PaperclipIcon className="w-4 h-4 mx-2 cursor-pointer" />
            <input
              type="file"
              onChange={handleImageChange}
              className="hidden cursor-pointer"
            />
          </Label>
          <div>
            {selectedImage && (
              <span className="text-sm font-medium">{selectedImage.name}</span>
            )}
          </div>
        </div>

        <Button className="h-8 w-full " type="submit" disabled={isDisabled}>
          Submit
        </Button>
      </form>
    </div>
  );
}

export default NewDiscussion;
