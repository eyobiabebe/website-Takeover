import axios from "axios";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function checkProfileComplete(userId: string) {

  const res = await axios.post('/api/profile', { userId }, { withCredentials: true });

  return await res.data.profile.isCompleted;
}