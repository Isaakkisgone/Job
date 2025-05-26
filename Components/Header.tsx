"use client";
import { useAuth } from "@/context/AuthContext";
import {
  LogIn,
  UserPlus,
  User,
  LogOut,
  Settings,
  Shield,
  Bell,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { Button } from "./ui/button";

function Header() {
  const { user, userProfile, logout } = useAuth();
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setShowDropdown(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="px-10 py-6 bg-[#D7DEDC] text-gray-500 flex justify-between items-center">
      <Link href={"/"} className="flex items-center gap-2">
        <Image src="/logo.svg" alt="logo" width={0} height={0} />
        <h1 className="font-extrabold text-2xl text-[#7263f3]">
          Цагийн ажил зуучлал
        </h1>
      </Link>

      <ul className="flex items-center gap-8">
        <li className="flex items-center gap-4">
          <Link
            href={"/findwork"}
            className={`py-2 px-6 rounded-md ${
              pathname === "/findwork"
                ? "text-[#7263F3] border-[#7263F3] border bg-[#7263F3]/10"
                : ""
            }`}
          >
            Ажил хайх
          </Link>
          <Link
            href={"/myjobs"}
            className={`py-2 px-6 rounded-md ${
              pathname === "/myjobs"
                ? "text-[#7263F3] border-[#7263F3] border bg-[#7263F3]/10"
                : ""
            }`}
          >
            Хадгалсан зарууд
          </Link>
          <Link
            href={"/post"}
            className={`py-2 px-6 rounded-md ${
              pathname === "/post"
                ? "text-[#7263F3] border-[#7263F3] border bg-[#7263F3]/10"
                : ""
            }`}
          >
            Ажлын зар оруулах
          </Link>
          {userProfile?.userType === "admin" && (
            <Link
              href={"/admin"}
              className={`py-2 px-6 rounded-md ${
                pathname === "/admin"
                  ? "text-[#7263F3] border-[#7263F3] border bg-[#7263F3]/10"
                  : ""
              }`}
            >
              Админ самбар
            </Link>
          )}
        </li>
      </ul>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <Link
              href="/notifications"
              className={`p-2 rounded-md hover:bg-gray-200 transition-colors ${
                pathname === "/notifications"
                  ? "text-[#7263F3] bg-[#7263F3]/10"
                  : ""
              }`}
            >
              <Bell className="w-5 h-5" />
            </Link>

            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {user.displayName || user.email}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Профайл
                    </Link>
                    <Link
                      href="/notifications"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      <Bell className="w-4 h-4" />
                      Мэдэгдэл
                    </Link>
                    {userProfile?.userType === "employer" && (
                      <Link
                        href="/post"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        <UserPlus className="w-4 h-4" />
                        Ажлын зар оруулах
                      </Link>
                    )}
                    {userProfile?.userType === "admin" && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        <Shield className="w-4 h-4" />
                        Админ самбар
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Гарах
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/auth/login" className="flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Нэвтрэх
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-[#7263f3] hover:bg-[#5a4fd1]"
            >
              <Link href="/auth/register" className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Бүртгүүлэх
              </Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
