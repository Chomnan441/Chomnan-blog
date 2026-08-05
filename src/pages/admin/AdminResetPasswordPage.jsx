import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/context/AuthContext";

const INITIAL_FORM = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function AdminResetPasswordPage() {
  const { resetPassword } = useAuth();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }));
  }

  function validateForm() {
    const nextErrors = {};

    if (!formData.currentPassword) {
      nextErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      nextErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      nextErrors.newPassword = "New password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!validateForm()) return;
    setIsConfirmOpen(true);
  }

  async function handleConfirmReset() {
    const result = await resetPassword(formData);

    if (!result.success) {
      setIsConfirmOpen(false);
      setErrors({ form: result.error, currentPassword: result.error });
      toast.error("Could not reset password", {
        description: result.error,
      });
      return;
    }

    setIsConfirmOpen(false);
    setFormData(INITIAL_FORM);
    setErrors({});
    toast.success("Password reset", {
      description: "Your password has been successfully updated",
    });
  }

  return (
    <section className="px-6 py-8 md:px-10 md:py-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <h1 className="text-3xl font-bold text-stone-950">Reset password</h1>
        <Button
          type="submit"
          form="admin-reset-password-form"
          className="h-11 rounded-full bg-stone-950 px-6 text-base font-medium text-white hover:bg-stone-800"
        >
          Reset password
        </Button>
      </header>

      <form
        id="admin-reset-password-form"
        onSubmit={handleSubmit}
        noValidate
        className="mx-auto flex max-w-xl flex-col gap-5"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="admin-current-password" className="text-stone-600">
            Current password
          </Label>
          <Input
            id="admin-current-password"
            name="currentPassword"
            type="password"
            placeholder="Current password"
            value={formData.currentPassword}
            onChange={handleChange}
            className="h-11 rounded-xl border-stone-300 bg-white"
            aria-invalid={Boolean(errors.currentPassword)}
            autoComplete="current-password"
          />
          {errors.currentPassword && (
            <p className="text-sm text-red-500" role="alert">
              {errors.currentPassword}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="admin-new-password" className="text-stone-600">
            New password
          </Label>
          <Input
            id="admin-new-password"
            name="newPassword"
            type="password"
            placeholder="New password"
            value={formData.newPassword}
            onChange={handleChange}
            className="h-11 rounded-xl border-stone-300 bg-white"
            aria-invalid={Boolean(errors.newPassword)}
            autoComplete="new-password"
          />
          {errors.newPassword && (
            <p className="text-sm text-red-500" role="alert">
              {errors.newPassword}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="admin-confirm-password" className="text-stone-600">
            Confirm new password
          </Label>
          <Input
            id="admin-confirm-password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="h-11 rounded-xl border-stone-300 bg-white"
            aria-invalid={Boolean(errors.confirmPassword)}
            autoComplete="new-password"
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500" role="alert">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {errors.form && (
          <p className="text-sm text-red-500" role="alert">
            {errors.form}
          </p>
        )}
      </form>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="max-w-md rounded-2xl border-stone-200 p-8 sm:max-w-md">
          <button
            type="button"
            onClick={() => setIsConfirmOpen(false)}
            className="absolute top-4 right-4 rounded-md p-1 text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-800"
            aria-label="Close dialog"
          >
            <X className="size-5" aria-hidden="true" />
          </button>

          <AlertDialogTitle className="text-center text-2xl font-bold text-stone-950">
            Reset password
          </AlertDialogTitle>
          <AlertDialogDescription className="mt-2 text-center text-base text-stone-600">
            Do you want to reset your password?
          </AlertDialogDescription>

          <AlertDialogFooter className="mt-6 border-0 bg-transparent p-0 sm:justify-center">
            <AlertDialogCancel className="h-11 rounded-full border-stone-950 bg-white px-8 text-base font-medium text-stone-950 hover:bg-stone-100">
              Cancel
            </AlertDialogCancel>
            <Button
              type="button"
              className="h-11 rounded-full bg-stone-950 px-8 text-base font-medium text-white hover:bg-stone-800"
              onClick={handleConfirmReset}
            >
              Reset
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

export default AdminResetPasswordPage;
