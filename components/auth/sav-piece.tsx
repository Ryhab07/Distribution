"use client";
import * as React from "react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormError } from "@/components/form-error";
import { FormSucess } from "../form-sucess";
import { SuccessCard } from "../reusable/SuccessCard";
import { SavPieceSchema } from "@/schema/";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon, X, XCircle } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Textarea } from "../ui/textarea";
import { v4 as uuidv4 } from "uuid";
import data from "../../public/pieceData.json";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SavPieceFormProps extends React.HTMLAttributes<HTMLDivElement> {}
interface Article {
  MARQUE: string;
  REFARTICLE: string;
  LIBELLE240: string;
  TARIF: number;
}

export function SavPieceForm({ className, ...props }: SavPieceFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = React.useState<string | undefined>("");
  const [success, setSuccess] = React.useState<string | undefined>("");
  const [pending, setPending] = React.useState<boolean | undefined>(false);
  const [openState, setOpenState] = React.useState<Record<string, boolean>>({});
  // Function to toggle popover state for a specific field
  const toggleOpen = (fieldName: string, isOpen: boolean) => {
    setOpenState((prev) => ({ ...prev, [fieldName]: isOpen }));
  };
  const [step, setStep] = React.useState(1);
  const [date] = React.useState<Date | string>(new Date());
  const [formData, setFormData] = React.useState({});
  //const [status, setStatus] = React.useState("En attente de commande pièces");
  const creators = sessionStorage.getItem("id") ?? undefined;
  const uniqueID = uuidv4();
  const [filteredArticleNames, setFilteredArticleNames] = React.useState<
    Article[]
  >([]);
  const [selectedFilesPicture2, setselectedFilesPicture2] = React.useState<
    FileList | []
  >([]);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [articles] = React.useState<Article[]>(data);
  const [selectedArticle, setSelectedArticle] = React.useState<Article | null>(
    null
  );
  console.log("selectedArticle", selectedArticle);
  const [filteredReferences, setFilteredReferences] = React.useState<Article[]>(
    []
  );
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [userData, setUserData] = React.useState<CardProps[]>([]);
  const [entreprises, setEntreprises] = React.useState([]);
  const [userRole, setUserRole] = React.useState("")

  
    React.useEffect(() => {
      // Load the role from sessionStorage when the page loads
      const role = sessionStorage.getItem("role");
      setUserRole(role);
    }, []);
  
    const handleClick = (e) => {
      console.log("userRole", userRole);
      e.preventDefault(); // Prevent default form submission
      if (userRole === "collaborator") {
        window.location.href = "/collaborateur/sav/liste-sav-piece";
      } else if (userRole === "admin") {
        window.location.href = "/admin/sav/liste-sav-piece";
      }
    };

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
      setUserData(filteredUsers);
      const entrepriseList = filteredUsers.map((user) => user.entreprise);
      setEntreprises(entrepriseList);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  console.log("userData", userData);

  const [
    selectefFilesDocumentFacturePieceFournisseur,
    setselectefFilesDocumentFacturePieceFournisseur,
  ] = React.useState<FileList | []>([]);
  const [
    selectefFilesDocumentFacturePieceClientEconegoce,
    setselectefFilesDocumentFacturePieceClientEconegoce,
  ] = React.useState<FileList | []>([]);

  const form = useForm<z.infer<typeof SavPieceSchema>>({
    resolver: zodResolver(SavPieceSchema),
    defaultValues: {
      created_at: date,
      pieceCreatedID: uniqueID,
      creator: creators,
      picture2: undefined,
      DocumentFacturePieceFournisseur: undefined,
      DocumentFacturePieceClientEconegoce: undefined,
      societe: "",
      client: "",
      serieNumber: "",
      marque: "",
      numeroCommande: "",
      articleName: "",
      reference: "",
      stockDispoTremblay: "",
      dateCommande: "",
      dateDeLivraisonPrevu: "",
      lieuDuReception: "",
      dateReceptionDepot: "",
      dateExpiditon: "",
      dateReceptionPieceDef: "",
      dateExpiditonPieceDef: "",
      numeroDevisEconegoce: "",
      dateReglement: "",
      facturePierceFournisseur: "",
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
    console.log("Default values:", form.getValues());
  }, [form]);

  const handleFileChange = (e, field) => {
    const newFiles = Array.from(e.target.files);
    const selectedFiles = form.getValues(field) || [];

    // Filter out files that exceed 20 MB
    const maxFileSize = 20 * 1024 * 1024; // 20 MB in bytes
    const updatedFiles = [...selectedFiles, ...newFiles].filter(
      (file) => file.size <= maxFileSize
    );

    if (updatedFiles.length < newFiles.length) {
      alert("Some files exceed the 20 MB limit and were not added.");
    }

    const dataTransfer = new DataTransfer();
    updatedFiles.forEach((file) => dataTransfer.items.add(file));
    const fileList = dataTransfer.files;

    form.setValue(field, fileList);

    if (field === "picture2") {
      setselectedFilesPicture2(fileList);
    } else if (field === "DocumentFacturePieceFournisseur") {
      setselectefFilesDocumentFacturePieceFournisseur(fileList);
    } else if (field === "DocumentFacturePieceFournisseur") {
      setselectefFilesDocumentFacturePieceFournisseur(fileList);
    }

    console.log(`Files after addition for ${field}:`, fileList);
  };

  const removeFile = (field, index) => {
    const intIndex = parseInt(index, 10);
    const selectedFiles = form.getValues(field) || [];
    const filesArray = Array.from(selectedFiles);
    const updatedFiles = filesArray.filter((file, i) => i !== intIndex);

    // Create a new DataTransfer object
    const dataTransfer = new DataTransfer();
    // Add files to the DataTransfer object
    updatedFiles.forEach((file) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dataTransfer.items.add(file);
    });

    // Extract the FileList from the DataTransfer object
    const newFileList = dataTransfer.files;

    // Update the form value with the new FileList
    form.setValue(field, newFileList);
    // Update the state based on the field
    if (field === "picture2") {
      setselectedFilesPicture2(newFileList);
    } else if (field === "DocumentFacturePieceFournisseur") {
      setselectefFilesDocumentFacturePieceFournisseur(newFileList);
    } else if (field === "DocumentFacturePieceFournisseur") {
      setselectefFilesDocumentFacturePieceFournisseur(newFileList);
    }
    // Add more cases as needed
    console.log(`Form value after update for ${field}:`, form.getValues(field));
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

  React.useEffect(() => {
    console.log("Default values:", form.getValues());
  }, [form]);

  const onSubmit = async (values: z.infer<typeof SavPieceSchema>) => {
    try {
      /* Check if required fields are empty
      if (
        !values.numeroBlOuFacture ||
        !values.societe ||
        !values.client ||
        !values.serieNumber ||
        !values.marque ||
        !values.numeroCommande ||
        !values.articleName ||
        !values.reference
      ) {
        throw new Error("Veuillez remplir tous les champs obligatoires.");
      }*/

      if (step === 1) {
        console.log();
        setFormData(values);
        setStep(2);
      } else {
        const combinedData = { ...formData, ...values };
        setError("");
        setSuccess("");
        setPending(true);

        const formDataToSend = new FormData();
        Object.entries(combinedData).forEach(([key, value]) => {
          if (value instanceof FileList && value.length > 0) {
            for (let i = 0; i < value.length; i++) {
              formDataToSend.append(key, value[i]);
            }
          } else {
            formDataToSend.append(key, String(value));
          }
        });

        console.log("FormData contents:");
        for (const [key, value] of formDataToSend.entries()) {
          if (value instanceof File) {
            console.log(`${key}: File { name: ${value.name}, size: ${value.size}, type: ${value.type} }`);
          } else {
            console.log(`${key}: ${value}`);
          }
        }
        


        startTransition(() => {
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/pieces/create`, {
            method: "POST",
            body: formDataToSend,
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.success) {
                setSuccess(data.success);
                setPending(false);
                const role = sessionStorage.getItem("role");
                if (role === "collaborator") {
                  window.location.href = "/collaborateur/sav/liste-sav-piece";
                } else if (role === "admin") {
                  window.location.href = "/admin/sav/liste-sav-piece";
                }
              } else {
                setError(data.error);
                setPending(false);
              }
            })
            .catch((error) => {
              console.error("Erreur lors de l'enregistrement'", error);
              setError("Erreur lors de l'enregistrement");
              setPending(false);
            });
        });
      }
    } catch (error) {
      console.error(
        "Erreur lors de la validation des champs obligatoires'",
        error
      );
      setError(
        error.message || "Erreur lors de la validation des champs obligatoires"
      );
    }
  };

  const onClick = async () => {
    const values = form.getValues();
    onSubmit(values);
  };

  const nextStep = () => {
    const { numeroBlOuFacture } = form.getValues();
    if (!numeroBlOuFacture) {
      setError("");
      setStep(step + 1);
    } else {
      setError("");
      setStep(step + 1);
    }
  };

  //const prevStep = () => setStep(step - 1);

  const handleArticleChange = (
    value: string,
    field: "REFARTICLE" | "LIBELLE240"
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

  const entrepriseChange = (e) => {
    const value = e.target.value;
    form.setValue("societe", value);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    handleArticleChange(value, "article");
  };

  const handleClearDate = (field) => {
    field.onChange(""); // Clear the field value
  };

  console.log("status change", status);

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
          <FormSucess message={success} />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <>
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 z-40">
                  <div className="grid gap-1">
                    <FormField
                      control={form.control}
                      name="numeroBlOuFacture"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">
                            N° BL ou Facture{" "}
                            {/*<span className="text-red-500">*</span>*/}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder=""
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <FormItem>
                      <FormLabel className="text-black">
                        Document BL ou Facture
                      </FormLabel>
                      <div className="bg-white p-4 sm:p-6 rounded-md w-full overflow-hidden">
                        <div className="text-center">
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
                          <p className="mt-2 text-sm text-gray-600">
                            Ajouter un fichier
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF, PDF jusqu’à 5MO
                          </p>
                        </div>

                        <FormControl className="mt-2">
                          <Input
                            type="file"
                            accept="image/*,application/pdf"
                            multiple
                            onChange={(e) => handleFileChange(e, "picture2")}
                          />
                        </FormControl>

                        <div className="mt-4 space-y-2">
                          {selectedFilesPicture2 &&
                            Object.keys(selectedFilesPicture2).map((key) => (
                              <div
                                key={key}
                                className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                              >
                                <a
                                  href={URL.createObjectURL(
                                    selectedFilesPicture2[key]
                                  )}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline truncate"
                                >
                                  {selectedFilesPicture2[key].name}
                                </a>
                                <button
                                  className="ml-2 text-red-500"
                                  onClick={() => removeFile("picture2", key)}
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
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
                </div>
                <div className="flex lg:justify-center items-end gap-4">
                  <Button
                    type="button"
                    onClick={nextStep}
                    variant={"login"}
                    className={`lg:inline-block px-5 relative rounded group overflow-hidden font-medium bg-transparent text-[#fab516]`}
                  >
                    <span
                      className={`absolute top-0 left-0 flex w-0 h-full mr-0 transition-all duration-200 ease-out transform translate-x-0 bg-[#fab516] group-hover:w-full opacity-90`}
                    ></span>
                    <span
                      className={`relative group-hover:text-white flex items-center gap-2`}
                    >
                      Suivant
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className="mt-6 lg:inline-block px-5 relative rounded group overflow-hidden font-medium bg-transparent text-black border-2 border-black"
                    onClick={handleClick}
                  >
                    <span
                      className={`relative group-hover:text-black flex items-center gap-2`}
                    >
                      Annuler
                    </span>
                  </Button>
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 z-40">
                  <div className="grid gap-1">
                    <label className="text-black">
                      SOCIETE {/*<span className="text-red-500">*</span>*/}
                    </label>
                    <FormField
                      name="societe"
                      control={form.control}
                      render={({ field }) => (
                        <input
                          {...field}
                          list="societe"
                          onChange={entrepriseChange}
                          className="p-2 border border-gray-200 rounded-md cursor-pointer lg:w-full w-[98%]"
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
                          <FormLabel className="text-black">
                            CLIENT {/*<span className="text-red-500">*</span>*/}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder=""
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-1">
                    <label className="text-black">
                      REFERENCE {/*<span className="text-red-500">*</span>*/}
                    </label>
                    <FormField
                      name="reference"
                      control={form.control}
                      render={({ field }) => (
                        <input
                          {...field}
                          list="references"
                          onChange={handleReferenceChange}
                          className="p-2 border border-gray-200 rounded-md cursor-pointer lg:w-full w-[98%]"
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
                    <label className="text-black">
                      NOM DE LA PIECE{" "}
                      {/*<span className="text-red-500">*</span>*/}
                    </label>
                    <FormField
                      name="articleName"
                      control={form.control}
                      render={({ field }) => (
                        <input
                          {...field}
                          list="articleNames"
                          onChange={handleArticleNameChange}
                          className="p-2 border border-gray-200 rounded-md cursor-pointer lg:w-full w-[98%]"
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
                          <FormLabel className="text-black">
                            MARQUE {/*<span className="text-red-500">*</span>*/}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder=""
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
                            Prix HT fournisseur
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder=""
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
                            {/*<span className="text-red-500">*</span>*/}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder=""
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
                          <FormLabel className="text-black">Quantité</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder=""
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
                            {/*<span className="text-red-500">*</span>*/}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder=""
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
                              placeholder=""
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
                            <Popover
                              open={openState["dateCommande"]}
                              onOpenChange={(isOpen) =>
                                toggleOpen("dateCommande", isOpen)
                              }
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
                                    {field.value ? (
                                      format(field.value, "PPP", { locale: fr })
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
                                  onSelect={field.onChange}
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
                      name="dateDeLivraisonPrevu"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">
                            DATE DE LIVRAISON PREVU{" "}
                          </FormLabel>
                          <br />
                          <FormControl>
                            <Popover
                              open={openState["dateDeLivraisonPrevu"]}
                              onOpenChange={(isOpen) =>
                                toggleOpen("dateDeLivraisonPrevu", isOpen)
                              }
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
                                    {field.value ? (
                                      format(field.value, "PPP", { locale: fr })
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
                                  onSelect={field.onChange}
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
                              placeholder=""
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
                              open={openState["dateReceptionDepot"]}
                              onOpenChange={(isOpen) =>
                                toggleOpen("dateReceptionDepot", isOpen)
                              }
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
                                    {field.value ? (
                                      format(field.value, "PPP", { locale: fr })
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
                                  onSelect={field.onChange}
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
                              open={openState["dateExpiditon"]}
                              onOpenChange={(isOpen) =>
                                toggleOpen("dateExpiditon", isOpen)
                              }
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
                                    {field.value ? (
                                      format(field.value, "PPP", { locale: fr })
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
                                  onSelect={field.onChange}
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

                  {/*<div className="grid gap-1">
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
                            <Popover>
                              <PopoverTrigger asChild className="w-full">
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "lg:w-full w-full pl-3 text-left font-normal justify-between",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP", { locale: fr })
                                    ) : (
                                      <span> Sélectionnez une date </span>
                                    )}
                                                                                                                                            <div className="flex justify-between gap-2">
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  <X className="ml-auto h-4 w-4 opacity-50" onClick={() => handleClearDate(field)}/>
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
                                  onSelect={field.onChange}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>*/}

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
                              placeholder=""
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
                              open={openState["dateReceptionPieceDef"]}
                              onOpenChange={(isOpen) =>
                                toggleOpen("dateReceptionPieceDef", isOpen)
                              }
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
                                    {field.value ? (
                                      format(field.value, "PPP", { locale: fr })
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
                                  onSelect={field.onChange}
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
                              open={openState["dateExpiditonPieceDef"]}
                              onOpenChange={(isOpen) =>
                                toggleOpen("dateExpiditonPieceDef", isOpen)
                              }
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
                                    {field.value ? (
                                      format(field.value, "PPP", { locale: fr })
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
                                  onSelect={field.onChange}
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
                              placeholder=""
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
                              open={openState["dateReglement"]}
                              onOpenChange={(isOpen) =>
                                toggleOpen("dateReglement", isOpen)
                              }
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
                                    {field.value ? (
                                      format(field.value, "PPP", { locale: fr })
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
                                  onSelect={field.onChange}
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
                              placeholder=""
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <FormItem>
                      <FormLabel className="text-black">
                        DOCUMENT FACTURE PIECE FOURNISSEUR
                      </FormLabel>
                      <div className="bg-white p-6 sm:p-10 rounded-md w-full overflow-hidden">
                        <div className="text-center">
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
                          <p className="mt-2 text-sm text-gray-600">
                            Ajouter un fichier
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF, PDF jusqu’à 5MO
                          </p>
                        </div>

                        <FormControl className="mt-2">
                          <Input
                            type="file"
                            accept="image/*,application/pdf"
                            multiple
                            onChange={(e) =>
                              handleFileChange(
                                e,
                                "DocumentFacturePieceFournisseur"
                              )
                            }
                          />
                        </FormControl>

                        <div className="mt-4 space-y-2">
                          {selectefFilesDocumentFacturePieceFournisseur &&
                            Object.keys(
                              selectefFilesDocumentFacturePieceFournisseur
                            ).map((key) => (
                              <div
                                key={key}
                                className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                              >
                                <a
                                  href={URL.createObjectURL(
                                    selectefFilesDocumentFacturePieceFournisseur[
                                      key
                                    ]
                                  )}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline truncate"
                                >
                                  {selectefFilesDocumentFacturePieceFournisseur[
                                    key
                                  ].name.length > 20 && window.innerWidth <= 768
                                    ? selectefFilesDocumentFacturePieceFournisseur[
                                        key
                                      ].name.substring(0, 20) + "..."
                                    : selectefFilesDocumentFacturePieceFournisseur[
                                        key
                                      ].name.length > 40
                                    ? selectefFilesDocumentFacturePieceFournisseur[
                                        key
                                      ].name.substring(0, 40) + "..."
                                    : selectefFilesDocumentFacturePieceFournisseur[
                                        key
                                      ].name}
                                </a>

                                <button
                                  className="ml-2 text-red-500"
                                  onClick={() =>
                                    removeFile(
                                      "DocumentFacturePieceFournisseur",
                                      key
                                    )
                                  }
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  </div>

                  <div className="grid gap-1">
                    <FormField
                      control={form.control}
                      name="FacturePieceClientEconegoce"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">
                            FACTURE PIECE CLIENT ECONEGOCE
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder=""
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
                        DOCUMENT FACTURE PIECE CLIENT ECONEGOCE
                      </FormLabel>
                      <div className="bg-white p-6 sm:p-10 rounded-md w-full overflow-hidden">
                        <div className="space-y-2 text-center">
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

                          <p className="text-sm text-gray-600">
                            Ajouter un fichier
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF, PDF up to 5MO
                          </p>
                        </div>
                        {!selectefFilesDocumentFacturePieceClientEconegoce ||
                        selectefFilesDocumentFacturePieceClientEconegoce.length ===
                          0 ? (
                          <FormControl className="mt-2">
                            <Input
                              type="file"
                              accept="image/*,application/pdf"
                              multiple
                              onChange={(e) =>
                                handleFileChange(
                                  e,
                                  "DocumentFacturePieceClientEconegoce"
                                )
                              }
                            />
                          </FormControl>
                        ) : null}
                        {selectefFilesDocumentFacturePieceClientEconegoce &&
                          selectefFilesDocumentFacturePieceClientEconegoce.length >
                            0 && (
                            <FormControl className="mt-2">
                              <Input
                                type="file"
                                accept="image/*,application/pdf"
                                multiple
                                onChange={(e) =>
                                  handleFileChange(
                                    e,
                                    "DocumentFacturePieceClientEconegoce"
                                  )
                                }
                              />
                            </FormControl>
                          )}

                        <div className="mt-4">
                          {selectefFilesDocumentFacturePieceClientEconegoce &&
                            Object.keys(
                              selectefFilesDocumentFacturePieceClientEconegoce
                            ).map((key) => (
                              <div
                                key={key}
                                className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                              >
                                <a
                                  href={URL.createObjectURL(
                                    selectefFilesDocumentFacturePieceClientEconegoce[
                                      key
                                    ]
                                  )}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline truncate"
                                >
                                  {selectefFilesDocumentFacturePieceClientEconegoce[
                                    key
                                  ].name.length > 20 && window.innerWidth <= 768
                                    ? selectefFilesDocumentFacturePieceClientEconegoce[
                                        key
                                      ].name.substring(0, 20) + "..."
                                    : selectefFilesDocumentFacturePieceClientEconegoce[
                                        key
                                      ].name.length > 40
                                    ? selectefFilesDocumentFacturePieceClientEconegoce[
                                        key
                                      ].name.substring(0, 40) + "..."
                                    : selectefFilesDocumentFacturePieceClientEconegoce[
                                        key
                                      ].name}
                                </a>

                                <button
                                  className="ml-2 text-red-500"
                                  onClick={() =>
                                    removeFile(
                                      "DocumentFacturePieceClientEconegoce",
                                      key
                                    )
                                  }
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  </div>

                  <div className="grid gap-1">
                    <FormField
                      control={form.control}
                      name="avoirPierceFournisseur"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">
                            AVOIR PIECE FOURNISSEUR
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder=""
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
                      name="RepenseExpertise"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">
                            REPONSE D EXPERTISE
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder=""
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
                      name="AvoirPieceClientEconegoce"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">
                            AVOIR PIECE CLIENT ECONEGOCE
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder=""
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
                      name="DossierCloture"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">
                            DOSSIER CLOTURE
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder=""
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
                              placeholder=""
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
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Statut</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Statut" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Avoir">Avoir</SelectItem>
                              <SelectItem value="En attente de commande pièces">
                                En attente de commande pièces
                              </SelectItem>
                              <SelectItem value="En attente de réception de pièces">
                                En attente de réception de pièces
                              </SelectItem>
                              <SelectItem value="En attente de paiement">
                                En attente de paiement
                              </SelectItem>
                              <SelectItem value="Facturation">
                                Facturation
                              </SelectItem>
                              <SelectItem value="Pièces envoyées">
                                Pièces envoyées
                              </SelectItem>
                              <SelectItem value="Validé">Validé</SelectItem>
                            </SelectContent>
                          </Select>
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
                  <Button
                    type="submit"
                    variant={"login"}
                    onClick={onClick}
                    className={`mt-6 lg:inline-block px-5 relative rounded group overflow-hidden font-medium bg-transparent text-[#fab516]`}
                  >
                    <span
                      className={`absolute top-0 left-0 flex w-0 h-full mr-0 transition-all duration-200 ease-out transform translate-x-0 bg-[#fab516] group-hover:w-full opacity-90`}
                    ></span>
                    <span
                      className={`relative group-hover:text-white flex items-center gap-2`}
                    >
                      Créer
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className="mt-6 lg:inline-block px-5 relative rounded group overflow-hidden font-medium bg-transparent text-black border-2 border-black"
                    onClick={handleClick}
                  >
                    <span
                      className={`relative group-hover:text-black flex items-center gap-2`}
                    >
                      Annuler
                    </span>
                  </Button>
                </div>
              </>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
