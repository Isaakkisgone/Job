"use client";
import { useGlobalContext } from "@/context/globalContext";
import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

function JobLocation() {
  const { setLocation, location } = useGlobalContext();

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setLocation((prev: {}) => ({ ...prev, [name]: value }));
  };
localStorage.setItem("islogin", "1");
  return (
    <div className="p-6 flex flex-col gap-4 bg-background border border-border rounded-lg">
      <h3 className="text-lg font-semibold">Ажлын байршил</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex-1">
          <Label htmlFor="country" className="text-sm text-muted-foreground">
            Аймаг,Хот
          </Label>
          <Input
            type="text"
            id="Аймаг,Хот"
            name="Аймаг,Хот"
            value={location.country}
            onChange={handleLocationChange}
            className="flex-1 w-full mt-2"
            placeholder="Enter Country"
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="city" className="text-sm text-muted-foreground">
            Сум, Дүүрэг
          </Label>
          <Input
            type="text"
            id="Сум, Дүүрэг"
            name="Сум, Дүүрэг"
            value={location.city}
            onChange={handleLocationChange}
            className="flex-1 w-full mt-2"
            placeholder="Enter City"
          />
        </div>
      </div>

      <div className="flex-1">
        <Label htmlFor="address" className="text-sm text-muted-foreground">
          Хаяг, байршил
        </Label>
        <Input
          type="text"
          id="Хаяг, байршил"
          name="Хаяг, байршил"
          value={location.address}
          onChange={handleLocationChange}
          className="flex-1 w-full mt-2"
          placeholder="Enter Address"
        />
      </div>
    </div>
  );
}

export default JobLocation;
