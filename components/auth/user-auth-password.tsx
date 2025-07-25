"use client";
import * as React from "react";
import { useTransition } from "react";
//import { ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { cn } from "@/lib/utils";
//import { Icons } from "@/components/ui/icons";
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
import { NewPasswordSchema } from "@/schema/";
import { FormError } from "@/components/form-error";
import { FormSucess } from "../form-sucess";
import { DialogClose } from "../ui/dialog";

interface UserModificationAuthFormProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({
  className,
  ...props
}: UserModificationAuthFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = React.useState<string | undefined>("");
  const [success, setSuccess] = React.useState<string | undefined>("");
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const userId = sessionStorage.getItem("id");
  const userToken = sessionStorage.getItem("token");

  const onSubmit = async (values: z.infer<typeof NewPasswordSchema>) => {
    const updatedValues = { ...values, userId };
    setError("");
    setSuccess("");
    startTransition(() => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(updatedValues),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setSuccess(data.success);
            window.location.reload();
          } else {
            setError(data.error);
          }
        })
        .catch((error) => {
          // Handle network or other errors
          console.error("Erreur lors de l'enregistrement", error);
          setError("Une erreur s'est produite lors de l'enregistrement");
        });
    });
  };

  return (
    <div
      className={cn(
        "mt-10 bg-[#FBFBFB] border border-[#DFDFDF] p-4 gap-6",
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
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ancien Mot de Passe</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="*********"
                        type="password"
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
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nouveau Mot de Passe</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="*********"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/*<div className="flex lg:justify-end items-end">
            <div className="col-start-2">
              <Button
                disabled={isPending}
                variant={"login"}
                className={`lg:inline-block px-5 relative rounded group overflow-hidden font-medium bg-transparent text-[#fab516]`}
              >
                <span
                  className={`absolute top-0 left-0 flex w-0 h-full mr-0 transition-all duration-200 ease-out transform translate-x-0 bg-[#fab516] group-hover:w-full opacity-90`}
                ></span>
                <span
                  className={`relative group-hover:text-white flex items-center gap-2`}
                >
                  {isPending && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin " />
                  )}
                  <div className="bg-[#fab516] rounded-full opacity-90">
                    <ArrowRight className="text-white w-4 h-4" />
                  </div>
                  Valider
                </span>
              </Button>
            </div>
          </div>*/}
          <div className="flex justify-center items-center gap-4">
              {/* Valider Button */}
              <Button
                type="submit"
                disabled={isPending}
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
  );
}
