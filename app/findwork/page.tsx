"use client";
import Filters from "@/Components/Filters";
import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import JobCard from "@/Components/JobItem/JobCard";
import SearchForm from "@/Components/SearchForm";
import { getAllJobs, searchJobs, Job } from "@/lib/firestore";
import { grip, list, table } from "@/utils/Icons";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function FindWorkPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState(3);
  const [filters, setFilters] = useState({
    fullTime: false,
    partTime: false,
    contract: false,
    temporary: false,
  });

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        let fetchedJobs: Job[];

        if (searchQuery) {
          fetchedJobs = await searchJobs(searchQuery);
        } else {
          fetchedJobs = await getAllJobs();
        }

        setJobs(fetchedJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchQuery]);

  // cycle through 1, 2, 3 columns
  const toggleGridColumns = () => {
    setColumns((prev) => (prev === 3 ? 2 : prev === 2 ? 1 : 3));
  };

  const getIcon = () => {
    if (columns === 3) return grip;
    if (columns === 2) return table;
    return list;
  };

  const filteredJobs = jobs.filter((job: Job) => {
    if (
      !filters.fullTime &&
      !filters.partTime &&
      !filters.contract &&
      !filters.temporary
    ) {
      return true; // Show all if no filters selected
    }

    if (filters.fullTime && job.type === "full-time") return true;
    if (filters.partTime && job.type === "part-time") return true;
    if (filters.contract && job.type === "contract") return true;
    if (filters.temporary && job.type === "temporary") return true;

    return false;
  });

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
          <h2 className="text-3xl font-bold text-black py-8">
            {searchQuery
              ? `"${searchQuery}" хайлтын илэрц`
              : "Сүүлд нэмэгдсэн ажлын байр"}
            {!loading && ` (${filteredJobs.length})`}
          </h2>

          <button
            onClick={toggleGridColumns}
            className="flex items-center gap-4 border border-gray-400 px-8 py-2 rounded-full font-medium hover:bg-gray-50 transition-colors"
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
          <div className="w-64 self-start">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-4">Шүүлтүүр</h3>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Ажлын төрөл</h4>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.fullTime}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        fullTime: e.target.checked,
                      }))
                    }
                    className="rounded"
                  />
                  <span>Бүтэн цагийн</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.partTime}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        partTime: e.target.checked,
                      }))
                    }
                    className="rounded"
                  />
                  <span>Цагийн ажил</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.contract}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        contract: e.target.checked,
                      }))
                    }
                    className="rounded"
                  />
                  <span>Гэрээт ажилтан</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.temporary}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        temporary: e.target.checked,
                      }))
                    }
                    className="rounded"
                  />
                  <span>Түр зуурын</span>
                </label>
              </div>
            </div>
          </div>

          <div
            className={`self-start flex-1 grid gap-8 ${
              columns === 3
                ? "grid-cols-3"
                : columns === 2
                ? "grid-cols-2"
                : "grid-cols-1"
            }`}
          >
            {loading ? (
              <div className="col-span-full flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7263f3] mx-auto"></div>
                  <p className="mt-4 text-gray-600">Ачааллаж байна...</p>
                </div>
              </div>
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map((job: Job) => <JobCard key={job.id} job={job} />)
            ) : (
              <div className="col-span-full mt-1 flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-600">
                    Илэрц олдсонгүй!
                  </p>
                  <p className="text-gray-500 mt-2">
                    {searchQuery
                      ? "Өөр түлхүүр үгээр хайж үзнэ үү"
                      : "Одоогоор ажлын зар байхгүй байна"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default FindWorkPage;
