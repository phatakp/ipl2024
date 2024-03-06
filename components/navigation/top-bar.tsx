import { getAuthServerSession } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const TopBar = async () => {
  const session = await getAuthServerSession();
  return (
    <div
      className={cn(
        "w-screen h-8 align-middle border-b border-input",
        !!session?.user.id
          ? `${session?.user?.profile?.team?.shortName}`
          : "bg-background text-foreground "
      )}
    >
      <div className="max-w-6xl font-bold px-4 mx-auto text-sm pt-1 font-over">
        FPL @2024
      </div>
    </div>
  );
};
