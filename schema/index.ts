import * as z from "zod";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
];

const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

export const LoginSchema = z.object({
  email: z.string().email({
    message: "L'e-mail est requis.",
  }),
  password: z.string().min(6, {
    message: "Au moins 6 caractères requis.",
  }),
});

export const RegisterSchema = z.object({
  creatorId: z.string().min(0, {
    message: "creator id est requis.",
  }),

  name: z.string().min(0, {
    message: "Le nom est requis.",
  }),
  lastname: z.string().min(0, {
    message: "Le prénom est requis.",
  }),
  entreprise: z.string().min(0, {
    message: "Le nom de l'entreprise est requis.",
  }),
  email: z
    .string()
    .email({
      message: "L'e-mail est requis.",
    })
    .refine((value) => value.includes("@"), {
      message: "L'e-mail doit contenir un '@'.",
    }),
    email2: z
    .string()
    .optional()
    .refine(value => {
      if (value === undefined || value === "") return true;
      return /^[\w._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
    }, { message: "L'e-mail secondaire doit être valide." }),
  adresse: z.string().min(0, {
    message: "L'adresse est requis.",
  }),
  phoneSecondaire: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (value === undefined || value === "") return true; // Skip validation if the field is empty
        return /^\d{10}$/.test(value);
      },
      {
        message: "Le numéro de téléphone doit contenir uniquement 10 chiffres.",
      }
    ),
  phone: z
    .string()
    .min(10, {
      message: "Le numéro de téléphone doit contenir uniquement 10 chiffres.",
    })
    .regex(/^\d{10}$/, {
      message: "Le numéro de téléphone doit contenir uniquement 10 chiffres.",
    }),
  password: z.string().min(6, {
    message: "Au moins 6 caractères requis.",
  }),
  sales375: z.coerce.number().nonnegative().optional(),
  sales500: z.coerce.number().nonnegative().optional(),
  role: z.string().min(0, {
    message: "role est requis.",
  }),
});

export const RegisterCollaboratorSchema = z.object({
  creatorId: z.string().min(0, {
    message: "creator id est requis.",
  }),
  name: z.string().min(1, {
    message: "Le nom est requis.",
  }),
  lastname: z.string().min(1, {
    message: "Le prénom est requis.",
  }),
  entreprise: z.string().min(0, {
    message: "Le nom de l'entreprise est requis.",
  }),
  email: z
    .string()
    .email({
      message: "L'e-mail est requis.",
    })
    .refine((value) => value.includes("@"), {
      message: "L'e-mail doit contenir un '@'.",
    }),
  adresse: z.string().min(0, {
    message: "L'adresse est requis.",
  }),
  phone: z
    .string()
    .min(10, {
      message: "Le numéro de téléphone doit contenir 10 chiffres.",
    })
    .refine(
      (value) => {
        if (value === undefined || value === "") return true; // Skip validation if the field is empty
        return /^\d{10}$/.test(value);
      },
      {
        message: "Le numéro de téléphone doit contenir uniquement 10 chiffres.",
      }
    ),
  password: z.string().min(6, {
    message: "Au moins 6 caractères requis.",
  }),
  sales: z.coerce.number().nonnegative().optional(),
  role: z.string().min(0, {
    message: "role est requis.",
  }),
});

