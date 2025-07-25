import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import ContactFormModel from "@/models/contactForm";
import connectDB from "@/lib/db"; // Import the function for connecting to the database

const transporter = nodemailer.createTransport({
  host: "ssl0.ovh.net",
  port: 465,
  secure: true,
  auth: {
    user: "contact@devinov.fr",
    pass: "Devinov2022$",
  },
  tls: {
    rejectUnauthorized: false,
  },
  from: "contact@devinov.fr",
});

const sendConfirmationEmailToUser = async (formData) => {
  try {
    const mailOptions = {
      from: "noreply@devinov.fr",
      to: formData.email,
      subject: "Confirmation de réception de votre message",
      text: `Bonjour ${formData.fullName},

Nous avons bien reçu votre message et nous vous en remercions. Un membre de notre équipe vous contactera dans les plus brefs délais.

Cordialement,
L'equie EcoBL`,
    };

    await transporter.sendMail(mailOptions);
    console.log("E-mail de confirmation envoyé à l'utilisateur avec succès");
  } catch (error) {
    console.error(
      "Erreur lors de l'envoi de l'e-mail de confirmation à l'utilisateur :",
      error
    );
    throw new Error(
      "Échec de l'envoi de l'e-mail de confirmation à l'utilisateur"
    );
  }
};

const sendEmailToAdmin = async (formData) => {
  try {
    const mailOptions = {
      from: "noreply@devinov.fr",
      to: "soufien@devinov.fr",
      subject: "Nouveau message depuis le formulaire de contact",
      text: `Nouveau message reçu depuis le formulaire de contact :

Nom complet : ${formData.fullName}
Email : ${formData.email}
Message : ${formData.demande}

Cordialement,
L'équipe EcoBL`,
    };

    await transporter.sendMail(mailOptions);
    console.log("E-mail envoyé à l'administrateur avec succès");
  } catch (error) {
    console.error(
      "Erreur lors de l'envoi de l'e-mail à l'administrateur :",
      error
    );
    throw new Error("Échec de l'envoi de l'e-mail à l'administrateur");
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const formData = req.body;
      // Connect to the database
      await connectDB();
      // Create a new contact form document using the ContactFormModel
      const newContactForm = await ContactFormModel.create(formData);
      // Wait for the document to be saved in the database before sending the email
      await newContactForm.save();
      // Send confirmation email to the user
      await sendConfirmationEmailToUser(formData);
      await sendEmailToAdmin(formData);
      res.status(200).json({
        success: true,
        message: "Votre message a été envoyé avec succès",
      });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: "Méthode non autorisée" });
  }
}
