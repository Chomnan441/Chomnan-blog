import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/components/AuthLayout";
import AuthFormField from "@/components/AuthFormField";
import { useAuth } from "@/context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [hasError, setHasError] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setHasError(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const success = await login(formData.email, formData.password);

    if (success) {
      navigate("/");
      return;
    }

    setHasError(true);
    toast.error("Your password is incorrect or this email doesn't exist", {
      description: "Please try another password or email",
    });
  }

  return (
    <AuthLayout>
      <section className="w-full max-w-[440px] rounded-3xl bg-stone-300/40 px-8 py-10 md:px-10 md:py-12">
        <h1 className="mb-8 text-center text-3xl font-bold text-stone-950">
          Log in
        </h1>

        <form
          className="flex flex-col gap-5"
          onSubmit={handleSubmit}
          noValidate
        >
          <AuthFormField
            id="email"
            label="Email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            invalid={hasError}
            autoComplete="email"
          />
          <AuthFormField
            id="password"
            label="Password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            invalid={hasError}
            autoComplete="current-password"
          />

          <p className="-mt-2 text-right text-sm">
            <Link
              to="/forgot-password"
              className="font-medium text-stone-600 underline underline-offset-2 hover:text-stone-950"
            >
              Forgot password?
            </Link>
          </p>

          <Button
            type="submit"
            className="mt-2 h-12 w-full rounded-full bg-stone-950 text-base font-medium text-white hover:bg-stone-800"
          >
            Log in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-600">
          Don&apos;t have any account?{" "}
          <Link
            to="/sign-up"
            className="font-medium text-stone-950 underline underline-offset-2 hover:text-stone-700"
          >
            Sign up
          </Link>
        </p>
      </section>
    </AuthLayout>
  );
}

export default LoginPage;
