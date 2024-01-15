"use client";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Select from "react-select";
import { interests } from "../interests";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import DatePicker from "react-date-picker";

const ProfileEdit = ({ user, fetchData }) => {
  const [userState, setUser] = useState(user);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [date, setDate] = useState(new Date(user.dob));
  const [formOpen, setFormOpen] = useState(true);

  const categories = interests.flatMap(
    (categoryObject) => Object.values(categoryObject)[0]
  );
  // const subcategories = interests.flatMap(
  //   (categoryObject) => Object.values(categoryObject)[1]
  // );

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
    setSelectedSubCategories(selectedSubCategories);

    const newSelectedCategories = selectedSubCategories.map((subCategory) => {
      return interests.find((interest) =>
        interest.subcategories.includes(subCategory.value)
      ).category;
    });
    const uniqueSelectedCategories = [...new Set(newSelectedCategories)];

    setSelectedCategories(uniqueSelectedCategories);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const interests = selectedSubCategories.map((option) => option.value);
    const categories = selectedCategories;
    const formData = { ...userState, categories, interests, dob: date };

    console.log(formData);

    await fetch("/api/users/profile", {
      method: "POST",
      body: JSON.stringify({ formData }),
      headers: { "Content-Type": "application/json" },
    });
    // window.location.reload();
  };

  return (
    <>
      <form onSubmit={submitHandler} className={cn("grid items-start gap-4")}>
        {/* <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={user.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div> */}
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
            <DatePicker onChange={setDate} value={date} />
          </div>
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
          />
        </div>
        <Button type="submit">Save changes</Button>
      </form>
    </>
  );
};

export default ProfileEdit;
