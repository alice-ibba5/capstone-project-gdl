import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/users.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  // Configura le tue credenziali per l'invio di email
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

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

      // Invia l'email di benvenuto
      const mailOptions = {
        from: "gdlove.wordsforthesoul@gmail.com",
        to: user.email,
        subject: "Email di benvenuto!",
        text: `Email di benvenuto a ${user.name} ${user.surname}. 
        BenvenutO su ✨GDLove🔮 - il luogo ideale per gli amanti dei libri che
        desiderano connettersi, esplorare nuove letture e partecipare a
        entusiasmanti discussioni letterarie. Siamo un team appassionato
        di lettori e sviluppatori che si sono uniti per creare
        un'esperienza coinvolgente e interattiva per tutti coloro che
        amano immergersi nel mondo della letteratura.`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
        } else {
          console.log("Email di benvenuto inviata: " + info.response);
        }
      });
    }

    cb(null, user);
  }
);

export default googleStrategy;
