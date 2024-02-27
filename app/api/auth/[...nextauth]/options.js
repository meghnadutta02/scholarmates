import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import connect from "@/app/config/db";
import User from "@/app/(models)/userModel";

export const options = {
  providers: [
    GitHubProvider({
      profile(profile) {
        //console.log("Profile Github: ", profile);
        let isAdmin = false;
        if (profile?.email === "meghnakha18@gmail.com") {
          isAdmin = true;
        }
        return {
          ...profile,
          isAdmin,
        };
      },
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      profile(profile) {
        //console.log("Profile Google: ", profile);
        let isAdmin = false;
        if (profile?.email === "meghnakha18@gmail.com") {
          isAdmin = true;
        }
        return {
          ...profile,
          id: profile.sub,
          isAdmin,
        };
      },
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, profile }) {
      await connect();
      const { name, email, isAdmin } = user || profile;

      let currentUser = await User.findOne({ email });

      if (!currentUser) {
        currentUser = await User.create({
          name,
          email,
          isAdmin,
        });
      }

      user.db_id = currentUser._id;
      user.collegeName = currentUser.collegeName;
      user.interests = currentUser.interests.length;
      console.log("User: ", user.interests);
      return user;
    },

    // for server side
    async jwt({ token, user }) {
      if (user) {
        token.isAdmin = user.isAdmin;
        token.interests = user.interests;
        token.collegeName = user.collegeName;
        token.db_id = user.db_id;
      }
      return token;
    },
    // for client side
    async session({ session, token }) {
      if (session?.user) {
        session.user.isAdmin = token.isAdmin;
        session.user.db_id = token.db_id;
        session.user.interests = token.interests;
        session.user.collegeName = token.collegeName;
      }
      return session;
    },
  },
  theme: {
    colorScheme: "light",
    logo: "/logo.png",
  },
  // pages: { signIn: "/auth/signIn" },
};
