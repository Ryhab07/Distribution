"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";

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

interface Framework {
  value: string;
  label: string;
}

interface ComboboxDemoProps {
  frameworks: Framework[];
  option: string;
  defaultValue: string;
  onOptionSelect: (selectedOption: Framework | null) => void;
  disabled?: boolean; // New disabled prop
}

export function ComboboxDemo({
  frameworks,
  option,
  defaultValue,
  onOptionSelect,
  disabled = false, // Default to false if not provided
}: ComboboxDemoProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);

  const handlePopoverOpenChange = (isOpen: boolean) => {
    if (!disabled) {
      setOpen(isOpen);
    }
  };

  return (
    <Popover open={open} onOpenChange={handlePopoverOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between rounded-none",
            disabled && "opacity-50 pointer-events-none"
          )}
          disabled={disabled}
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : `${option}`}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      {!disabled && (
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Chercher..." />
            <CommandEmpty>Option non trouvée.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue); // Always set the current value
                    setOpen(false);
                    onOptionSelect(
                      frameworks.find((framework) => framework.value === currentValue) ?? null
                    );
                  }}
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
      )}
    </Popover>
  );
}
