"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaInfoCircle } from "react-icons/fa";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import Select from "react-select";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { interests } from "../(data)/interests";
import { PaperclipIcon } from "lucide-react";

const EditDiscussion = ({ discussion, setDiscussion }) => {
  let formData = new FormData();
  const [isDisabled, setIsDisabled] = useState(false);
  const [subCategoryError, setSubCategoryError] = useState(false);
  const [title, setTitle] = useState(discussion.title || "");
  const [content, setContent] = useState(discussion.content || "");
  const [type, setType] = useState(discussion.type || "");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);

  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const initialCategory = interests.find((interest) =>
      interest.subcategories.includes(discussion.subcategories[0])
    );

    if (initialCategory) {
      setSelectedCategory({
        label: initialCategory.category,
        value: initialCategory.category,
      });

      const newSubcategoryOptions = initialCategory.subcategories.map(
        (subcategory) => ({
          label: subcategory,
          value: subcategory,
        })
      );

      setSubCategoryOptions(newSubcategoryOptions);
      const initialSubCategories = discussion.subcategories.map((sub) => ({
        label: sub,
        value: sub,
      }));

      setSelectedSubCategories(initialSubCategories);
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

    if (
      !title ||
      !content ||
      !type ||
      !selectedCategory ||
      !selectedSubCategories.length
    ) {
      return toast.error("Please fill out all fields");
    }
    const toastId = toast.loading("Updating discussion...");

    formData.append("title", title);
    formData.append("content", content);
    formData.append("type", type);
    formData.append("coverImage", selectedImage);
    selectedSubCategories.forEach((subcategory) => {
      formData.append("subcategories", subcategory.value);
    });

    try {
      const result = await fetch(`/api/discussion/${discussion._id}`, {
        method: "PUT",
        body: formData,
      });

      if (result.ok) {
        const updatedDiscussion = await result.json();
        delete updatedDiscussion.result.creator;
        setDiscussion((prevDiscussion) => ({
          ...prevDiscussion,
          ...updatedDiscussion.result,
        }));

        toast.update(toastId, {
          render: "Discussion updated! Go to chat room.",
          type: "success",
          isLoading: false,
          autoClose: 4000,
        });
      }
    } catch (error) {
      toast.update(toastId, {
        render: "Error updating discussion",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
      console.error("Error updating discussion:", error);
    }

    setSelectedImage("");
    setTitle("");
    setType("");
    setIsDisabled(false);

    setSelectedCategories([]);
    setSelectedSubCategories([]);
    setSelectedCategory(null);
    setContent("");

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
          {subCategoryError && (
            <div className="text-red-500 flex items-center mt-2 text-sm">
              <FaInfoCircle className="mr-1" />
              You can only select up to 10 subcategories
            </div>
          )}
        </div>

        <div className="flex justify-start my-3 p-[10px] border rounded items-center">
          <Label className="flex cursor-pointer text-gray-500 font-normal">
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

        <Button className="h-8 w-full" type="submit" disabled={isDisabled}>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default EditDiscussion;
