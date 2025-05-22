"use client";
import Filters from "@/Components/Filters";
import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import JobCard from "@/Components/JobItem/JobCard";
import SearchForm from "@/Components/SearchForm";
import { useJobsContext } from "@/context/jobsContext";
import { Job } from "@/types/types";
import { grip, list, table } from "@/utils/Icons";
import Image from "next/image";
import React from "react";

function page() {
  const { jobs, filters } = useJobsContext();
  const [columns, setColumns] = React.useState(3);

  // cycle through 1, 2, 3 columns
  const toggleGridColumns = () => {
    setColumns((prev) => (prev === 3 ? 2 : prev === 2 ? 1 : 3));
  };

  const getIcon = () => {
    if (columns === 3) return grip;
    if (columns === 2) return table;
    return list;
  };

  const filetredJobs =
    filters.fullTime || filters.partTime || filters.contract || filters.internet
      ? jobs.filter((job: Job) => {
          if (filters.fullTime && job.jobType.includes("Бүтэн цагийн"))
            return true;
          if (filters.partTime && job.jobType.includes("Цагийн ажил"))
            return true;
          if (filters.contract && job.jobType.includes("Гэрээт ажилтан")) return true;
          if (filters.internship && job.jobType.includes("Дадлага"))
            return true;

          if (filters.graphicDesigner && job.tags.includes("TraphicDesigner")) return true;
          if (filters.tradeconsultant && job.tags.includes("Tradeconsultant")) return true;
          if (filters.chef && job.tags.includes("Chef")) return true;
          if (filters.Waiter && job.tags.includes("Waiter")) return true;
        })
      : jobs;

  return (
    <main>
      <Header />

      <div className="relative px-16 bg-[#D7DEDC] overflow-hidden">
        <h1 className="py-8 text-black font-bold text-3xl">
          Өөрт тохирох ажлыг эндээс
        </h1>

        <div className="pb-8 relative z-10">
          <SearchForm />
        </div>

        <Image
          src="/woman-on-phone.jpg"
          alt="hero"
          width={200}
          height={500}
          className="clip-path w-[15rem] absolute z-0 top-[0] right-[10rem] h-full object-cover"
        />

        <Image
          src="/team.jpg"
          alt="hero"
          width={200}
          height={500}
          className="clip-path-2 rotate-6 w-[15rem] absolute z-0 top-[0] right-[32rem] h-full object-cover"
        />
      </div>

      <div className="w-[90%] mx-auto mb-14">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-black py-8">Сүүлд нэмэгдсэн ажлын байр</h2>

          <button
            onClick={toggleGridColumns}
            className="flex items-center gap-4 border border-gray-400 px-8 py-2 rounded-full font-medium"
          >
            <span>
              {columns === 3
                ? "Сүлжээ хүснэгт"
                : columns === 2
                ? "Хүснэгт"
                : "Жагсаалт"}
            </span>
            <span className="text-lg">{getIcon()}</span>
          </button>
        </div>

        <div className="flex gap-8">
          <Filters />

          <div
            className={`self-start flex-1 grid gap-8 ${
              columns === 3
                ? "grid-cols-3"
                : columns === 2
                ? "grid-cols-2"
                : "grid-cols-1"
            }`}
          >
            {jobs.length > 0 ? (
              filetredJobs.map((job: Job) => (
                <JobCard key={job._id} job={job} />
              ))
            ) : (
              <div className="mt-1 flex items-center">
                <p className="text-2xl font-bold">Илэрц олдсонгүй!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default page;
