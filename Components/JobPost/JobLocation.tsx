"use client";
import { useGlobalContext } from "@/context/globalContext";
import React, { useEffect } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

function JobLocation() {
  const { setLocation, location } = useGlobalContext();

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocation((prev: any) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    localStorage.setItem("islogin", "1");
  }, []);

  return (
    <div className="p-6 flex flex-col gap-4 bg-background border border-border rounded-lg">
      <h3 className="text-lg font-semibold">Ажлын байршил</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex-1">
          <Label htmlFor="country" className="text-sm text-muted-foreground">
            Аймаг, Хот
          </Label>
          <Input
            type="text"
            id="country"
            name="country"
            value={location.country}
            onChange={handleLocationChange}
            className="flex-1 w-full mt-2"
            placeholder="Аймаг, Хот"
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="city" className="text-sm text-muted-foreground">
            Сум, Дүүрэг
          </Label>
          <Input
            type="text"
            id="city"
            name="city"
            value={location.city}
            onChange={handleLocationChange}
            className="flex-1 w-full mt-2"
            placeholder="Сум, Дүүрэг"
          />
        </div>
      </div>

      <div className="flex-1">
        <Label htmlFor="address" className="text-sm text-muted-foreground">
          Хаяг, байршил
        </Label>
        <Input
          type="text"
          id="address"
          name="address"
          value={location.address}
          onChange={handleLocationChange}
          className="flex-1 w-full mt-2"
          placeholder="Хаяг, байршил"
        />
      </div>
    </div>
  );
}

export default JobLocation;
