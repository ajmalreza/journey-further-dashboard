"use client";

import { Avatar, AvatarFallback } from "./avatar";
import { cn } from "@/lib/utils";

interface AvatarInitialsProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

// Color palette for different background colors
const colorPalette = [
  "bg-blue-500",
  "bg-green-500", 
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-red-500",
  "bg-cyan-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-rose-500",
];

const sizeClasses = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm", 
  lg: "size-12 text-base",
};

export function AvatarInitials({ name, size = "md", className }: AvatarInitialsProps) {
  // Generate initials from name
  const initials = name
    .split(" ")
    .map(word => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Generate a consistent color based on the name
  const colorIndex = name.length % colorPalette.length;
  const colorClass = colorPalette[colorIndex];

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarFallback 
        className={cn(
          colorClass,
          "text-white font-semibold",
          "hover:opacity-80 transition-opacity"
        )}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
