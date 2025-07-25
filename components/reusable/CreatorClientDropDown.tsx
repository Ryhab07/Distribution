import { PopoverTrigger } from "@radix-ui/react-popover";
import { Label } from "../ui/label";
import { Popover, PopoverContent } from "../ui/popover";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "../ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const CreatorClientDropDown = ({ userData, onValueChange }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    sessionStorage.setItem("value", value);
  }, [value]);

  const filteredData = userData.filter((framework) =>
    framework.entreprise.toLowerCase().includes(filterValue.toLowerCase())
  );

  return (
    <div className="relative lg:max-w-[1280px] mt-20 mb-10">
      <div className="ml-[4px]  border-gray-300 absolute left-1/2 -translate-x-1/2 mt-[4px]  bg-[#fee2b7] z-10 h-[100%] rounded-lg w-[100%] mx-auto flex justify-center"></div>
      <div className="bg-[#F0F0F0] border border-[#DFDFDF] p-4 mt-4 rounded-[10px] z-40 relative">
        <Label>
          Choisissez un client <span className="text-red-500">*</span>
        </Label>
        <Popover open={open} onOpenChange={setOpen} >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {value
                ? userData.find((item) => item._id === value)?.entreprise
                : "Choisissez un client..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className={cn("w-full p-0 h-60")}>
            <Command className={cn("w-full")}>
              <input
                type="text"
                className="w-full p-2 border-b border-[#DFDFDF] focus:border-devinovGreen"
                placeholder="Recherchez par nom..."
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
              />
              {/*<CommandEmpty>
                Aucun client n&apos;a été trouvé correspondant à ce nom.
              </CommandEmpty>*/}
              <CommandGroup
                className={cn("lg:w-[1080px] w-[300px] overflow-y-auto")}
              >
                {filteredData.length === 0 && filterValue !== "" ? (
                  <CommandEmpty>
                    Aucun client n&apos;a été trouvé correspondant à ce nom.
                  </CommandEmpty>
                ) : (
                  filteredData.map((framework) => (
                    <CommandItem
                      key={framework._id}
                      value={framework._id}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        onValueChange(currentValue);
                        setOpen(false);
                      }}
                      className={cn("lg:w-[1080px] w-[300px]")}
                    >
                      {framework.entreprise}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          value === framework._id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))
                )}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default CreatorClientDropDown;
