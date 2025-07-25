"use client";
import { FormError } from "@/components/form-error";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SavPieceSchema } from "@/schema/";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, isValid, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, X, XCircle } from "lucide-react";
import * as React from "react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import * as z from "zod";
import data from "../../public/pieceData.json";
import { SuccessCard } from "../reusable/SuccessCard";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Textarea } from "../ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogClose } from "../ui/dialog";

interface SavPieceFormProps extends React.HTMLAttributes<HTMLDivElement> {}
interface Article {
  MARQUE: string;
  REFARTICLE: string;
  LIBELLE240: string;
  TARIF: number;
}

interface CardProps {
  _id: string;
  created_at: string;
  societe: string;
  client: string;
  marque: string;
  serieNumber: string;
  numeroCommande: string;
  articleName: string;
  reference: string;
  stockDispoTremblay: string;
  dateCommande: string;
  dateDeLivraisonPrevu: string;
  lieuDuReception: string;
  personneQuiPasseCommande: string;
  dateLivraisonPrevue: string;
  dateReceptionDepot: string;
  dateExpedition: string;
  dateReceptionPieceDef: string;
  dateExpeditionPieceDef: string;
  numeroDevisEconegoce: string;
  dateReglement: string;
  facturePieceFournisseur: string;
  avoirPieceFournisseur: string;
  facturePieceClientEconegoce: string;
  reponseExpertise: string;
  avoirPieceClientEconegoce: string;
  dossierCloture: string;
  observation: string;
  numeroBlOuFacture: string;
  DocumentFacturePieceFournisseur: string;
  DocumentFacturePieceClientEconegoce: string;
  Prix: number;
  Quantite: number;
  picture2: string;
  CardProps?: string;
  status?:
    | "En attente de commande pièces"
    | "Pièces envoyées"
    | "En attente de réception de pièces"
    | "Facturation"
    | "Avoir"
    | "Validé"
    | undefined; // Use literal types
  adresseRetrait?:
    | "53 Av. du Bois de la Pie, 93290 Tremblay-en-France"
    | "1 Avenue de la gare, 95380 Louvres"
    | undefined; // Specific address literals
  facturePierceFournisseur: string;
  onSelectCard: (id: string) => void; // New prop
}

