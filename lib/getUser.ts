import { cache } from "react";
import { cookies } from "next/headers";
import { verifyToken } from "./jwt";

export const getUser = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  return token ? verifyToken(token.value) : null;
});
