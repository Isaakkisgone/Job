import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// Job interface
export interface Job {
  id?: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  requirements: string[];
  type: "full-time" | "part-time" | "contract" | "temporary";
  jobType?: "full-time" | "part-time" | "contract" | "internship"; // Alternative field name
  category: string;
  postedBy: string; // user ID
  postedAt: Timestamp;
  updatedAt: Timestamp;
  isActive: boolean;
  status?: "active" | "closed" | "draft"; // Job status
  viewCount?: number; // View count for analytics
}

// Job Application interface
export interface JobApplication {
  id?: string;
  jobId: string;
  applicantId: string; // user ID
  employerId: string; // job poster's user ID
  coverLetter?: string;
  resumeUrl?: string;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  appliedAt: Timestamp;
  updatedAt: Timestamp;
}

// User profile interface
export interface UserProfile {
  id?: string;
  uid: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  skills?: string[];
  experience?: string;
  education?: string;
  location?: string;
  userType?: "job_seeker" | "employer" | "admin"; // Хэрэглэгчийн төрөл
  company?: string; // Ажил олгогчийн хувьд
  position?: string; // Ажил олгогчийн албан тушаал
  website?: string; // Ажил олгогчийн вебсайт
  profilePicture?: string; // Профайл зураг
  resume?: string; // CV файлын URL (ажил хайгчийн хувьд)
  savedJobs?: string[]; // job IDs
  appliedJobs?: string[]; // Өргөдөл илгээсэн ажлын ID-ууд
  postedJobs?: string[]; // Нийтэлсэн ажлын ID-ууд (ажил олгогчийн хувьд)
  isVerified?: boolean; // Баталгаажсан эсэх
  verified?: boolean; // Alternative field name for verification
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Notification interface
export interface Notification {
  id?: string;
  userId: string;
  type: "application_status" | "new_job" | "job_match" | "system";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Timestamp;
  data?: {
    jobId?: string;
    applicationId?: string;
    employerId?: string;
  };
}

// Jobs collection functions
export const jobsCollection = collection(db, "jobs");
export const usersCollection = collection(db, "users");
export const applicationsCollection = collection(db, "applications");

// Create a new job
export const createJob = async (
  jobData: Omit<Job, "id" | "postedAt" | "updatedAt">
) => {
  try {
    const now = Timestamp.now();
    const docRef = await addDoc(jobsCollection, {
      ...jobData,
      postedAt: now,
      updatedAt: now,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
};

// Get all jobs
export const getAllJobs = async () => {
  try {
    const q = query(
      jobsCollection,
      where("isActive", "==", true),
      orderBy("postedAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const jobs: Job[] = [];
    querySnapshot.forEach((doc) => {
      jobs.push({ id: doc.id, ...doc.data() } as Job);
    });
    return jobs;
  } catch (error) {
    console.error("Error getting jobs:", error);
    throw error;
  }
};

// Get job by ID
export const getJobById = async (jobId: string) => {
  try {
    const docRef = doc(db, "jobs", jobId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Job;
    } else {
      throw new Error("Job not found");
    }
  } catch (error) {
    console.error("Error getting job:", error);
    throw error;
  }
};

// Update job
export const updateJob = async (jobId: string, updates: Partial<Job>) => {
  try {
    const docRef = doc(db, "jobs", jobId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating job:", error);
    throw error;
  }
};

// Delete job
export const deleteJob = async (jobId: string) => {
  try {
    const docRef = doc(db, "jobs", jobId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting job:", error);
    throw error;
  }
};

// Search jobs
export const searchJobs = async (searchTerm: string, category?: string) => {
  try {
    let q = query(
      jobsCollection,
      where("isActive", "==", true),
      orderBy("postedAt", "desc")
    );

    if (category) {
      q = query(
        jobsCollection,
        where("isActive", "==", true),
        where("category", "==", category),
        orderBy("postedAt", "desc")
      );
    }

    const querySnapshot = await getDocs(q);
    const jobs: Job[] = [];
    querySnapshot.forEach((doc) => {
      const job = { id: doc.id, ...doc.data() } as Job;
      // Simple text search in title, company, and description
      if (
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        jobs.push(job);
      }
    });
    return jobs;
  } catch (error) {
    console.error("Error searching jobs:", error);
    throw error;
  }
};

// User profile functions
export const createUserProfile = async (
  profileData: Omit<UserProfile, "id" | "createdAt" | "updatedAt">
) => {
  try {
    const now = Timestamp.now();
    const docRef = await addDoc(usersCollection, {
      ...profileData,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
};

// Get user profile by UID
export const getUserProfile = async (uid: string) => {
  try {
    const q = query(usersCollection, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as UserProfile;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (
  profileId: string,
  updates: Partial<UserProfile>
) => {
  try {
    const docRef = doc(db, "users", profileId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// Save job to user's saved jobs
export const saveJob = async (userId: string, jobId: string) => {
  try {
    const userProfile = await getUserProfile(userId);
    if (userProfile) {
      const savedJobs = userProfile.savedJobs || [];
      if (!savedJobs.includes(jobId)) {
        savedJobs.push(jobId);
        await updateUserProfile(userProfile.id!, { savedJobs });
      }
    }
  } catch (error) {
    console.error("Error saving job:", error);
    throw error;
  }
};

// Remove job from user's saved jobs
export const unsaveJob = async (userId: string, jobId: string) => {
  try {
    const userProfile = await getUserProfile(userId);
    if (userProfile) {
      const savedJobs = userProfile.savedJobs || [];
      const updatedSavedJobs = savedJobs.filter((id) => id !== jobId);
      await updateUserProfile(userProfile.id!, { savedJobs: updatedSavedJobs });
    }
  } catch (error) {
    console.error("Error unsaving job:", error);
    throw error;
  }
};

// Job Application functions
export const createJobApplication = async (
  applicationData: Omit<JobApplication, "id" | "appliedAt" | "updatedAt">
) => {
  try {
    const now = Timestamp.now();

    // Filter out undefined values to prevent Firestore errors
    const cleanedData = Object.fromEntries(
      Object.entries(applicationData).filter(
        ([_, value]) => value !== undefined
      )
    );

    const docRef = await addDoc(applicationsCollection, {
      ...cleanedData,
      appliedAt: now,
      updatedAt: now,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating job application:", error);
    throw error;
  }
};

// Get applications for a job
export const getJobApplications = async (jobId: string) => {
  try {
    const q = query(
      applicationsCollection,
      where("jobId", "==", jobId),
      orderBy("appliedAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const applications: JobApplication[] = [];
    querySnapshot.forEach((doc) => {
      applications.push({ id: doc.id, ...doc.data() } as JobApplication);
    });
    return applications;
  } catch (error) {
    console.error("Error getting job applications:", error);
    throw error;
  }
};

// Get applications by user
export const getUserApplications = async (userId: string) => {
  try {
    const q = query(
      applicationsCollection,
      where("applicantId", "==", userId),
      orderBy("appliedAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const applications: JobApplication[] = [];
    querySnapshot.forEach((doc) => {
      applications.push({ id: doc.id, ...doc.data() } as JobApplication);
    });
    return applications;
  } catch (error) {
    console.error("Error getting user applications:", error);
    throw error;
  }
};

// Update application status
export const updateApplicationStatus = async (
  applicationId: string,
  status: JobApplication["status"]
) => {
  try {
    // First get the application to get job and applicant info
    const applicationRef = doc(db, "applications", applicationId);
    const applicationDoc = await getDoc(applicationRef);

    if (!applicationDoc.exists()) {
      throw new Error("Application not found");
    }

    const applicationData = applicationDoc.data() as JobApplication;

    // Update the application status
    await updateDoc(applicationRef, {
      status,
      updatedAt: Timestamp.now(),
    });

    // Get job details for notification
    const jobDoc = await getDoc(doc(db, "jobs", applicationData.jobId));
    if (jobDoc.exists()) {
      const jobData = jobDoc.data() as Job;

      // Send notification to applicant
      await sendApplicationStatusNotification(
        applicationData.applicantId,
        jobData.title,
        status,
        applicationId
      );
    }
  } catch (error) {
    console.error("Error updating application status:", error);
    throw error;
  }
};

// Check if user has already applied to a job
export const hasUserAppliedToJob = async (userId: string, jobId: string) => {
  try {
    const q = query(
      applicationsCollection,
      where("applicantId", "==", userId),
      where("jobId", "==", jobId)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking if user applied:", error);
    throw error;
  }
};

// Admin functions
export const getAllUsers = async () => {
  try {
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as UserProfile[];
  } catch (error) {
    console.error("Error getting all users:", error);
    throw error;
  }
};

export const getAllJobApplications = async () => {
  try {
    const applicationsRef = collection(db, "jobApplications");
    const snapshot = await getDocs(applicationsRef);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as JobApplication[];
  } catch (error) {
    console.error("Error getting all job applications:", error);
    throw error;
  }
};

export const getPopularJobs = async (limit: number = 10) => {
  try {
    const jobsRef = collection(db, "jobs");
    const applicationsRef = collection(db, "jobApplications");

    // Get all jobs
    const jobsSnapshot = await getDocs(jobsRef);
    const jobs = jobsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Job[];

    // Get all applications
    const applicationsSnapshot = await getDocs(applicationsRef);
    const applications = applicationsSnapshot.docs.map((doc) =>
      doc.data()
    ) as JobApplication[];

    // Count applications per job
    const jobStats = jobs.map((job) => {
      const applicationCount = applications.filter(
        (app) => app.jobId === job.id
      ).length;
      return {
        id: job.id,
        title: job.title,
        company: job.company,
        applicationCount,
        viewCount: job.viewCount || 0,
      };
    });

    // Sort by application count and return top jobs
    return jobStats
      .sort((a, b) => b.applicationCount - a.applicationCount)
      .slice(0, limit);
  } catch (error) {
    console.error("Error getting popular jobs:", error);
    throw error;
  }
};

export const getMostActiveEmployers = async (limit: number = 10) => {
  try {
    const usersRef = collection(db, "users");
    const jobsRef = collection(db, "jobs");
    const applicationsRef = collection(db, "jobApplications");

    // Get all employers
    const usersSnapshot = await getDocs(usersRef);
    const employers = usersSnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() } as UserProfile))
      .filter((user) => user.userType === "employer");

    // Get all jobs
    const jobsSnapshot = await getDocs(jobsRef);
    const jobs = jobsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Job[];

    // Get all applications
    const applicationsSnapshot = await getDocs(applicationsRef);
    const applications = applicationsSnapshot.docs.map((doc) =>
      doc.data()
    ) as JobApplication[];

    // Calculate stats for each employer
    const employerStats = employers.map((employer) => {
      const employerJobs = jobs.filter((job) => job.postedBy === employer.id);
      const jobIds = employerJobs.map((job) => job.id);
      const applicationsReceived = applications.filter((app) =>
        jobIds.includes(app.jobId)
      ).length;

      return {
        id: employer.id,
        name: employer.name || "Нэр байхгүй",
        company: employer.company || "Компани байхгүй",
        jobsPosted: employerJobs.length,
        applicationsReceived,
      };
    });

    // Sort by total activity (jobs posted + applications received)
    return employerStats
      .sort(
        (a, b) =>
          b.jobsPosted +
          b.applicationsReceived -
          (a.jobsPosted + a.applicationsReceived)
      )
      .slice(0, limit);
  } catch (error) {
    console.error("Error getting most active employers:", error);
    throw error;
  }
};

export const getJobStatistics = async () => {
  try {
    const jobsRef = collection(db, "jobs");
    const snapshot = await getDocs(jobsRef);
    const jobs = snapshot.docs.map((doc) => doc.data()) as Job[];

    return {
      total: jobs.length,
      active: jobs.filter((job) => job.status === "active").length,
      closed: jobs.filter((job) => job.status === "closed").length,
      byType: {
        fullTime: jobs.filter((job) => job.jobType === "full-time").length,
        partTime: jobs.filter((job) => job.jobType === "part-time").length,
        contract: jobs.filter((job) => job.jobType === "contract").length,
        internship: jobs.filter((job) => job.jobType === "internship").length,
      },
    };
  } catch (error) {
    console.error("Error getting job statistics:", error);
    throw error;
  }
};

export const getUserStatistics = async () => {
  try {
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);
    const users = snapshot.docs.map((doc) => doc.data()) as UserProfile[];

    return {
      total: users.length,
      jobSeekers: users.filter((user) => user.userType === "job_seeker").length,
      employers: users.filter((user) => user.userType === "employer").length,
      verified: users.filter((user) => user.verified).length,
    };
  } catch (error) {
    console.error("Error getting user statistics:", error);
    throw error;
  }
};

// Notification functions
export const createNotification = async (
  notificationData: Omit<Notification, "id" | "createdAt">
) => {
  try {
    const notificationsRef = collection(db, "notifications");
    const docRef = await addDoc(notificationsRef, {
      ...notificationData,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

export const getUserNotifications = async (userId: string) => {
  try {
    const notificationsRef = collection(db, "notifications");
    const q = query(
      notificationsRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Notification[];
  } catch (error) {
    console.error("Error getting user notifications:", error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const notificationRef = doc(db, "notifications", notificationId);
    await updateDoc(notificationRef, {
      isRead: true,
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

export const deleteNotification = async (notificationId: string) => {
  try {
    const notificationRef = doc(db, "notifications", notificationId);
    await deleteDoc(notificationRef);
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};

// Helper function to send notification when application status changes
export const sendApplicationStatusNotification = async (
  applicantId: string,
  jobTitle: string,
  status: string,
  applicationId: string
) => {
  try {
    let title = "";
    let message = "";

    switch (status) {
      case "accepted":
        title = "Өргөдөл хүлээн авагдлаа!";
        message = `Таны "${jobTitle}" ажлын байранд илгээсэн өргөдөл хүлээн авагдлаа.`;
        break;
      case "rejected":
        title = "Өргөдлийн хариу";
        message = `Таны "${jobTitle}" ажлын байранд илгээсэн өргөдөл татгалзагдлаа.`;
        break;
      case "reviewed":
        title = "Өргөдөл шалгагдаж байна";
        message = `Таны "${jobTitle}" ажлын байранд илгээсэн өргөдөл шалгагдаж байна.`;
        break;
      default:
        return;
    }

    await createNotification({
      userId: applicantId,
      type: "application_status",
      title,
      message,
      isRead: false,
      data: {
        applicationId,
      },
    });
  } catch (error) {
    console.error("Error sending application status notification:", error);
  }
};