export const CollabRegisterSchema = z.object({
  creatorId: z.string().min(1, {
    message: "creator id est requis.",
  }),

  name: z.string().min(1, {
    message: "Le nom est requis.",
  }),

  lastname: z.string().min(1, {
    message: "Le prénom est requis.",
  }),

  entreprise: z.string().min(1, {
    message: "Le nom de l'entreprise est requis.",
  }),

  email: z
    .string()
    .email({
      message: "L'e-mail est requis.",
    })
    .refine((value) => value.includes("@"), {
      message: "L'e-mail doit contenir un '@'.",
    }),

  email2: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (value === undefined || value === "") return true; // Skip validation if the field is empty
        return /^[\w._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
      },
      {
        message:
          "L'e-mail secondaire doit être valide et contenir un '@' et un domaine.",
      }
    ),

  adresse: z.string().min(1, {
    message: "L'adresse est requis.",
  }),

  phone: z
    .string()
    .min(10, {
      message: "Le numéro de téléphone doit contenir 10 chiffres.",
    })
    .regex(/^\d{10}$/, {
      message: "Le numéro de téléphone doit contenir uniquement 10 chiffres.",
    }),

  phoneSecondaire: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (value === undefined || value === "") return true; // Skip validation if the field is empty
        return /^\d{10}$/.test(value);
      },
      {
        message: "Le numéro de téléphone doit contenir uniquement 10 chiffres.",
      }
    ),

  password: z.string().min(6, {
    message: "Au moins 6 caractères requis.",
  }),

  role: z.string().min(1, {
    message: "role est requis.",
  }),

  sales375: z.coerce
    .number()
    .nonnegative()
    .max(0.95, { message: "Le nombre doit être inférieur ou égal à 0,95" })
    .optional(),

  sales500: z.coerce
    .number()
    .nonnegative()
    .max(0.95, { message: "Le nombre doit être inférieur ou égal à 0,95" })
    .optional(),
});

export const ModifyInfoSchema = z.object({
  email: z.string().min(0, {
    message: "Au moins 6 caractères requis.",
  }),
  name: z.string().min(0, {
    message: "Le nom est requis.",
  }),
  lastname: z.string().min(0, {
    message: "Le prénom est requis.",
  }),
  adresse: z.string().min(0, {
    message: "L'adresse est requis.",
  }),
  entreprise: z.string().min(0, {
    message: "Le nom de l'entreprise est requis.",
  }),
  phone: z.string().min(0, {
    message: "Le numéro de téléphone doit contenir 10 chiffres.",
  }),
  role: z.string().min(0, {
    message: "Role est requis.",
  }),
});

export const NewPasswordSchema = z.object({
  currentPassword: z.string().min(6, {
    message: "Au moins 6 caractères requis.",
  }),

  newPassword: z.string().min(6, {
    message: "Au moins 6 caractères requis.",
  }),
});

export const ContactPageSchema = z.object({
  fullName: z.string().min(5, {
    message: "Ce champ est obligatoire, veuillez le remplir.",
  }),

  entreprise: z.string().min(5, {
    message: "Ce champ est obligatoire, veuillez le remplir.",
  }),
  phone: z
    .string()
    .refine(
      (value) => {
        const parsedNumber = parseFloat(value);
        return !isNaN(parsedNumber) && parsedNumber.toString() === value;
      },
      {
        message: "Le numéro de téléphone doit être un nombre.",
      }
    )
    .refine((value) => value.length >= 10, {
      message: "Le numéro de téléphone doit contenir uniquement 10 chiffres.",
    }),
  email: z.string().email({
    message: "Ce champ est obligatoire, veuillez le remplir.",
  }),
  objet: z.string().min(6, {
    message: "Ce champ est obligatoire, veuillez le remplir.",
  }),

  demande: z.string().min(6, {
    message: "Ce champ est obligatoire, veuillez le remplir.",
  }),
});

export const ContactModifySalesSchema = z.object({
  sales: z.number().nonnegative({
    message: "Veuillez entrer un taux de remise valide.",
  }),
});

export const RecoverPasswordchema = z.object({
  email: z.string().email({
    message: "L'e-mail est requis.",
  }),
});

