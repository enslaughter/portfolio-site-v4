export async function GET() {
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    scope: "read:user",
  });

  return Response.redirect(
    `https://github.com/login/oauth/authorize?${params}`
  );
}