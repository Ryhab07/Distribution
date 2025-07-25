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
import { SavMachinesSchema } from "@/schema/";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon, X, XCircle } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { v4 as uuidv4 } from "uuid";
import data from "../../public/data.json";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "../ui/textarea";
//import { Textarea } from "../ui/textarea";

interface Article {
  MARQUE: string;
  NArticle: string;
  Description: string;
  CoutUnitaire: number;
  PrixUnitaire: number;
  CodeCategorieParent: string;
  NFournisseur: string;
}

interface SavMachinesFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SavMachinesForm({ className, ...props }: SavMachinesFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = React.useState<string | undefined>("");
  const [success, setSuccess] = React.useState<string | undefined>("");
  const [pending, setPending] = React.useState<boolean | undefined>(false);
  const [step, setStep] = React.useState(1);
  const [date] = React.useState<Date | string>("");
  const [formData, setFormData] = React.useState({});
  const creators = sessionStorage.getItem("id") ?? undefined;
  const uniqueID = uuidv4();
  const [selectedFilesPicture2, setselectedFilesPicture2] = React.useState<
    FileList | []
  >([]);
  const [selectedFilesPicture1, setselectedFilesPicture1] = React.useState<
    FileList | []
  >([]);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [articles] = React.useState<Article[]>(data);
  const [selectedArticle, setSelectedArticle] = React.useState<Article | null>(
    null
  );
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [userData, setUserData] = React.useState<CardProps[]>([]);
  const [entreprises, setEntreprises] = React.useState([]);
  const [openState, setOpenState] = React.useState<Record<string, boolean>>({});
  const [userRole, setUserRole] = React.useState("")
  // Function to toggle popover state for a specific field
  const toggleOpen = (fieldName: string, isOpen: boolean) => {
    setOpenState((prev) => ({ ...prev, [fieldName]: isOpen }));
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

  const handleClearDate = (field) => {
    field.onChange(""); // Clear the field value
  };

  console.log("userData", userData);

  console.log("selectedArticle", selectedArticle);

  const form = useForm<z.infer<typeof SavMachinesSchema>>({
    resolver: zodResolver(SavMachinesSchema),
    defaultValues: {
      created_at: new Date(),
      pieceCreatedID: uniqueID,
      creator: creators,
      picture1: undefined,
      picture2: undefined,
      dateDemande: date,
      numeroBlOuFacture: "",
      zendesk: "",
      observation: "",
      installateur: "",
      client: "",
      causeSAV: "",
      marque: "",
      articleNumber: "",
      modele: "",
      categorieArticle: "",
      serieNumber: "",
      quantite: 1,
      blNumber: "",
      accord: "",
      dateRetourDepot: date,
      dateDemandeAvoirFournisseur: date,
      dateReceptionAvoirFournisseur: date,
      statutFournisseur: "",
      avoirFournisseurNumber: "",
      dateAvoirInstallateur: date,
      avoirInstallateurNumber: "",
      nouveauBlNumber: "",
      dateRetourFournisseur: date,
      prixAchat: 0,
      prixVente: 0,
      retoursMachines: "",
      status: "En attente de commande pièces",
      adresseRetrait: "53 Av. du Bois de la Pie, 93290 Tremblay-en-France",
    },
  });

  const handleFileChange = (e, field) => {
    console.log("field", field);
    const newFiles = Array.from(e.target.files);
    const selectedFiles = form.getValues(field) || [];
    const updatedFiles = [...selectedFiles, ...newFiles];
    console.log("updatedFiles1", updatedFiles);

    // Convert array of files to FileList
    const dataTransfer = new DataTransfer();
    updatedFiles.forEach((file) => {
      dataTransfer.items.add(file);
    });
    const fileList = dataTransfer.files;

    // Update form value
    form.setValue(field, fileList);
    console.log("fileList", fileList);

    // Update state based on field
    if (field === "picture2") {
      setselectedFilesPicture2(fileList);
    } else if (field === "picture1") {
      setselectedFilesPicture1(fileList);
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
    console.log("newFileList", newFileList);

    // Update the form value with the new FileList
    form.setValue(field, newFileList);
    // Update the state based on the field
    if (field === "picture2") {
      setselectedFilesPicture2(newFileList);
    } else if (field === "DocumentfacturePierceFournisseur") {
      setselectedFilesPicture1(newFileList);
    }
    // Add more cases as needed
    console.log(`Form value after update for ${field}:`, form.getValues(field));
  };

  React.useEffect(() => {
    setselectedFilesPicture2(form.watch("picture2"));
  }, [form.watch("picture2")]);

  React.useEffect(() => {
    setselectedFilesPicture1(form.watch("picture1"));
  }, [form.watch("picture1")]);

  React.useEffect(() => {
    console.log("Default values:", form.getValues());
  }, [form]);

  const handleArticleChange = (
    value: string,
    field: "NArticle" | "Description"
  ) => {
    const article = articles.find(
      (article) =>
        (field === "NArticle" && article.NArticle === value) ||
        (field === "Description" && article.Description === value)
    );

    if (article) {
      setSelectedArticle(article);
      form.setValue("prixAchat", article.CoutUnitaire);
      form.setValue("prixVente", article.PrixUnitaire);
      form.setValue("marque", article.NFournisseur);
      form.setValue("categorieArticle", article.CodeCategorieParent);
      if (field === "NArticle") {
        form.setValue("modele", article.Description);
      } else if (field === "Description") {
        form.setValue("articleNumber", article.NArticle);
      }
    } else {
      setSelectedArticle(null);
      form.setValue("prixAchat", 0);
      form.setValue("prixVente", 0);
      form.setValue("marque", "");
      form.setValue("categorieArticle", "");
    }
  };

  const handleArticleNumberChange = (e) => {
    const value = e.target.value;
    form.setValue("articleNumber", value);
    handleArticleChange(value, "NArticle");
  };

  const entrepriseChange = (e) => {
    const value = e.target.value;
    form.setValue("installateur", value);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    handleArticleChange(value, "article");
  };

  const handleModeleChange = (e) => {
    const value = e.target.value;
    form.setValue("modele", value);
    handleArticleChange(value, "Description");
  };

  // Preserve the input values even if there's no match
  React.useEffect(() => {
    // Get the current form values
    const currentArticleNumber = form.getValues("articleNumber");
    const currentModele = form.getValues("modele");

    // Set the form values back to the current input values
    form.setValue("articleNumber", currentArticleNumber);
    form.setValue("modele", currentModele);
  }, [form]);

  const onSubmit = async (values: z.infer<typeof SavMachinesSchema>) => {
    try {
      /* Check if required fields are empty
      if (
        !values.installateur ||
        !values.client ||
        !values.causeSAV ||
        !values.marque ||
        !values.articleNumber ||
        !values.modele ||
        !values.serieNumber ||
        !values.quantite ||
        !values.accord
      ) {
        throw new Error("Veuillez remplir tous les champs obligatoires.");
      }*/

      if (step === 1) {
        console.log();
        setFormData(values);
        setStep(2);
      } else {
        console.log("values);", form.getValues());
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

        startTransition(() => {
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/machines/create`, {
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
                  window.location.href = "/collaborateur/sav/liste-sav-machine";
                } else if (role === "admin") {
                  window.location.href = "/admin/sav/liste-sav-machine";
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

  React.useEffect(() => {
    // Load the role from sessionStorage when the page loads
    const role = sessionStorage.getItem("role");
    setUserRole(role);
  }, []);

  const handleClick = (e) => {
    console.log("userRole", userRole);
    e.preventDefault(); // Prevent default form submission
    if (userRole === "collaborator") {
      window.location.href = "/collaborateur/sav/liste-sav-machine";
    } else if (userRole === "admin") {
      window.location.href = "/admin/sav/liste-sav-machine";
    }
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
          <FormSucess message={success} />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  nextStep();
                }}
                className="space-y-6"
              >
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
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
  type="button" // Add this line to prevent form submission
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
                </div>
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
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
                <div className="flex lg:justify-center items-end gap-2">
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
              </form>
            )}
            {step === 2 && (
              <div>
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
                  <div className="grid gap-1">
                    <label className="text-black">
                      INSTALLATEUR {/*<span className="text-red-500">*</span>*/}
                    </label>
                    <FormField
                      name="installateur"
                      control={form.control}
                      render={({ field }) => (
                        <input
                          {...field}
                          list="installateur"
                          onChange={entrepriseChange}
                          className="p-2 border border-gray-200 rounded-md cursor-pointer lg:w-full w-[98%]"
                        />
                      )}
                    />
                    <datalist id="installateur">
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
                    <FormField
                      control={form.control}
                      name="causeSAV"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">
                            CAUSE SAV{" "}
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
                  {/*

                  <div className="grid gap-1">
                    <FormField
                      control={form.control}
                      name="articleNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">
                            N° ARTICLE <span className="text-red-500">*</span>
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
                      name="modele"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">
                            MODELE <span className="text-red-500">*</span>
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
                      name="categorieArticle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">
                            CATEGORIE ARTICLE
                            <span className="text-red-500">*</span>
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

                  */}

                  <div className="grid gap-4 sm:gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
                    <label className="text-black">
                      N° Article {/*<span className="text-red-500">*</span>*/}
                    </label>
                    <FormField
                      name="articleNumber"
                      control={form.control}
                      render={({ field }) => (
                        <input
                          {...field}
                          list="articleNumbers"
                          onChange={handleArticleNumberChange}
                          className="p-2 border border-gray-200 rounded-md cursor-pointer lg:w-full w-[98%]"
                        />
                      )}
                    />
                    <datalist id="articleNumbers">
                      {articles.map((article) => (
                        <option key={article.NArticle} value={article.NArticle}>
                          {article.Description}
                        </option>
                      ))}
                    </datalist>
                  </div>
                  <div className="grid gap-4 sm:gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
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
                              placeholder=""
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <datalist id="marque">
                      {articles.map((article) => (
                        <option
                          key={article.NFournisseur}
                          value={article.NFournisseur}
                        >
                          {article.Description}
                        </option>
                      ))}
                    </datalist>
                  </div>

                  <div className="grid gap-4 sm:gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
                    <label className="text-black">
                      Modèle {/*<span className="text-red-500">*</span>*/}
                    </label>
                    <FormField
                      name="modele"
                      control={form.control}
                      render={({ field }) => (
                        <input
                          {...field}
                          list="descriptions"
                          onChange={handleModeleChange}
                          className="p-2 border border-gray-200 rounded-md cursor-pointer lg:w-full w-[98%]"
                        />
                      )}
                    />
                    <datalist id="descriptions">
                      {articles.map((article) => (
                        <option
                          key={article.NArticle}
                          value={article.Description}
                        >
                          {article.NArticle}
                        </option>
                      ))}
                    </datalist>
                  </div>
                  <div className="grid gap-4 sm:gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
                    <label className="text-black">Prix d&apos;achat</label>
                    <FormField
                      name="prixAchat"
                      control={form.control}
                      render={({ field }) => (
                        <input
                          {...field}
                          className="p-2 border border-gray-200 rounded-md cursor-pointer lg:w-full w-[98%]"
                        />
                      )}
                    />
                  </div>
                  <div className="grid gap-4 sm:gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
                    <label className="text-black">Prix de vente</label>
                    <FormField
                      name="prixVente"
                      control={form.control}
                      render={({ field }) => (
                        <input
                          {...field}
                          className="p-2 border border-gray-200 rounded-md cursor-pointer lg:w-full w-[98%]"
                        />
                      )}
                    />
                  </div>
                  <div className="grid gap-4 sm:gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
                    <label className="text-black">CATEGORIE ARTICLE</label>
                    <FormField
                      name="categorieArticle"
                      control={form.control}
                      render={({ field }) => (
                        <input
                          {...field}
                          className="p-2 border border-gray-200 rounded-md cursor-pointer lg:w-full w-[98%]"
                        />
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
                            N° SERIE{" "}
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
                      name="quantite"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">
                            QUANTITE{" "}
                            {/*<span className="text-red-500">*</span>*/}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder=""
                              type="number"
                              min={1}
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
                      name="accord"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">
                            ACCORD {/*<span className="text-red-500">*</span>*/}
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
                  {/*<div className="grid gap-1">
                    <label className="text-black">Retour Machine</label>
                    <FormField
                      name="retoursMachines"
                      control={form.control}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          className="p-2 border border-gray-200 rounded-md cursor-pointer"
                        />
                      )}
                    />
                  </div>*/}
                  <div className="grid gap-1">
                    <FormField
                      control={form.control}
                      name="dateRetourDepot"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">
                            DATE RETOUR DEPOT{" "}
                          </FormLabel>
                          <br />
                          <FormControl>
                            <Popover
                              open={openState["dateRetourDepot"]}
                              onOpenChange={(isOpen) =>
                                toggleOpen("dateRetourDepot", isOpen)
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
                                  onSelect={(value) => {
                                    field.onChange(value);
                                    toggleOpen("dateRetourDepot", false);
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
                      name="dateDemandeAvoirFournisseur"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">
                            DATE DEMANDE AVOIR FOURNISSEUR{" "}
                          </FormLabel>
                          <br />
                          <FormControl>
                            <Popover
                              open={openState["dateDemandeAvoirFournisseur"]}
                              onOpenChange={(isOpen) =>
                                toggleOpen(
                                  "dateDemandeAvoirFournisseur",
                                  isOpen
                                )
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
                                  onSelect={(value) => {
                                    field.onChange(value);
                                    toggleOpen(
                                      "dateDemandeAvoirFournisseur",
                                      false
                                    );
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
                      name="dateReceptionAvoirFournisseur"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">
                            DATE RECEPTION AVOIR FOURNISSEUR{" "}
                          </FormLabel>
                          <br />
                          <FormControl>
                            <Popover
                              open={openState["dateReceptionAvoirFournisseur"]}
                              onOpenChange={(isOpen) =>
                                toggleOpen(
                                  "dateReceptionAvoirFournisseur",
                                  isOpen
                                )
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
                                  onSelect={(value) => {
                                    field.onChange(value);
                                    toggleOpen(
                                      "dateReceptionAvoirFournisseur",
                                      false
                                    );
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
                      name="statutFournisseur"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">
                            STATUT FOURNISSEUR{" "}
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
                      name="avoirFournisseurNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">
                            N° AVOIR FOURNISSEUR{" "}
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
                      name="dateAvoirInstallateur"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">
                            DATE AVOIR INSTALLATEUR
                          </FormLabel>
                          <br />
                          <FormControl>
                            <Popover
                              open={openState["dateAvoirInstallateur"]}
                              onOpenChange={(isOpen) =>
                                toggleOpen("dateAvoirInstallateur", isOpen)
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
                                  onSelect={(value) => {
                                    field.onChange(value);
                                    toggleOpen("dateAvoirInstallateur", false);
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
                      name="avoirInstallateurNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">
                            N° AVOIR INSTALLATEUR
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
                      name="nouveauBlNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black uppercase">
                            N°Facture/Bl
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
                      name="dateRetourFournisseur"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">
                            DATE RETOUR FOURNISSEUR
                          </FormLabel>
                          <FormControl>
                            <Popover
                              open={openState["dateRetourFournisseur"]}
                              onOpenChange={(isOpen) =>
                                toggleOpen("dateRetourFournisseur", isOpen)
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
                                  onSelect={(value) => {
                                    field.onChange(value);
                                    toggleOpen("dateRetourFournisseur", false);
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
                  <div className="flex flex-col gap-2">
                    <FormItem>
                      <FormLabel className="text-black">
                        Photo de la machine
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
                            onChange={(e) => handleFileChange(e, "picture1")}
                          />
                        </FormControl>

                        <div className="mt-4 space-y-2">
                          {selectedFilesPicture1 &&
                            Object.keys(selectedFilesPicture1).map((key) => (
                              <div
                                key={key}
                                className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                              >
                                <a
                                  href={URL.createObjectURL(
                                    selectedFilesPicture1[key]
                                  )}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline truncate"
                                >
                                  {selectedFilesPicture1[key].name}
                                </a>
                                <button
                                  className="ml-2 text-red-500"
                                  onClick={() => removeFile("picture1", key)}
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
                      name="observation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">
                            Onservation{" "}
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
                      name="zendesk"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">
                            Numéro Ticket Zendesk{" "}
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

                  {/*<div className="grid gap-1">
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
                  </div>*/}
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
                    onClick={onClick}
                    variant={"login"}
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
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
