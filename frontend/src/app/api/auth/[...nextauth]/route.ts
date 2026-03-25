import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // This runs when Google sends the user back to us
    async signIn({ user }) {
      if (!user.email) return false;

      try {
        // CALL THE DJANGO BRIDGE
        const response = await fetch(
          `${process.env.BASE_URL}/users/auth/bridge/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Internal-Secret": process.env.INTERNAL_AUTH_SECRET!,
            },
            body: JSON.stringify({
              email: user.email,
              first_name: user.name?.split(" ")[0] || "",
              last_name: user.name?.split(" ")[1] || "",
            }),
          },
        );

        if (response.ok) {
          const data = await response.json();
          // We attach the Django JWTs to the user object
          // so they persist into the NextAuth JWT token
          user.accessToken = data.access;
          user.refreshToken = data.refresh;
          return true;
        }
        return false;
      } catch (error) {
        console.error("Django Auth Bridge failed:", error);
        return false;
      }
    },

    // Persist the Django Tokens into the session
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },

    // Make the access token available to your frontend components
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
