"use client";
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { interests } from "@/app/interests";
import { Button } from "@/components/ui/button";
import "./filter.css";
export default function DiscussionFilter({ applyFilters }) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [college, setCollege] = useState(false);
  const [selectedType, setSelectedType] = useState([]);
  const applyFilters1 = () => {
    const filters = {
      category: selectedCategories,
      subcategory: selectedSubcategories,
      college: college,
      type: selectedType,
    };
    applyFilters(filters);
  };
  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedType([]);
    setCollege(false);
    setSelectedSubcategories([]);
    applyFilters({
      category: [],
      subcategory: [],
      college: false,
      type: [],
    });
  };
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedCategories((prevSelectedCategories) => [
        ...prevSelectedCategories,
        value,
      ]);
    } else {
      setSelectedCategories((prevSelectedCategories) =>
        prevSelectedCategories.filter((category) => category !== value)
      );
      setExpandedCategory(null);
    }
  };
  const handleTypeChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedType((prevSelectedType) => [...prevSelectedType, value]);
    } else {
      setSelectedType((prevSelectedType) =>
        prevSelectedType.filter((type) => type !== value)
      );
    }
  };
  const handleSubcategoryChange = (event, category) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedCategories((prev) =>
        prev.filter((value) => value != category)
      );
      setSelectedSubcategories((prevSelectedCategories) => [
        ...prevSelectedCategories,
        value,
      ]);
    } else {
      setSelectedSubcategories((prevSelectedCategories) =>
        prevSelectedCategories.filter((category) => category !== value)
      );
    }
  };

  const toggleSubcategories = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
    <section className="flex">
      <aside className=" pl-4 pt-4 pb-16 z-46 overflow-y-auto fixed w-[23%] top-0 right-0 bottom-0 bg-gray-100 dark:bg-gray-800 shadow-md z-50 text-gray-600 dark:text-white text-md ">
        <h2 className="font-bold">View Discussions from My College</h2>
        <ul>
          <li>
            <input
              type="checkbox"
              id="college"
              name="college"
              checked={college}
              onChange={(e) => setCollege(true)}
            />
            <label className="ml-2" htmlFor="college">
              Yes
            </label>
          </li>
        </ul>
        <h2 className="font-bold mt-3">Filter by category</h2>
        <ul>
          {interests.map((interest, index) => (
            <li key={index}>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={interest.category}
                  name={interest.category}
                  value={interest.category}
                  checked={selectedCategories.includes(interest.category)}
                  onChange={handleCategoryChange}
                />
                <label className="ml-2" htmlFor={interest.category}>
                  {interest.category}
                </label>
                {selectedCategories.includes(interest.category) && (
                  <button
                    onClick={() => toggleSubcategories(interest.category)}
                  >
                    {expandedCategory === interest.category ? (
                      <FaChevronUp className="ml-2 h-3 w-3" />
                    ) : (
                      <FaChevronDown className="ml-2 h-3 w-3" />
                    )}
                  </button>
                )}
              </div>
              {expandedCategory === interest.category && (
                <div className="ml-4">
                  <ul>
                    {interest.subcategories.map((subcategory, subIndex) => (
                      <li key={subIndex}>
                        <input
                          type="checkbox"
                          id={`${interest.category}-${subIndex}`}
                          name={subcategory}
                          value={subcategory}
                          checked={selectedSubcategories.includes(subcategory)}
                          onChange={(e) =>
                            handleSubcategoryChange(e, interest.category)
                          }
                        />
                        <label
                          className="ml-2"
                          htmlFor={`${interest.category}-${subIndex}`}
                        >
                          {subcategory}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>

        <h2 className="font-bold mt-3">Filter by type</h2>
        <ul>
          <li>
            <input
              type="checkbox"
              id="general"
              name="type"
              value="general"
              checked={selectedType.includes("general")}
              onChange={handleTypeChange}
            />
            <label className="ml-2" htmlFor="general">
              General
            </label>
          </li>
          <li>
            <input
              type="checkbox"
              id="urgent"
              name="type"
              value="urgent"
              checked={selectedType.includes("urgent")}
              onChange={handleTypeChange}
            />
            <label className="ml-2" htmlFor="urgent">
              Urgent
            </label>
          </li>
          <li>
            <input
              type="checkbox"
              id="announcement"
              name="type"
              value="announcement"
              checked={selectedType.includes("announcement")}
              onChange={handleTypeChange}
            />
            <label className="ml-2" htmlFor="announcement">
              Announcement
            </label>
          </li>
          <li>
            <input
              type="checkbox"
              id="collaboration"
              name="type"
              value="collaboration"
              checked={selectedType.includes("collaboration")}
              onChange={handleTypeChange}
            />
            <label className="ml-2" htmlFor="collaboration">
              Collaboration
            </label>
          </li>
          <li>
            <input
              type="checkbox"
              id="event"
              name="type"
              value="event"
              checked={selectedType.includes("event")}
              onChange={handleTypeChange}
            />
            <label className="ml-2" htmlFor="event">
              Event
            </label>
          </li>
          <li>
            <input
              type="checkbox"
              id="support"
              name="type"
              value="support"
              checked={selectedType.includes("support")}
              onChange={handleTypeChange}
            />
            <label className="ml-2" htmlFor="support">
              Support
            </label>
          </li>
        </ul>
        <div className="flex justify-end gap-4 pr-4">
          <Button
            variant=""
            className="font-bold py-1 px-4 "
            onClick={applyFilters1}
          >
            Apply
          </Button>
          <Button
            variant="destructive"
            className="font-bold py-1 px-4 rounded"
            onClick={resetFilters}
          >
            Reset
          </Button>
        </div>
      </aside>
    </section>
  );
}
