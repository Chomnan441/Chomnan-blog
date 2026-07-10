import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/components/AuthLayout";
import { useAuth } from "@/context/AuthContext";

function RegistrationSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { completeRegistration } = useAuth();

  const registeredUser = location.state?.user;

  useEffect(() => {
    if (!registeredUser) {
      navigate("/", { replace: true });
    }
  }, [registeredUser, navigate]);

  function handleContinue() {
    completeRegistration(registeredUser);
    navigate("/");
  }

  if (!registeredUser) {
    return null;
  }

  return (
    <AuthLayout>
      <section className="flex w-full max-w-[440px] flex-col items-center rounded-3xl bg-stone-300/40 px-8 py-12 md:px-10 md:py-14">
        <div
          className="mb-6 flex size-16 items-center justify-center rounded-full bg-emerald-500"
          aria-hidden="true"
        >
          <Check className="size-8 text-white" strokeWidth={3} />
        </div>

        <h1 className="mb-8 text-center text-3xl font-bold text-stone-950">
          Registration success
        </h1>

        <Button
          type="button"
          onClick={handleContinue}
          className="h-12 rounded-full bg-stone-950 px-10 text-base font-medium text-white hover:bg-stone-800"
        >
          Continue
        </Button>
      </section>
    </AuthLayout>
  );
}

export default RegistrationSuccessPage;