export const SavMachinesSchema = z.object({
  created_at: z
    .union([z.date(), z.string()])
    .optional()
    .refine((value) => {
      if (
        typeof value === "string" &&
        value !== "Invalid Date" &&
        value !== "" &&
        value !== " "
      ) {
        return isValidDate(value);
      }
      return true; // Allow if it's the specific phrase or a valid date object
    }, "Invalid date format"),
  pieceCreatedID: z.string().optional(),
  creator: z.string().optional(),
  picture1: z
    .any()
    .refine(
      (file) => file?.size <= MAX_FILE_SIZE,
      `La taille du fichier doit être inférieure à 5MB.`
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Le fichier doit être une image (JPEG ou PNG)"
    ),
  picture2: z
    .any()
    .refine(
      (file) => file?.size <= MAX_FILE_SIZE,
      `La taille du fichier doit être inférieure à 5MB.`
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Le fichier doit être une image (JPEG ou PNG)"
    ),
  /*numeroBlOuFacture: z.string().min(0, { message: "Ce champ est obligatoire, veuillez le remplir." }),
  dateDemande: z.any(),
  installateur: z.string().min(0, { message: "Ce champ est obligatoire, veuillez le remplir." }),
  client: z.string().min(0, { message: "Ce champ est obligatoire, veuillez le remplir." }),
  causeSAV: z.string().min(0, { message: "Ce champ est obligatoire, veuillez le remplir." }),
  marque: z.string().min(0, { message: "Ce champ est obligatoire, veuillez le remplir." }),
  articleNumber: z.string().min(0, { message: "Ce champ est obligatoire, veuillez le remplir." }),
  modele: z.string().min(0, { message: "Ce champ est obligatoire, veuillez le remplir." }),
  categorieArticle: z.string().min(0, { message: "Ce champ est obligatoire, veuillez le remplir." }),
  serieNumber: z.string().min(0, { message: "Ce champ est obligatoire, veuillez le remplir." }),
  quantite: z.coerce.number().positive().int().min(0, { message: "La quantité doit être un entier positif" }),
  blNumber: z.string().min(0, { message: "Ce champ est obligatoire, veuillez le remplir." }),
  accord: z.string().min(0, { message: "Ce champ est obligatoire, veuillez le remplir." }),*/
  numeroBlOuFacture: z.string().optional(),
  zendesk: z.string().optional(),
  observation: z.string().optional(),
  dateDemande: z.any(),
  installateur: z.string().optional(),
  client: z.string().optional(),
  causeSAV: z.string().optional(),
  marque: z.string().optional(),
  articleNumber: z.string().optional(),
  modele: z.string().optional(),
  categorieArticle: z.string().optional(),
  serieNumber: z.string().optional(),
  quantite: z.coerce.number().optional(),
  blNumber: z.string().optional(),
  accord: z.string().optional(),
  retoursMachines: z.string().optional(),
  dateRetourDepot: z.any(),
  dateDemandeAvoirFournisseur: z.any(),
  dateReceptionAvoirFournisseur: z.any(),
  statutFournisseur: z.string().optional(),
  avoirFournisseurNumber: z.string().optional(),
  dateAvoirInstallateur: z.any(),
  avoirInstallateurNumber: z.string().optional(),
  nouveauBlNumber: z.string().optional(),
  dateRetourFournisseur: z.any(),
  prixAchat: z.number(),
  prixVente: z.number(),
  status: z
    .enum([
      "En attente de commande pièces",
      "Pièces envoyées",
      "En attente de réception de pièces",
      "Facturation",
      "Avoir",
      "Validé",
    ])
    .optional(),
  adresseRetrait: z
    .enum([
      "53 Av. du Bois de la Pie, 93290 Tremblay-en-France",
      "1 Avenue de la gare, 95380 Louvres",
    ])
    .optional(),
});

