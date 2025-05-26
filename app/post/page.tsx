"use client";
import Header from "@/Components/Header";
import JobForm from "@/Components/JobPost/JobForm";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Button } from "@/Components/ui/button";
import Link from "next/link";

function PostPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
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

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Ажлын зар оруулахын тулд нэвтэрнэ үү
            </h2>
            <p className="text-gray-600 mb-6">
              Ажлын зар оруулахын тулд эхлээд бүртгэл үүсгэх эсвэл нэвтрэх
              шаардлагатай.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link href="/auth/login">Нэвтрэх</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/auth/register">Бүртгүүлэх</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">
            Ажлын зар оруулах
          </h2>

          <div className="max-w-4xl mx-auto">
            <JobForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostPage;
