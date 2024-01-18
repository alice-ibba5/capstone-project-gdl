process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import express from "express";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";

const emailAlSitoRouter = express.Router();
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
emailAlSitoRouter.use(bodyParser.urlencoded({ extended: true }));
emailAlSitoRouter.use(bodyParser.json());

// Gestisci la richiesta POST
emailAlSitoRouter.post("/", (req, res) => {
  console.log("Richiesta POST ricevuta");
  // Estrai i dati dalla richiesta POST
  const { user, name, surname, email, message } = req.body;

  // Configura l'opzione del messaggio
  const mailOptions = {
    from: `${email}`,
    to: process.env.EMAIL_USER, // Sostituisci con l'indirizzo email del destinatario desiderato
    subject: "Nuova email dal sito",
    text: `Messaggio da ${name} ${surname} ${message}`,
  };

  // Invia l'email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).send("Email inviata: " + info.response);
  });
});

export default emailAlSitoRouter;
