import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenAddress(address: string) {
  if (!address) return "";

  const start = address.substring(0, 6);
  const end = address.substring(address.length - 4);

  return `${start}...${end}`;
}
