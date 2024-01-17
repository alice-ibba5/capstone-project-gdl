import express from "express";
import brevo from "@getbrevo/brevo";
import { User } from "./models/users.js";

const emailContattiRouter = express.Router();

let apiInstance = new brevo.TransactionalEmailsApi();

let apiKey = apiInstance.authentications["apiKey"];
apiKey.apiKey = process.env.BREVO_API_KEY;

emailContattiRouter.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send("User not found for the given email");
    }

    let sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = "Abbiamo ricevuto la tua email!";

    sendSmtpEmail.htmlContent = `<html>
    <body>
    <h1 class="font-face-CinzelDecorative">Ciao ${user.name} ${user.surname}!</h1>
    <p>La tua richiesta è stata presa in carico e ti risponderemo non appena possibile.
    Nel frattempo, buona lettura!</p>
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
      subject: "Email di conferma",
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

export default emailContattiRouter;
