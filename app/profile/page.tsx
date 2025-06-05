"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
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
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import {
  updateUserProfile,
  getJobsByEmployer,
  getJobApplications,
  getUserProfile as getApplicantProfile,
  Job,
  JobApplication,
  UserProfile,
} from "@/lib/firestore";
import {
  User,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  Globe,
  Building,
  Calendar,
  Users,
  Eye,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";
import { Timestamp } from "firebase/firestore";

export default function ProfilePage() {
  const { user, userProfile, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [employerJobs, setEmployerJobs] = useState<Job[]>([]);
  const [selectedJobApplications, setSelectedJobApplications] = useState<
    JobApplication[]
  >([]);
  const [applicantProfiles, setApplicantProfiles] = useState<{
    [key: string]: UserProfile;
  }>({});
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    skills: [] as string[],
    experience: "",
    education: "",
    location: "",
    company: "",
    position: "",
    website: "",
    userType: "job_seeker" as "job_seeker" | "employer" | "admin",
  });
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || "",
        email: userProfile.email || "",
        phone: userProfile.phone || "",
        bio: userProfile.bio || "",
        skills: userProfile.skills || [],
        experience: userProfile.experience || "",
        education: userProfile.education || "",
        location: userProfile.location || "",
        company: userProfile.company || "",
        position: userProfile.position || "",
        website: userProfile.website || "",
        userType: userProfile.userType || "job_seeker",
      });

      // Fetch employer's jobs if user is an employer
      if (userProfile.userType === "employer" && userProfile.uid) {
        fetchEmployerJobs(userProfile.uid);
      }
    }
  }, [userProfile]);

  const fetchEmployerJobs = async (employerId: string) => {
    try {
      setLoadingJobs(true);
      const jobs = await getJobsByEmployer(employerId);
      setEmployerJobs(jobs);
    } catch (error) {
      console.error("Error fetching employer jobs:", error);
      toast.error("Ажлуудыг ачаалахад алдаа гарлаа");
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleViewApplications = async (jobId: string) => {
    try {
      setLoadingApplications(true);
      const applications = await getJobApplications(jobId);
      setSelectedJobApplications(applications);

      // Fetch applicant profiles
      const profiles: { [key: string]: UserProfile } = {};
      for (const app of applications) {
        try {
          const profile = await getApplicantProfile(app.applicantId);
          if (profile) {
            profiles[app.applicantId] = profile;
          }
        } catch (error) {
          console.error("Error fetching applicant profile:", error);
        }
      }
      setApplicantProfiles(profiles);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Хүсэлтүүдийг ачаалахад алдаа гарлаа");
    } finally {
      setLoadingApplications(false);
    }
  };

  const formatDate = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    return date.toLocaleDateString("mn-MN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
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

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Хүлээгдэж буй";
      case "reviewed":
        return "Шалгагдаж буй";
      case "accepted":
        return "Хүлээн авагдсан";
      case "rejected":
        return "Татгалзсан";
      default:
        return status;
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSave = async () => {
    if (!userProfile?.id) return;

    try {
      await updateUserProfile(userProfile.id, formData);
      toast.success("Профайл амжилттай шинэчлэгдлээ!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Профайл шинэчлэхэд алдаа гарлаа!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#7263f3]"></div>
          <p className="mt-4 text-gray-600">Ачааллаж байна...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Нэвтрэх шаардлагатай</CardTitle>
            <CardDescription>Профайл харахын тулд нэвтэрнэ үү</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <main>
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-[#7263f3]">Миний профайл</h1>
            <Button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className="bg-[#7263f3] hover:bg-[#5a4fd1]"
            >
              {isEditing ? "Хадгалах" : "Засах"}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Үндсэн мэдээлэл */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Үндсэн мэдээлэл
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Нэр</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">И-мэйл</Label>
                      <Input
                        id="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Утас</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        disabled={!isEditing}
                        placeholder="+976 xxxxxxxx"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Байршил</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) =>
                          handleInputChange("location", e.target.value)
                        }
                        disabled={!isEditing}
                        placeholder="Улаанбаатар, Монгол"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="userType">Хэрэглэгчийн төрөл</Label>
                    <Select
                      value={formData.userType}
                      onValueChange={(
                        value: "job_seeker" | "employer" | "admin"
                      ) => handleInputChange("userType", value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="job_seeker">Ажил хайгч</SelectItem>
                        <SelectItem value="employer">Ажил олгогч</SelectItem>
                        <SelectItem value="admin">Админ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="bio">Товч танилцуулга</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        handleInputChange("bio", e.target.value)
                      }
                      disabled={!isEditing}
                      placeholder="Өөрийн тухай товч бичнэ үү..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Ажил олгогчийн нэмэлт мэдээлэл */}
              {formData.userType === "employer" && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="w-5 h-5" />
                      Байгууллагын мэдээлэл
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="company">Байгууллагын нэр</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) =>
                            handleInputChange("company", e.target.value)
                          }
                          disabled={!isEditing}
                          placeholder="Компанийн нэр"
                        />
                      </div>
                      <div>
                        <Label htmlFor="position">Албан тушаал</Label>
                        <Input
                          id="position"
                          value={formData.position}
                          onChange={(e) =>
                            handleInputChange("position", e.target.value)
                          }
                          disabled={!isEditing}
                          placeholder="Таны албан тушаал"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="website">Вебсайт</Label>
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) =>
                          handleInputChange("website", e.target.value)
                        }
                        disabled={!isEditing}
                        placeholder="https://example.com"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Ажил хайгчийн нэмэлт мэдээлэл */}
              {formData.userType === "job_seeker" && (
                <>
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5" />
                        Ажлын туршлага
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={formData.experience}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          handleInputChange("experience", e.target.value)
                        }
                        disabled={!isEditing}
                        placeholder="Ажлын туршлагаа бичнэ үү..."
                        rows={4}
                      />
                    </CardContent>
                  </Card>

                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Боловсрол</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={formData.education}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          handleInputChange("education", e.target.value)
                        }
                        disabled={!isEditing}
                        placeholder="Боловсролын мэдээллээ бичнэ үү..."
                        rows={3}
                      />
                    </CardContent>
                  </Card>

                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Ур чадвар</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isEditing && (
                        <div className="flex gap-2 mb-4">
                          <Input
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            placeholder="Ур чадвар нэмэх"
                            onKeyPress={(e) => e.key === "Enter" && addSkill()}
                          />
                          <Button onClick={addSkill} type="button">
                            Нэмэх
                          </Button>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skill, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => isEditing && removeSkill(skill)}
                          >
                            {skill}
                            {isEditing && " ×"}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Ажил олгогчийн ажлуудын жагсаалт */}
              {formData.userType === "employer" && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      Миний оруулсан ажлууд
                    </CardTitle>
                    <CardDescription>
                      Таны оруулсан ажлууд болон тэдгээрт ирсэн хүсэлтүүд
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loadingJobs ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7263f3] mx-auto"></div>
                        <p className="mt-2 text-sm text-gray-600">
                          Ачааллаж байна...
                        </p>
                      </div>
                    ) : employerJobs.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Та одоогоор ажил оруулаагүй байна.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {employerJobs.map((job) => (
                          <div
                            key={job.id}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {job.title}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                  {job.company}
                                </p>
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>{job.location}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatDate(job.postedAt)}</span>
                                  </div>
                                </div>
                              </div>
                              <Badge
                                variant={job.isActive ? "default" : "secondary"}
                                className={
                                  job.isActive
                                    ? "bg-green-100 text-green-800"
                                    : ""
                                }
                              >
                                {job.isActive ? "Идэвхтэй" : "Идэвхгүй"}
                              </Badge>
                            </div>

                            <Separator className="my-3" />

                            <div className="flex justify-between items-center">
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Цалин:</span>{" "}
                                {job.salary}
                              </div>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleViewApplications(job.id!)
                                    }
                                  >
                                    <Users className="w-4 h-4 mr-2" />
                                    Хүсэлт харах
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>
                                      {job.title} - Ирсэн хүсэлтүүд
                                    </DialogTitle>
                                    <DialogDescription>
                                      Энэ ажлын байранд ирсэн бүх хүсэлтүүд
                                    </DialogDescription>
                                  </DialogHeader>

                                  {loadingApplications ? (
                                    <div className="text-center py-8">
                                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7263f3] mx-auto"></div>
                                      <p className="mt-2 text-sm text-gray-600">
                                        Ачааллаж байна...
                                      </p>
                                    </div>
                                  ) : selectedJobApplications.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                      <p>
                                        Энэ ажилд одоогоор хүсэлт ирээгүй байна.
                                      </p>
                                    </div>
                                  ) : (
                                    <div className="space-y-4">
                                      {selectedJobApplications.map(
                                        (application) => {
                                          const applicant =
                                            applicantProfiles[
                                              application.applicantId
                                            ];
                                          return (
                                            <Card key={application.id}>
                                              <CardContent className="p-4">
                                                <div className="flex justify-between items-start mb-3">
                                                  <div>
                                                    <h4 className="font-semibold">
                                                      {applicant?.name ||
                                                        "Нэр байхгүй"}
                                                    </h4>
                                                    <p className="text-sm text-gray-600">
                                                      {applicant?.email}
                                                    </p>
                                                    {applicant?.phone && (
                                                      <p className="text-sm text-gray-600">
                                                        {applicant.phone}
                                                      </p>
                                                    )}
                                                  </div>
                                                  <div className="text-right">
                                                    <Badge
                                                      className={getStatusColor(
                                                        application.status
                                                      )}
                                                    >
                                                      {getStatusText(
                                                        application.status
                                                      )}
                                                    </Badge>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                      {formatDate(
                                                        application.appliedAt
                                                      )}
                                                    </p>
                                                  </div>
                                                </div>

                                                {application.coverLetter && (
                                                  <div className="mb-3">
                                                    <h5 className="font-medium mb-2">
                                                      Хүсэлтийн захидал:
                                                    </h5>
                                                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                                                      {application.coverLetter}
                                                    </p>
                                                  </div>
                                                )}

                                                {applicant?.skills &&
                                                  applicant.skills.length >
                                                    0 && (
                                                    <div className="mb-3">
                                                      <h5 className="font-medium mb-2">
                                                        Ур чадвар:
                                                      </h5>
                                                      <div className="flex flex-wrap gap-1">
                                                        {applicant.skills.map(
                                                          (skill, index) => (
                                                            <Badge
                                                              key={index}
                                                              variant="outline"
                                                              className="text-xs"
                                                            >
                                                              {skill}
                                                            </Badge>
                                                          )
                                                        )}
                                                      </div>
                                                    </div>
                                                  )}

                                                {applicant?.experience && (
                                                  <div className="mb-3">
                                                    <h5 className="font-medium mb-2">
                                                      Ажлын туршлага:
                                                    </h5>
                                                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                                                      {applicant.experience}
                                                    </p>
                                                  </div>
                                                )}

                                                {application.resumeUrl && (
                                                  <div>
                                                    <Button
                                                      variant="outline"
                                                      size="sm"
                                                      asChild
                                                    >
                                                      <a
                                                        href={
                                                          application.resumeUrl
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                      >
                                                        <FileText className="w-4 h-4 mr-2" />
                                                        CV харах
                                                      </a>
                                                    </Button>
                                                  </div>
                                                )}
                                              </CardContent>
                                            </Card>
                                          );
                                        }
                                      )}
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Хажуугийн мэдээлэл */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Холбоо барих</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {formData.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{formData.email}</span>
                    </div>
                  )}
                  {formData.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{formData.phone}</span>
                    </div>
                  )}
                  {formData.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{formData.location}</span>
                    </div>
                  )}
                  {formData.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <a
                        href={formData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#7263f3] hover:underline"
                      >
                        {formData.website}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Статистик</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Хадгалсан ажил:
                    </span>
                    <span className="font-medium">
                      {userProfile?.savedJobs?.length || 0}
                    </span>
                  </div>
                  {formData.userType === "job_seeker" && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Өргөдөл илгээсэн:
                      </span>
                      <span className="font-medium">
                        {userProfile?.appliedJobs?.length || 0}
                      </span>
                    </div>
                  )}
                  {formData.userType === "employer" && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Нийтэлсэн ажил:
                      </span>
                      <span className="font-medium">
                        {userProfile?.postedJobs?.length || 0}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
