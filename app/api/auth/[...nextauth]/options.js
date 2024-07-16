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
      user.degree = currentUser.degree;
      user.yearInCollege = currentUser.yearInCollege;
      user.bio = currentUser.bio;
      user.dob = currentUser.dob;
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
        token.degree = user.degree;
        token.yearInCollege = user.yearInCollege;
        token.bio = user.bio;
        token.dob = user.dob;
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
        if (session.degree) token.degree = session.degree;
        if (session.bio !== null) token.bio = session.bio;

        // Reverting to the previous version...
        if (session.dob) token.dob = session.dob;
        if (session.yearInCollege) token.yearInCollege = session.yearInCollege;

        // 2 cases need to be considered
        // 1- Profile update  : DOB and Year null value needs to be accessed when user clears the fields
        // Checking for Eg; "if(session.Year || session.Year === null)" is the same as updating everytime without any condition
        //  i.e. what i did previously just token.dob = session.dob

        // If we do token.dob=session.dob without conditions, then problem arises on ACCEPT requests & REMOVE users
        // As only connection object is being sent, the dob & yearInCollege get updated to null
        // hence the profile progress drops faultily

        // Possible solns. -
        // -  Spread and send the session dob and year along with the connection array while accept/ remove
        //     Ofc this requires dob and year to be sent on every update (Probably the easier approach)
        // -  Use a nested if for the null value cases to update to null values by passing an empty string from profile update
        //  if (session.dob) {
        //     if (session.dob === "") token.dob = null;
        //     else token.dob = session.dob;
        // Because this null [ Number and Date ] is being used in Profile Progress
        // Note : date = "" converts to the default value 1970... and must be null on empty unless converted to string
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
        session.user.degree = token.degree;
        session.user.yearInCollege = token.yearInCollege;
        session.user.bio = token.bio;
        session.user.dob = token.dob;
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
