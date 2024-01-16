import express from "express";
import brevo from "@getbrevo/brevo";
import { User } from "./models/users.js";

const emailRouter = express.Router();

let apiInstance = new brevo.TransactionalEmailsApi();

let apiKey = apiInstance.authentications["apiKey"];
apiKey.apiKey = process.env.BREVO_API_KEY;

emailRouter.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send("User not found for the given email");
    }

    let sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = "Email di benvenuto";

    sendSmtpEmail.htmlContent = `<html>
    <body>
    <h1 class="font-face-CinzelDecorative">Email di benvenuto a ${user.name} ${user.surname}</h1>
    <p>BenvenutO su ✨GDLove🔮 - il luogo ideale per gli amanti dei libri che
       desiderano connettersi, esplorare nuove letture e partecipare a
       entusiasmanti discussioni letterarie. Siamo un team appassionato
       di lettori e sviluppatori che si sono uniti per creare
       un'esperienza coinvolgente e interattiva per tutti coloro che
       amano immergersi nel mondo della letteratura.</p>
    </body>
    </html>`;
    sendSmtpEmail.sender = {
      name: "GDLove",
      email: "gdlove.wordsforthesoul@gmail.com",
    };
    sendSmtpEmail.to = [{ email: email, name: `${user.name} ${user.surname}` }];
    sendSmtpEmail.replyTo = {
      name: "GDLove",
      email: "gdlove.wordsforthesoul@gmail.com",
    };

    sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };

    sendSmtpEmail.params = {
      parameter: "macarena",
      subject: "Email di benvenuto",
    };

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log(
      "API called successfully. Returned data: " + JSON.stringify(data)
    );

    res.send(data);
  } catch (error) {
    console.error("Error sending welcome email:", error);
    res.status(500).send("Error sending welcome email: " + error.message);
  }
});

export default emailRouter;
