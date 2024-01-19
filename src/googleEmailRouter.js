process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import express from "express";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import googleStrategy from "./middlewares/google.js";

const googleEmailRouter = express.Router();
// Configurazione di nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Middleware per analizzare i dati del corpo della richiesta POST
googleEmailRouter.use(bodyParser.urlencoded({ extended: true }));
googleEmailRouter.use(bodyParser.json());

// Gestisci la richiesta POST
googleEmailRouter.post("/", googleStrategy, async (req, res) => {
  console.log("Richiesta POST ricevuta");
  // Estrai i dati dalla richiesta POST
  const { name, surname, email } = req.body;

  // Configura l'opzione del messaggio
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: `${email}`, // Sostituisci con l'indirizzo email del destinatario desiderato
    subject: "Email di benvenuto!",
    text: `Email di benvenuto a ${name} ${surname}. 
    BenvenutO su ✨GDLove🔮 - il luogo ideale per gli amanti dei libri che
    desiderano connettersi, esplorare nuove letture e partecipare a
    entusiasmanti discussioni letterarie. Siamo un team appassionato
    di lettori e sviluppatori che si sono uniti per creare
    un'esperienza coinvolgente e interattiva per tutti coloro che
    amano immergersi nel mondo della letteratura.`,
  };

  // Invia l'email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).send("Email inviata: " + info.response);
  });
});

export default googleEmailRouter;
