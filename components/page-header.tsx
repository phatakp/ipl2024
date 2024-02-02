"use client";

import { routes } from "@/lib/routes";
import { usePathname } from "next/navigation";

export const PageHeader = () => {
  const path = usePathname();

  if (!routes.map((route) => route.href).includes(path)) return null;

  return (
    <div className="w-screen bg-darkblue text-darkblue-foreground">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <h1 className="font-heading font-extrabold tracking-wider text-3xl capitalize">
          {path.slice(1)}
        </h1>
      </div>
    </div>
  );
};
