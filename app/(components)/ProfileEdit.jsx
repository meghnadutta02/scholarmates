"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Select from "react-select";
import { useSession } from "next-auth/react";
import { interests } from "../(data)/interests";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { departments } from "../(data)/department_list";
import { colleges } from "../(data)/college_list";
import { degrees } from "../(data)/degree_list";
import { FaInfoCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { format, subYears } from "date-fns";
import { HelpCircle } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";

const ProfileEdit = ({ user, setUser }) => {
  const [userState, setUserState] = useState(user);
  const { update } = useSession();

  const maxDate = format(subYears(new Date(), 11), "yyyy-MM-dd");
  const [selectedCategories, setSelectedCategories] = useState(
    user.interestCategories
  );
  const [selectedSubCategories, setSelectedSubCategories] = useState(
    user.interestSubcategories.map((subcategory) => ({
      label: subcategory,
      value: subcategory,
    }))
  );

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [date, setDate] = useState(user.dob ? new Date(user.dob) : "");
  const [formOpen, setFormOpen] = useState(true);
  const [subCategoryError, setSubCategoryError] = useState(false);
  const [minInterestError, setMinInterestError] = useState(false);

  const categories = interests.flatMap(
    (categoryObject) => Object.values(categoryObject)[0]
  );

  const categoryOptions = categories.map((category) => ({
    label: category,
    value: category,
  }));
  const degreesOptions = degrees.map((degree) => ({
    label: degree,
    value: degree,
  }));
  const departmentsOptions = departments.map((department) => ({
    label: department,
    value: department,
  }));
  const collegesOptions = colleges.map((college) => ({
    label: college,
    value: college,
  }));

  const handleChange = (field, value) => {
    setUserState((prevUser) => ({ ...prevUser, [field]: value }));
  };

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

  const handleSubcategoryChange = (selectedSubCategories) => {
    if (selectedSubCategories.length > 10) {
      setSubCategoryError(true);
      return;
    } else {
      setSubCategoryError(false);
    }

    setSelectedSubCategories(selectedSubCategories);

    if (selectedSubCategories.length < 3) {
      setMinInterestError(true);
    } else {
      setMinInterestError(false);
    }

    const newSelectedCategories = selectedSubCategories.map((subCategory) => {
      return interests.find((interest) =>
        interest.subcategories.includes(subCategory.value)
      ).category;
    });

    const uniqueSelectedCategories = [...new Set(newSelectedCategories)];

    const finalSelectedCategories = selectedCategories.filter((category) =>
      newSelectedCategories.includes(category)
    );

    setSelectedCategories([
      ...new Set([...uniqueSelectedCategories, ...finalSelectedCategories]),
    ]);
  };

  const handleCollegeChange = (selectedOption) => {
    handleChange("collegeName", selectedOption.value);
  };

  const handleDegreeChange = (selectedOption) => {
    handleChange("degree", selectedOption.value);
  };

  const handleDepartmentChange = (selectedOption) => {
    handleChange("department", selectedOption.value);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const interests = selectedSubCategories.map((option) => option.value);
    const categories = selectedCategories;
    let formData = {};

    if (categories.length > 0 && interests.length > 0) {
      formData = {
        ...userState,
        interestSubcategories: interests,
        dob: date ? date.toISOString() : null,
        interestCategories: categories,
      };
    } else {
      formData = {
        ...userState,
        interestSubcategories: [],
        interestCategories: [],
        dob: date ? date.toISOString() : null,
      };
    }

    const res = await fetch(`/api/users/profile`, {
      method: "PUT",
      body: JSON.stringify({ formData }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data.result);
      update(data.result);
      setFormOpen(false);
      toast.success("Profile updated successfully", {
        autoClose: 4000,
        closeOnClick: true,
      });
    } else {
      toast.error("Profile update failed", {
        autoClose: 4000,
        closeOnClick: true,
      });
    }
  };

  return (
    <>
      <form onSubmit={submitHandler} className={cn("grid items-start gap-4")}>
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={userState.name}
            required
            minLength="3"
            maxLength="35"
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label className="flex items-center gap-2" htmlFor="collegeName">
            College Name{" "}
            <Popover>
              <PopoverTrigger>
                <HelpCircle
                  size={16}
                  className="text-gray-500 hover:text-yellow-600"
                />
              </PopoverTrigger>
              <PopoverContent className="w-80">
                College name not on the list or having trouble finding it?{" "}
                <Link href="/contact" className="underline text-blue-500">
                  Drop us a message
                </Link>{" "}
                We got you covered.
              </PopoverContent>
            </Popover>
          </Label>
          <Select
            name="collegeName"
            options={collegesOptions}
            value={collegesOptions.find(
              (option) => option.value === userState.collegeName
            )}
            onChange={handleCollegeChange}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[4fr,6fr,2fr] gap-4 w-full">
          <div>
            <Label htmlFor="degree">Degree</Label>
            <Select
              name="degree"
              options={degreesOptions}
              value={degreesOptions.find(
                (option) => option.value === userState.degree
              )}
              onChange={handleDegreeChange}
            />
          </div>
          <div>
            <Label htmlFor="department">Department</Label>
            <Select
              name="department"
              options={departmentsOptions}
              value={departmentsOptions.find(
                (option) => option.value === userState.department
              )}
              onChange={handleDepartmentChange}
            />
          </div>

          <div>
            <Label htmlFor="yearInCollege">Year of study</Label>
            <Input
              id="yearInCollege"
              name="yearInCollege"
              value={userState.yearInCollege}
              type="number"
              min="1"
              max="5"
              onChange={(e) => {
                handleChange("yearInCollege", e.target.value);
              }}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            value={userState.bio}
            maxLength="35"
            onChange={(e) => handleChange("bio", e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <div className="w-1/2">
            <Label htmlFor="interests">Categories</Label>
            <Select
              name="interests"
              options={categoryOptions}
              value={selectedCategory}
              onChange={handleCategoryChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <input
              type="date"
              value={
                date && !isNaN(Date.parse(date))
                  ? new Date(date).toISOString().split("T")[0]
                  : ""
              }
              max={maxDate}
              className="w-full p-1 rounded-sm border border-gray-350"
              onChange={(e) => {
                const newDate = e.target.value
                  ? new Date(e.target.value)
                  : null;
                setDate(newDate);
              }}
            />
          </div>
        </div>
        <div className="flex items-center text-gray-400 text-sm italic font-semibold">
          <FaInfoCircle className="mr-2" />
          Select a category to choose interests
        </div>

        <div className="grid gap-2">
          <Label htmlFor="interests">Your interests</Label>
          {subCategoryError && (
            <div className="text-red-500 flex items-center mt-1 text-sm">
              <FaInfoCircle className="mr-1" />
              You can only select up to 10 interests
            </div>
          )}
          {minInterestError && (
            <div className="text-red-500 flex items-center mt-1 text-sm">
              <FaInfoCircle className="mr-1" />
              You need to select at least 3 interests
            </div>
          )}
          <Select
            isMulti
            name="interests"
            options={subCategoryOptions}
            value={selectedSubCategories}
            onChange={handleSubcategoryChange}
            placeholder="Select a category first"
          />
        </div>
        {formOpen ? (
          <Button type="submit" disabled={selectedSubCategories.length < 3}>
            Save changes
          </Button>
        ) : (
          <Button>Updated</Button>
        )}
      </form>
    </>
  );
};

export default ProfileEdit;
