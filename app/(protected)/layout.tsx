import { getAuthServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const revalidate = 0;
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthServerSession();

  if (!session?.user?.id) redirect("/sign-in");

  return <main>{children}</main>;
}
