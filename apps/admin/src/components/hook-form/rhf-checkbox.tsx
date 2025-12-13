import { ComponentProps } from "react";
import { useFormContext } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";

function RHFCheckbox({
  name,
  label,
  ...other
}: { name: string; label: string } & ComponentProps<typeof Checkbox>) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center gap-2">
          <FormControl>
            <Checkbox
              {...field}
              onCheckedChange={(v) => {
                field.onChange(v);
              }}
              {...other}
            />
          </FormControl>
          <FormLabel>{label}</FormLabel>
        </FormItem>
      )}
    />
  );
}

export default RHFCheckbox;
