export interface Child {
  full_name: string;
  age?: string;
  experience?: "beginner" | "intermediate" | "advanced";
  availability?: string[];
}

export interface Parent {
  name: string;
  email: string;
  phone: string;
}

