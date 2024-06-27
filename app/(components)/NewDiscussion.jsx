import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from 'next/navigation'

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
import { interests } from "../interests";
import { PaperclipIcon } from "lucide-react";

function NewDiscussion({ discussion, onSave }) {
  const router = useRouter()
  let formData = new FormData();
  const [isDisabled, setIsDisabled] = useState(false);
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

  useEffect(() => {
    if (discussion) {
      setTitle(discussion.title);
      setGroupTitle(discussion.groupTitle);
      setContent(discussion.content);
      setType(discussion.type);
      setPrivacy(discussion.privacy);
      setSelectedImage(discussion.coverImage)
      // Set selected category and subcategories
      const selectedCategory = categoryOptions.find(
        (category) => category.value === discussion.category
      );
      setSelectedCategory(selectedCategory);
      handleCategoryChange(selectedCategory);
      const selectedSubCategories = discussion.subcategories.map((subcategory) => ({
        label: subcategory,
        value: subcategory,
      }));
      setSelectedSubCategories(selectedSubCategories);
    }
  }, [discussion]);

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
      interests.find((interest) => interest.category === selectedCategory?.value)
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
    setSelectedImage(event.target.files?.[0]);
  };

  const handleSubCategoryChange = (selectedSubCategories) => {
    setSelectedSubCategories(selectedSubCategories);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setIsDisabled(true);
    const toastId = toast.loading(discussion ? "Updating discussion..." : "Creating discussion...");

    formData.append("groupTitle", groupTitle);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("type", type);
    formData.append("privacy", privacy);
    formData.append("coverImage", selectedImage);
    if (
      !title ||
      !content ||
      !type ||
      !selectedCategory ||
      !selectedSubCategories.length
    ) {
      return toast.error("Please fill out all fields");
    }
    if (!selectedCategory) {
      return toast.error("Please select a category");
    }
    selectedSubCategories.forEach((subcategory) => {
      formData.append("subcategories", subcategory.value);
    });

    try {
      const apiUrl = discussion
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/mydiscussion?id=${discussion._id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/discussion`;
      const result = await fetch(apiUrl,
        {
          method: discussion ? "PUT" : "POST",
          body: formData,
        }
      );

      if (result.ok) {
        toast.update(toastId, {
          render: discussion ? "Discussion updated!" : "Discussion created! Go to chat room.",
          type: "success",
          isLoading: false,
          autoClose: 4000,
        });
        router.push('/mydiscussion');
        if (onSave) onSave();
      }
    } catch (error) {
      console.error("Error uploading discussion:", error);
      toast.update(toastId, {
        render: discussion ? "Error updating discussion" : "Error creating discussion",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    }

    setSelectedImage("");
    setTitle("");
    setType("");
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
            maxLength={50}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="my-3">
          <Textarea
            placeholder="Write a description"
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
