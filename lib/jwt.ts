import { SignJWT, jwtVerify } from "jose";

export interface JWTPayload {
  id: string;
  provider: "github" | "google";
  name: string | null;
  avatar_url: string;
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET);
const ALG = "HS256";

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}
