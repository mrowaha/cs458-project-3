import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";

export type DropDownProps = {
  name: string;
  control: Control<any>;
  label?: string;
  placeholder?: string;
  items: any[];
  displayExpr: string;
  valueExpr: string;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;
  onChange?: (value: string) => void;
};

export const DropDown = ({
  name,
  control,
  label,
  placeholder,
  items,
  displayExpr,
  valueExpr,
  errorMessage,
  disabled = false,
  required = false,
  onChange
}: DropDownProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}{required && <span className="text-red-500 ml-1">*</span>}</FormLabel>}
          <FormControl>
            <Select
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                if (onChange) onChange(value);
              }}
              disabled={disabled}
            >
              <SelectTrigger className="bg-zinc-800 border-zinc-700 focus:ring-accent-base">
                <SelectValue placeholder={placeholder || "Select an option"} />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                {items.length === 0 ? (
                  <div className="p-2 text-zinc-400 text-center">No data</div>
                ) : (
                  items.map((item) => (
                    <SelectItem
                      key={item[valueExpr]}
                      value={item[valueExpr].toString()}
                      className="text-zinc-300 focus:bg-zinc-700"
                    >
                      {item[displayExpr]}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </FormControl>
          {errorMessage && <FormMessage>{errorMessage}</FormMessage>}
        </FormItem>
      )}
    />
  );
};