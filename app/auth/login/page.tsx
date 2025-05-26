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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
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
            Нэвтрэх
          </CardTitle>
          <CardDescription>Өөрийн бүртгэлээр нэвтэрнэ үү</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                И-мэйл хаяг
              </label>
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
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                Нууц үг
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Нууц үгээ оруулна уу"
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

            <Button
              type="submit"
              className="w-full bg-[#7263f3] hover:bg-[#5a4fd1]"
              disabled={loading}
            >
              {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Link
              href="/auth/reset-password"
              className="text-sm text-[#7263f3] hover:underline"
            >
              Нууц үгээ мартсан уу?
            </Link>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Бүртгэл байхгүй юу?{" "}
              <Link
                href="/auth/register"
                className="text-[#7263f3] hover:underline"
              >
                Бүртгүүлэх
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
