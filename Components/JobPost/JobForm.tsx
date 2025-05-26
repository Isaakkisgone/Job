"use client";
import { useGlobalContext } from "@/context/globalContext";
import { useAuth } from "@/context/AuthContext";
import { createJob } from "@/lib/firestore";
import React, { useState } from "react";
import JobTitle from "./JobTitle";
import JobDetails from "./JobDetails";
import JobSkills from "./JobSkills ";
import JobLocation from "./JobLocation";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

function JobForm() {
  const {
    jobTitle,
    jobDescription,
    salaryType,
    activeEmploymentTypes,
    salary,
    location,
    skills,
    negotiable,
    tags,
    resetJobForm,
  } = useGlobalContext();

  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sections = ["Тухай", "Дэлгэрэнгүй", "Ур чадвар", "Хаяг"];
  const [currentSection, setCurrentSection] = React.useState(sections[0]);

  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
  };

  const renderStages = () => {
    switch (currentSection) {
      case "Тухай":
        return <JobTitle />;
      case "Дэлгэрэнгүй":
        return <JobDetails />;
      case "Ур чадвар":
        return <JobSkills />;
      case "Хаяг":
        return <JobLocation />;
    }
  };

  const getCompletedColor = (section: string) => {
    switch (section) {
      case "Тухай":
        return jobTitle && activeEmploymentTypes.length > 0
          ? "bg-[#7263F3] text-white"
          : "bg-gray-300";
      case "Дэлгэрэнгүй":
        return jobDescription && salary > 0
          ? "bg-[#7263F3] text-white"
          : "bg-gray-300";
      case "Ур чадвар":
        return skills.length && tags.length > 0
          ? "bg-[#7263F3] text-white"
          : "bg-gray-300";
      case "Хаяг":
        return location.address || location.city || location.country
          ? "bg-[#7263F3] text-white"
          : "bg-gray-300";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Нэвтэрч орно уу!");
      return;
    }

    // Validation
    if (!jobTitle || activeEmploymentTypes.length === 0) {
      toast.error("Ажлын нэр болон төрлийг бөглөнө үү!");
      setCurrentSection("Тухай");
      return;
    }

    if (!jobDescription || salary <= 0) {
      toast.error("Ажлын тайлбар болон цалингийн мэдээллийг бөглөнө үү!");
      setCurrentSection("Дэлгэрэнгүй");
      return;
    }

    if (skills.length === 0 || tags.length === 0) {
      toast.error("Шаардлагатай ур чадвар болон шошгыг нэмнэ үү!");
      setCurrentSection("Ур чадвар");
      return;
    }

    if (!location.address && !location.city && !location.country) {
      toast.error("Ажлын байрны хаягийг бөглөнө үү!");
      setCurrentSection("Хаяг");
      return;
    }

    setIsSubmitting(true);

    try {
      const jobData = {
        title: jobTitle,
        company: user.displayName || "Компани",
        location: `${location.address ? location.address + ", " : ""}${
          location.city ? location.city + ", " : ""
        }${location.country}`,
        salary: `${salary}${
          salaryType === "hourly"
            ? "/цаг"
            : salaryType === "monthly"
            ? "/сар"
            : "/жил"
        }${negotiable ? " (хэлэлцэх боломжтой)" : ""}`,
        description: jobDescription,
        requirements: skills,
        type: activeEmploymentTypes[0] as
          | "full-time"
          | "part-time"
          | "contract"
          | "temporary",
        category: tags[0] || "Бусад",
        postedBy: user.uid,
        isActive: true,
      };

      const jobId = await createJob(jobData);
      toast.success("Ажлын зар амжилттай нийтлэгдлээ!");
      resetJobForm();
      router.push(`/job/${jobId}`);
    } catch (error) {
      console.error("Error creating job:", error);
      toast.error("Ажлын зар нийтлэхэд алдаа гарлаа!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex gap-6">
      <div className="self-start w-[10rem] flex flex-col bg-white rounded-md shadow-sm overflow-hidden">
        {sections.map((section, index) => (
          <button
            key={index}
            className={`pl-4 py-3 relative flex self-start items-center gap-2 font-medium 
                ${
                  currentSection === section
                    ? "text-[#7263F3]"
                    : "text-gray-500"
                }
                `}
            onClick={() => handleSectionChange(section)}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center border border-gray-400/60 justify-center text-gray-500
                ${
                  currentSection === section ? " text-white" : ""
                } ${getCompletedColor(section)}`}
            >
              {index + 1}
            </span>
            {section}
            {currentSection === section && (
              <span className="w-1 h-full absolute left-0 top-0 bg-[#7263F3] rounded-full"></span>
            )}
          </button>
        ))}
      </div>

      <form
        className="p-6 flex-1 bg-white rounded-lg self-start"
        onSubmit={handleSubmit}
      >
        {renderStages()}

        <div className="flex justify-end gap-4 mt-4">
          {currentSection !== "Хаяг" && (
            <button
              type="button"
              className="px-6 py-2 bg-[#7263F3] text-white rounded-md hover:bg-[#5a4fd1] transition-colors"
              onClick={() => {
                const currentIndex = sections.indexOf(currentSection);
                setCurrentSection(sections[currentIndex + 1]);
              }}
            >
              Дараах
            </button>
          )}

          {currentSection === "Хаяг" && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="self-end px-6 py-2 bg-[#7263F3] text-white rounded-md hover:bg-[#5a4fd1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Нийтэлж байна..." : "Нийтлэх"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default JobForm;
