"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  createUserProfile,
  getUserProfile,
  UserProfile,
} from "@/lib/firestore";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    userType: "job_seeker" | "employer"
  ) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        // Get or create user profile
        try {
          let profile = await getUserProfile(user.uid);
          if (!profile) {
            // Create new profile if doesn't exist
            await createUserProfile({
              uid: user.uid,
              name: user.displayName || "",
              email: user.email || "",
            });
            profile = await getUserProfile(user.uid);
          }
          setUserProfile(profile);
        } catch (error) {
          console.error("Error handling user profile:", error);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Амжилттай нэвтэрлээ!");
    } catch (error: any) {
      toast.error("Нэвтрэхэд алдаа гарлаа: " + error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    userType: "job_seeker" | "employer"
  ) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName: name });

      // Create user profile in Firestore
      await createUserProfile({
        uid: userCredential.user.uid,
        name: name,
        email: email,
        userType: userType,
      });

      toast.success("Амжилттай бүртгэгдлээ!");
    } catch (error: any) {
      toast.error("Бүртгэлд алдаа гарлаа: " + error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
      toast.success("Амжилттай гарлаа!");
    } catch (error: any) {
      toast.error("Гарахад алдаа гарлаа: " + error.message);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Нууц үг сэргээх имэйл илгээгдлээ!");
    } catch (error: any) {
      toast.error("Нууц үг сэргээхэд алдаа гарлаа: " + error.message);
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    login,
    register,
    logout,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
