"use client";
import * as React from "react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
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
import { Checkbox } from "@/components/ui/checkbox";

// Zod schema for the kit form
const KitSchema = z.object({
  brand: z.array(z.string()).min(1, "Veuillez sélectionner au moins une marque"),
  powerKit: z.array(z.string()).min(1, "Veuillez sélectionner au moins une puissance de kit"),
  panelPower: z.array(z.string()).min(1, "Veuillez sélectionner au moins une puissance de panneau"),
  panelsPerInverter: z.array(z.string()).min(1, "Veuillez sélectionner au moins un nombre de panneaux par micro-onduleur"),
  powerType: z.array(z.string()).min(1, "Veuillez sélectionner au moins un type d'alimentation"),
  panelOrientation: z.array(z.string()).min(1, "Veuillez sélectionner au moins une orientation des panneaux"),
});

export function KitForm({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = React.useState<string | undefined>("");
  const [success, setSuccess] = React.useState<string | undefined>("");
  const [pending, setPending] = React.useState<boolean | undefined>(false);

  const form = useForm<z.infer<typeof KitSchema>>({
    resolver: zodResolver(KitSchema),
    defaultValues: {
      brand: [],
      powerKit: [],
      panelPower: [],
      panelsPerInverter: [],
      powerType: [],
      panelOrientation: [],
    },
  });

  console.log("isPending", isPending)

  const onSubmit = async (values: z.infer<typeof KitSchema>) => {
    console.log("Form values:", values);
    setError("");
    setSuccess("");
    setPending(true);
  
    startTransition(() => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/kits/submit-kit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            const kitNames = data.data.map((kit) => kit.name); // Keep as an array
            setSuccess(`${data.data.length} kit(s) ajouté(s) avec succès:\n${kitNames.map(kit => `- ${kit}`).join('\n')}`);
  
            setPending(false);
          } else {
            setError(data.error);
            setPending(false);
          }
        })
        .catch((error) => {
          console.error("Erreur lors de l'enregistrement du kit", error);
          setError("Erreur lors de l'enregistrement du kit");
        });
    });
  };
  
  

  // Helper functions for "Select All" and "Unselect All"
  const handleSelectAll = (field: keyof z.infer<typeof KitSchema>, values: string[]) => {
    form.setValue(field, values);
  };

  const handleUnselectAll = (field: keyof z.infer<typeof KitSchema>) => {
    form.setValue(field, []);
  };

  const formattedMessage = success?.replace(/\n/g, '<br />');

  return (
    <div className="relative cursor-pointer w-full mb-10">
      <div className="z-10 border-gray-300 absolute left-1/2 -translate-x-1/2 mt-[210px] lg:mt-[430px] bg-devinovGreen h-[20%] rounded-lg w-[60%] mx-auto flex justify-center"></div>
      <div
        className={cn(
          "mt-10 bg-[#FBFBFB] border border-[#F0F0F0] p-4 gap-6 rounded-[20px] z-40 relative",
          className
        )}
        {...props}
      >
        <div className="mb-10">
          <FormError message={error} />
          
          <FormSucess message={formattedMessage} />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
              {/* Brand Selection (Multiple Checkboxes) */}
              <div className="grid gap-1">
                <FormField
                  control={form.control}
                  name="brand"
                  render={() => (
                    <FormItem>
                      <FormLabel>
                        Marque <span className="text-red-600">*</span>
                      </FormLabel>
                      <div className="space-y-2">
                        {["Powernity", "Ecoya"].map((brand) => (
                          <FormField
                            key={brand}
                            control={form.control}
                            name="brand"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(brand)}
                                    onCheckedChange={(checked) => {
                                      const newValue = checked
                                        ? [...field.value, brand]
                                        : field.value?.filter((v) => v !== brand);
                                      field.onChange(newValue);
                                    }}
                                  />
                                </FormControl>
                                <FormLabel>{brand}</FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Power Kit Selection (Multiple Checkboxes) */}
              <div className="grid gap-1">
                <FormField
                  control={form.control}
                  name="powerKit"
                  render={() => (
                    <FormItem>
                      <FormLabel>
                        Puissance Kit <span className="text-red-600">*</span>
                      </FormLabel>
                      <div className="space-y-2">
                        <div className="flex lg:flex-row flex-col gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleSelectAll("powerKit", ["3000", "3500", "4000", "4500", "5000", "5500", "6000", "6500", "7000", "7500", "8000", "8500", "9000", "9500"])}
                          >
                            Tout sélectionner
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleUnselectAll("powerKit")}
                          >
                            Tout désélectionner
                          </Button>
                        </div>
                        <div className="grid lg:grid-cols-4 grid-cols-2 gap-4">
                          {[3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500, 7000, 7500, 8000, 8500, 9000, 9500].map((power) => (
                            <FormField
                              key={power}
                              control={form.control}
                              name="powerKit"
                              render={({ field }) => (
                                <FormItem className="flex items-center space-x-2">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(power.toString())}
                                      onCheckedChange={(checked) => {
                                        const newValue = checked
                                          ? [...field.value, power.toString()]
                                          : field.value?.filter((v) => v !== power.toString());
                                        field.onChange(newValue);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel>{power}W</FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Panel Power Selection (Checkboxes) */}
              <div className="grid gap-1">
                <FormField
                  control={form.control}
                  name="panelPower"
                  render={() => (
                    <FormItem>
                      <FormLabel>
                        Puissance Panneaux <span className="text-red-600">*</span>
                      </FormLabel>
                      <div className="space-y-2">
                        {["375", "500"].map((power) => (
                          <FormField
                            key={power}
                            control={form.control}
                            name="panelPower"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(power)}
                                    onCheckedChange={(checked) => {
                                      const newValue = checked
                                        ? [...field.value, power]
                                        : field.value?.filter((v) => v !== power);
                                      field.onChange(newValue);
                                    }}
                                  />
                                </FormControl>
                                <FormLabel>{power}W</FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Panels Per Inverter Selection (Checkboxes) */}
              <div className="grid gap-1">
                <FormField
                  control={form.control}
                  name="panelsPerInverter"
                  render={() => (
                    <FormItem>
                      <FormLabel>
                        Nombre de Panneaux pour 1 Micro-Onduleur <span className="text-red-600">*</span>
                      </FormLabel>
                      <div className="space-y-2">
                        {["1", "2"].map((count) => (
                          <FormField
                            key={count}
                            control={form.control}
                            name="panelsPerInverter"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(count)}
                                    onCheckedChange={(checked) => {
                                      const newValue = checked
                                        ? [...field.value, count]
                                        : field.value?.filter((v) => v !== count);
                                      field.onChange(newValue);
                                    }}
                                  />
                                </FormControl>
                                <FormLabel>{count}</FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Power Type Selection (Checkboxes) */}
              <div className="grid gap-1">
                <FormField
                  control={form.control}
                  name="powerType"
                  render={() => (
                    <FormItem>
                      <FormLabel>
                        Type d’alimentation <span className="text-red-600">*</span>
                      </FormLabel>
                      <div className="space-y-2">
                        {["Monophasé", "Triphasé"].map((type) => (
                          <FormField
                            key={type}
                            control={form.control}
                            name="powerType"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(type)}
                                    onCheckedChange={(checked) => {
                                      const newValue = checked
                                        ? [...field.value, type]
                                        : field.value?.filter((v) => v !== type);
                                      field.onChange(newValue);
                                    }}
                                  />
                                </FormControl>
                                <FormLabel>{type}</FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Panel Orientation Selection (Checkboxes) */}
              <div className="grid gap-1">
                <FormField
                  control={form.control}
                  name="panelOrientation"
                  render={() => (
                    <FormItem>
                      <FormLabel>
                        Orientation des Panneaux <span className="text-red-600">*</span>
                      </FormLabel>
                      <div className="space-y-2">
                        {["Portrait", "Paysage"].map((orientation) => (
                          <FormField
                            key={orientation}
                            control={form.control}
                            name="panelOrientation"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(orientation)}
                                    onCheckedChange={(checked) => {
                                      const newValue = checked
                                        ? [...field.value, orientation]
                                        : field.value?.filter((v) => v !== orientation);
                                      field.onChange(newValue);
                                    }}
                                  />
                                </FormControl>
                                <FormLabel>{orientation}</FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex lg:justify-end items-end">
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
                    Créer Kit
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