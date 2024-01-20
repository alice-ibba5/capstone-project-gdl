process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/users.js";
import nodemailer from "nodemailer";

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:
      "https://capstone-project-gdl-backend.onrender.com/api/users/google-callback",
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

      const transporter = nodemailer.createTransport({
        service: "gmail",
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD2,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
      // Invia l'email di benvenuto
      try {
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

        await transporter.sendMail(mailOptions);
        console.log("Email di benvenuto inviata con successo");
      } catch (error) {
        console.error("Errore durante l'invio dell'email di benvenuto:", error);
        // Gestisci l'errore in modo appropriato, ad esempio, restituisci un errore al chiamante
        return cb(error, null);
      }
    }
    cb(null, user);
  }
);

export default googleStrategy;
