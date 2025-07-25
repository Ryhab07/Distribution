import { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcryptjs';
import nodemailer from 'nodemailer';
import { nanoid } from 'nanoid';
import connectDB from '../../../lib/db';
import UserModel from '../../../models/user';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectDB();

    if (req.method === 'POST') {
        const { email } = req.body;

        try {
            const user = await UserModel.findOne({ email });


            if (!user) {
                res.status(404).json({ error: 'Utilisateur non trouvé' });
                return;
            }

            const nouveauMotDePasse = generateRandomPassword();

            user.password = await hash(nouveauMotDePasse, 12);
            await user.save();

            await envoyerEmailRecuperationMotDePasse(user.email, nouveauMotDePasse);

            res.status(200).json({ message: 'Un email a été envoyé avec le nouveau mot de passe.' });
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Erreur lors de la récupération du mot de passe :', error.message);
                res.status(500).json({ message: 'Erreur interne du serveur' });
            } else {
                console.error('Erreur inattendue lors de la récupération du mot de passe :', error);
                res.status(500).json({ message: 'Erreur interne du serveur' });
            }
        }
    } else {
        res.status(500).json({ message: 'Route non valide' });
    }
}

export default handler;

function generateRandomPassword() {
    return nanoid(12);
}

async function envoyerEmailRecuperationMotDePasse(email: string, nouveauMotDePasse: string) {
    const transporter = nodemailer.createTransport({
        host: "ssl0.ovh.net",
        port: 465,
        secure: true,
        auth: {
          user: "contact@devinov.fr",
          pass: "Devinov2024$",
        },
        tls: {
          rejectUnauthorized: false,
        },
        from: "contact@devinov.fr",
      });

    const optionsMail = {
        from: 'noreply@devinov.fr',
        to: email,
        subject: 'Récupération de mot de passe',
        html: `
            <p>Bonjour,</p>
            <p>Votre nouveau mot de passe est : <strong>${nouveauMotDePasse}</strong></p>
            <p>Assurez-vous de le changer dès que possible.</p>
            <p>Cordialement,</p>
            <p>Votre équipe de support</p>
        `,
    };

    try {
        await transporter.sendMail(optionsMail);
        console.log('Email de récupération de mot de passe envoyé avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email de récupération de mot de passe :', error.message);
    }
}
