import axios from "axios";
import { clsx, type ClassValue } from "clsx"
import { useSelector } from "react-redux";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function checkProfileComplete(userId: string) {

  const res = await axios.post('/api/profile', { userId });

  return await res.data.profile.isCompleted;
}