import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import connect from "@/app/config/db";

import User from "@/app/(models)/userModel";

export const options = {
  providers: [
    GitHubProvider({
      profile(profile) {
        return { ...profile };
      },
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      profile(profile) {
        return {
          ...profile,
          id: profile.sub,
        };
      },
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, profile }) {
      await connect();
      const { name, email, picture, login } = user || profile;

      let currentUser = await User.findOne({ email });

      if (!currentUser) {
        currentUser = await User.create({
          name: name || login,
          email,
          profilePic: picture,
        });
      }

      // Add user details to the user object to be used in JWT callback
      user.db_id = currentUser._id;
      user.collegeName = currentUser.collegeName;
      user.isAdmin = currentUser.isAdmin;
      user.profilePic = currentUser.profilePic;
      user.interestCategories = currentUser.interestCategories;
      user.name = currentUser.name;
      user.interestSubcategories = currentUser.interestSubcategories;

      user.degree = currentUser.degree;
      user.yearInCollege = currentUser.yearInCollege;
      user.bio = currentUser.bio;
      user.dob = currentUser.dob;
      user.updatedAt = currentUser.updatedAt;

      return user;
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        // Add user details to the token
        token.isAdmin = user.isAdmin;
        token.interestCategories = user.interestCategories;
        token.interestSubcategories = user.interestSubcategories;
        token.profilePic = user.profilePic;
        token.name = user.name;
        token.collegeName = user.collegeName;
        token.db_id = user.db_id;

        token.degree = user.degree;
        token.yearInCollege = user.yearInCollege;
        token.bio = user.bio;
        token.dob = user.dob;
        token.updatedAt = user.updatedAt;
      }

      if (trigger === "update" && session) {
        Object.assign(token, {
          name: session.name || token.name,
          collegeName: session.collegeName || token.collegeName,
          profilePic: session.profilePic || token.profilePic,
          interestCategories:
            session.interestCategories || token.interestCategories,
          interestSubcategories:
            session.interestSubcategories || token.interestSubcategories,
          degree: session.degree || token.degree,
          bio: session.bio !== undefined ? session.bio : token.bio,
          dob: session.dob !== undefined ? session.dob : token.dob,
          yearInCollege:
            session.yearInCollege !== undefined
              ? session.yearInCollege
              : token.yearInCollege,
        });
      }

      if (token.db_id) {
        await connect();
        const currentUser = await User.findById(token.db_id);
        if (currentUser) {
          const updatedAt = new Date(currentUser.updatedAt).getTime();
          const tokenUpdatedAt = token.updatedAt
            ? new Date(token.updatedAt).getTime()
            : 0;

          if (updatedAt > tokenUpdatedAt) {
            Object.assign(token, {
              isAdmin: currentUser.isAdmin,
              interestCategories: currentUser.interestCategories,
              interestSubcategories: currentUser.interestSubcategories,
              profilePic: currentUser.profilePic,
              name: currentUser.name,
              collegeName: currentUser.collegeName,

              degree: currentUser.degree,
              yearInCollege: currentUser.yearInCollege,
              bio: currentUser.bio,
              dob: currentUser.dob,
              updatedAt: currentUser.updatedAt,
            });
          }
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        Object.assign(session.user, {
          isAdmin: token.isAdmin,
          db_id: token.db_id,
          interestCategories: token.interestCategories,
          interestSubcategories: token.interestSubcategories,
          collegeName: token.collegeName,
          profilePic: token.profilePic,
          name: token.name,

          degree: token.degree,
          yearInCollege: token.yearInCollege,
          bio: token.bio,
          dob: token.dob,
        });
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
