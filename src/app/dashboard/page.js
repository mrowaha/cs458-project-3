"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to login if not authenticated
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>You successfully logged in as: {session.user?.name}</h1>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
