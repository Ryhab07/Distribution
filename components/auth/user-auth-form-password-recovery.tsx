"use client";

import * as React from "react";
import { useTransition } from "react";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { RecoverPasswordchema } from "@/schema/index";
import { FormError } from "@/components/form-error";
import { FormSucess } from "../form-sucess";

interface PasswordRecoverProps extends React.HTMLAttributes<HTMLDivElement> {}

export function PasswordRecover({ className, ...props }: PasswordRecoverProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = React.useState<string | undefined>("");
  const [success, setSuccess] = React.useState<string | undefined>("");
  const form = useForm<z.infer<typeof RecoverPasswordchema>>({
    resolver: zodResolver(RecoverPasswordchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof RecoverPasswordchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/recover-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
            setSuccess(data.message);
        } else {
          // Handle sign-in failure
          setError(data.error);
        }
      })
      .catch((error) => {
        // Handle network or other errors
        console.error("Erreur lors de la connexion", error);
        setError("Une erreur s'est produite lors de la connexion");
      });
    });
    
  };

  return (
    <div className={cn("grid gap-2", className)} {...props}>
      <div className="">
        <FormError message={error} />
        <FormSucess message={success} />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <div className="grid gap-2 bg-devinovGreen px-4 rounded-[30px] h-[350px] pt-20">
            <div className="grid gap-1 text-white">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="john.doe@example.com"
                        type="email"
                        className=" bg-white text-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              disabled={isPending}
              variant={"login"}
              className="bg-devinovBleu text-white rounded-lg text-[16px] font-normal w-full lg:w-[50%] mx-auto border-transparent"
            >
              {isPending && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin " />
              )}
              récupérer mot de passe
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
