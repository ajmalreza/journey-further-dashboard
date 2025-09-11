"use client";

import { BarChart3, Menu } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-sidebar flex items-center justify-between px-6 shadow-lg z-50">
      {/* Left side - Logo and Brand */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-sidebar-foreground/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
          <BarChart3 className="h-5 w-5 text-sidebar-foreground" />
        </div>
        <Link href="/dashboard" className="flex items-center space-x-2">
          <span className="text-xl font-semibold text-sidebar-foreground">
            Campaign Dashboard
          </span>
        </Link>
      </div>

      {/* Right side - Mobile menu button (hidden on desktop) */}
      <div className="lg:hidden">
        <button className="text-sidebar-foreground hover:text-sidebar-foreground/80 transition-colors">
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
}