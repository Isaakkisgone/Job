"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
  Bell,
  BellOff,
  CheckCircle,
  XCircle,
  Clock,
  Briefcase,
  User,
  Trash2,
} from "lucide-react";
import {
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
  createNotification,
  Notification,
} from "@/lib/firestore";
import toast from "react-hot-toast";
import moment from "moment";

export default function NotificationsPage() {
  const { user, userProfile, loading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const userNotifications = await getUserNotifications(user!.uid);
      setNotifications(userNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Мэдэгдэл ачаалахад алдаа гарлаа");
    } finally {
      setLoadingNotifications(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      toast.success("Мэдэгдэл уншсан гэж тэмдэглэгдлээ");
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Алдаа гарлаа");
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await deleteNotification(notificationId);
      setNotifications((prev) =>
        prev.filter((notif) => notif.id !== notificationId)
      );
      toast.success("Мэдэгдэл устгагдлаа");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Алдаа гарлаа");
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "application_status":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "new_job":
        return <Briefcase className="h-5 w-5 text-blue-500" />;
      case "job_match":
        return <User className="h-5 w-5 text-purple-500" />;
      case "system":
        return <Bell className="h-5 w-5 text-gray-500" />;
      case "new_application":
        return <User className="h-5 w-5 text-orange-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationTypeText = (type: string) => {
    switch (type) {
      case "application_status":
        return "Өргөдлийн хариу";
      case "new_job":
        return "Шинэ ажлын байр";
      case "job_match":
        return "Тохирох ажил";
      case "system":
        return "Системийн мэдэгдэл";
      case "new_application":
        return "Шинэ ажил хүлээн авах хүсэл";
      default:
        return "Мэдэгдэл";
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread") return !notif.isRead;
    if (filter === "read") return notif.isRead;
    return true;
  });

  const unreadCount = notifications.filter((notif) => !notif.isRead).length;

  if (loading || loadingNotifications) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Ачаалж байна...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Нэвтрэх шаардлагатай</h1>
          <p className="text-gray-600">Мэдэгдэл харахын тулд нэвтэрнэ үү</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Мэдэгдэл
              </h1>
              <p className="text-gray-600">
                Таны ажлын өргөдөл болон шинэ боломжуудын мэдэгдэл
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Bell className="h-6 w-6 text-gray-500" />
              {unreadCount > 0 && (
                <Badge variant="destructive">{unreadCount}</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              size="sm"
            >
              Бүгд ({notifications.length})
            </Button>
            <Button
              variant={filter === "unread" ? "default" : "outline"}
              onClick={() => setFilter("unread")}
              size="sm"
            >
              Уншаагүй ({unreadCount})
            </Button>
            <Button
              variant={filter === "read" ? "default" : "outline"}
              onClick={() => setFilter("read")}
              size="sm"
            >
              Уншсан ({notifications.length - unreadCount})
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BellOff className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Мэдэгдэл байхгүй
                </h3>
                <p className="text-gray-500 text-center">
                  {filter === "unread"
                    ? "Уншаагүй мэдэгдэл байхгүй байна"
                    : filter === "read"
                    ? "Уншсан мэдэгдэл байхгүй байна"
                    : "Танд мэдэгдэл байхгүй байна"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`transition-all hover:shadow-md ${
                  !notification.isRead
                    ? "border-l-4 border-l-blue-500 bg-blue-50/30"
                    : ""
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium text-gray-900">
                            {notification.title}
                          </h3>
                          <Badge variant="secondary" className="text-xs">
                            {getNotificationTypeText(notification.type)}
                          </Badge>
                          {!notification.isRead && (
                            <Badge variant="default" className="text-xs">
                              Шинэ
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>
                            {moment(notification.createdAt?.toDate()).fromNow()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {!notification.isRead && notification.id && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id!)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Уншсан
                        </Button>
                      )}
                      {notification.id && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(notification.id!)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Mark All as Read */}
        {unreadCount > 0 && (
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  const unreadNotifications = notifications.filter(
                    (n) => !n.isRead && n.id
                  );
                  await Promise.all(
                    unreadNotifications.map((n) =>
                      markNotificationAsRead(n.id!)
                    )
                  );
                  setNotifications((prev) =>
                    prev.map((notif) => ({ ...notif, isRead: true }))
                  );
                  toast.success("Бүх мэдэгдэл уншсан гэж тэмдэглэгдлээ");
                } catch (error) {
                  toast.error("Алдаа гарлаа");
                }
              }}
            >
              Бүгдийг уншсан гэж тэмдэглэх
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