export const SavPieceSchema = z.object({
  created_at: z.any(),
  pieceCreatedID: z.string().optional(),
  creator: z.string().optional(),
  numeroBlOuFacture: z.string().min(0, {
    message: "Ce champ est obligatoire, veuillez le remplir.",
  }),
  picture2: z
    .any()
    .refine(
      (file) => file?.size <= MAX_FILE_SIZE,
      `La taille du fichier doit être inférieure à 5MB.`
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Le fichier doit être une image (JPEG ou PNG)"
    ),

    DocumentFacturePieceFournisseur: z
    .any()
    .refine(
      (file) => file?.size <= MAX_FILE_SIZE,
      `La taille du fichier doit être inférieure à 5MB.`
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Le fichier doit être une image (JPEG ou PNG)"
    ),

  DocumentFacturePieceClientEconegoce: z
    .any()
    .refine(
      (file) => file?.size <= MAX_FILE_SIZE,
      `La taille du fichier doit être inférieure à 5MB.`
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Le fichier doit être une image (JPEG ou PNG)"
    ),

  /*societe: z.string().min(0, {
    message: "Ce champ est obligatoire, veuillez le remplir.",
  }),
  client: z.string().min(0, {
    message: "Ce champ est obligatoire, veuillez le remplir.",
  }),
  serieNumber: z.string().min(0, {
    message: "Ce champ est obligatoire, veuillez le remplir.",
  }),
  marque: z.string().min(0, {
    message: "Ce champ est obligatoire, veuillez le remplir.",
  }),
  numeroCommande: z.string().min(0, {
    message: "Ce champ est obligatoire, veuillez le remplir.",
  }),
  articleName: z.string().min(0, {
    message: "Ce champ est obligatoire, veuillez le remplir.",
  }),
  reference: z.string().min(0, {
    message: "Ce champ est obligatoire, veuillez le remplir.",
  }),*/
  societe: z.string().optional(),
  client: z.string().optional(),
  serieNumber: z.string().optional(),
  marque: z.string().optional(),
  numeroCommande: z.string().optional(),
  articleName: z.string().optional(),
  reference: z.string().optional(),
  stockDispoTremblay: z.string().optional(),
  dateCommande: z.any(),
  dateDeLivraisonPrevu: z.any(),
  lieuDuReception: z.string().optional(),
  dateReceptionDepot: z.any(),
  dateExpiditon: z.any(),
  dateReceptionPieceDef: z.any(),
  dateExpiditonPieceDef: z.any(),
  numeroDevisEconegoce: z.string().optional(),
  dateReglement: z.any(),
  facturePierceFournisseur: z
    .union([z.string(), z.array(z.string())])
    .optional(),
  avoirPierceFournisseur: z.union([z.string(), z.array(z.string())]).optional(),
  FacturePieceClientEconegoce: z
    .union([z.string(), z.array(z.string())])
    .optional(),
  RepenseExpertise: z.string().optional(),
  AvoirPieceClientEconegoce: z.string().optional(),
  DossierCloture: z.string().optional(),
  Observation: z.string().optional(),
  dateLivraisonPrevue: z.any(),
  personneQuiPasseCommande: z.string().optional(),
  Prix: z.number(),
  Quantite: z.union([z.number(), z.string()]).transform((val) => {
    // Convert string to number if necessary
    return typeof val === "string" ? parseFloat(val) : val;
  }),
  status: z
    .enum([
      "En attente de commande pièces",
      "Pièces envoyées",
      "En attente de réception de pièces",
      "Facturation",
      "Avoir",
      "Validé",
    ])
    .optional(),
  adresseRetrait: z
    .enum([
      "53 Av. du Bois de la Pie, 93290 Tremblay-en-France",
      "1 Avenue de la gare, 95380 Louvres",
    ])
    .optional(),
});

export const SavInterventionSchema = z.object({
  created_at: z.any(),
  pieceCreatedID: z.string().optional(),
  dateDeLaDemande: z.any(),
  creator: z.string().optional(),
  societe: z.string().optional(),
  client: z.string().optional(),
  serieNumber: z.string().optional(),
  marque: z.string().optional(),
  nDeTicket: z.string().optional(),
  devisEconegoce: z.string().optional(),
  devisFournisseur: z.string().optional(),
  dateDinterventionPrevut: z.any(),
  dateDuRapport: z.any(),
  factureFournisseur: z.string().optional(),
  bonDeCommandeEconegoce: z.string().optional(),
  factureEconegoce: z.string().optional(),
  observation: z.string().optional(),
});
