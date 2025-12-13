import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import isEqual from "lodash/isEqual";
import { Check, ChevronsUpDown } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useBoolean } from "usehooks-ts";
import { SelectOption } from "./rhf-select";

function RHFCombo({
  name,
  label,
  options,
  description,
}: {
  name: string;
  label: string;
  options: SelectOption[];
  description?: string;
}) {
  const { control, setValue, watch } = useFormContext();

  const popover = useBoolean();

  const value = watch(name);

  return (
    <>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>{label}</FormLabel>
            <Popover open={popover.value} onOpenChange={popover.setValue}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between",
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    {options.find((option) => {
                      const parsedValue = parseInt(option.value, 10);
                      return isEqual(
                        typeof parsedValue === "number"
                          ? parsedValue
                          : option.value,
                        value,
                      );
                    })?.label || `Select ${label}`}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder={`Search ${label}...`}
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No {label} found.</CommandEmpty>
                    <CommandGroup>
                      {options.map((opt) => (
                        <CommandItem
                          key={String(opt.value)}
                          value={opt.label as string}
                          onSelect={() => {
                            const parsedValue = parseInt(opt.value, 10);
                            const isSelected = isEqual(
                              typeof parsedValue === "number"
                                ? parsedValue
                                : opt.value,
                              value,
                            );
                            setValue(name, isSelected ? null : parsedValue);
                            popover.setFalse();
                          }}
                        >
                          {opt.label}
                          <Check
                            className={cn(
                              "ml-auto",
                              opt.value === field.value
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

export default RHFCombo;
