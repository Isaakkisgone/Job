"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import {
  Users,
  Briefcase,
  FileText,
  TrendingUp,
  Eye,
  UserCheck,
  Building,
  Search,
} from "lucide-react";
import {
  getAllUsers,
  getAllJobs,
  getAllJobApplications,
  getJobStatistics,
  getUserStatistics,
  getPopularJobs,
  getMostActiveEmployers,
} from "@/lib/firestore";
import toast from "react-hot-toast";

interface AdminStats {
  totalUsers: number;
  totalJobSeekers: number;
  totalEmployers: number;
  totalJobs: number;
  totalApplications: number;
  activeJobs: number;
  pendingApplications: number;
  acceptedApplications: number;
}

interface PopularJob {
  id: string;
  title: string;
  company: string;
  applicationCount: number;
  viewCount: number;
}

interface ActiveEmployer {
  id: string;
  name: string;
  company: string;
  jobsPosted: number;
  applicationsReceived: number;
}

export default function AdminPage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [popularJobs, setPopularJobs] = useState<PopularJob[]>([]);
  const [activeEmployers, setActiveEmployers] = useState<ActiveEmployer[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!loading && (!user || userProfile?.userType !== "admin")) {
      toast.error("Админ эрхтэй хэрэглэгч байх шаардлагатай");
      router.push("/");
      return;
    }

    if (user && userProfile?.userType === "admin") {
      fetchAdminData();
    }
  }, [user, userProfile, loading, router]);

  const fetchAdminData = async () => {
    try {
      setLoadingStats(true);

      // Fetch basic statistics
      const [users, jobs, applications] = await Promise.all([
        getAllUsers(),
        getAllJobs(),
        getAllJobApplications(),
      ]);

      const jobSeekers = users.filter((u) => u.userType === "job_seeker");
      const employers = users.filter((u) => u.userType === "employer");
      const activeJobs = jobs.filter((j) => j.status === "active");
      const pendingApps = applications.filter((a) => a.status === "pending");
      const acceptedApps = applications.filter((a) => a.status === "accepted");

      setStats({
        totalUsers: users.length,
        totalJobSeekers: jobSeekers.length,
        totalEmployers: employers.length,
        totalJobs: jobs.length,
        totalApplications: applications.length,
        activeJobs: activeJobs.length,
        pendingApplications: pendingApps.length,
        acceptedApplications: acceptedApps.length,
      });

      // Fetch popular jobs and active employers
      const [popularJobsData, activeEmployersData] = await Promise.all([
        getPopularJobs(10),
        getMostActiveEmployers(10),
      ]);

      // Filter out items with undefined ids
      const validPopularJobs = popularJobsData.filter(
        (job) => job.id !== undefined
      ) as PopularJob[];
      const validActiveEmployers = activeEmployersData.filter(
        (employer) => employer.id !== undefined
      ) as ActiveEmployer[];

      setPopularJobs(validPopularJobs);
      setActiveEmployers(validActiveEmployers);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast.error("Мэдээлэл ачаалахад алдаа гарлаа");
    } finally {
      setLoadingStats(false);
    }
  };

  if (loading || loadingStats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Ачаалж байна...</p>
        </div>
      </div>
    );
  }

  if (!user || userProfile?.userType !== "admin") {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Админ удирдлагын самбар
          </h1>
          <p className="text-gray-600">
            Системийн ерөнхий статистик болон хэрэглэгчдийн үйл ажиллагааг хянах
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Нийт хэрэглэгч
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">
                Ажил хайгч: {stats?.totalJobSeekers || 0} | Ажил олгогч:{" "}
                {stats?.totalEmployers || 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Нийт ажлын байр
              </CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalJobs || 0}</div>
              <p className="text-xs text-muted-foreground">
                Идэвхтэй: {stats?.activeJobs || 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Нийт өргөдөл
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.totalApplications || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Хүлээгдэж буй: {stats?.pendingApplications || 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Амжилттай өргөдөл
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.acceptedApplications || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Нийт өргөдлийн{" "}
                {stats?.totalApplications
                  ? Math.round(
                      (stats.acceptedApplications / stats.totalApplications) *
                        100
                    )
                  : 0}
                %
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="popular-jobs" className="space-y-4">
          <TabsList>
            <TabsTrigger value="popular-jobs">Алдартай ажлын байр</TabsTrigger>
            <TabsTrigger value="active-employers">
              Идэвхтэй ажил олгогчид
            </TabsTrigger>
            <TabsTrigger value="reports">Тайлангууд</TabsTrigger>
          </TabsList>

          <TabsContent value="popular-jobs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Хамгийн их өргөдөл авсан ажлын байрууд
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {popularJobs.map((job, index) => (
                    <div
                      key={job.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary">#{index + 1}</Badge>
                        <div>
                          <h3 className="font-medium">{job.title}</h3>
                          <p className="text-sm text-gray-600">{job.company}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span>{job.applicationCount} өргөдөл</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{job.viewCount} үзэлт</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active-employers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Хамгийн идэвхтэй ажил олгогчид
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeEmployers.map((employer, index) => (
                    <div
                      key={employer.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary">#{index + 1}</Badge>
                        <div>
                          <h3 className="font-medium">{employer.name}</h3>
                          <p className="text-sm text-gray-600">
                            {employer.company}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          <span>{employer.jobsPosted} ажил</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <UserCheck className="h-4 w-4" />
                          <span>{employer.applicationsReceived} өргөдөл</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Тайлан гаргах</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={() => generateReport("users")}
                    className="w-full justify-start"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Хэрэглэгчдийн тайлан
                  </Button>
                  <Button
                    onClick={() => generateReport("jobs")}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Briefcase className="mr-2 h-4 w-4" />
                    Ажлын байрны тайлан
                  </Button>
                  <Button
                    onClick={() => generateReport("applications")}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Өргөдлийн тайлан
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Системийн эрүүл мэнд</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Өргөдлийн амжилтын хувь:</span>
                    <Badge variant="default">
                      {stats?.totalApplications
                        ? Math.round(
                            (stats.acceptedApplications /
                              stats.totalApplications) *
                              100
                          )
                        : 0}
                      %
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Идэвхтэй ажлын хувь:</span>
                    <Badge variant="default">
                      {stats?.totalJobs
                        ? Math.round((stats.activeJobs / stats.totalJobs) * 100)
                        : 0}
                      %
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Ажил олгогчийн хувь:</span>
                    <Badge variant="default">
                      {stats?.totalUsers
                        ? Math.round(
                            (stats.totalEmployers / stats.totalUsers) * 100
                          )
                        : 0}
                      %
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </main>
  );

  function generateReport(type: "users" | "jobs" | "applications") {
    toast.success(
      `${
        type === "users"
          ? "Хэрэглэгчдийн"
          : type === "jobs"
          ? "Ажлын байрны"
          : "Өргөдлийн"
      } тайлан үүсгэж байна...`
    );
    // Implement report generation logic here
  }
}
