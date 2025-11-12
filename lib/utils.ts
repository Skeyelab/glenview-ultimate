import type { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  const filtered = inputs.filter(Boolean);
  // Convert to string and merge - twMerge handles the string merging
  const classString = filtered.map(String).join(" ");
  return twMerge(classString);
}
