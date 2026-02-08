import NextAuth from "next-auth";

declare global {
  var mongoose: {
    conn: any;
    promise: any;
  };
}

// These tell TypeScript what data our user object contains
declare module "next-auth" {
  interface User {
    id: string
    email: string
    name: string
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    name: string
  }
}

export {};