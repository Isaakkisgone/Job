"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState<"job_seeker" | "employer">(
    "job_seeker"
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, loading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Нууц үг таарахгүй байна!");
      return;
    }

    if (password.length < 6) {
      alert("Нууц үг дор хаяж 6 тэмдэгт байх ёстой!");
      return;
    }

    try {
      await register(email, password, name, userType);
      router.push("/");
    } catch (error) {
      // Error is handled in the context
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#d7dedc] to-[#7263f3]/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-[#7263f3]">
            Бүртгүүлэх
          </CardTitle>
          <CardDescription>Шинэ бүртгэл үүсгэнэ үү</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label
                htmlFor="userType"
                className="block text-sm font-medium mb-2"
              >
                Хэрэглэгчийн төрөл
              </Label>
              <Select
                value={userType}
                onValueChange={(value: "job_seeker" | "employer") =>
                  setUserType(value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Төрөл сонгоно уу" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="job_seeker">Ажил хайгч</SelectItem>
                  <SelectItem value="employer">Ажил олгогч</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="name" className="block text-sm font-medium mb-2">
                Нэр
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Таны нэр"
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="block text-sm font-medium mb-2">
                И-мэйл хаяг
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
              />
            </div>

            <div>
              <Label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                Нууц үг
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Дор хаяж 6 тэмдэгт"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <Label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-2"
              >
                Нууц үг баталгаажуулах
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Нууц үгээ дахин оруулна уу"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#7263f3] hover:bg-[#5a4fd1]"
              disabled={loading}
            >
              {loading ? "Бүртгэж байна..." : "Бүртгүүлэх"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Аль хэдийн бүртгэлтэй юу?{" "}
              <Link
                href="/auth/login"
                className="text-[#7263f3] hover:underline"
              >
                Нэвтрэх
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-gray-500 hover:underline">
              Нүүр хуудас руу буцах
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