export function SavPieceFormModificationAdmin({
  className,
  id,
  ...props
}: SavPieceFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = React.useState<string | undefined>("");
  const [success, setSuccess] = React.useState<string | undefined>("");
  const [pending, setPending] = React.useState<boolean | undefined>(false);
  const [step, setStep] = React.useState(2);
  const [formData, setFormData] = React.useState({});
  const uniqueID = uuidv4();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isOpenDateEnlevement, setIsOpenDateEnlevement] = React.useState(false);
  const [isOpenDateReception, setIsOpenDateReception] = React.useState(false);
  const [isOpenDatePrevue, setIsOpenDatePrevue] = React.useState(false);
  const [isOpenDateDefectueuse, setIsOpenDateDefectueuse] =
    React.useState(false);
  const [isOpenDateEXPEDITION, setIsOpenDateEXPEDITION] = React.useState(false);
  const [isOpenDateREGLEMENT, setIsOpenDateREGLEMENT] = React.useState(false);
  const [filteredArticleNames, setFilteredArticleNames] = React.useState<
    Article[]
  >([]);
  const [selectedFilesPicture2, setselectedFilesPicture2] = React.useState<
    FileList | []
  >([]);
  const [articles] = React.useState<Article[]>(data);
  const [selectedArticle, setSelectedArticle] = React.useState<Article | null>(
    null
  );
  console.log("selectedArticle", selectedArticle);
  const [filteredReferences, setFilteredReferences] = React.useState<Article[]>(
    []
  );
  const [userData, setUserData] = React.useState<CardProps[]>([]);
  const [
    selectefFilesDocumentFacturePieceFournisseur,
    setselectefFilesDocumentFacturePieceFournisseur,
  ] = React.useState<FileList | []>([]);
  const [
    selectefFilesDocumentFacturePieceClientEconegoce,
    setselectefFilesDocumentFacturePieceClientEconegoce,
  ] = React.useState<FileList | []>([]);
  const [formValuesLoaded, setFormValuesLoaded] = React.useState(false);
  const [userDatas, setUserDatas] = React.useState<CardProps[]>([]);
  const [entreprises, setEntreprises] = React.useState([]);

  console.log(
    "selectefFilesDocumentFacturePieceFournisseur",
    selectefFilesDocumentFacturePieceFournisseur
  );
  console.log(
    "selectefFilesDocumentFacturePieceClientEconegoce",
    selectefFilesDocumentFacturePieceClientEconegoce
  );
  console.log("selectedFilesPicture2", selectedFilesPicture2);

  React.useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/admin/all-users");
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      const filteredUsers = data.users.filter((user) => user.role === "user");
      setUserDatas(filteredUsers);
      const entrepriseList = filteredUsers.map((user) => user.entreprise);
      setEntreprises(entrepriseList);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  console.log("userData", userDatas);

  const form = useForm<z.infer<typeof SavPieceSchema>>({
    resolver: zodResolver(SavPieceSchema),
    defaultValues: {
      created_at: new Date(),
      pieceCreatedID: uniqueID,
      DocumentFacturePieceFournisseur: [],
      picture2: [],
      DocumentFacturePieceClientEconegoce: [],
      societe: "",
      client: "",
      serieNumber: "",
      marque: "",
      numeroCommande: "",
      articleName: "",
      reference: "",
      stockDispoTremblay: "",
      dateCommande: "",
      lieuDuReception: "",
      dateReceptionDepot: "",
      dateExpiditon: "",
      dateReceptionPieceDef: "",
      dateExpiditonPieceDef: "",
      numeroDevisEconegoce: "",
      dateReglement: "",
      facturePierceFournisseur: "",
      dateDeLivraisonPrevu: "",
      avoirPierceFournisseur: "",
      FacturePieceClientEconegoce: "",
      RepenseExpertise: "",
      AvoirPieceClientEconegoce: "",
      DossierCloture: "",
      Observation: "",
      dateLivraisonPrevue: "",
      personneQuiPasseCommande: "",
      numeroBlOuFacture: "",
      Quantite: 0,
      Prix: 0,
      status: "En attente de commande pièces",
      adresseRetrait: "53 Av. du Bois de la Pie, 93290 Tremblay-en-France",
    },
  });

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/pieces/fetchPieces?page=1&id=${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        console.log("data.pieces", data.pieces);
        setUserData(data.pieces);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [id]);

  React.useEffect(() => {
    if (userData.length > 0 && !formValuesLoaded) {
      form.reset({
        created_at: new Date(userData[0]?.created_at),
        facturePierceFournisseur: userData[0]?.facturePierceFournisseur,
        avoirPierceFournisseur: userData[0]?.avoirPieceFournisseur,
        pieceCreatedID: uniqueID,
        societe: userData[0]?.societe,
        client: userData[0]?.client,
        serieNumber: userData[0]?.serieNumber,
        marque: userData[0]?.marque,
        numeroCommande: userData[0]?.numeroCommande,
        articleName: userData[0]?.articleName,
        reference: userData[0]?.reference,
        stockDispoTremblay: userData[0]?.stockDispoTremblay,
        dateCommande: new Date(userData[0]?.dateCommande),
        lieuDuReception: userData[0]?.lieuDuReception,
        dateReceptionDepot: new Date(userData[0]?.dateReceptionDepot),
        dateExpiditon: new Date(userData[0]?.dateExpedition),
        dateReceptionPieceDef: new Date(userData[0]?.dateReceptionPieceDef),
        dateExpiditonPieceDef: new Date(userData[0]?.dateExpeditionPieceDef),
        numeroDevisEconegoce: userData[0]?.numeroDevisEconegoce,
        dateReglement: new Date(userData[0]?.dateReglement),
        FacturePieceClientEconegoce: userData[0]?.facturePieceClientEconegoce,
        RepenseExpertise: userData[0]?.reponseExpertise,
        AvoirPieceClientEconegoce: userData[0]?.avoirPieceClientEconegoce,
        DossierCloture: userData[0]?.dossierCloture,
        dateDeLivraisonPrevu: userData[0]?.dateDeLivraisonPrevu,
        Observation: userData[0]?.observation,
        dateLivraisonPrevue: new Date(userData[0]?.dateLivraisonPrevue),
        personneQuiPasseCommande: userData[0]?.personneQuiPasseCommande,
        Prix: userData[0]?.Prix,
        Quantite: userData[0]?.Quantite,
        numeroBlOuFacture: userData[0]?.numeroBlOuFacture,
        status: userData[0]?.status,
        adresseRetrait: userData[0]?.adresseRetrait,
        DocumentFacturePieceFournisseur:
          userData[0]?.DocumentFacturePieceFournisseur || [],
        picture2: userData[0]?.picture2 || [],
        DocumentFacturePieceClientEconegoce:
          userData[0]?.DocumentFacturePieceClientEconegoce || [],
      });
      console.log("Form values after reset:", form.getValues());
      setFormValuesLoaded(true);
    }
  }, [userData, form, uniqueID, formValuesLoaded]);

  React.useEffect(() => {
    console.log("Default values:", form.getValues());
  }, [form, userData]);

  const handleClearDate = (field) => {
    field.onChange(""); // Clear the field value
  };

  console.log("step", step);
  console.log("success", success);

  const handleRemovePicture2 = (index: number) => {
    const existingFiles = form.getValues("picture2");
    console.log("picture2 files before removal:", existingFiles);

    if (!Array.isArray(existingFiles)) {
      console.error(
        `Field "picture2" does not contain an array.`,
        existingFiles
      );
      return;
    }

    const updatedFiles = [...existingFiles];
    updatedFiles.splice(index, 1);

    // If no files are left, set the field to an empty array
    if (updatedFiles.length === 0) {
      form.setValue("picture2", []);
    } else {
      form.setValue("picture2", updatedFiles);
    }
  };

  const handleRemoveDocumentFacturePieceClientEconegoce = (index: number) => {
    const existingFiles = form.getValues("DocumentFacturePieceClientEconegoce");
    console.log(
      "DocumentFacturePieceClientEconegoce files before removal:",
      existingFiles
    );

    if (!Array.isArray(existingFiles)) {
      console.error(
        `Field "DocumentFacturePieceClientEconegoce" does not contain an array.`,
        existingFiles
      );
      return;
    }

    const updatedFiles = [...existingFiles];
    updatedFiles.splice(index, 1);

    // If no files are left, set the field to an empty array
    if (updatedFiles.length === 0) {
      form.setValue("DocumentFacturePieceClientEconegoce", []);
    } else {
      form.setValue("DocumentFacturePieceClientEconegoce", updatedFiles);
    }
  };

  const handleRemoveDocumentDocumentFacturePieceFournisseur = (
    index: number
  ) => {
    const existingFiles = form.getValues("DocumentFacturePieceFournisseur");
    console.log(
      "DocumentFacturePieceFournisseur files before removal:",
      existingFiles
    );

    if (!Array.isArray(existingFiles)) {
      console.error(
        `Field "DocumentFacturePieceFournisseur" does not contain an array.`,
        existingFiles
      );
      return;
    }

    const updatedFiles = [...existingFiles];
    updatedFiles.splice(index, 1);

    // If no files are left, set the field to an empty array
    if (updatedFiles.length === 0) {
      form.setValue("DocumentFacturePieceFournisseur", []);
    } else {
      form.setValue("DocumentFacturePieceFournisseur", updatedFiles);
    }
  };

  const handleFileChange = (e, field) => {
    console.log("field " + field);
    const files = Array.from(e.target.files);
    const existingFiles = form.getValues(field) || [];
    form.setValue(field, [...existingFiles, ...files]);
  };

  const removeFile = (
    field:
      | "DocumentFacturePieceFournisseur"
      | "picture2"
      | "DocumentFacturePieceClientEconegoce",
    index: number
  ) => {
    const files = [...form.getValues(field)];
    files.splice(index, 1);
    form.setValue(field, files);
  };

  const appendFiles = (field, newFiles) => {
    const existingFiles = form.getValues(field) || []; // Get existing files
    const updatedFiles = [...existingFiles, ...newFiles]; // Combine existing and new files

    // Limit the total number of files (e.g., 5)
    if (updatedFiles.length > 5) {
      alert("You can only upload up to 5 files.");
      return;
    }

    // Update the form value with the combined files
    form.setValue(field, updatedFiles);
  };

  React.useEffect(() => {
    setselectedFilesPicture2(form.watch("picture2"));
  }, [form.watch("picture2")]);

  React.useEffect(() => {
    setselectefFilesDocumentFacturePieceFournisseur(
      form.watch("DocumentFacturePieceFournisseur")
    );
  }, [form.watch("DocumentFacturePieceFournisseur")]);

  React.useEffect(() => {
    setselectefFilesDocumentFacturePieceClientEconegoce(
      form.watch("DocumentFacturePieceClientEconegoce")
    );
  }, [form.watch("DocumentFacturePieceClientEconegoce")]);

  const onSubmit = async (values: z.infer<typeof SavPieceSchema>) => {
    try {
      const method = id ? "PUT" : "POST";
      console.log("HTTP Method:", method);

      if (step === 1) {
        console.log("Step 1: Setting form data and moving to step 2");
        setFormData(values);
        setStep(2);
        return;
      }

      const combinedData = { ...formData, ...values };
      console.log("Combined Data:", combinedData);

      setError("");
      setSuccess("");
      setPending(true);

      const formDataToSend = new FormData();
      console.log("FormData object created");

      // Append all non-file fields to FormData
      Object.entries(combinedData).forEach(([key, value]) => {
        if (
          key === "DocumentFacturePieceFournisseur" ||
          key === "picture2" ||
          key === "DocumentFacturePieceClientEconegoce"
        ) {
          // Skip file fields here, they will be handled separately
          console.log(`Skipping file field: ${key}`);
          return;
        }
        formDataToSend.append(key, String(value));
        console.log(`Appended non-file field: ${key} = ${value}`);
      });

      // Append files to FormData
      const appendFilesToFormData = (fieldName: string, files: File[] | string[]) => {
        if (files.length === 0) {
          formDataToSend.append(fieldName, JSON.stringify([]));
        } else {
          files.forEach((file) => {
            if (typeof file === "string") {
              formDataToSend.append(fieldName, file);
              console.log(`Appended existing file URL: ${fieldName} = ${file}`);
            } else {
              formDataToSend.append(fieldName, file, file.name); // Ensure the original file name is used
              console.log(`Appended file: ${fieldName} = ${file.name}`);
            }
          });
        }
      };

      // Append files for each file field
      appendFilesToFormData(
        "DocumentFacturePieceFournisseur",
        values.DocumentFacturePieceFournisseur || []
      );
      appendFilesToFormData("picture2", values.picture2 || []);
      appendFilesToFormData(
        "DocumentFacturePieceClientEconegoce",
        values.DocumentFacturePieceClientEconegoce || []
      );

      // Ensure _id is included in the request body for PUT requests
      if (method === "PUT") {
        formDataToSend.append("_id", id); // Assuming `id` is the MongoDB ObjectId of the piece to update
        console.log(`Appended _id for PUT request: ${id}`);
      }

      startTransition(() => {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}pieces/create`;
        console.log("API URL:", apiUrl);

        const requestOptions: RequestInit = {
          method: method,
          body: formDataToSend, // Send FormData directly
          headers: {
            // Do not set Content-Type for FormData, the browser will handle it
          },
        };

        console.log("Request Options:", requestOptions);

        fetch(apiUrl, requestOptions)
          .then((response) => response.json())
          .then((data) => {
            console.log("Response Data:", data);
            if (data.success) {
              setSuccess(data.success);
              console.log("Success:", data.success);
              const role = sessionStorage.getItem("role");
              const url = `/sav/sav-piece-detail?search=${id}`;
              console.log("Role:", role);
              console.log("Redirect URL:", url);

              if (role === "collaborator") {
                  window.location.href = `/collaborateur${url}`;
                } else if (role === "admin") {
                  window.location.href = `/admin${url}`;
                }
            } else {
              setError(data.error);
              console.log("Error:", data.error);
            }
            setPending(false);
          })
          .catch((error) => {
            console.error("Error during submission:", error);
            setError("Error during submission");
            setPending(false);
          });
      });
    } catch (error) {
      console.error("Error validating fields:", error);
      setError(error.message || "Error validating fields");
    }
  };

  const onClick = async () => {
    const values = form.getValues();
    onSubmit(values);
  };

  //const prevStep = () => setStep(step - 1);

  const handleArticleChange = (
    value: string,
    field: "REFARTICLE" | "LIBELLE240" | "article"
  ) => {
    const article = articles.find(
      (article) =>
        (field === "REFARTICLE" && article.REFARTICLE === value) ||
        (field === "LIBELLE240" && article.LIBELLE240 === value)
    );

    if (article) {
      setSelectedArticle(article);
      form.setValue("Prix", article.TARIF);
      form.setValue("marque", article.MARQUE);
      form.setValue("reference", article.REFARTICLE);
      form.setValue("articleName", article.LIBELLE240);
    } else {
      setSelectedArticle(null);
      form.setValue("Prix", 0);
      form.setValue("marque", "");
      if (field === "REFARTICLE") {
        form.setValue("reference", value);
      } else if (field === "LIBELLE240") {
        form.setValue("articleName", value);
      }
    }
  };

  const handleReferenceChange = (e) => {
    const value = e.target.value;
    form.setValue("reference", value);
    setFilteredReferences(
      articles.filter((article) =>
        article.REFARTICLE.toLowerCase().includes(value.toLowerCase())
      )
    );
    handleArticleChange(value, "REFARTICLE");
  };

  const handleArticleNameChange = (e) => {
    const value = e.target.value;
    form.setValue("articleName", value);
    setFilteredArticleNames(
      articles.filter((article) =>
        article.LIBELLE240.toLowerCase().includes(value.toLowerCase())
      )
    );
    handleArticleChange(value, "LIBELLE240");
  };

  const formatDate = (date: string | Date | null) => {
    if (!date) return "Sélectionnez une date"; // Handle null or undefined case

    // Ensure date is parsed into a Date object
    const parsedDate = typeof date === "string" ? parseISO(date) : date;

    if (!isValid(parsedDate)) return "Sélectionnez une date"; // Handle invalid date case

    // Format the parsed date
    return format(parsedDate, "PPP", { locale: fr });
  };

  console.log(
    "formatDate(field.value || userData[0]?.dateReglement)",
    formatDate(userData[0]?.dateReglement)
  );

  const entrepriseChange = (e) => {
    const value = e.target.value;
    form.setValue("societe", value);
    handleArticleChange(value, "article");
  };

  return (
    <div className="relative cursor-pointer w-full mb-10 ">
      {pending === true && <SuccessCard />}

      <div
        className={cn(
          "mt-10 bg-[#FBFBFB] border border-[#F0F0F0] p-4 gap-6 rounded-[20px] z-40 relative ",
          className
        )}
        {...props}
      >
        <div className="mb-10">
          <FormError message={error} />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <>
              <div
                className="grid lg:grid-cols-2 grid-cols-1 gap-8 z-40"
                style={{ overflowY: "auto" }}
              >
                <div className="grid gap-1">
                  <FormField
                    control={form.control}
                    name="numeroBlOuFacture"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">
                          N° BL ou Facture{" "}
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="!placeholder-black !text-black"
                            {...field}
                            disabled={isPending}
                            placeholder={""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-1">
                  <FormField
                    control={form.control}
                    name="adresseRetrait"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse Retrait</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Adresse Retrait" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="53 Av. du Bois de la Pie, 93290 Tremblay-en-France">
                              Tremblay-En-France
                            </SelectItem>
                            <SelectItem value="1 Avenue de la gare, 95380 Louvres">
                              Louvres
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-1">
                  <label className="text-black">
                    SOCIETE <span className="text-red-500">*</span>
                  </label>
                  <FormField
                    name="societe"
                    control={form.control}
                    render={({ field }) => (
                      <input
                        {...field}
                        list="societe"
                        onChange={entrepriseChange}
                        className="p-2 border border-gray-200 rounded-md cursor-pointer"
                      />
                    )}
                  />
                  <datalist id="societe">
                    {entreprises.map((article) => (
                      <option key={article} value={article}>
                        {article}
                      </option>
                    ))}
                  </datalist>
                </div>
                <div className="grid gap-1">
                  <FormField
                    control={form.control}
                    name="client"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">CLIENT</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder={""}
                            className="!placeholder-black !text-black"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-1">
                  <label className="text-black">REFERENCE</label>
                  <FormField
                    name="reference"
                    control={form.control}
                    render={({ field }) => (
                      <input
                        {...field}
                        list="references"
                        onChange={handleReferenceChange}
                        className="p-2 border border-gray-200 rounded-md cursor-pointer !placeholder-black !text-black"
                        placeholder={""}
                      />
                    )}
                  />
                  <datalist id="references">
                    {filteredReferences.map((article) => (
                      <option
                        key={article.REFARTICLE}
                        value={article.REFARTICLE}
                      >
                        {article.LIBELLE240}
                      </option>
                    ))}
                  </datalist>
                </div>
                <div className="grid gap-1">
                  <label className="text-black">NOM DE LA PIECE</label>
                  <FormField
                    name="articleName"
                    control={form.control}
                    render={({ field }) => (
                      <input
                        {...field}
                        list="articleNames"
                        onChange={handleArticleNameChange}
                        className="p-2 border border-gray-200 rounded-md cursor-pointer !placeholder-black !text-black"
                        placeholder={""}
                      />
                    )}
                  />
                  <datalist id="articleNames">
                    {filteredArticleNames.map((article) => (
                      <option
                        key={article.REFARTICLE}
                        value={article.LIBELLE240}
                      >
                        {article.REFARTICLE}
                      </option>
                    ))}
                  </datalist>
                </div>
                <div className="grid gap-1">
                  <FormField
                    control={form.control}
                    name="marque"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">MARQUE</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder={""}
                            className="!placeholder-black !text-black"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-1">
                  <FormField
                    control={form.control}
                    name="Quantite"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">QUANTITE</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder={""}
                            className="!placeholder-black !text-black"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-1">
                  <FormField
                    control={form.control}
                    name="Prix"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">
                          PRIX HT Fournisseur
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder={""}
                            className="!placeholder-black !text-black"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-1">
                  <FormField
                    control={form.control}
                    name="serieNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">
                          NUMERO DE SERIE{" "}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder={""}
                            className="!placeholder-black !text-black"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-1">
                  <FormField
                    control={form.control}
                    name="numeroCommande"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">
                          NUMERO DE COMMANDE{" "}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder={""}
                            className="!placeholder-black !text-black"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-1">
                  <FormField
                    control={form.control}
                    name="stockDispoTremblay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">
                          STOCK DISPO TREMBLAY
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder={""}
                            className="!placeholder-black !text-black"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-1">
                  <FormField
                    control={form.control}
                    name="dateCommande"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">
                          DATE DE LA COMMANDE{" "}
                        </FormLabel>
                        <br />
                        <FormControl>
                          <Popover open={isOpen} onOpenChange={setIsOpen}>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "lg:w-full w-full pl-3 text-left font-normal justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                  onClick={() => setIsOpen(true)}
                                >
                                  {field.value || userData[0]?.dateCommande ? (
                                    <span>
                                      {formatDate(
                                        field.value || userData[0]?.dateCommande
                                      )}
                                    </span>
                                  ) : (
                                    <span> Sélectionnez une date </span>
                                  )}

                                  <div className="flex justify-between gap-2">
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    <X
                                      className="ml-auto h-4 w-4 opacity-50"
                                      onClick={(e) => {
                                        e.stopPropagation(); // Prevent triggering the Popover
                                        handleClearDate(field);
                                      }}
                                    />
                                  </div>
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={
                                  field.value
                                    ? new Date(field.value)
                                    : undefined
                                }
                                onSelect={(date) => {
                                  field.onChange(date);
                                  setIsOpen(false); // Close the Popover when a date is picked
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-1">
                  <FormField
                    control={form.control}
                    name="lieuDuReception"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">
                          LIEU DE RECEPTION
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder={""}
                            className="!placeholder-black !text-black"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-1">
                  <FormField
                    control={form.control}
                    name="dateReceptionDepot"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">
                          DATE DE RECEPTION DEPOT{" "}
                        </FormLabel>
                        <br />
                        <FormControl>
                          <Popover
                            open={isOpenDateReception}
                            onOpenChange={setIsOpenDateReception}
                          >
                            <PopoverTrigger asChild className="w-full">
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "lg:w-full w-full pl-3 text-left font-normal justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {/* Conditional rendering */}
                                  {field.value &&
                                  field.value !== null &&
                                  field.value !== undefined ? (
                                    <span>{formatDate(field.value)}</span>
                                  ) : userData[0]?.dateReceptionDepot &&
                                    userData[0]?.dateReceptionDepot !== null &&
                                    userData[0]?.dateReceptionDepot !==
                                      undefined ? (
                                    <span>
                                      {formatDate(
                                        userData[0]?.dateReceptionDepot
                                      )}
                                    </span>
                                  ) : (
                                    <span> Sélectionnez une date </span>
                                  )}

                                  <div className="flex justify-between gap-2">
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    <X
                                      className="ml-auto h-4 w-4 opacity-50"
                                      onClick={() => handleClearDate(field)}
                                    />
                                  </div>
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={
                                  field.value
                                    ? new Date(field.value)
                                    : undefined
                                }
                                onSelect={(date) => {
                                  field.onChange(date);
                                  setIsOpenDateReception(false); // Close the Popover when a date is picked
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-1">
                  <FormField
                    control={form.control}
                    name="dateExpiditon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">
                          DATE EXPEDITION ou ENLEVEMENT{" "}
                        </FormLabel>
                        <br />
                        <FormControl>
                          <Popover
                            open={isOpenDateEnlevement}
                            onOpenChange={setIsOpenDateEnlevement}
                          >
                            <PopoverTrigger asChild className="w-full">
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "lg:w-full w-full pl-3 text-left font-normal justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ||
                                  userData[0]?.dateExpedition ? (
                                    <span>
                                      {formatDate(
                                        field.value ||
                                          userData[0]?.dateExpedition
                                      )}
                                    </span>
                                  ) : (
                                    <span> Sélectionnez une date </span>
                                  )}
                                  <div className="flex justify-between gap-2">
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    <X
                                      className="ml-auto h-4 w-4 opacity-50"
                                      onClick={() => handleClearDate(field)}
                                    />
                                  </div>
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={
                                  field.value
                                    ? new Date(field.value)
                                    : undefined
                                }
                                onSelect={(date) => {
                                  field.onChange(date);
                                  setIsOpenDateEnlevement(false); // Close the Popover when a date is picked
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-1">
                  <FormField
                    control={form.control}
                    name="dateLivraisonPrevue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">
                          DATE DE LIVRAISON PREVUE{" "}
                        </FormLabel>
                        <br />
                        <FormControl>
                          <Popover
                            open={isOpenDatePrevue}
                            onOpenChange={setIsOpenDatePrevue}
                          >
                            <PopoverTrigger asChild className="w-full">
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "lg:w-full w-full pl-3 text-left font-normal justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ||
                                  userData[0]?.dateLivraisonPrevue ? (
                                    <span>
                                      {formatDate(
                                        field.value ||
                                          userData[0]?.dateLivraisonPrevue
                                      )}
                                    </span>
                                  ) : (
                                    <span> Sélectionnez une date </span>
                                  )}
                                  <div className="flex justify-between gap-2">
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    <X
                                      className="ml-auto h-4 w-4 opacity-50"
                                      onClick={() => handleClearDate(field)}
                                    />
                                  </div>
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={
                                  field.value
                                    ? new Date(field.value)
                                    : undefined
                                }
                                onSelect={(date) => {
                                  field.onChange(date);
                                  setIsOpenDatePrevue(false); // Close the Popover when a date is picked
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-1">
                  <FormField
                    control={form.control}
                    name="personneQuiPasseCommande"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">
                          PERSONNE QUI PASSE COMMANDE
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder={""}
                            className="!placeholder-black !text-black"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-1">
                  <FormField
                    control={form.control}
                    name="dateReceptionPieceDef"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">
                          DATE RECEPTION PIECE DEFECTUEUSE{" "}
                        </FormLabel>
                        <br />
                        <FormControl>
                          <Popover
                            open={isOpenDateDefectueuse}
                            onOpenChange={setIsOpenDateDefectueuse}
                          >
                            <PopoverTrigger asChild className="w-full">
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "lg:w-full w-full pl-3 text-left font-normal justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ||
                                  userData[0]?.dateReceptionPieceDef ? (
                                    <span>
                                      {formatDate(
                                        field.value ||
                                          userData[0]?.dateReceptionPieceDef
                                      )}
                                    </span>
                                  ) : (
                                    <span> Sélectionnez une date </span>
                                  )}
                                  <div className="flex justify-between gap-2">
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    <X
                                      className="ml-auto h-4 w-4 opacity-50"
                                      onClick={() => handleClearDate(field)}
                                    />
                                  </div>
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={
                                  field.value
                                    ? new Date(field.value)
                                    : undefined
                                }
                                onSelect={(date) => {
                                  field.onChange(date);
                                  setIsOpenDateDefectueuse(false); // Close the Popover when a date is picked
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-1">
                  <FormField
                    control={form.control}
                    name="dateExpiditonPieceDef"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">
                          DATE EXPEDITION DE LA PIECE DEFECTUEUSE{" "}
                        </FormLabel>
                        <br />
                        <FormControl>
                          <Popover
                            open={isOpenDateEXPEDITION}
                            onOpenChange={setIsOpenDateEXPEDITION}
                          >
                            <PopoverTrigger asChild className="w-full">
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "lg:w-full w-full pl-3 text-left font-normal justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ||
                                  userData[0]?.dateExpeditionPieceDef ? (
                                    <span>
                                      {formatDate(
                                        field.value ||
                                          userData[0]?.dateExpeditionPieceDef
                                      )}
                                    </span>
                                  ) : (
                                    <span> Sélectionnez une date </span>
                                  )}
                                  <div className="flex justify-between gap-2">
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    <X
                                      className="ml-auto h-4 w-4 opacity-50"
                                      onClick={() => handleClearDate(field)}
                                    />
                                  </div>
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={
                                  field.value
                                    ? new Date(field.value)
                                    : undefined
                                }
                                onSelect={(date) => {
                                  field.onChange(date);
                                  setIsOpenDateEXPEDITION(false); // Close the Popover when a date is picked
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-1">
                  <FormField
                    control={form.control}
                    name="numeroDevisEconegoce"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">
                          NUMERO DU DEVIS ECONEGOCE{" "}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder={""}
                            className="!placeholder-black !text-black"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-1">
                  <FormField
                    control={form.control}
                    name="dateReglement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">
                          DATE DU REGLEMENT{" "}
                        </FormLabel>
                        <br />
                        <FormControl>
                          <Popover
                            open={isOpenDateREGLEMENT}
                            onOpenChange={setIsOpenDateREGLEMENT}
                          >
                            <PopoverTrigger asChild className="w-full">
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "lg:w-full w-full pl-3 text-left font-normal justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value || userData[0]?.dateReglement ? (
                                    <span>
                                      {formatDate(
                                        field.value ||
                                          userData[0]?.dateReglement
                                      )}
                                    </span>
                                  ) : (
                                    <span> Sélectionnez une date </span>
                                  )}

                                  <div className="flex justify-between gap-2">
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    <X
                                      className="ml-auto h-4 w-4 opacity-50"
                                      onClick={() => handleClearDate(field)}
                                    />
                                  </div>
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={
                                  field.value
                                    ? new Date(field.value)
                                    : undefined
                                }
                                onSelect={(date) => {
                                  field.onChange(date);
                                  setIsOpenDateREGLEMENT(false); // Close the Popover when a date is picked
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-1">
                  <FormField
                    control={form.control}
                    name="facturePierceFournisseur"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">
                          FACTURE PIECE FOURNISSEUR{" "}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder={""}
                            className="!placeholder-black !text-black"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-1">
                  <FormField
                    control={form.control}
                    name="FacturePieceClientEconegoce"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">
                        FACTURE PIECE CLIENT ECONEGOCE{" "}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder={""}
                            className="!placeholder-black !text-black"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>                

                <div className="grid gap-1">
                  <FormItem>
                    <FormLabel className="text-black">
                      Document BL ou Facture
                    </FormLabel>
                    <div className="bg-[#ffffff] p-10 rounded-md">
                      <div className="space-y-1  whitespace-nowrap overflow-hidden overflow-ellipsis  align-center text-center cursor-auto mx-auto flex justify-center flex-col">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>

                        <div className="flex justify-center text-sm text-gray-600">
                          <p className="text-center">Ajouter un fichier</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF, PDF up to 5MO
                        </p>
                      </div>

                      <div className="mt-4">
                        {(!form.getValues("picture2") ||
                          form.getValues("picture2").length === 0) && (
                          <FormControl className="mt-2">
                            <Input
                              type="file"
                              accept="image/*,application/pdf"
                              multiple
                              {...form.register("picture2")}
                              onChange={(e) => handleFileChange(e, "picture2")}
                            />
                          </FormControl>
                        )}
                        {Array.isArray(form.getValues("picture2")) &&
                          form.getValues("picture2").map((file, index) => {
                            const fileName =
                              typeof file === "string" ? file : file.name;
                            const fileUrl =
                              typeof file === "string"
                                ? `/api/uploads/${encodeURIComponent(file)}`
                                : URL.createObjectURL(file);

                            return (
                              <div
                                key={index}
                                className="flex items-center mt-2"
                              >
                                <a
                                  href={fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline"
                                >
                                  {fileName.length > 20
                                    ? `${fileName.slice(0, 20)}...`
                                    : fileName}
                                </a>

                                <button
                                  className="ml-2 text-red-500"
                                  onClick={() =>
                                    typeof file === "string"
                                      ? handleRemovePicture2(index)
                                      : removeFile("picture2", index)
                                  }
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </div>
                              
                            );
                          })}
                                            <div className="mt-4 flex justify-center">
                      <button
                        type="button"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        onClick={() => {
                          // Create a file input element
                          const fileInput = document.createElement("input");
                          fileInput.type = "file";
                          fileInput.accept = "image/*,application/pdf";
                          fileInput.multiple = true;

                          // Handle file selection
                          fileInput.onchange = (e) => {
                            const files = Array.from(e.target.files);
                            appendFiles("picture2", files);
                          };

                          fileInput.click();
                        }}
                      >
                        Ajouter plus de documents
                      </button>
                    </div>  
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                </div>
                <div className="grid gap-1">
                  <FormItem>
                    <FormLabel className="text-black">
                      DOCUMENT FACTURE PIECE FOURNISSEUR
                    </FormLabel>
                    <div className="bg-[#ffffff] p-10 rounded-md">
                      <div className="space-y-1  whitespace-nowrap overflow-hidden overflow-ellipsis  align-center text-center cursor-auto mx-auto flex justify-center flex-col">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>

                        <div className="flex justify-center text-sm text-gray-600">
                          <p className="text-center">Ajouter un fichier</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF, PDF up to 5MO
                        </p>
                      </div>

                      <div className="mt-4">
                        {(!form.getValues("DocumentFacturePieceFournisseur") ||
                          form.getValues("DocumentFacturePieceFournisseur")
                            .length === 0) && (
                          <FormControl className="mt-2">
                            <Input
                              type="file"
                              accept="image/*,application/pdf"
                              multiple
                              {...form.register(
                                "DocumentFacturePieceFournisseur"
                              )}
                              onChange={(e) =>
                                handleFileChange(
                                  e,
                                  "DocumentFacturePieceFournisseur"
                                )
                              }
                            />
                          </FormControl>
                        )}

                        {Array.isArray(
                          form.getValues("DocumentFacturePieceFournisseur")
                        ) &&
                          form
                            .getValues("DocumentFacturePieceFournisseur")
                            .map((file, index) => {
                              const fileName =
                                typeof file === "string" ? file : file.name;
                              const fileUrl =
                                typeof file === "string"
                                  ? `/api/uploads/${encodeURIComponent(file)}`
                                  : URL.createObjectURL(file);

                              return (
                                <div
                                  key={index}
                                  className="flex items-center mt-2"
                                >
                                  <a
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                  >
                                    {fileName.length > 20
                                      ? `${fileName.slice(0, 20)}...`
                                      : fileName}
                                  </a>

                                  <button
                                    className="ml-2 text-red-500"
                                    onClick={() =>
                                      typeof file === "string"
                                        ? handleRemoveDocumentDocumentFacturePieceFournisseur(
                                            index
                                          )
                                        : removeFile(
                                            "DocumentFacturePieceFournisseur",
                                            index
                                          )
                                    }
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </div>
                              );
                            })}
                      </div>
                      <div className="mt-4 flex justify-center">
                      <button
                        type="button"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        onClick={() => {
                          // Create a file input element
                          const fileInput = document.createElement("input");
                          fileInput.type = "file";
                          fileInput.accept = "image/*,application/pdf";
                          fileInput.multiple = true;

                          // Handle file selection
                          fileInput.onchange = (e) => {
                            const files = Array.from(e.target.files);
                            appendFiles("DocumentFacturePieceFournisseur", files);
                          };

                          fileInput.click();
                        }}
                      >
                        Ajouter plus de documents
                      </button>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                </div>
                <div className="grid gap-1">
                  <FormItem>
                    <FormLabel className="text-black">
                      DOCUMENT FACTURE PIECE CLIENT ECONEGOCE
                    </FormLabel>
                    <div className="bg-[#ffffff] p-10 rounded-md">
                      <div className="space-y-1  whitespace-nowrap overflow-hidden overflow-ellipsis  align-center text-center cursor-auto mx-auto flex justify-center flex-col">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>

                        <div className="flex justify-center text-sm text-gray-600">
                          <p className="text-center">Ajouter un fichier</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF, PDF up to 5MO
                        </p>
                      </div>

                      <div className="mt-4">
                        {(!form.getValues(
                          "DocumentFacturePieceClientEconegoce"
                        ) ||
                          form.getValues("DocumentFacturePieceClientEconegoce")
                            .length === 0) && (
                          <FormControl className="mt-2">
                            <Input
                              type="file"
                              accept="image/*,application/pdf"
                              multiple
                              {...form.register(
                                "DocumentFacturePieceClientEconegoce"
                              )}
                              onChange={(e) =>
                                handleFileChange(
                                  e,
                                  "DocumentFacturePieceClientEconegoce"
                                )
                              }
                            />
                          </FormControl>
                        )}
                        {Array.isArray(
                          form.getValues("DocumentFacturePieceClientEconegoce")
                        ) &&
                          form
                            .getValues("DocumentFacturePieceClientEconegoce")
                            .map((file, index) => {
                              const fileName =
                                typeof file === "string" ? file : file.name;
                              const fileUrl =
                                typeof file === "string"
                                  ? `/api/uploads/${encodeURIComponent(file)}`
                                  : URL.createObjectURL(file);

                              return (
                                <div
                                  key={index}
                                  className="flex items-center mt-2"
                                >
                                  <a
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                  >
                                    {fileName.length > 20
                                      ? `${fileName.slice(0, 20)}...`
                                      : fileName}
                                  </a>

                                  <button
                                    className="ml-2 text-red-500"
                                    onClick={() =>
                                      typeof file === "string"
                                        ? handleRemoveDocumentFacturePieceClientEconegoce(
                                            index
                                          )
                                        : removeFile(
                                            "DocumentFacturePieceClientEconegoce",
                                            index
                                          )
                                    }
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </div>
                              );
                            })}
                      </div>
                      <div className="mt-4 flex justify-center">
                        <button
                          type="button"
                          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                          onClick={() => {
                            // Create a file input element
                            const fileInput = document.createElement("input");
                            fileInput.type = "file";
                            fileInput.accept = "image/*,application/pdf";
                            fileInput.multiple = true;

                            // Handle file selection
                            fileInput.onchange = (e) => {
                              const files = Array.from(e.target.files);
                              appendFiles("DocumentFacturePieceClientEconegoce", files);
                            };

                            fileInput.click();
                          }}
                        >
                          Ajouter plus de documents
                        </button>
                      </div>
                    </div>
                    
                    <FormMessage />
                  </FormItem>
                </div>
                <div className="grid gap-1">
                  <FormField
                    control={form.control}
                    name="Observation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">
                          OBSERVATION
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            disabled={isPending}
                            placeholder={""}
                            className="!placeholder-black !text-black"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex justify-center items-center gap-4">
                {/*<Button
                    type="button"
                    onClick={prevStep}
                    variant={"login"}
                    className={`lg:inline-block px-5 relative rounded group overflow-hidden font-medium bg-transparent text-[#fab516]`}
                  >
                    <span
                      className={`absolute top-0 left-0 flex w-0 h-full mr-0 transition-all duration-200 ease-out transform translate-x-0 bg-[#fab516] group-hover:w-full opacity-90`}
                    ></span>
                    <span
                      className={`relative group-hover:text-white flex items-center gap-2`}
                    >
                      Précédent
                    </span>
                    </Button>*/}
                <div className="flex justify-center items-center gap-4">
                  {/* Valider Button */}
                  <Button
                    type="submit"
                    variant={"login"}
                    onClick={onClick}
                    className={`lg:inline-block px-5 relative rounded group overflow-hidden font-medium bg-transparent text-[#fab516]`}
                  >
                    <span
                      className={`absolute top-0 left-0 flex w-0 h-full mr-0 transition-all duration-200 ease-out transform translate-x-0 bg-[#fab516] group-hover:w-full opacity-90`}
                    ></span>
                    <span
                      className={`relative group-hover:text-white flex items-center gap-2`}
                    >
                      Valider
                    </span>
                  </Button>

                  {/* Annuler Button (Closes Modal) */}
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      className="lg:inline-block px-5 relative rounded group overflow-hidden font-medium bg-transparent text-black border-2 border-black"
                    >
                      <span
                        className={`relative group-hover:text-black flex items-center gap-2`}
                      >
                        Annuler
                      </span>
                    </Button>
                  </DialogClose>
                </div>
              </div>
            </>
          </form>
        </Form>
      </div>
    </div>
  );
}
