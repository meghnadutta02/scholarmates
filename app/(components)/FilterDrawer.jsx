"use client";

import { useState } from "react";
import { Drawer } from "vaul";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaFilter } from "react-icons/fa6";
import { interests } from "@/app/interests";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CaretSortIcon } from "@radix-ui/react-icons";

const FilterDrawer = ({ applyFilters }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [college, setCollege] = useState(false);
  const [selectedType, setSelectedType] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);

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
        prev.filter((value) => value !== category)
      );
      setSelectedSubcategories((prevSelectedSubcategories) => [
        ...prevSelectedSubcategories,
        value,
      ]);
    } else {
      setSelectedSubcategories((prevSelectedSubcategories) =>
        prevSelectedSubcategories.filter((category) => category !== value)
      );
    }
  };

  const toggleSubcategories = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
    <Drawer.Root direction="left">
      <Drawer.Trigger asChild>
        <button className="flex items-center">
          <FaFilter className="mr-1" />
          Filter
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="rounded-se-lg bg-zinc-700 dark:bg-gray-800 flex flex-col h-full max-w-[90%] w-[380px] md:w-[380px] fixed bottom-0 left-0 overflow-y-scroll scrollbar pb-5 mt-24 z-50 scrollbar-thumb-gray-400 scrollbar-thumb-rounded-full shadow-inner">
          <div className="p-4 rounded-se-lg bg-zinc-700  dark:bg-gray-800 flex-1 h-full font-sans">
            <div className="max-w-lg mx-auto">
              <section className="flex">
                <aside className="text-gray-200 dark:text-white text-md w-full">
                  <h2 className="font-semibold text-xl ">My College</h2>
                  <ul className="border-b-2 border-gray-200 pb-[10px] ">
                    <li>
                      <input
                        type="checkbox"
                        id="college"
                        name="college"
                        checked={college}
                        onChange={(e) => setCollege(e.target.checked)}
                      />
                      <label className="ml-2" htmlFor="college">
                        Yes
                      </label>
                    </li>
                  </ul>

                  <Collapsible className="border-b-2 border-gray-200 pb-[8px]">
                    <div className="flex my-2 items-center justify-between">
                      <h2 className="text-xl font-semibold">Categories</h2>
                      <CollapsibleTrigger asChild>
                        <CaretSortIcon className="h-8 w-8 ml-4 hover:bg-slate-600 hover:rounded-full p-1" />
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent>
                      <ul>
                        {interests.map((interest, index) => (
                          <li key={index}>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id={interest.category}
                                name={interest.category}
                                value={interest.category}
                                checked={selectedCategories.includes(
                                  interest.category
                                )}
                                onChange={handleCategoryChange}
                                className="h-4 w-4 "
                              />
                              <label
                                className="ml-2"
                                htmlFor={interest.category}
                              >
                                {interest.category}
                              </label>
                              {selectedCategories.includes(
                                interest.category
                              ) && (
                                <button
                                  onClick={() =>
                                    toggleSubcategories(interest.category)
                                  }
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
                                <ul className="grid grid-cols-2 w-fit">
                                  {interest.subcategories.map(
                                    (subcategory, subIndex) => (
                                      <li key={subIndex} className="flex gap-2">
                                        <div className="checkbox-wrapper-26">
                                          <input
                                            type="checkbox"
                                            id={`${interest.category}-${subIndex}`}
                                            name={subcategory}
                                            value={subcategory}
                                            checked={selectedSubcategories.includes(
                                              subcategory
                                            )}
                                            onChange={(e) =>
                                              handleSubcategoryChange(
                                                e,
                                                interest.category
                                              )
                                            }
                                          />
                                          <label
                                            for={`${interest.category}-${subIndex}`}
                                          >
                                            <div class="tick_mark"></div>
                                          </label>
                                        </div>
                                        <div className="">
                                          <label
                                            htmlFor={`${interest.category}-${subIndex}`}
                                          >
                                            {subcategory}
                                          </label>
                                        </div>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </CollapsibleContent>
                  </Collapsible>

                  <Collapsible className="border-b-2 border-gray-200 pb-[8px]">
                    <div className="flex my-2 items-center justify-between">
                      <h2 className="text-xl font-semibold">Type</h2>
                      <CollapsibleTrigger asChild>
                        <CaretSortIcon className="h-8 w-8 ml-4 hover:bg-slate-600 hover:rounded-full p-1" />
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent>
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
                    </CollapsibleContent>
                  </Collapsible>

                  <div className="flex justify-center gap-4 my-5">
                    <Drawer.Close asChild>
                      <Button
                        variant=""
                        className="font-semibold py-1 px-4"
                        onClick={applyFilters1}
                      >
                        Apply
                      </Button>
                    </Drawer.Close>
                    <Drawer.Close asChild>
                      <Button
                        variant="destructive"
                        className="font-semibold py-1 px-4 rounded"
                        onClick={resetFilters}
                      >
                        Reset
                      </Button>
                    </Drawer.Close>
                  </div>
                </aside>
              </section>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default FilterDrawer;
