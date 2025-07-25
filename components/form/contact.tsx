"use client";
import * as React from "react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
import { ContactPageSchema } from "@/schema/";
import { FormError } from "@/components/form-error";
import { FormSucess } from "../form-sucess";
import { Textarea } from "../ui/textarea";


interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ContactForm({ className, ...props }: UserAuthFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = React.useState<string | undefined>("");
  const [success, setSuccess] = React.useState<string | undefined>("");
  const form = useForm<z.infer<typeof ContactPageSchema>>({
    resolver: zodResolver(ContactPageSchema),
    defaultValues: {
      fullName: "",
      entreprise: "",
      phone: "",
      email: "",
      objet: "",
      demande: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ContactPageSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setSuccess(data.message);
            window.location.reload();
          } else {
            setError(data.error);
          }
        })
        .catch((error) => {
          // Handle network or other errors
          console.error("Erreur lors de l'envoi de votre demande", error);
          setError("Erreur lors de l'envoi de votre demande");
        });
    });
  };

  return (
    <div
      className={cn(
        "mt-10 bg-transparent border border-transparent p-4 gap-6",
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
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom<span className="text-red-600">*</span></FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Votre Nom et Prénom"
                        className="rounded-[30px] border border-[#C1C1C1] bg-[#FAFAFA] p-4"
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
                name="entreprise"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nom d’entreprise <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Nom de votre entreprise"
                        className="rounded-[30px] border border-[#C1C1C1] bg-[#FAFAFA] p-4"
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
                    <FormLabel>Numéro de téléphone <span className="text-red-600">*</span></FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Votre Numéro de téléphone"
                        className="rounded-[30px] border border-[#C1C1C1] bg-[#FAFAFA] p-4"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Votre adresse Email"
                        type="email"
                        className="rounded-[30px] border border-[#C1C1C1] bg-[#FAFAFA] p-4"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div>
          <div className="">
      <FormField
        control={form.control}
        name="objet"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Objet<span className="text-red-600">*</span></FormLabel>
            <FormControl>
              <Input
                {...field}
                disabled={isPending}
                placeholder="Demandez notre catalogue complet"
                className="rounded-[30px] border border-[#C1C1C1] bg-[#FAFAFA] p-4"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>

    <div className="mt-8">
      <FormField
        control={form.control}
        name="demande"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Votre demande<span className="text-red-600">*</span></FormLabel>
            <FormControl>
              <Textarea
                {...field}
                disabled={isPending}
                placeholder="Demandez notre catalogue complet"
                className="rounded-[30px] border border-[#C1C1C1] bg-[#FAFAFA] p-4"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
          </div>
          <div className="flex lg:justify-start items-end">
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
                    
                  </div>
                  Envoyer
                </span>
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
