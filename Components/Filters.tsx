"use client";
import React from "react";
import { Button } from "./ui/button";
import { useJobsContext } from "@/context/jobsContext";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import formatMoney from "@/utils/formatMoney";

function Filters() {
  const {
    handleFilterChange,
    filters,
    setFilters,
    minSalary,
    maxSalary,
    setMinSalary,
    setMaxSalary,
    searchJobs,
    setSearchQuery,
  } = useJobsContext();

  const clearAllFilters = () => {
    setFilters({
      fullTime: false,
      partTime: false,
      contract: false,
      internship: false,
      graphicDesigner: false,
      tradeconsultant: false,
      chef: false,
      Waiter: false,
    });

    setSearchQuery({ tags: "", location: "", title: "" });
  };

  const handleMinSalaryChange = (value: number[]) => {
    setMinSalary(value[0]);
    if (value[0] > maxSalary) {
      setMaxSalary(value[0]);
    }
  };

  const handleMaxSalaryChange = (value: number[]) => {
    setMaxSalary(value[0]);
    if (value[0] < minSalary) {
      setMinSalary(value[0]);
    }
  };

  return (
    <div className="w-[22rem] pr-4 space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold mb-4">Job Type</h2>

          <Button
            variant={"ghost"}
            className="h-auto p-0 text-red-500 hover:text-red-700"
            onClick={() => {
              clearAllFilters();
              searchJobs();
            }}
          >
            Устгах
          </Button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="fullTime"
              checked={filters.fullTime}
              onCheckedChange={() => handleFilterChange("fullTime")}
            />
            <Label htmlFor="fullTime">Бүтэн цагийн</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="partTime"
              checked={filters.partTime}
              onCheckedChange={() => handleFilterChange("partTime")}
            />
            <Label htmlFor="partTime">Цагийн ажил</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="contract"
              checked={filters.contract}
              onCheckedChange={() => handleFilterChange("contract")}
            />
            <Label htmlFor="contract">Гэрээт ажил</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="internship"
              checked={filters.internship}
              onCheckedChange={() => handleFilterChange("internship")}
            />
            <Label htmlFor="internship">Дадлага</Label>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Tags</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="graphicDesigner"
              checked={filters.graphicDesigner}
              onCheckedChange={() => handleFilterChange("graphicDesigner")}
            />
            <Label htmlFor="graphicDesigner">График дизайнер</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="tradeconsultant"
              checked={filters.tradeconsultant}
              onCheckedChange={() => handleFilterChange("tradeconsultant")}
            />
            <Label htmlFor="tradeconsultant">Худалдааны зөвлөх</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="chef"
              checked={filters.chef}
              onCheckedChange={() => handleFilterChange("chef")}
            />
            <Label htmlFor="chef">Тогооч</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="Waiter"
              checked={filters.Waiter}
              onCheckedChange={() => handleFilterChange("Waiter")}
            />
            <Label htmlFor="Waiter">Зөөгч</Label>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Цалингийн хэмжээ</h2>
        <div className="flex flex-col gap-4">
          <Label htmlFor="minSalary">Бага хэмжээ</Label>
          <Slider
            id="minSalary"
            min={0}
            max={200000}
            step={50}
            value={[minSalary]}
            onValueChange={handleMinSalaryChange}
            className="w-full"
          />
          <span className="text-sm text-gray-500">
            {formatMoney(minSalary, "GBP")}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Label htmlFor="maxSalary">Их хэмжээ</Label>
        <Slider
          id="maxSalary"
          min={0}
          max={200000}
          step={50}
          value={[maxSalary]}
          onValueChange={handleMaxSalaryChange}
          className="w-full"
        />
        <span className="text-sm text-gray-500">
          {formatMoney(maxSalary, "GBP")}
        </span>
      </div>
    </div>
  );
}

export default Filters;
