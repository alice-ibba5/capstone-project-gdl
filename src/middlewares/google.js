import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/users.js";

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3330/api/users/google-callback",
  },
  async function (_, __, profile, cb) {
    console.log(profile);

    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      user = await User.create({
        googleId: profile.id,
        name: profile.name.givenName,
        surname: profile.name.familyName,
        email: profile.emails[0].value,
        avatar: profile.photos[0].value,
      });
    }

    cb(null, user);

    // cb(new Error("User not allowed"))
  }
);

export default googleStrategy;
