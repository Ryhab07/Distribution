import mongoose, { Document, Model } from 'mongoose';

// Define the interface for the contact form document
interface ContactFormDocument extends Document {
  fullName: string;
  entreprise: string;
  phone: string;
  email: string;
  objet: string;
  demande: string;
  status: string;
  submissionDateTime: Date;
}

// Define the contact form schema
const ContactFormSchema = new mongoose.Schema<ContactFormDocument>({
  fullName: {
    type: String,
    required: true,
    minlength: 5,
    message: "Le nom est requis."
  },
  entreprise: {
    type: String,
    required: true,
    minlength: 5,
    message: "Le nom de l'entreprise est requis."
  },
  phone: {
    type: String,
    required: true,
    minlength: 10,
    message: "Le numéro de téléphone doit contenir uniquement 10 chiffres."
  },
  email: {
    type: String,
    required: true,
    email: true,
    message: "L'e-mail est requis."
  },
  objet: {
    type: String,
    required: true,
    minlength: 0,
    message: "L'objet est requis."
  },
  demande: {
    type: String,
    required: true,
    minlength: 6,
    message: "La demande est requise"
  },
  status: {
    type: String,
    default: 'En cours'
  },
  submissionDateTime: {
    type: Date,
    default: Date.now
  }
});

// Define and export the ContactForm model
const ContactFormModel: Model<ContactFormDocument> = mongoose.model<ContactFormDocument>('ContactForm', ContactFormSchema);

export default ContactFormModel;
