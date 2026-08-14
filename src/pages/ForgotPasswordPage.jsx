import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/components/AuthLayout";
import AuthFormField from "@/components/AuthFormField";
import { validateEmail } from "@/lib/auth";
import { forgotPasswordWithApi } from "@/lib/authApi";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) {
      setError("Email is required");
      return;
    }
    if (!validateEmail(trimmed)) {
      setError("Email must be a valid email");
      return;
    }

    setIsLoading(true);
    setError("");

    const result = await forgotPasswordWithApi(trimmed);
    setIsLoading(false);

    if (!result.success) {
      setError(result.error);
      toast.error("Could not send reset email", {
        description: result.error,
      });
      return;
    }

    setIsSubmitted(true);
    toast.success("Check your email", {
      description: result.message,
    });
  }

  return (
    <AuthLayout>
      <section className="w-full max-w-[440px] rounded-3xl bg-stone-300/40 px-8 py-10 md:px-10 md:py-12">
        <h1 className="mb-4 text-center text-3xl font-bold text-stone-950">
          Forgot password
        </h1>
        <p className="mb-8 text-center text-sm text-stone-600">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>

        {isSubmitted ? (
          <div className="flex flex-col gap-6 text-center">
            <p className="text-sm leading-relaxed text-stone-600">
              If an account exists for this email, a password reset link has
              been sent. Please check your inbox.
            </p>
            <Link
              to="/login"
              className="font-medium text-stone-950 underline underline-offset-2 hover:text-stone-700"
            >
              Back to log in
            </Link>
          </div>
        ) : (
          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit}
            noValidate
          >
            <AuthFormField
              id="email"
              name="email"
              label="Email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
              error={error}
              autoComplete="email"
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="mt-2 h-12 w-full rounded-full bg-stone-950 text-base font-medium text-white hover:bg-stone-800"
            >
              {isLoading ? "Sending…" : "Send reset link"}
            </Button>
          </form>
        )}

        {!isSubmitted && (
          <p className="mt-6 text-center text-sm text-stone-600">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-medium text-stone-950 underline underline-offset-2 hover:text-stone-700"
            >
              Log in
            </Link>
          </p>
        )}
      </section>
    </AuthLayout>
  );
}

export default ForgotPasswordPage;
