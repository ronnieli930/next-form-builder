import { type ClassValue, clsx } from "clsx";
import { v4 as uuidv4 } from "uuid";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function idGenerator(): string {
  return uuidv4();
}
