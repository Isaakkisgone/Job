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

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword, loading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      // Error is handled in the context
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#d7dedc] to-[#7263f3]/5 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-[#7263f3]">
              Имэйл илгээгдлээ
            </CardTitle>
            <CardDescription>
              Нууц үг сэргээх заавар таны имэйл хаягт илгээгдлээ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                {email} хаягт нууц үг сэргээх холбоос илгээгдлээ. Имэйлээ
                шалгаад заавраар дагуу нууц үгээ шинэчлэнэ үү.
              </p>
              <Button asChild className="w-full">
                <Link href="/auth/login">Нэвтрэх хуудас руу буцах</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#d7dedc] to-[#7263f3]/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-[#7263f3]">
            Нууц үг сэргээх
          </CardTitle>
          <CardDescription>
            Имэйл хаягаа оруулбал нууц үг сэргээх холбоос илгээх болно
          </CardDescription>
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

            <Button
              type="submit"
              className="w-full bg-[#7263f3] hover:bg-[#5a4fd1]"
              disabled={loading}
            >
              {loading ? "Илгээж байна..." : "Нууц үг сэргээх"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Нууц үгээ санаж байна уу?{" "}
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
