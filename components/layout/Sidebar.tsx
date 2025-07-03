"use client";

import { cn } from "@/lib/utils";
import { Brain, FilePlus, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Create New Card",
    href: "/dashboard/cards/new",
    icon: FilePlus,
  },
  {
    label: "Test Yourself",
    href: "/dashboard/cards",
    icon: Brain,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex h-full w-64 flex-col text-neutral-800 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-900 border-r dark:border-neutral-500 border-neutral-200">
      <nav className="mt-20 flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "group flex items-center px-2 py-2 font-medium rounded-md transition-colors",
                isActive
                  ? "bg-neutral-500 text-neutral-100"
                  : "text-neutral-500 dark:text-neutral-300  hover:text-neutral-600 dark:hover:text-neutral-400 hover:bg-neutral-200"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  isActive
                    ? "text-neutral-100"
                    : "text-neutral-500 group-hover:text-neutral-400 dark:text-neutral-100"
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
