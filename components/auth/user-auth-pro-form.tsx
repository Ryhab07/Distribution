"use client";
import * as React from "react";
import { useTransition } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
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
import { RegisterSchema } from "@/schema/";
import { FormError } from "@/components/form-error";
import { FormSucess } from "../form-sucess";
import { EyeOff, Eye } from "lucide-react";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthProForm({ className, ...props }: UserAuthFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = React.useState<string | undefined>("");
  const [success, setSuccess] = React.useState<string | undefined>("");
  const id = sessionStorage.getItem("id") ?? undefined;
  const [pending, setPending] = React.useState<boolean | undefined>(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const currentUrl = router; // Get the current URL
  console.log("Current URL:", currentUrl); // Log the current URL

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      creatorId: id,
      name: "",
      lastname: "",
      entreprise: "",
      email: "",
      email2: "",
      adresse: "",
      phone: "",
      phoneSecondaire: "",
      password: "",
      role: "userPro",
      sales375: 0,
      sales500: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    console.log("Form values:", values);
    setError("");
    setSuccess("");
    setPending(true);

    startTransition(() => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setSuccess(data.success);
            setPending(false);
            window.location.href = "/admin/liste-des-clients-pro";
          } else {
            setError(data.error);
            setPending(false);
          }
        })
        .catch((error) => {
          // Handle network or other errors
          console.error("Erreur lors de l'enregistrement'", error);
          setError("Erreur lors de l'enregistrement");
        });
    });
  };

  return (
    <div className="relative cursor-pointer w-full mb-10 ">
      <div className="z-10 border-gray-300 absolute left-1/2 -translate-x-1/2 mt-[210px] lg:mt-[430px] bg-devinovGreen h-[20%] rounded-lg w-[60%] mx-auto flex justify-center"></div>
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
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
              <div className="grid gap-1">
                <FormField
                  control={form.control}
                  name="entreprise"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Nom d’entreprise {/*<span className="text-red-600">*</span>*/}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} placeholder="" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-1">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} placeholder="" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-1">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Email {/*<span className="text-red-600">*</span>*/}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="john.doe@example.com"
                          type="email"
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
                  name="email2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email secondaire</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder=""
                          type="email2"
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro de téléphone </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder=""
                          maxLength={10} // Limits input to 10 characters
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
                            if (value.length <= 10) {
                              field.onChange(value); // Update the field value only if valid
                            }
                          }}
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
                  name="phoneSecondaire"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro de téléphone portable </FormLabel>
                      <FormControl>
                      <Input
                          {...field}
                          disabled={isPending}
                          placeholder=""
                          maxLength={10}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            if (value.length <= 10) {
                              field.onChange(value); 
                            }
                          }}
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
                  name="adresse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} placeholder="" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-1">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de Passe</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder=""
                            type={showPassword ? "text" : "password"}
                          />
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-3"
                          >
                            {showPassword ? (
                              <EyeOff color="black" />
                            ) : (
                              <Eye color="black" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex lg:justify-end items-end gap-4">
              <div className="col-start-2">
                <Button
                  disabled={pending === true}
                  variant={"login"}
                  className={`lg:inline-block px-5 relative rounded group overflow-hidden font-medium bg-transparent text-[#fab516]`}
                >
                  <span
                    className={`absolute top-0 left-0 flex w-0 h-full mr-0 transition-all duration-200 ease-out transform translate-x-0 bg-[#fab516] group-hover:w-full opacity-90`}
                  ></span>
                  <span
                    className={`relative group-hover:text-white flex items-center gap-2`}
                  >
                    {pending === true && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin " />
                    )}
                    Créer Client Pro
                  </span>
                </Button>
              </div>
              <div className="col-start-2">
                <Button
                  type="button"
                  variant="outline"
                  className="lg:inline-block px-5 relative rounded group overflow-hidden font-medium bg-transparent text-black border-2 border-black"
                  onClick={() => {
                    window.location.href = "/admin/liste-des-clients-pro"; // Replace with your desired URL
                  }}
                >
                  <span
                    className={`relative group-hover:text-black flex items-center gap-2`}
                  >
                    Annuler
                  </span>
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
