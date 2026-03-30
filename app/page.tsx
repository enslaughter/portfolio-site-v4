import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const rawCookie = cookieStore.get("github_user");
  const user = rawCookie ? JSON.parse(rawCookie.value) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <h1>Github OAuth sign in</h1>
      <a href="/api/auth/login">
        <button>Sign In</button>
      </a>
      {user && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "1.5rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={user.avatar_url} alt={user.name} width={64} height={64} style={{ borderRadius: "50%" }} />
            <span>{user.name}</span>
          </div>
          <pre style={{ marginTop: "2rem", textAlign: "left" }}>
            {JSON.stringify(user, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
}
