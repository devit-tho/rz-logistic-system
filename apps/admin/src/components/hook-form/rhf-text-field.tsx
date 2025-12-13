import { ComponentProps } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

// Sanitize input: keep digits and only one decimal point
function sanitizeDecimalInput(val: string): string {
  const clean = val.replace(/[^0-9.]/g, "");
  const parts = clean.split(".");
  if (parts.length > 2) {
    return `${parts[0]}.${parts.slice(1).join("")}`;
  }
  return clean;
}

function RHFTextField({
  name,
  label,
  type,
  description,
  ...other
}: {
  name: string;
  label: string;
  description?: string | React.ReactNode;
} & ComponentProps<typeof Input>) {
  const { control, setValue } = useFormContext();
  const isNumber = type === "number";

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              type={isNumber ? "text" : type}
              inputMode={isNumber ? "decimal" : "text"}
              autoComplete="off"
              value={field.value ?? ""}
              onChange={(e) => {
                if (isNumber) {
                  const sanitized = sanitizeDecimalInput(e.target.value);
                  field.onChange(sanitized); // keep as string while typing
                } else {
                  field.onChange(e.target.value);
                }
              }}
              onBlur={() => {
                if (isNumber && typeof field.value === "string") {
                  const num = parseFloat(field.value);
                  setValue(name, isNaN(num) ? 0 : num);
                }
              }}
              {...other}
            />
          </FormControl>
          <FormMessage />
          {description && <FormDescription>{description}</FormDescription>}
        </FormItem>
      )}
    />
  );
}

export default RHFTextField;
