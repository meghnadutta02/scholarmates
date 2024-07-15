import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import connect from "@/app/config/db";
import User from "@/app/(models)/userModel";

export const options = {
  providers: [
    GitHubProvider({
      profile(profile) {
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
      const { name, email, isAdmin, picture } = user || profile;

      let currentUser = await User.findOne({ email });

      if (!currentUser) {
        currentUser = await User.create({
          name,
          email,
          isAdmin,
          profilePic: picture,
        });
      }

      user.db_id = currentUser._id;
      user.collegeName = currentUser.collegeName;
      user.isAdmin = currentUser.isAdmin;
      user.profilePic = currentUser.profilePic;
      user.interestCategories = currentUser.interestCategories;
      user.name = currentUser.name;
      user.interestSubcategories = currentUser.interestSubcategories;
      user.requestPending = currentUser.requestPending;
      user.connection = currentUser.connection;
      return user;
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.isAdmin = user.isAdmin;
        token.interestCategories = user.interestCategories;
        token.interestSubcategories = user.interestSubcategories;
        token.profilePic = user.profilePic;
        token.name = user.name;
        token.collegeName = user.collegeName;
        token.db_id = user.db_id;
        token.requestPending = user.requestPending;
        token.connection = user.connection;
      }

      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.collegeName) token.collegeName = session.collegeName;
        if (session.profilePic) token.profilePic = session.profilePic;
        if (session.interestCategories)
          token.interestCategories = session.interestCategories;
        if (session.interestSubcategories)
          token.interestSubcategories = session.interestSubcategories;
        if (session.requestPending)
          token.requestPending = session.requestPending;
        if (session.connection) token.connection = session.connection;
      }

      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        session.user.isAdmin = token.isAdmin;
        session.user.db_id = token.db_id;
        session.user.interestCategories = token.interestCategories;
        session.user.interestSubcategories = token.interestSubcategories;
        session.user.collegeName = token.collegeName;
        session.user.profilePic = token.profilePic;
        session.user.name = token.name;
        session.user.requestPending = token.requestPending;
        session.user.connection = token.connection;
      }
      return session;
    },
  },

  theme: {
    colorScheme: "light",
    logo: "/logo.png",
  },
};

export default NextAuth(options);
