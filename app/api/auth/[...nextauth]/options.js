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

      // console.log("Current user:", currentUser);

      user.db_id = currentUser._id;
      user.collegeName = currentUser.collegeName;
      user.isAdmin = currentUser.isAdmin;
      user.profilePic = currentUser.profilePic;
      user.interestCategories = currentUser.interestCategories;
      user.interestSubcategories = currentUser.interestSubcategories;
      user.requestPending = currentUser.requestPending;
      user.connection = currentUser.connection;
      return user;
    },
    async redirect({ url, baseUrl }) {
      if (url === `${baseUrl}/api/auth/signin`) {
        return `${baseUrl}/discussions`;
      } else if (url === `${baseUrl}/api/auth/signout`) {
        return `${baseUrl}/`;
      }
      return url.startsWith(baseUrl) ? url : baseUrl;
    },

    // for server side
    async jwt({ token, user }) {
      if (user) {
        token.isAdmin = user.isAdmin;
        token.interestCategories = user.interestCategories;
        token.interestSubcategories = user.interestSubcategories;
        token.profilePic = user.profilePic;
        token.isAdmin = user.isAdmin;
        token.collegeName = user.collegeName;
        token.db_id = user.db_id;
        token.requestPending = user.requestPending;
        token.connection = user.connection;
      }
      return token;
    },
    // for client side
    async session({ session, token }) {
      if (session?.user) {
        session.user.isAdmin = token.isAdmin;
        session.user.db_id = token.db_id;
        session.user.interestCategories = token.interestCategories;
        session.user.interestSubcategories = token.interestSubcategories;
        session.user.collegeName = token.collegeName;
        session.user.profilePic = token.profilePic;
        session.user.isAdmin = token.isAdmin;
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
  // pages: { signIn: "/auth/signIn" },
};
