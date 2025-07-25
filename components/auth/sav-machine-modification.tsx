"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { fr } from "date-fns/locale";
import * as React from "react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format, isValid, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

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

import { FormError } from "@/components/form-error";
import { SavMachinesSchema } from "@/schema/";
import { CalendarIcon, X, XCircle } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import data from "../../public/data.json";
import { SuccessCard } from "../reusable/SuccessCard";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface Article {
  NArticle: string;
  Description: string;
  CoutUnitaire: number;
  PrixUnitaire: number;
  CodeCategorieParent: string;
}

interface CardProps {
  [key: string]: any;

  onSelectCard: (id: string) => void; // New prop
}

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogClose } from "../ui/dialog";

interface SavMachinesFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SavMachinesFormModification({
  className,
  id,
  ...props
}: SavMachinesFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = React.useState<string | undefined>("");
  const [success, setSuccess] = React.useState<string | undefined>("");
  const [pending, setPending] = React.useState<boolean | undefined>(false);
  const [step, setStep] = React.useState(2);

  const [formData, setFormData] = React.useState({});

  const uniqueID = uuidv4();
  const [selectedFilesPicture2, setselectedFilesPicture2] = React.useState<
    FileList | []
  >([]);
  const [selectedFilesPicture1, setselectedFilesPicture1] = React.useState<
    FileList | []
  >([]);
  const [articles] = React.useState<Article[]>(data);
  const [selectedArticle, setSelectedArticle] = React.useState<Article | null>(
    null
  );

  const [userData, setUserData] = React.useState<CardProps[]>([]);
  const [formValuesLoaded, setFormValuesLoaded] = React.useState(false);
  const [userDatas, setUserDatas] = React.useState<CardProps[]>([]);
  const [entreprises, setEntreprises] = React.useState([]);

  const handleClearDate = (field) => {
    console.log("Clearing date");
    field.onChange("");
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
      setUserDatas(filteredUsers);
      const entrepriseList = filteredUsers.map((user) => user.entreprise);
      setEntreprises(entrepriseList);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  console.log("setUserDatas", userDatas);
  console.log("success", success);
  console.log("selectedArticle", selectedArticle);
  console.log("selectedFilesPicture2", selectedFilesPicture2);

  const form = useForm<z.infer<typeof SavMachinesSchema>>({
    resolver: zodResolver(SavMachinesSchema),
    defaultValues: {
      created_at: new Date(),
      picture1: undefined,
      picture2: undefined,
      dateDemande: new Date(),
      numeroBlOuFacture: "",
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
      dateRetourDepot: "",
      dateDemandeAvoirFournisseur: new Date(),
      dateReceptionAvoirFournisseur: new Date(),
      statutFournisseur: "",
      avoirFournisseurNumber: "",
      dateAvoirInstallateur: new Date(),
      avoirInstallateurNumber: "",
      nouveauBlNumber: "",
      dateRetourFournisseur: new Date(),
      prixAchat: 0,
      prixVente: 0,
      status: "En attente de commande pièces",
      adresseRetrait: "53 Av. du Bois de la Pie, 93290 Tremblay-en-France",
    },
  });

  const entrepriseChange = (e) => {
    const value = e.target.value;
    form.setValue("installateur", value);
    handleArticleChange(value, "article");
  };

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `/api/machines/fetchMachines?page=1&id=${id}`
        );
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
        picture1: userData[0]?.picture1 || [],
        picture2:  userData[0]?.picture2 || [],
        dateDemande: new Date(userData[0]?.dateDemande),
        installateur: userData[0]?.installateur,
        client: userData[0]?.client,
        causeSAV: userData[0]?.causeSAV,
        marque: userData[0]?.marque,
        articleNumber: userData[0]?.articleNumber,
        numeroBlOuFacture: userData[0]?.numeroBlOuFacture,
        modele: userData[0]?.modele,
        categorieArticle: userData[0]?.categorieArticle,
        serieNumber: userData[0]?.serieNumber,
        quantite: userData[0]?.quantite,
        blNumber: userData[0]?.blNumber,
        accord: userData[0]?.accord,
        dateRetourDepot:
          userData[0]?.dateRetourDepot !== null
            ? new Date(userData[0]?.dateRetourDepot)
            : " ",
        dateDemandeAvoirFournisseur:
          userData[0]?.dateDemandeAvoirFournisseur !== null
            ? new Date(userData[0]?.dateDemandeAvoirFournisseur)
            : " ",
        dateReceptionAvoirFournisseur:
          userData[0]?.dateReceptionAvoirFournisseur !== null
            ? new Date(userData[0]?.dateReceptionAvoirFournisseur)
            : " ",
        statutFournisseur: userData[0]?.statutFournisseur,
        avoirFournisseurNumber: userData[0]?.avoirFournisseurNumber,
        dateAvoirInstallateur:
          userData[0]?.dateAvoirInstallateur !== null
            ? new Date(userData[0]?.dateAvoirInstallateur)
            : " ",
        avoirInstallateurNumber: userData[0]?.avoirInstallateurNumber,
        nouveauBlNumber: userData[0]?.nouveauBlNumber,
        dateRetourFournisseur:
          userData[0]?.dateRetourFournisseur !== null
            ? new Date(userData[0]?.dateRetourFournisseur)
            : " ",
        prixAchat: userData[0]?.prixAchat,
        prixVente: userData[0]?.prixVente,
        status: userData[0]?.status,
        adresseRetrait: userData[0]?.adresseRetrait,
      });
      setFormValuesLoaded(true);
    }
  }, [userData, form, uniqueID, formValuesLoaded]);

  React.useEffect(() => {
    console.log("Default values:", form.getValues());
  }, [form, userData]);

  const onSubmit = async (values: z.infer<typeof SavMachinesSchema>) => {
    try {
      const method = id ? "PUT" : "POST";

      if (step === 1) {
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

        // Ensure _id is included in the request body for PUT requests
        if (method === "PUT") {
          formDataToSend.append("_id", id);
        }

        startTransition(() => {
          const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/machines/create`;
          const requestOptions: RequestInit = {
            method: method,
            body:
              method === "PUT"
                ? formDataToSend
                : JSON.stringify(Object.fromEntries(formDataToSend)), // Sending form data or JSON string based on method
            headers:
              method === "PUT"
                ? undefined
                : { "Content-Type": "application/json" }, // Content-Type header for JSON payload
          };

          fetch(apiUrl, requestOptions)
            .then((response) => response.json())
            .then((data) => {
              if (data.success) {
                setSuccess(data.success);
                setPending(false);

                const role = sessionStorage.getItem("role");
                const url = `/sav/sav-piece-machine?search=${id}`;

                if (role === "collaborator") {
                  window.location.href = `/collaborateur${url}`;
                } else if (role === "admin") {
                  window.location.href = `/admin${url}`;
                }
              } else {
                setError(data.error);
                setPending(false);
              }
            })
            .catch((error) => {
              console.error("Error during submission:", error);
              setError("Error during submission");
              setPending(false);
            });
        });
      }
    } catch (error) {
      console.error("Error validating fields:", error);
      setError(error.message || "Error validating fields");
    }
  };

  const handleRemoveExistingFile = (index) => {
    const updatedPictures = [...form.getValues("picture1")];
    updatedPictures.splice(index, 1);
    form.setValue("picture1", updatedPictures);
  };

  const handleFileChange = (e, field) => {
    const files = Array.from(e.target.files);
    const existingFiles = form.getValues(field);
    form.setValue(field, [...existingFiles, ...files]);
  };

  const removeFile = (field, index) => {
    const files = [...form.getValues(field)];
    files.splice(index, 1);
    form.setValue(field, files);
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
    field: "NArticle" | "Description" | "article"
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
      form.setValue("categorieArticle", "");
    }
  };

  const handleArticleNumberChange = (e) => {
    const value = e.target.value;
    form.setValue("articleNumber", value);
    handleArticleChange(value, "NArticle");
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

  const onClick = async () => {
    const values = form.getValues();
    onSubmit(values);
  };

  /*const nextStep = () => {
    const { numeroBlOuFacture } = form.getValues();
    if (!numeroBlOuFacture) {
      setError("");
      setStep(step + 1);
    } else {
      setError("");
      setStep(step + 1);
    }
  };*/

  //const prevStep = () => setStep(step - 1);

  const formatDate = (date: string | Date | null) => {
    if (!date) return "Sélectionnez une date"; // Handle null or undefined case

    // Ensure date is parsed into a Date object
    const parsedDate = typeof date === "string" ? parseISO(date) : date;

    if (!isValid(parsedDate)) return "Sélectionnez une date"; // Handle invalid date case

    // Format the parsed date
    return format(parsedDate, "PPP", { locale: fr });
  };

  console.log("selectedFilesPicture1", selectedFilesPicture1);

  const formatDate2 = (dateString: string) => {
    const dateObject = new Date(dateString);
    const day = dateObject.getDate().toString().padStart(2, "0");
    const month = (dateObject.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
    const year = dateObject.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const dateDeLaDemande2 =
    userData[0]?.dateDemande === ""
      ? formatDate2(userData[0]?.created_at)
      : formatDate2(userData[0]?.dateDemande);

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
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
              <h4>Date de la demande: {dateDeLaDemande2}</h4>
              <div className="grid gap-1">
                <FormField
                  control={form.control}
                  name="numeroBlOuFacture"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black">
                        Numéro de retour RV{" "}
                      </FormLabel>
                      <FormControl>
                        <Input
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
                  INSTALLATEUR <span className="text-red-500">*</span>
                </label>
                <FormField
                  name="installateur"
                  control={form.control}
                  render={({ field }) => (
                    <input
                      {...field}
                      list="installateur"
                      onChange={entrepriseChange}
                      className="p-2 border border-gray-200 rounded-md cursor-pointer"
                      placeholder={""}
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
                      <FormLabel className="text-black">CLIENT</FormLabel>
                      <FormControl>
                        <Input
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
                  name="causeSAV"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black">CAUSE SAV</FormLabel>
                      <FormControl>
                        <Input
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
                  name="marque"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black"> MARQUE</FormLabel>
                      <FormControl>
                        <Input
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
              {/*

                <div className="grid gap-1">
                  <FormField
                    control={form.control}
                    name="articleNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">
                          N° ARTICLE  
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
                          MODELE  
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

              <div className="grid gap-1">
                <label className="text-black">N° Article</label>
                <FormField
                  name="articleNumber"
                  control={form.control}
                  render={({ field }) => (
                    <input
                      {...field}
                      list="articleNumbers"
                      onChange={handleArticleNumberChange}
                      placeholder={""}
                      className="p-2 border border-gray-200 rounded-md cursor-pointer"
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
              <div className="grid gap-1">
                <label className="text-black">Modèle</label>
                <FormField
                  name="modele"
                  control={form.control}
                  render={({ field }) => (
                    <input
                      {...field}
                      list="descriptions"
                      onChange={handleModeleChange}
                      placeholder={""}
                      className="p-2 border border-gray-200 rounded-md cursor-pointer"
                    />
                  )}
                />
                <datalist id="descriptions">
                  {articles.map((article) => (
                    <option key={article.NArticle} value={article.Description}>
                      {article.NArticle}
                    </option>
                  ))}
                </datalist>
              </div>
              <div className="grid gap-1">
                <label className="text-black">Prix d&apos;achat</label>
                <FormField
                  name="prixAchat"
                  control={form.control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="p-2 border border-gray-200 rounded-md cursor-pointer"
                      placeholder={""}
                    />
                  )}
                />
              </div>
              <div className="grid gap-1">
                <label className="text-black">Prix de vente</label>
                <FormField
                  name="prixVente"
                  control={form.control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="p-2 border border-gray-200 rounded-md cursor-pointer"
                      placeholder={""}
                    />
                  )}
                />
              </div>
              <div className="grid gap-1">
                <label className="text-black">CATEGORIE ARTICLE</label>
                <FormField
                  name="categorieArticle"
                  control={form.control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="p-2 border border-gray-200 rounded-md cursor-pointer"
                      placeholder={""}
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
                      <FormLabel className="text-black">N° SERIE</FormLabel>
                      <FormControl>
                        <Input
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
                  name="quantite"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black">QUANTITE</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder={""}
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
                      <FormLabel className="text-black">ACCORD</FormLabel>
                      <FormControl>
                        <Input
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
                  name="dateRetourDepot"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black">
                        DATE RETOUR DEPOT{"  "} {dateRetourDepot}
                      </FormLabel>
                      <br />

                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild className="w-full">
                            <Button
                              variant={"outline"}
                              className={cn(
                                "lg:w-full w-full pl-3 text-left font-normal justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                <span>{formatDate(field.value)}</span>
                              ) : (
                                <span> Sélectionnez une date </span>
                              )}

                              <div className="flex justify-between gap-2">
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                <X
                                  className="ml-auto h-4 w-4 opacity-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleClearDate(field);
                                  }}
                                />
                              </div>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={
                                field.value ? new Date(field.value) : undefined
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
                  name="dateDemandeAvoirFournisseur"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black">
                        DATE DEMANDE AVOIR FOURNISSEUR{"  "}{" "}
                      </FormLabel>
                      <br />

                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild className="w-full">
                            <Button
                              variant={"outline"}
                              className={cn(
                                "lg:w-full w-full pl-3 text-left font-normal justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                <span>{formatDate(field.value)}</span>
                              ) : (
                                <span> Sélectionnez une date </span>
                              )}

                              <div className="flex justify-between gap-2">
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                <X
                                  className="ml-auto h-4 w-4 opacity-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleClearDate(field);
                                  }}
                                />
                              </div>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={
                                field.value ? new Date(field.value) : undefined
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
                  name="dateReceptionAvoirFournisseur"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black">
                        DATE RECEPTION AVOIR FOURNISSEUR{"  "}{" "}
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
                                  <span>{formatDate(field.value)}</span>
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
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={
                                field.value ? new Date(field.value) : undefined
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
                  name="dateAvoirInstallateur"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black">
                        DATE AVOIR INSTALLATEUR {"  "}{" "}
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
                                  <span>{formatDate(field.value)}</span>
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
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={
                                field.value ? new Date(field.value) : undefined
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
                  name="nouveauBlNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black">
                        NOUVEAU N° BL
                      </FormLabel>
                      <FormControl>
                        <Input
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
                  name="dateRetourFournisseur"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black">
                        DATE RETOUR FOURNISSEUR {"  "}{" "}
                      </FormLabel>
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
                                  <span>{formatDate(field.value)}</span>
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
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={
                                field.value ? new Date(field.value) : undefined
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
                <FormItem>
                  <FormLabel className="text-black">
                    Photo de la machine
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
                            {...form.register("picture1")}
                            onChange={(e) => handleFileChange(e, "picture1")}
                          />
                        </FormControl>
                      )}

                      {Array.isArray(form.getValues("picture1")) &&
                        form.getValues("picture1").map((file, index) => {
                          const fileName =
                            typeof file === "string" ? file : file.name;
                          const fileUrl =
                            typeof file === "string"
                              ? `/api/uploads/${encodeURIComponent(file)}`
                              : URL.createObjectURL(file);

                          return (
                            <div key={index} className="flex items-center mt-2">
                              <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                              >
                                {fileName}
                              </a>

                              <button
                                className="ml-2 text-red-500"
                                onClick={() =>
                                  typeof file === "string"
                                    ? handleRemoveExistingFile(index)
                                    : removeFile("picture1", index)
                                }
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              </div>

              <div className="grid gap-1">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>status</FormLabel>
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
                          <SelectItem value="En attente de commande pièces">
                            En attente de commande pièces
                          </SelectItem>
                          <SelectItem value="Pièces envoyées">
                            Pièces envoyées
                          </SelectItem>
                          <SelectItem value="En attente de réception de pièces">
                            En attente de réception de pièces
                          </SelectItem>
                          <SelectItem value="Facturation">
                            Facturation
                          </SelectItem>
                          <SelectItem value="Avoir">Avoir</SelectItem>
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
              {/* Valider Button */}
              <Button
                type="submit"
                onClick={onClick}
                variant={"login"}
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
          </form>
        </Form>
      </div>
    </div>
  );
}
