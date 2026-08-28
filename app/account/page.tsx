import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AccountPage from "@/components/account-page";

export default async function AccountRoute() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account");

  return (
    <AccountPage
      email={session.user.email ?? ""}
      name={session.user.name || session.user.email || "Creator"}
    />
  );
}
