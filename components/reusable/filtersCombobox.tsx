"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CardProps<T> {
  word: string;
  date: boolean;
  data: T[];
  onSelect?: (selectedValue: T | "") => void;
  height?: string; // New prop for height
}

export function FilterCombobox<T>(props: CardProps<T>) {
  const { word, data, date, onSelect, height = "300px" } = props; // Default height to 300px
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string>("");

  const formatDate = (dateString: string) => {
    const dateObject = new Date(dateString);
    const day = dateObject.getDate().toString().padStart(2, "0");
    const month = (dateObject.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
    const year = dateObject.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const frameworks = (data ? [
    { value: "", label: "Tous" },
    ...data.reduce((acc, item) => {
      const formattedDate = date ? formatDate(String(item)) : String(item);
      const existingItem = acc.find((el) => el.label === formattedDate);
      if (existingItem) {
        existingItem.value += `, ${item}`;
      } else {
        acc.push({ value: String(item), label: formattedDate } as { value: string; label: string });
      }
      return acc;
    }, [] as { value: string; label: string }[])
  ] : []) as { value: string; label: string }[];

  const handleSelect = (currentValue: string) => {
    setValue(currentValue === value ? "" : currentValue);
    setOpen(false);
  
    if (onSelect) {
      if (currentValue === "") {
        onSelect("");
      } else {
        const selectedItem = data.find(
          (item) => formatDate(String(item)) === currentValue || String(item) === currentValue
        );
        onSelect(selectedItem as T);
      }
    }
  };
  

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="lg:w-[200px] w-full justify-between"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : `${word}`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" style={{ maxHeight: height, overflowY: "auto" }}>
        <Command>
          <CommandInput placeholder="Recherche..." />
          <CommandEmpty>Aucune donnée disponible.</CommandEmpty>
          <CommandGroup>
            {frameworks.map((framework) => (
              <CommandItem
                key={framework.value}
                value={framework.value}
                onSelect={() => handleSelect(framework.value)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === framework.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {framework.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
