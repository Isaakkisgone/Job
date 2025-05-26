"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
  getAllJobs,
  getUserApplications,
  Job,
  JobApplication,
  getJobById,
} from "@/lib/firestore";
import {
  MapPin,
  Building,
  Calendar,
  Clock,
  DollarSign,
  Eye,
  FileText,
} from "lucide-react";
import { Timestamp } from "firebase/firestore";
import Link from "next/link";
import toast from "react-hot-toast";

interface JobWithApplication extends Job {
  application?: JobApplication;
}

export default function MyJobsPage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"saved" | "applied" | "posted">(
    "saved"
  );
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<JobWithApplication[]>([]);
  const [postedJobs, setPostedJobs] = useState<Job[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
      return;
    }

    if (user && userProfile) {
      fetchUserJobs();
    }
  }, [user, userProfile, loading, router]);

  const fetchUserJobs = async () => {
    try {
      setLoadingData(true);

      // Fetch saved jobs
      if (userProfile?.savedJobs && userProfile.savedJobs.length > 0) {
        const savedJobsData = await Promise.all(
          userProfile.savedJobs.map(async (jobId) => {
            try {
              return await getJobById(jobId);
            } catch (error) {
              console.error(`Error fetching job ${jobId}:`, error);
              return null;
            }
          })
        );
        setSavedJobs(savedJobsData.filter((job) => job !== null) as Job[]);
      }

      // Fetch applied jobs
      if (userProfile?.userType === "job_seeker") {
        const applications = await getUserApplications(user!.uid);
        const appliedJobsData = await Promise.all(
          applications.map(async (application) => {
            try {
              const job = await getJobById(application.jobId);
              return { ...job, application };
            } catch (error) {
              console.error(
                `Error fetching applied job ${application.jobId}:`,
                error
              );
              return null;
            }
          })
        );
        setAppliedJobs(
          appliedJobsData.filter((job) => job !== null) as JobWithApplication[]
        );
      }

      // Fetch posted jobs for employers
      if (userProfile?.userType === "employer") {
        const allJobs = await getAllJobs();
        const userPostedJobs = allJobs.filter(
          (job) => job.postedBy === userProfile.id
        );
        setPostedJobs(userPostedJobs);
      }
    } catch (error) {
      console.error("Error fetching user jobs:", error);
      toast.error("Мэдээлэл ачаалахад алдаа гарлаа");
    } finally {
      setLoadingData(false);
    }
  };

  const formatDate = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    return date.toLocaleDateString("mn-MN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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

  const getApplicationStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Хүлээгдэж буй";
      case "reviewed":
        return "Шалгагдаж буй";
      case "accepted":
        return "Хүлээн авагдсан";
      case "rejected":
        return "Татгалзагдсан";
      default:
        return status;
    }
  };

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewed":
        return "bg-blue-100 text-blue-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#7263f3] mx-auto"></div>
          <p className="mt-4 text-gray-600">Ачааллаж байна...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Миний ажлууд
          </h1>
          <p className="text-gray-600">
            Хадгалсан, өргөдөл илгээсэн болон нийтэлсэн ажлын байрууд
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8">
          <Button
            variant={activeTab === "saved" ? "default" : "outline"}
            onClick={() => setActiveTab("saved")}
            className={
              activeTab === "saved" ? "bg-[#7263f3] hover:bg-[#5a4fd1]" : ""
            }
          >
            Хадгалсан зар ({savedJobs.length})
          </Button>
          {userProfile?.userType === "job_seeker" && (
            <Button
              variant={activeTab === "applied" ? "default" : "outline"}
              onClick={() => setActiveTab("applied")}
              className={
                activeTab === "applied" ? "bg-[#7263f3] hover:bg-[#5a4fd1]" : ""
              }
            >
              Өргөдөл илгээсэн ({appliedJobs.length})
            </Button>
          )}
          {userProfile?.userType === "employer" && (
            <Button
              variant={activeTab === "posted" ? "default" : "outline"}
              onClick={() => setActiveTab("posted")}
              className={
                activeTab === "posted" ? "bg-[#7263f3] hover:bg-[#5a4fd1]" : ""
              }
            >
              Нийтэлсэн зар ({postedJobs.length})
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Saved Jobs */}
          {activeTab === "saved" && (
            <div>
              {savedJobs.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Хадгалсан ажил байхгүй
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Та одоогоор ямар нэг ажил хадгалаагүй байна
                    </p>
                    <Button asChild>
                      <Link href="/findwork">Ажил хайх</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedJobs.map((job) => (
                    <Card
                      key={job.id}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex gap-3">
                            <div className="w-12 h-12 bg-[#7263f3]/10 rounded-lg flex items-center justify-center">
                              <Building className="w-6 h-6 text-[#7263f3]" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">
                                {job.title}
                              </CardTitle>
                              <p className="text-gray-600">{job.company}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span>{job.salary}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">
                            {getJobTypeLabel(job.type)}
                          </Badge>
                          <Button asChild size="sm">
                            <Link href={`/job/${job.id}`}>Дэлгэрэнгүй</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Applied Jobs */}
          {activeTab === "applied" &&
            userProfile?.userType === "job_seeker" && (
              <div>
                {appliedJobs.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Өргөдөл илгээсэн ажил байхгүй
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Та одоогоор ямар нэг ажилд өргөдөл илгээгээгүй байна
                      </p>
                      <Button asChild>
                        <Link href="/findwork">Ажил хайх</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {appliedJobs.map((job) => (
                      <Card
                        key={job.id}
                        className="hover:shadow-lg transition-shadow"
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex gap-3">
                              <div className="w-12 h-12 bg-[#7263f3]/10 rounded-lg flex items-center justify-center">
                                <Building className="w-6 h-6 text-[#7263f3]" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">
                                  {job.title}
                                </CardTitle>
                                <p className="text-gray-600">{job.company}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                Өргөдөл:{" "}
                                {formatDate(job.application!.appliedAt)}
                              </span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <Badge
                              variant="secondary"
                              className={getApplicationStatusColor(
                                job.application!.status
                              )}
                            >
                              {getApplicationStatusLabel(
                                job.application!.status
                              )}
                            </Badge>
                            <Button asChild size="sm">
                              <Link href={`/job/${job.id}`}>Дэлгэрэнгүй</Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

          {/* Posted Jobs */}
          {activeTab === "posted" && userProfile?.userType === "employer" && (
            <div>
              {postedJobs.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Нийтэлсэн ажил байхгүй
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Та одоогоор ямар нэг ажлын зар нийтлээгүй байна
                    </p>
                    <Button asChild>
                      <Link href="/post">Ажлын зар нийтлэх</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {postedJobs.map((job) => (
                    <Card
                      key={job.id}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex gap-3">
                            <div className="w-12 h-12 bg-[#7263f3]/10 rounded-lg flex items-center justify-center">
                              <Building className="w-6 h-6 text-[#7263f3]" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">
                                {job.title}
                              </CardTitle>
                              <p className="text-gray-600">{job.company}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Нийтэлсэн: {formatDate(job.postedAt)}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <Badge
                            variant="secondary"
                            className={
                              job.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {job.isActive ? "Идэвхтэй" : "Идэвхгүй"}
                          </Badge>
                          <Button asChild size="sm">
                            <Link href={`/job/${job.id}`}>Дэлгэрэнгүй</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
