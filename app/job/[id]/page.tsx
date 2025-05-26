"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getJobById,
  Job,
  createJobApplication,
  hasUserAppliedToJob,
  saveJob,
  unsaveJob,
  getUserProfile,
} from "@/lib/firestore";
import { useAuth } from "@/context/AuthContext";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import {
  MapPin,
  Building,
  Calendar,
  Clock,
  DollarSign,
  User,
  ArrowLeft,
  Bookmark,
  Share2,
  Send,
} from "lucide-react";
import { Timestamp } from "firebase/firestore";
import toast from "react-hot-toast";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        if (params.id) {
          const jobData = await getJobById(params.id as string);
          setJob(jobData);

          // Check if user has applied and if job is saved
          if (user) {
            const applied = await hasUserAppliedToJob(
              user.uid,
              params.id as string
            );
            setHasApplied(applied);

            // Check if job is saved
            const profile = await getUserProfile(user.uid);
            if (profile?.savedJobs?.includes(params.id as string)) {
              setIsSaved(true);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching job:", error);
        toast.error("Ажлын мэдээлэл олдсонгүй!");
        router.push("/findwork");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [params.id, router, user]);

  const formatDate = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    return date.toLocaleDateString("mn-MN", {
      year: "numeric",
      month: "long",
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

  const handleSaveJob = async () => {
    if (!user || !job?.id) {
      router.push("/auth/login");
      return;
    }

    try {
      if (isSaved) {
        await unsaveJob(user.uid, job.id);
        setIsSaved(false);
        toast.success("Хадгалсан жагсаалтаас хасагдлаа");
      } else {
        await saveJob(user.uid, job.id);
        setIsSaved(true);
        toast.success("Хадгалсан жагсаалтад нэмэгдлээ");
      }
    } catch (error) {
      toast.error("Алдаа гарлаа!");
    }
  };

  const handleApply = () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (userProfile?.userType !== "job_seeker") {
      toast.error("Зөвхөн ажил хайгчид өргөдөл илгээх боломжтой!");
      return;
    }

    if (hasApplied) {
      toast.success("Та энэ ажилд аль хэдийн өргөдөл илгээсэн байна!");
      return;
    }

    setShowApplicationDialog(true);
  };

  const submitApplication = async () => {
    if (!user || !job?.id) return;

    setIsApplying(true);
    try {
      const applicationData: any = {
        jobId: job.id,
        applicantId: user.uid,
        employerId: job.postedBy,
        status: "pending",
      };

      // Only add coverLetter if it's not empty
      if (coverLetter.trim()) {
        applicationData.coverLetter = coverLetter.trim();
      }

      // Only add resumeUrl if it exists and is not empty
      if (userProfile?.resume && userProfile.resume.trim()) {
        applicationData.resumeUrl = userProfile.resume.trim();
      }

      await createJobApplication(applicationData);

      setHasApplied(true);
      setShowApplicationDialog(false);
      setCoverLetter("");
      toast.success("Өргөдөл амжилттай илгээгдлээ!");
    } catch (error) {
      toast.error("Өргөдөл илгээхэд алдаа гарлаа!");
    } finally {
      setIsApplying(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job?.title,
        text: `${job?.company}-д ${job?.title} ажлын байр`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Холбоос хуулагдлаа!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#7263f3] mx-auto"></div>
            <p className="mt-4 text-gray-600">Ачааллаж байна...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Ажлын мэдээлэл олдсонгүй
            </h2>
            <Button onClick={() => router.push("/findwork")}>Буцах</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back button */}
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Буцах
          </Button>

          {/* Job header */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-[#7263f3]/10 rounded-lg flex items-center justify-center">
                    <Building className="w-8 h-8 text-[#7263f3]" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                    <CardDescription className="text-lg font-medium text-gray-700">
                      {job.company}
                    </CardDescription>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Нийтэлсэн: {formatDate(job.postedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveJob}
                    className={isSaved ? "text-[#7263f3]" : ""}
                  >
                    <Bookmark className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <Badge
                  variant="secondary"
                  className="bg-[#7263f3]/10 text-[#7263f3]"
                >
                  {getJobTypeLabel(job.type)}
                </Badge>
                {job.category && (
                  <Badge variant="outline">{job.category}</Badge>
                )}
                {hasApplied && (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    Өргөдөл илгээсэн
                  </Badge>
                )}
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job description */}
              <Card>
                <CardHeader>
                  <CardTitle>Ажлын тайлбар</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap">{job.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Requirements */}
              {job.requirements && job.requirements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Шаардлага</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {job.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-2 h-2 bg-[#7263f3] rounded-full mt-2 flex-shrink-0"></span>
                          <span>{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Salary info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Цалин
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-[#7263f3]">
                    {job.salary}
                  </p>
                </CardContent>
              </Card>

              {/* Job details */}
              <Card>
                <CardHeader>
                  <CardTitle>Дэлгэрэнгүй мэдээлэл</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Ажлын төрөл</p>
                      <p className="text-sm text-gray-600">
                        {getJobTypeLabel(job.type)}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Байршил</p>
                      <p className="text-sm text-gray-600">{job.location}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Компани</p>
                      <p className="text-sm text-gray-600">{job.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Apply button */}
              <Card>
                <CardContent className="pt-6">
                  {hasApplied ? (
                    <Button
                      disabled
                      className="w-full"
                      size="lg"
                      variant="secondary"
                    >
                      Өргөдөл илгээсэн
                    </Button>
                  ) : (
                    <Dialog
                      open={showApplicationDialog}
                      onOpenChange={setShowApplicationDialog}
                    >
                      <DialogTrigger asChild>
                        <Button
                          onClick={handleApply}
                          className="w-full bg-[#7263f3] hover:bg-[#5a4fd1]"
                          size="lg"
                        >
                          Өргөдөл илгээх
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Өргөдөл илгээх</DialogTitle>
                          <DialogDescription>
                            {job.title} ажлын байранд өргөдөл илгээх
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="coverLetter">
                              Хүсэлтийн захидал (заавал биш)
                            </Label>
                            <Textarea
                              id="coverLetter"
                              value={coverLetter}
                              onChange={(e) => setCoverLetter(e.target.value)}
                              placeholder="Өөрийн тухай товч бичнэ үү..."
                              rows={4}
                            />
                          </div>
                          {userProfile?.resume && (
                            <div className="text-sm text-gray-600">
                              <p>Таны CV автоматаар хавсаргагдана.</p>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setShowApplicationDialog(false)}
                              className="flex-1"
                            >
                              Цуцлах
                            </Button>
                            <Button
                              onClick={submitApplication}
                              disabled={isApplying}
                              className="flex-1 bg-[#7263f3] hover:bg-[#5a4fd1]"
                            >
                              {isApplying ? (
                                "Илгээж байна..."
                              ) : (
                                <>
                                  <Send className="w-4 h-4 mr-2" />
                                  Илгээх
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    {!user
                      ? "Өргөдөл илгээхийн тулд нэвтэрсэн байх шаардлагатай"
                      : userProfile?.userType !== "job_seeker"
                      ? "Зөвхөн ажил хайгчид өргөдөл илгээх боломжтой"
                      : hasApplied
                      ? "Та энэ ажилд аль хэдийн өргөдөл илгээсэн байна"
                      : ""}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
