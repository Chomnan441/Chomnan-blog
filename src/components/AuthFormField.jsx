import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function AuthFormField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  invalid = false,
  autoComplete,
}) {
  const isInvalid = invalid || Boolean(error);

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-sm font-normal text-stone-500">
        {label}
      </Label>
      <Input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        aria-invalid={isInvalid}
        className={cn(
          "h-12 rounded-xl border-stone-300 bg-white px-4 text-base text-stone-950 placeholder:text-stone-400",
          isInvalid &&
            "border-red-400 text-red-500 focus-visible:border-red-400 focus-visible:ring-red-400/20",
        )}
      />
      {error && (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default AuthFormField;
