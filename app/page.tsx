import { getUser } from "@/lib/getUser";
import Button from "@/components/Button";
import CollaborativeTextarea from "@/components/CollaborativeTextarea";

export default async function Home() {
  const user = await getUser();

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: "1rem" }}>
      {user ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={user.avatar_url} alt={user.name ?? undefined} width={64} height={64} style={{ borderRadius: "50%" }} />
          <span style={{ fontWeight: 700 }}>{user.name}</span>
          <form action="/api/auth/logout" method="POST">
            <Button type="submit">Sign Out</Button>
          </form>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
          <h1 style={{ margin: 0 }}>Sign in</h1>
          <a href="/api/auth/login">
            <Button>Sign in with GitHub</Button>
          </a>
        </div>
      )}
      <CollaborativeTextarea />
    </div>
  );
}
