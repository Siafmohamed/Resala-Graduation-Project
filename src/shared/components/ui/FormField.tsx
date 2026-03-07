import { Controller, type FieldValues, type UseControllerProps } from "react-hook-form"

import { Input } from "@/shared/components/ui/Input"
import { Label } from "@/shared/components/ui/Label"

interface FormFieldProps<T extends FieldValues> extends UseControllerProps<T> {
  label: string
  placeholder?: string
  type?: string
  error?: string
  helperText?: string
  fullWidth?: boolean
}

export function FormField<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  type = "text",
  error,
  helperText,
  fullWidth = true,
  ...props
}: FormFieldProps<T>) {
  return (
    <div className={fullWidth ? "w-full" : ""}>
      <Label htmlFor={name}>{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            id={name}
            type={type}
            placeholder={placeholder}
            error={error}
            helperText={helperText}
            fullWidth={fullWidth}
            className={error ? "border-red-500 focus:ring-red-500" : ""}
          />
        )}
        {...props}
      />
    </div>
  )
}