import { AnvilIcon, HomeIcon, LayoutDashboardIcon } from "lucide-react";

export const routes = [
  {
    name: "HomePage",
    href: "/",
    isProtected: false,
    icon: <HomeIcon className="w-4 h-4" />,
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    isProtected: true,
    icon: <LayoutDashboardIcon className="w-4 h-4" />,
  },
  {
    name: "Matches",
    href: "/matches",
    isProtected: false,
    icon: <AnvilIcon className="w-4 h-4" />,
  },
  {
    name: "Rules",
    href: "/rules",
    isProtected: false,
    icon: <AnvilIcon className="w-4 h-4" />,
  },
];
