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
import { Label } from "@/Components/ui/label";
import { Badge } from "@/Components/ui/badge";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import { updateUserProfile } from "@/lib/firestore";
import {
  User,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  Globe,
  Building,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, userProfile, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
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
    }
  }, [userProfile]);

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
