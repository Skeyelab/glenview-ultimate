import type { Parent, Child } from "@/lib/register-types";

export const sampleParent1: Parent = {
  name: "John Doe",
  email: "john@example.com",
  phone: "555-0100",
};

export const sampleParent2: Parent = {
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "555-0101",
};

export const sampleChild1: Child = {
  full_name: "Alice Doe",
  age: "10",
  experience: "beginner",
  availability: ["Mon", "Wed", "Fri"],
};

export const sampleChild2: Child = {
  full_name: "Bob Doe",
  age: "12",
  experience: "intermediate",
  availability: ["Tue", "Thu"],
};

export const sampleChild3: Child = {
  full_name: "Charlie Doe",
  age: "14",
  experience: "advanced",
  availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
};

export const sampleNotes = "Please note any allergies or special considerations.";
