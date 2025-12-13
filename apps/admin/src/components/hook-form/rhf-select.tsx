import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ComponentProps } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

export interface SelectOption {
  label: string | null;
  value: string;
}

function RHFSelect({
  name,
  options,
  label,
  ...other
}: { name: string; label: string; options: SelectOption[] } & ComponentProps<
  typeof Select
>) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select
              {...other}
              value={String(field.value ?? "")}
              defaultValue={field.value ?? ""}
              onValueChange={(v) => {
                const isNumber = !isNaN(Number(v));
                if (isNumber) {
                  field.onChange(Number(v));
                } else {
                  field.onChange(v);
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default RHFSelect;
