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
import { LoginSchema } from "@/schema/index";
import { FormError } from "@/components/form-error";
import { FormSucess } from "../form-sucess";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
//import Cookies from "js-cookie";

interface UserAuthLoginProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthLogin({ className, ...props }: UserAuthLoginProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = React.useState<string | undefined>("");
  const [success, setSuccess] = React.useState<string | undefined>("");
  const [showPassword, setShowPassword] = React.useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((response) => response.json())
        .then((data) => {
          if (
            data.message ===
            "Multiple accounts found. Please choose your company."
          ) {
            window.location.href = "/verification-compte";
            // Send data.users to the new page
            sessionStorage.setItem("users", JSON.stringify(data.users));
          } else if (data.success) {
            // Save user data to session storage
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("role", data.user.role);
            sessionStorage.setItem("entreprise", data.user?.entreprise);
            sessionStorage.setItem("name", data.user?.name);
            sessionStorage.setItem("lastname", data.user?.lastname);
            sessionStorage.setItem("phone", data.user?.phone);
            sessionStorage.setItem("email", data.user?.email);
            sessionStorage.setItem("adresse", data.user?.adresse);
            sessionStorage.setItem("id", data.user?._id);
            sessionStorage.setItem("sales", data.user?.sales);
            sessionStorage.setItem("isLoggedIn", "true");

            // Redirect user based on their role
            switch (data.user.role) {
              case "user":
                window.location.href = "/";
                break;
              case "collaborator":
                window.location.href = "/collaborateur/mon-compte";
                break;
              case "picker":
                window.location.href = "/";
                break;
              case "userPro":
                window.location.href = "/user-pro/sav";
                break;
              case "admin":
                window.location.href = "/admin/mon-compte";
                break;
              default:
                // Handle unknown role
                console.error("Unknown user role:", data.user.role);
                break;
            }
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
    <div className={cn("grid gap-2 w-full", className)} {...props}>
      <div className="">
        <FormError message={error} />
        <FormSucess message={success} />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-2  px-4 rounded-[30px] h-[350px] pt-10">
            <div className="grid gap-1 text-white">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-start gap-2 items-center">
                      <Mail className="text-devinovGreen" />
                      <FormLabel className="text-black">Email</FormLabel>
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="john.doe@example.com"
                        type="email"
                        className=" bg-transparent border-b border-b-devinovGreen border-t-transparent border-l-transparent border-r-transparent text-black rounded-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-1 text-white">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-start gap-2 items-center">
                      <Lock className="text-devinovGreen" />
                      <FormLabel className="text-black">Mot de Passe</FormLabel>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="*********"
                          type={showPassword ? "text" : "password"}
                          className="bg-transparent border-b border-b-devinovGreen border-t-transparent border-l-transparent border-r-transparent text-black rounded-none"
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
            <Link
              className="text-sm text-center mt-2 mb-2 font-light underline text-black"
              href="/recuperation-mot-de-passe"
            >
              Mot de passe oublié
            </Link>
            <Button
              disabled={isPending}
              variant={"login"}
              className="bg-black text-white rounded-lg text-[16px] font-normal w-full lg:w-[30%] mx-auto border-transparent"
            >
              {isPending && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin " />
              )}
              Connexion
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
