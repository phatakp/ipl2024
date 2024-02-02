import { getAuthServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthServerSession();

  if (!session?.user?.id) redirect("/sign-in");

  return <main className="">{children}</main>;
}
