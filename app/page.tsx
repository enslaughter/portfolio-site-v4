import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import Button from "@/components/Button";
import CollaborativeTextarea from "@/components/CollaborativeTextarea";

export default async function Home() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");
  const user = tokenCookie ? await verifyToken(tokenCookie.value) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <h1>Sign in with GitHub</h1>
      <a href="/api/auth/login">
        <Button>Sign In</Button>
      </a>
      {user && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "1.5rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={user.avatar_url} alt={user.name ?? undefined} width={64} height={64} style={{ borderRadius: "50%" }} />
            <span>{user.name}</span>
          </div>
          <pre style={{ marginTop: "2rem", textAlign: "left" }}>
            {JSON.stringify(user, null, 2)}
          </pre>
        </>
      )}
      <CollaborativeTextarea />
    </div>
  );
}
