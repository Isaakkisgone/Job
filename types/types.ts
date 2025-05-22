interface Job {
  _id: string;
  title: string;
  description: string;
  location: string;
  salary: number;
  salaryType: "Жил" | "Сар" | "Өдөр" | "Цаг";
  negotiable: boolean;
  jobType: string[];
  tags: string[];
  likes: string[];
  skills: string[];
  applicants: string[];
  createdBy: {
    _id: string;
    profilePicture: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}
export type { Job };
