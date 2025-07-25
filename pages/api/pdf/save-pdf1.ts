import logError from "@/utils/logger";
import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import path from "path";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "200mb", 
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const {
      pdfBase64_1,
      pdfBase64_2,
      emailAddress,
      directory1,
      directory2,
      refcommande,
      cartitem,
      name,
      lastname,
    } = req.body;
    console.log("name last name client: " , name + lastname);
    const today = new Date();
    // Format the date in French format (DD/MM/YY)
    const formattedDate = new Intl.DateTimeFormat("fr-FR").format(today);

    try {
      // Convert the base64 strings to ArrayBuffers
      const buffer1 = Buffer.from(pdfBase64_1, "base64").buffer;
      const buffer2 = Buffer.from(pdfBase64_2, "base64").buffer;

      // Save the ArrayBuffers as PDFs in the specified directories
      const fs = await import("fs/promises");

      const pdfPath1 = path.join(
        process.cwd(),
        "pdfs",
        directory1,
        `${refcommande}_BC.pdf`
      );
      const pdfPath2 = path.join(
        process.cwd(),
        "pdfs",
        directory2,
        `${refcommande}_BR.pdf`
      );

      await fs.mkdir(path.dirname(pdfPath1), { recursive: true });
      await fs.mkdir(path.dirname(pdfPath2), { recursive: true });

      await fs.writeFile(pdfPath1, Buffer.from(buffer1));
      await fs.writeFile(pdfPath2, Buffer.from(buffer2));

      // Send email with attachments
      const transporter = nodemailer.createTransport({
        host: "ssl0.ovh.net",
        port: 465,
        secure: true,
        auth: {
          user: "contact@devinov.fr",
          pass: "Devinov2023@",
        },
        tls: {
          rejectUnauthorized: false,
        },
        from: "contact@devinov.fr",
      });

      let mailOptionsClient;
      let mailOptionsOns;

      // Check if the cart contains "Coffret AC Personnalisé"
      const containsCoffret =
        Array.isArray(cartitem) &&
        cartitem.some((item) => item.name === "Coffret AC Personnalisé");

      /*if (containsCoffret) {
        // Send email only to ons.jannet13@gmail.com
        mailOptionsOns = {
          from: 'noreply@devinov.fr',
          to: emailAddress, 
          subject: `Confirmation de votre commande - ${refcommande} sur LARNA.com`,
          text: `Bonjour,\n\nNous vous remercions pour votre commande ${refcommande} passée sur notre plateforme ECOBL.\nNous sommes ravis de vous confirmer que votre commande incluant un coffret AC personnalisé a été bien reçue et est actuellement en cours de traitement.\n\nNotre équipe commerciale met tout en œuvre pour s'assurer que votre commande soit traitée avec le plus grand soin et dans les meilleurs délais. Nous comprenons l'importance de cette commande pour vous et nous nous engageons à maintenir une communication claire et régulière jusqu'à sa finalisation.\n\nVous serez contacté directement par téléphone ou par email dès que votre commande sera validée et prête. Vous recevrez également toutes les informations nécessaires concernant le suivi de votre commande.\n\nSi vous avez des questions ou besoin de précisions supplémentaires en attendant, n'hésitez pas à nous contacter. Nous sommes là pour vous assister et répondre à toutes vos interrogations.\n\nNous vous remercions de votre confiance.\n\nCordialement,\nService Client EcoNegoce`,
        };
        
        mailOptionsClient = {
          from: 'noreply@devinov.fr',
          to: 'commandes@econegoce.com',
          subject: `Documents relatifs à la commande - ${refcommande}`,
          text: `Bonjour,\n\nVeuillez trouver ci-joint les documents liés à la commande ${refcommande}.\n\nCordialement,\nService Client EcoNegoce`,
          attachments: [
            {
              filename: `${refcommande}_BC.pdf`,
              path: pdfPath1,refcommande
            },
            {
              filename: `${refcommande}_BR.pdf`,
              path: pdfPath2,
            },
          ],
        };
      } else {
        // Send email to client
        //'commandes@econegoce.com'
        mailOptionsClient = {
          from: 'noreply@devinov.fr',
          to: [emailAddress, 'ons-121@hotmail.com', 'commandes@econegoce.com'],
          subject: `Documents relatifs à la commande - ${refcommande}`,
          text: `Bonjour,\n\nVeuillez trouver ci-joint les documents liés à la commande ${refcommande}.\n\nCordialement,\nService Client EcoNegoce`,
          attachments: [
            {
              filename: `${refcommande}_BC.pdf`,
              path: pdfPath1,
            },
            {
              filename: `${refcommande}_BR.pdf`,
              path: pdfPath2,
            },
          ],
        };
        
        mailOptionsOns = { ...mailOptionsClient };
      }*/

      if (containsCoffret) {
        // Send email only to ons.jannet13@gmail.com
        mailOptionsOns = {
          from: "noreply@devinov.fr",
          to: emailAddress,
          subject: `Confirmation de votre commande - ${refcommande} sur LARNA.com`,
          html: `<body
          style="margin: 0; padding: 0; font-family: 'Poppins', Arial, Helvetica, sans-serif; background: #FFFFFF; width: 100%; margin-left: auto; margin-right: auto;">
      
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tbody>
                  <tr>
                      <td style="position: relative; margin-bottom: 10px;">
                          <div style="border-color: #ccc; position: absolute; left: 50%; transform: translateX(-50%); 
                              background-color: #fab516; width: 700px;
                              z-index: 5; height: 10%; border-radius: 15px;  margin-left: auto; margin-right: auto; 
                              display: flex; justify-content: center; margin-top: 0px"></div>
                      
                          <div style="position: relative; z-index: 10; background: #F0F0F0; padding: 10px 0; margin: 10px 0;  width: 1000px; height: 700px; margin-left: auto; margin-right: auto; border-radius: 20px; border: 1px solid #DFDFDF;">
                              <table width="100%" border="0" cellspacing="0" cellpadding="0"
                                  style="max-width: 840px; margin: 0 auto; padding: 0; font-size: 15px; font-family: Arial, Helvetica;">
                                  <tbody>
                                      <tr>
                                          <td>
                                              <center>
                                                  <img src="https://i.ibb.co/S551gy3/LOGO-long-black.png" alt="LARNA.com"
                                                      style="max-width: 640px;  max-height: 40px; margin-bottom: 20px; margin-top: 20px;">
                                              </center>
                                              <table cellspacing="0" cellpadding="0" width="100%"
                                                  style="font-family: Arial, Helvetica, sans-serif;">
                      
                                                  <tbody style="text-align: start; width: 100%;">
                                                      <tr>
                                                          <td>
                                                              <p>Bonjour ${name},</p>
                                                              <p>Nous vous remercions d'avoir passé votre commande chez
                                                            LARNA ! </p>
                                                        <p>Nous sommes ravis de vous confirmer que votre commande incluant un coffret AC personnalisé a été bien reçue et est actuellement en cours de traitement.</p>
                                                        <p>nNotre équipe commerciale met tout en œuvre pour s'assurer que votre commande soit traitée avec le plus grand soin et dans les meilleurs délais. Nous comprenons l'importance de cette commande pour vous et nous nous engageons à maintenir une communication claire et régulière jusqu'à sa finalisation.</p>
                                                        <p>Vous serez contacté directement par téléphone ou par email dès que votre commande sera validée et prête. Vous recevrez également toutes les informations nécessaires concernant le suivi de votre commande.</p>

                                                        <p>
                                                            Si vous avez des questions ou besoin d'assistance concernant
                                                            votre commande ou le processus de retrait,
                                                            n'hésitez pas à contacter notre service client au 01 88 83
                                                            88 58.
                                                        </p>
                
                
                                                        <p>
                                                            Nous vous remercions de votre confiance et nous avons hâte
                                                            de vous voir lors du retrait de votre commande.
                                                            Cordialement,
                                                        </p><br />
                      
                                                              <p>Service Client </p>
                                                              <p style="margin-top: -20px;">LARNA </p>
                                                              <p style="margin-top: -20px;">01 88 83 88 58</p>
                                                              <p style="margin-top: -20px;">www.econegoce.com</p>
                                                          </td>
                                                      </tr>
                                                  </tbody>
                                              </table>
                                          </td>
                                      </tr>
                                  </tbody>
                              </table>
                          </div>
                          <div style="border-color: #ccc; position: absolute; left: 50%; transform: translateX(-50%); 
                          margin-top: -60px; background-color: #fab516; width: 700px;
                          z-index: 5; height: 10%; border-radius: 15px;  margin-left: auto; margin-right: auto; 
                          display: flex; justify-content: center;"></div>
                      </td>
                      
                  </tr>
              </tbody>
          </table>
      </body>`,
        };

        mailOptionsClient = {
          from: "noreply@devinov.fr",
          to: "commandes@econegoce.com",
          subject: `Nouvelle commande à préparer - ${refcommande}`,
          html: `<body
          style="margin: 0; padding: 0; font-family: 'Poppins', Arial, Helvetica, sans-serif; background: #FFFFFF; width: 100%; margin-left: auto; margin-right: auto;">
      
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tbody>
                  <tr>
                      <td style="position: relative; margin-bottom: 10px;">

                      
                          <div style="position: relative; z-index: 10; background: #F0F0F0; padding: 10px 0; margin: 10px 0;  width: 1000px; height: 550px; margin-left: auto; margin-right: auto; border-radius: 20px; border: 1px solid #DFDFDF;">
                              <table width="100%" border="0" cellspacing="0" cellpadding="0"
                                  style="max-width: 840px; margin: 0 auto; padding: 0; font-size: 15px; font-family: Arial, Helvetica;">
                                  <tbody>
                                      <tr>
                                          <td>
                                              <center>
                                                  <img src="https://i.ibb.co/S551gy3/LOGO-long-black.png" alt="LARNA.com"
                                                      style="max-width: 640px;  max-height: 40px; margin-bottom: 20px; margin-top: 20px;">
                                              </center>
                                              <table cellspacing="0" cellpadding="0" width="100%"
                                                  style="font-family: Arial, Helvetica, sans-serif;">
                      
                                                  <tbody style="text-align: start; width: 100%;">
                                                      <tr>
                                                          <td>
                                                              <p>Bonjour,</p>
                                                              <p>Une nouvelle commande a été passée sur la boutique en ligne ! </p>
                                                              <p style="font-weight: bold;">Détails de la commande :</p>
                                                              <ul>

                                                                  <li>Nom et Prénom du client : ${name} ${lastname}</li>
                                                                  <li>Numéro de commande : ${refcommande}</li>
                                                                  <li>Date de commande : ${formattedDate}</li>
                      
                                                              </ul>
                      
                                                              <p>
                                                                  Bon de retrait en pièce jointe : Nous avons inclus le bon de retrait de la commande en pièce jointe à cet e-mail. 
                                                                  Ce document contient toutes les informations nécessaires pour la préparation et le retrait de la commande. 
                                                                  Veuillez l'imprimer et l'attacher à la commande une fois préparée.
                                                              </p><br />
                      
                                                              <p>Cordialement,</p>
                                                          </td>
                                                      </tr>
                                                  </tbody>
                                              </table>
                                          </td>
                                      </tr>
                                  </tbody>
                              </table>
                          </div>
                          <div style="border-color: #ccc; position: absolute; left: 50%; transform: translateX(-50%); 
                          margin-top: -60px; background-color: #fab516; width: 700px;
                          z-index: 5; height: 10%; border-radius: 15px;  margin-left: auto; margin-right: auto; 
                          display: flex; justify-content: center;"></div>
                      </td>
                      
                  </tr>
              </tbody>
          </table>
      </body>`,
          attachments: [
            {
              filename: `${refcommande}_BC.pdf`,
              path: pdfPath1,
              refcommande,
            },
            {
              filename: `${refcommande}_BR.pdf`,
              path: pdfPath2,
            },
          ],
        };
      } else {
        // Send email to client
        //'commandes@econegoce.com'
        mailOptionsClient = {
          from: "noreply@devinov.fr",
          to: [emailAddress, "commandes@econegoce.com"],
          subject: `Confirmation de votre commande - ${refcommande}`,
          html: `<body
          style="margin: 0; padding: 0; font-family: 'Poppins', Arial, Helvetica, sans-serif; background: #FFFFFF; width: 100%; margin-left: auto; margin-right: auto;">
      
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tbody>
                  <tr>
                      <td style="position: relative; margin-bottom: 10px;">
                          <div style="position: relative; z-index: 10; background: #F0F0F0; padding: 10px 0; margin: 10px 0;  width: 1000px; height: 700px; margin-left: auto; margin-right: auto; border-radius: 20px; border: 1px solid #DFDFDF;">
                              <table width="100%" border="0" cellspacing="0" cellpadding="0"
                                  style="max-width: 840px; margin: 0 auto; padding: 0; font-size: 15px; font-family: Arial, Helvetica;">
                                  <tbody>
                                      <tr>
                                          <td>
                                              <center>
                                                  <img src="https://i.ibb.co/S551gy3/LOGO-long-black.png" alt="LARNA.com"
                                                      style="max-width: 640px;  max-height: 40px; margin-bottom: 20px; margin-top: 20px;">
                                              </center>
                                              <table cellspacing="0" cellpadding="0" width="100%"
                                                  style="font-family: Arial, Helvetica, sans-serif;">
                      
                                                  <tbody style="text-align: start; width: 100%;">
                                                      <tr>
                                                          <td>
                                                              <p>Bonjour ${name},</p>
                                                              <p>Nous vous remercions d'avoir passé votre commande chez
                                                                  LARNA ! </p>
                                                              <p>Nous sommes ravis de vous informer qu'elle a été traitée avec
                                                                  succès et est actuellement en préparation.</p>
                                                              <p style="font-weight: bold;">Détails de la commande :</p>
                                                              <ul>
                                                                  <li>Nom et Prénom du client : ${name} ${lastname}</li>
                                                                  <li>Numéro de commande : ${refcommande}</li>
                                                                  <li>Date de commande : ${formattedDate}</li>
                      
                                                              </ul>
                      
                                                              <p>
                                                                  Pour faciliter le retrait de votre commande, veuillez
                                                                  trouver en pièces jointes de cet email <span
                                                                      style="font-weight: bold;">le bon de retrait</span>
                                                                  ainsi que <span style="font-weight: bold;">la confirmation
                                                                      de commande</span>. Il est important de
                                                                  présenter le bon de retrait lors de votre arrivée
                                                                  pour garantir un service rapide et sécurisé.
                                                              </p>
                      
                                                              <p>
                                                                  Si vous avez des questions ou besoin d'assistance concernant
                                                                  votre commande ou le processus de retrait,
                                                                  n'hésitez pas à contacter notre service client au 01 88 83
                                                                  88 58.
                                                              </p>
                      

                      
                                                              <p>
                                                                  Nous vous remercions de votre confiance et nous avons hâte
                                                                  de vous voir lors du retrait de votre commande.
                                                                  Cordialement,
                                                              </p><br />
                      
                                                              <p>Service Client </p>
                                                              <p style="margin-top: -10px;">LARNA </p>
                                                              <p style="margin-top: -10px;">01 88 83 88 58</p>
                                                              <p style="margin-top: -10px;">www.econegoce.com</p>
                                                          </td>
                                                      </tr>
                                                  </tbody>
                                              </table>
                                          </td>
                                      </tr>
                                  </tbody>
                              </table>
                          </div>
                          <div style="border-color: #ccc; position: absolute; left: 50%; transform: translateX(-50%); 
                          margin-top: -60px; background-color: #fab516; width: 700px;
                          z-index: 5; height: 10%; border-radius: 15px;  margin-left: auto; margin-right: auto; 
                          display: flex; justify-content: center;"></div>
                      </td>
                      
                  </tr>
              </tbody>
          </table>
      </body>`,
          attachments: [
            {
              filename: `${refcommande}_BC.pdf`,
              path: pdfPath1,
            },
            {
              filename: `${refcommande}_BR.pdf`,
              path: pdfPath2,
            },
          ],
        };

        mailOptionsOns = { ...mailOptionsClient };
      }

      transporter.sendMail(mailOptionsClient, (errorClient, infoClient) => {
        if (errorClient) {
          logError("Error saving the PDFs on the server or sending email", errorClient);
          console.error("Error sending email to client:", errorClient);
        } else {
          console.log("Email sent to client:", infoClient.response);
        }
      });

      if (mailOptionsOns) {
        transporter.sendMail(mailOptionsOns, (errorOns, infoOns) => {
          if (errorOns) {
            logError("Error sending email to admin", errorOns);
            console.error("Error sending email to admin", errorOns);
          } else {
            console.log("Email sent to admin", infoOns.response);
          }
        });
      }

      res
        .status(200)
        .json({ message: "PDFs saved and email sent successfully" });
    } catch (error) {
      logError("Error saving the PDFs on the server or sending email", error);
      console.error(
        "Error saving the PDFs on the server or sending email:",
        error
      );
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}


