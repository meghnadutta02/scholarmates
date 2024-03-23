"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Select from "react-select";
import { interests } from "../interests";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FaInfoCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { format, subYears } from "date-fns";

const ProfileEdit = ({ user }) => {
  const [userState, setUser] = useState(user);
  const minDate = format(new Date(1975, 0, 1), "yyyy-MM-dd");
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
  const [date, setDate] = useState(new Date(user.dob));
  const [formOpen, setFormOpen] = useState(true);

  const categories = interests.flatMap(
    (categoryObject) => Object.values(categoryObject)[0]
  );

  const categoryOptions = categories.map((category) => ({
    label: category,
    value: category,
  }));

  const handleChange = (field, value) => {
    setUser((prevUser) => ({ ...prevUser, [field]: value }));
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
    const updatedSubCategories = [
      ...selectedSubCategories,
      ...selectedSubCategories.filter(
        (subcategory) =>
          !selectedSubCategories.some(
            (selected) => selected.value === subcategory.value
          )
      ),
    ];

    setSelectedSubCategories(updatedSubCategories);

    const newSelectedCategories = updatedSubCategories.map((subCategory) => {
      return interests.find((interest) =>
        interest.subcategories.includes(subCategory.value)
      ).category;
    });

    const uniqueSelectedCategories = [
      ...new Set([...selectedCategories, ...newSelectedCategories]),
    ];

    setSelectedCategories(uniqueSelectedCategories);
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
        dob: date,
        interestCategories: categories,
      };
    } else {
      formData = {
        ...userState,

        dob: date,
      };
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`,
      {
        method: "PUT",
        body: JSON.stringify({ formData }),
        headers: { "Content-Type": "application/json" },
      }
    );
    if (res.ok) {
      setFormOpen(false);
      toast.success("Profile updated successfully");
      window.location.reload();
    } else {
      toast.error("Profile update failed");
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
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="collegeName">College Name</Label>
          <Input
            id="collegeName"
            name="collegeName"
            value={userState.collegeName}
            onChange={(e) => handleChange("collegeName", e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <div>
            <Label htmlFor="degree">Degree</Label>
            <Input
              id="degree"
              name="degree"
              value={userState.degree}
              onChange={(e) => handleChange("degree", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              name="department"
              value={userState.department}
              onChange={(e) => handleChange("department", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="yearInCollege">Year</Label>
            <Input
              id="yearInCollege"
              name="yearInCollege"
              value={userState.yearInCollege}
              onChange={(e) => handleChange("yearInCollege", e.target.value)}
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            as="textarea"
            id="bio"
            name="bio"
            value={userState.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <div className="w-1/2">
            <Label htmlFor="interests">Categories</Label>
            <Select
              name="interests"
              options={categoryOptions}
              className="basic-multi-select"
              classNamePrefix="select"
              defaultValue={userState.interests}
              value={selectedCategory}
              onChange={handleCategoryChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <input
              type="date"
              value={date.toISOString().split("T")[0]}
              min={minDate}
              max={maxDate}
              className="w-full p-1 rounded-sm border border-gray-350"
              onChange={(e) => setDate(new Date(e.target.value))}
            />
          </div>
        </div>
        <div className="flex items-center text-gray-400 text-sm italic font-semibold">
          <FaInfoCircle className="mr-2" />
          Select a category to choose interests
        </div>

        <div className="grid gap-2">
          <Label htmlFor="interests">Your interests</Label>
          <Select
            isMulti
            name="interests"
            options={subCategoryOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            defaultValue={userState.interests}
            value={selectedSubCategories}
            onChange={handleSubcategoryChange}
            placeholder="Select a category first"
          />
        </div>
        {formOpen ? (
          <Button type="submit">Save changes</Button>
        ) : (
          <Button>Updated</Button>
        )}
      </form>
    </>
  );
};

export default ProfileEdit;
