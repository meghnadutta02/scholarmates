"use client";
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { interests } from "@/app/interests";

export default function DiscussionFilter() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [selectedType, setSelectedType] = useState([]);
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
  };
  const handleSubcategoryChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
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
      <aside className="px-2 pt-4 pb-12 z-46 h-screen overflow-y-auto fixed w-[23%] top-10 bg-gray-300 shadow-md">
        <h2 className="font-bold">View Discussions from My College</h2>
        <ul>
          <li>
            <input
              type="checkbox"
              id="college"
              name="college"
              value="college"
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
                          onChange={handleSubcategoryChange}
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
              onChange={handleTypeChange}
            />
            <label className="ml-2" htmlFor="support">
              Support
            </label>
          </li>
        </ul>
        <div className="flex justify-end gap-4 mt-4">
          <button className="bg-blue-400 hover:bg-blue-600 text-white transition ease-in-out font-bold py-1 px-4 rounded">
            Apply
          </button>
          <button className="bg-red-400 hover:bg-red-600 text-white transition ease-in-out font-bold py-1 px-4 rounded">
            Reset
          </button>
        </div>
      </aside>
    </section>
  );
}
