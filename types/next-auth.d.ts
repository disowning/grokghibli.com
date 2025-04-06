import "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
      credits: number;
      credits_reset_at: string | null;
    };
  }

  interface User {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    credits?: number;
    credits_reset_at?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    credits?: number;
    credits_reset_at?: string | null;
  }
} 