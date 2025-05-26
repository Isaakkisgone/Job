"use client";
import { useAuth } from "@/context/AuthContext";
import { Job } from "@/lib/firestore";
import { Calendar, MapPin, Building } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Separator } from "../ui/separator";
import { bookmark, bookmarkEmpty } from "@/utils/Icons";
import { Timestamp } from "firebase/firestore";

interface JobProps {
  job: Job;
  activeJob?: boolean;
}

function JobCard({ job, activeJob }: JobProps) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const router = useRouter();

  const {
    id,
    title,
    company,
    location,
    salary,
    description,
    type,
    category,
    postedAt,
  } = job;

  const handleLike = () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    setIsLiked((prev) => !prev);
    // TODO: Implement save/unsave job functionality
  };

  const jobTypeBg = (type: string) => {
    switch (type) {
      case "full-time":
        return "bg-green-500/20 text-green-600";
      case "part-time":
        return "bg-purple-500/20 text-purple-600";
      case "contract":
        return "bg-red-500/20 text-red-600";
      case "temporary":
        return "bg-indigo-500/20 text-indigo-600";
      default:
        return "bg-gray-500/20 text-gray-600";
    }
  };

  const getJobTypeLabel = (type: string) => {
    switch (type) {
      case "full-time":
        return "Бүтэн цагийн";
      case "part-time":
        return "Цагийн ажил";
      case "contract":
        return "Гэрээт ажил";
      case "temporary":
        return "Түр зуурын";
      default:
        return type;
    }
  };

  const formatDate = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Өчигдөр";
    if (diffDays < 7) return `${diffDays} хоногийн өмнө`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} долоо хоногийн өмнө`;
    return date.toLocaleDateString("mn-MN");
  };

  return (
    <div
      className={`p-6 rounded-xl flex flex-col gap-4 cursor-pointer transition-all hover:shadow-lg
        ${
          activeJob
            ? "bg-gray-50 shadow-md border-b-2 border-[#7263f3]"
            : "bg-white shadow-sm border border-gray-100"
        }`}
      onClick={() => router.push(`/job/${id}`)}
    >
      <div className="flex justify-between items-start">
        <div className="flex gap-3 items-start flex-1">
          <div className="w-12 h-12 bg-[#7263f3]/10 rounded-lg flex items-center justify-center">
            <Building className="w-6 h-6 text-[#7263f3]" />
          </div>

          <div className="flex flex-col gap-1 flex-1">
            <h4 className="font-bold text-lg hover:text-[#7263f3] transition-colors line-clamp-2">
              {title}
            </h4>
            <p className="text-sm text-gray-600 font-medium">{company}</p>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
          </div>
        </div>

        <button
          className={`text-xl ${
            isLiked ? "text-[#7263f3]" : "text-gray-400"
          } hover:scale-110 transition-transform`}
          onClick={(e) => {
            e.stopPropagation();
            handleLike();
          }}
        >
          {isLiked ? bookmark : bookmarkEmpty}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`py-1 px-3 text-xs font-medium rounded-full ${jobTypeBg(
            type
          )}`}
        >
          {getJobTypeLabel(type)}
        </span>
        {category && (
          <span className="py-1 px-3 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
            {category}
          </span>
        )}
      </div>

      <p className="text-sm text-gray-600 line-clamp-3">
        {description.length > 120
          ? `${description.substring(0, 120)}...`
          : description}
      </p>

      <Separator />

      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="font-bold text-lg text-[#7263f3]">{salary}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(postedAt)}</span>
        </div>
      </div>
    </div>
  );
}

export default JobCard;
