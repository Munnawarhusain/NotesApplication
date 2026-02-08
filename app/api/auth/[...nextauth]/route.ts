import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import connectDB from "@/lib/mongodb"
import Admin from "@/models/Admin"
import bcrypt from "bcryptjs"

// Configuration object for NextAuth
export const authOptions: NextAuthOptions = {
  
  // PROVIDERS: How users can log in
  providers: [
    CredentialsProvider({
      // Name shown on default login page (we're using custom page, so doesn't matter)
      name: "Credentials",
      
      // Define what fields the login form needs
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      
      // AUTHORIZE FUNCTION: This runs when someone tries to log in
      async authorize(credentials) {
        // Step 1: Check if email and password were provided
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide email and password")
        }

        try {
          // Step 2: Connect to MongoDB
          await connectDB()

          // Step 3: Look for admin with this email in database
          const admin = await Admin.findOne({ 
            email: credentials.email.toLowerCase() 
          })

          // Step 4: If no admin found, login fails
          if (!admin) {
            throw new Error("Invalid email or password")
          }

          // Step 5: Compare the password they entered with the hashed password in database
          // bcrypt.compare("password123", "$2a$10$hashed...") → true or false
          const isPasswordValid = await bcrypt.compare(
            credentials.password,  // Plain password from form
            admin.password        // Hashed password from database
          )

          // Step 6: If password doesn't match, login fails
          if (!isPasswordValid) {
            throw new Error("Invalid email or password")
          }

          // Step 7: Login successful! Return user data
          // This data will be stored in the session
          return {
            id: admin._id.toString(),
            email: admin.email,
            name: admin.name,
          }
          
        } catch (error: any) {
          console.error("Auth error:", error)
          throw new Error(error.message || "Authentication failed")
        }
      }
    })
  ],
  
  // PAGES: Custom signIn page (instead of NextAuth's default)
  pages: {
    signIn: '/signIn',  // Use our custom signIn page at /signIn
  },

  // CALLBACKS: Functions that run at specific times
  callbacks: {
    // JWT CALLBACK: Runs when creating the JWT token
    async jwt({ token, user }) {
      // When user first logs in, add their info to the token
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
      }
      return token
    },
    
    // SESSION CALLBACK: Runs when getting session data
    async session({ session, token }) {
      // Add user info from token to session
      // This is what you'll access with useSession()
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
      }
      return session
    }
  },

  // SESSION CONFIG: How sessions work
  session: {
    strategy: "jwt",  // Use JWT tokens (stored in cookies)
    maxAge: 7 * 24 * 60 * 60,  // Session lasts 7 days
  },

  // SECRET: Used to encrypt the JWT token
  secret: process.env.NEXTAUTH_SECRET,
}

// Export as GET and POST handlers (Next.js App Router requirement)
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }