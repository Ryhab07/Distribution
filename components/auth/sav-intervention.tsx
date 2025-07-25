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
import { SavInterventionSchema } from "@/schema/";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Textarea } from "../ui/textarea";
import { v4 as uuidv4 } from "uuid";

interface SavPieceFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SavInterventionForm({
  className,
  ...props
}: SavPieceFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = React.useState<string | undefined>("");
  const [success, setSuccess] = React.useState<string | undefined>("");
  const [pending, setPending] = React.useState<boolean | undefined>(false);
  const [step, setStep] = React.useState(1);
  const [date] = React.useState<Date | string>(new Date());
  const [formData, setFormData] = React.useState({});
  //const [status, setStatus] = React.useState("En attente de commande pièces");
  const creators = sessionStorage.getItem("id") ?? undefined;
  const uniqueID = uuidv4();
  const [openState, setOpenState] = React.useState<Record<string, boolean>>({});
  // Function to toggle popover state for a specific field
  const toggleOpen = (fieldName: string, isOpen: boolean) => {
    setOpenState((prev) => ({ ...prev, [fieldName]: isOpen }));
  };
  const [userData, setUserData] = React.useState<CardProps[]>([]);
  const [entreprises, setEntreprises] = React.useState([]);
  const [userRole, setUserRole] = React.useState("");
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
      setUserData(filteredUsers);
      const entrepriseList = filteredUsers.map((user) => user.entreprise);
      setEntreprises(entrepriseList);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  console.log("userData", userData);

  const form = useForm<z.infer<typeof SavInterventionSchema>>({
    resolver: zodResolver(SavInterventionSchema),
    defaultValues: {
      created_at: date,
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
    console.log("Default values:", form.getValues());
  }, [form]);

  React.useEffect(() => {
    console.log("Default values:", form.getValues());
  }, [form]);

  const onSubmit = async (values: z.infer<typeof SavInterventionSchema>) => {
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

        startTransition(() => {
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/intervention/create`, {
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
                  window.location.href = "/collaborateur/sav/liste-intervention";
                } else if (role === "admin") {
                  window.location.href = "/admin/sav/liste-intervention";
                }
                //window.location.href = "/collaborateur/sav/liste-intervention";
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

  const handleClearDate = (field) => {
    field.onChange(""); // Clear the field value
  };

  React.useEffect(() => {
    // Load the role from sessionStorage when the page loads
    const role = sessionStorage.getItem("role");
    setUserRole(role);
  }, []);

  const handleClick = (e) => {
    console.log("userRole", userRole);
    e.preventDefault(); // Prevent default form submission
    if (userRole === "collaborator") {
      window.location.href = "/collaborateur/sav/liste-intervention";
    } else if (userRole === "admin") {
      window.location.href = "/admin/sav/liste-intervention";
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
            <>
              <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 z-40">
                <div className="grid gap-1">
                  <FormField
                    control={form.control}
                    name="dateDeLaDemande"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">
                          DATE DE LA DEMANDE
                        </FormLabel>
                        <br />
                        <FormControl>
                          <Popover
                            open={openState["dateDeLaDemande"]}
                            onOpenChange={(isOpen) =>
                              toggleOpen("dateDeLaDemande", isOpen)
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
                                selected={
                                  field.value
                                    ? new Date(field.value)
                                    : undefined
                                }
                                onDayClick={(value) => {
                                  field.onChange(value);
                                  toggleOpen("dateDeLaDemande", false);
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
                    name="societe"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">SOCIETE</FormLabel>
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
                    name="marque"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">MARQUE</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder=""
                            className="w-full"
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
                    name="nDeTicket"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">
                          N° DE TICKET
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
                    name="devisEconegoce"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">
                          N° DEVIS ECONEGOCE
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
                    name="devisFournisseur"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">
                          N° DEVIS FOURNISSEUR
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
                    name="dateDinterventionPrevut"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">
                          DATE D&apos;INTERVENTION PREVUE
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
                                selected={
                                  field.value
                                    ? new Date(field.value)
                                    : undefined
                                }
                                onDayClick={(value) => {
                                  field.onChange(value);
                                  toggleOpen("dateDinterventionPrevut", false);
                                }}
                                initialFocus
                                fromDate={
                                  form.watch("dateDeLaDemande")
                                    ? new Date(form.watch("dateDeLaDemande"))
                                    : undefined
                                }
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
                          DATE DU RAPPORT
                        </FormLabel>
                        <br />
                        <FormControl>
                          <Popover
                            open={openState["dateDuRapport"]}
                            onOpenChange={(isOpen) =>
                              toggleOpen("dateDuRapport", isOpen)
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
                                selected={
                                  field.value
                                    ? new Date(field.value)
                                    : undefined
                                }
                                onDayClick={(value) => {
                                  field.onChange(value);
                                  toggleOpen("dateDuRapport", false);
                                }}
                                initialFocus
                                fromDate={
                                  form.watch("dateDinterventionPrevut")
                                    ? new Date(
                                        form.watch("dateDinterventionPrevut")
                                      )
                                    : undefined
                                }
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
                          FACTURE FOURNISSEUR
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
                    name="bonDeCommandeEconegoce"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">
                          BON DE COMMANDE ECONEGOCE
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
                    name="factureEconegoce"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">
                          FACTURE ECONEGOCE
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
                    name="observation"
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
              </div>
              <div className="flex justify-center items-center gap-4">
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
                    Créer
                  </span>
                </Button>
                <Button
                  variant="outline"
                  className=" lg:inline-block px-5 relative rounded group overflow-hidden font-medium bg-transparent text-black border-2 border-black"
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
          </form>
        </Form>
      </div>
    </div>
  );
}
