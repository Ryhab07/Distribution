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
import { SavInterventionSchema } from "@/schema/";
import { zodResolver } from "@hookform/resolvers/zod";
import { isValid } from "date-fns";
//import { fr } from "date-fns/locale";
import { CalendarIcon, X } from "lucide-react";
import * as React from "react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import * as z from "zod";
import { FormSucess } from "../form-sucess";
import { SuccessCard } from "../reusable/SuccessCard";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
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
  numeroCommande: string;
  dateDeLaDemande: any;
  societe: any;
  client: any;
  marque: any;
  serieNumber: any;
  nDeTicket: any;
  devisEconegoce: any;
  devisFournisseur: any;
  dateDinterventionPrevut: any;
  dateDuRapport: any;
  factureFournisseur: any;
  bonDeCommandeEconegoce: any;
  factureEconegoce: any;
  observation: any;
  onSelectCard: (id: string) => void; // New prop
}

export function SavInterventionFormModificationAdmin({
  className,
  id,
  ...props
}: SavPieceFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = React.useState<string | undefined>("");
  const [success, setSuccess] = React.useState<string | undefined>("");
  const [pending, setPending] = React.useState<boolean | undefined>(false);
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState({});
  const uniqueID = uuidv4();
  const creators = sessionStorage.getItem("id") ?? undefined;
  const [selectedArticle] = React.useState<Article | null>(null);
  console.log("selectedArticle", selectedArticle);
  const [userData, setUserData] = React.useState<CardProps[]>([]);
  const [formValuesLoaded, setFormValuesLoaded] = React.useState(false);
  const [userDatas, setUserDatas] = React.useState<CardProps[]>([]);
  const [entreprises, setEntreprises] = React.useState([]);
  const [openState, setOpenState] = React.useState<Record<string, boolean>>({});
  // Function to toggle popover state for a specific field
  const toggleOpen = (fieldName: string, isOpen: boolean) => {
    setOpenState((prev) => ({ ...prev, [fieldName]: isOpen }));
  };

  console.log("entreprises", entreprises);

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

  const form = useForm<z.infer<typeof SavInterventionSchema>>({
    resolver: zodResolver(SavInterventionSchema),
    defaultValues: {
      created_at: new Date(),
      pieceCreatedID: uniqueID,
      creator: creators,
      dateDeLaDemande: "",
      societe: "",
      client: "",
      marque: "",
      serieNumber: "",
      nDeTicket: "",
      devisEconegoce: "",
      devisFournisseur: "",
      dateDinterventionPrevut: "",
      dateDuRapport: "",
      factureFournisseur: "",
      bonDeCommandeEconegoce: "",
      factureEconegoce: "",
      observation: "",
    },
  });

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `/api/intervention/fetchPieces?page=1&id=${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        console.log("data.pieces", data.interventions);
        setUserData(data.interventions);
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
        pieceCreatedID: uniqueID,
        creator: creators,
        dateDeLaDemande: userData[0]?.dateDeLaDemande,
        societe: userData[0]?.societe,
        client: userData[0]?.client,
        marque: userData[0]?.marque,
        serieNumber: userData[0]?.serieNumber,
        nDeTicket: userData[0]?.nDeTicket,
        devisEconegoce: userData[0]?.devisEconegoce,
        devisFournisseur: userData[0]?.devisFournisseur,
        dateDinterventionPrevut: userData[0]?.dateDinterventionPrevut,
        dateDuRapport: userData[0]?.dateDuRapport,
        factureFournisseur: userData[0]?.factureFournisseur[0],
        bonDeCommandeEconegoce: userData[0]?.bonDeCommandeEconegoce,
        factureEconegoce: userData[0]?.factureEconegoce,
        observation: userData[0]?.observation,
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

  const onSubmit = async (values: z.infer<typeof SavInterventionSchema>) => {
    try {
      const method = id ? "PUT" : "POST";

      // Extraire les deux dates
      const dateInterventionPrevue = new Date(values.dateDinterventionPrevut);
      const dateDuRapport = new Date(values.dateDuRapport);

      // Valider si la DATE D'INTERVENTION PREVUE est supérieure à la DATE DU RAPPORT
      if (dateInterventionPrevue > dateDuRapport) {
        setError(
          "La DATE D'INTERVENTION PREVUE ne peut pas être supérieure à la DATE DU RAPPORT."
        );
        return;
      }

      if (step === 1) {
        setFormData(values);
        setStep(2);
        return;
      }

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

      // S'assurer que _id est inclus dans la requête pour les requêtes PUT
      if (method === "PUT") {
        formDataToSend.append("_id", id); // Supposons que `id` est l'ObjectId de MongoDB de l'élément à mettre à jour
      }

      startTransition(() => {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}intervention/create`;
        const requestOptions: RequestInit = {
          method: method,
          body:
            method === "PUT"
              ? formDataToSend
              : JSON.stringify(Object.fromEntries(formDataToSend)), // Envoyer les données du formulaire ou JSON en fonction de la méthode
          headers:
            method === "PUT"
              ? undefined
              : { "Content-Type": "application/json" }, // En-tête Content-Type pour la charge utile JSON
        };

        fetch(apiUrl, requestOptions)
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              setSuccess(data.success);

              const role = sessionStorage.getItem("role");
              const url = `/sav/sav-intervention-detail?search=${id}`;

              if (role === "collaborator") {
                window.location.href = `/collaborateur${url}`;
              } else if (role === "admin") {
                window.location.href = `/admin${url}`;
              }
            } else {
              setError(data.error);
            }
            setPending(false);
          })
          .catch((error) => {
            console.error("Erreur lors de la soumission :", error);
            setError("Erreur lors de la soumission");
            setPending(false);
          });
      });
    } catch (error) {
      console.error("Erreur lors de la validation des champs :", error);
      setError(error.message || "Erreur lors de la validation des champs");
    }
  };

  const onClick = async () => {
    const values = form.getValues();
    onSubmit(values);
  };

  /*const formatDate = (date: string | Date | null) => {
    console.log("Received date:", date); // Debug log for the date

    if (!date) return "Sélectionnez une date"; // Handle null or undefined case

    try {
      console.log("testing date");
      // Ensure the date is parsed only if it's a string
      const parsedDate = typeof date === "string" ? parseISO(date) : date;

      if (!isValid(parsedDate)) {
        console.log("Invalid date:", parsedDate);
        return "Sélectionnez une date"; // Handle invalid date case
      }

      // Format the parsed date
      return format(parsedDate, "PPP", { locale: fr });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Sélectionnez une date"; // Handle any unexpected errors
    }
  };
*/
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
            <>
              <p className="mb-2">
                Date De La Demande:{" "}
                {isValid(new Date(userData[0]?.dateDeLaDemande))
                  ? new Date(userData[0]?.dateDeLaDemande).toLocaleDateString(
                      "fr-FR",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )
                  : "-"}
              </p>
              <div
                className="grid lg:grid-cols-2 grid-cols-1 gap-8 z-40"
                style={{ overflowY: "auto" }}
              >
                <div className="grid gap-1">
                  <FormField
                    control={form.control}
                    name="societe"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">SOCIETE</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder={userData[0]?.societe}
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
                    name="client"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">CLIENT</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder={userData[0]?.client}
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
                          NUMERO DE SERIE
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder={userData[0]?.serieNumber}
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
                    name="marque"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">MARQUE</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder={userData[0]?.marque}
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
                    name="nDeTicket"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">
                          NUMERO DE TICKET
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder={userData[0]?.nDeTicket}
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
                    name="devisEconegoce"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">
                          DEVIS Econegoce{" "}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder={userData[0]?.devisEconegoce}
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
                    name="devisFournisseur"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">
                          DEVIS FOURNISSEUR{" "}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder={userData[0]?.devisFournisseur}
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
                    name="dateDinterventionPrevut"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">
                          DATE D&apos;INTERVENTION PREVU{" "}
                        </FormLabel>
                        <br />
                        <FormControl>
                          <Popover
                            open={openState["dateDinterventionPrevut"]}
                            onOpenChange={(isOpen) =>
                              toggleOpen("dateDinterventionPrevut", isOpen)
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
                                    <span>
                                      {isValid(new Date(field.value))
                                        ? new Date(
                                            field.value
                                          ).toLocaleDateString("fr-FR", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                          })
                                        : "Sélectionnez une date"}
                                    </span>
                                  ) : userData[0]?.dateDinterventionPrevut ? (
                                    <span>
                                      {isValid(
                                        new Date(
                                          userData[0].dateDinterventionPrevut
                                        )
                                      )
                                        ? new Date(
                                            userData[0].dateDinterventionPrevut
                                          ).toLocaleDateString("fr-FR", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                          })
                                        : "Sélectionnez une date"}
                                    </span>
                                  ) : (
                                    <span>Sélectionnez une date</span>
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
                                  toggleOpen("dateDinterventionPrevut", false);
                                }}
                                fromDate={
                                  userData &&
                                  userData.length > 0 &&
                                  userData[0]?.dateDeLaDemande
                                    ? isValid(
                                        new Date(userData[0]?.dateDeLaDemande)
                                      )
                                      ? new Date(userData[0]?.dateDeLaDemande)
                                      : undefined
                                    : undefined
                                }
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
                    name="dateDuRapport"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">
                          DATE DU RAPPORT{" "}
                        </FormLabel>
                        <br />
                        <FormControl>
                          <Popover
                            open={openState["dateDuRapport"]}
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
                                    <span>
                                      {isValid(new Date(field.value))
                                        ? new Date(
                                            field.value
                                          ).toLocaleDateString("fr-FR", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                          })
                                        : "Sélectionnez une date"}
                                    </span>
                                  ) : (
                                    <span>Sélectionnez une date</span>
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
                                fromDate={
                                  userData &&
                                  userData.length > 0 &&
                                  userData[0]?.dateDinterventionPrevut
                                    ? isValid(
                                        new Date(
                                          userData[0]?.dateDinterventionPrevut
                                        )
                                      )
                                      ? new Date(
                                          userData[0]?.dateDinterventionPrevut
                                        )
                                      : undefined
                                    : undefined
                                }
                                onSelect={(value) => {
                                  field.onChange(value);
                                  toggleOpen("dateDuRapport", false);
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
                    name="factureFournisseur"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">
                          FACTURE FOURNISSEUR{" "}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder={userData[0]?.factureFournisseur[0]}
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
                    name="bonDeCommandeEconegoce"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">
                          BON DE COMMANDE ECONEGOCE{" "}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder={userData[0]?.bonDeCommandeEconegoce}
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
                    name="factureEconegoce"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">
                          Facture Econegoce{" "}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder={userData[0]?.factureEconegoce}
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
                    name="observation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">
                          OBSERVATION{" "}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder={userData[0]?.observation}
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
            </>
          </form>
        </Form>
      </div>
    </div>
  );
}
