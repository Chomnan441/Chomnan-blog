import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/components/AuthLayout";
import AuthFormField from "@/components/AuthFormField";
import { recoveryPasswordWithApi } from "@/lib/authApi";

const INITIAL_FORM = {
  newPassword: "",
  confirmPassword: "",
};

const RECOVERY_SESSION_KEY = "chomnan_blog_recovery_session";
const RECOVERY_CACHE_MS = 60_000;

function parseRecoverySessionFromUrlPart(part) {
  if (!part) {
    return null;
  }

  const params = new URLSearchParams(part);
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");
  const type = params.get("type");

  if (!accessToken || !refreshToken) {
    return null;
  }

  if (type && type !== "recovery") {
    return null;
  }

  return { accessToken, refreshToken };
}

/** อ่าน recovery session จาก hash (#...) หรือ query (?...) */
function parseRecoverySessionFromUrl() {
  const hash = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash;

  const fromHash = parseRecoverySessionFromUrlPart(hash);
  if (fromHash) {
    return fromHash;
  }

  const search = window.location.search.startsWith("?")
    ? window.location.search.slice(1)
    : window.location.search;

  return parseRecoverySessionFromUrlPart(search);
}

function persistRecoverySession(session) {
  sessionStorage.setItem(
    RECOVERY_SESSION_KEY,
    JSON.stringify({ ...session, at: Date.now() }),
  );
}

function readCachedRecoverySession() {
  const raw = sessionStorage.getItem(RECOVERY_SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    const { accessToken, refreshToken, at } = JSON.parse(raw);
    if (!accessToken || !refreshToken || Date.now() - at > RECOVERY_CACHE_MS) {
      sessionStorage.removeItem(RECOVERY_SESSION_KEY);
      return null;
    }
    return { accessToken, refreshToken };
  } catch {
    sessionStorage.removeItem(RECOVERY_SESSION_KEY);
    return null;
  }
}

function clearRecoverySession() {
  sessionStorage.removeItem(RECOVERY_SESSION_KEY);
}

function resolveInitialRecoverySession() {
  const fromUrl = parseRecoverySessionFromUrl();
  if (fromUrl) {
    persistRecoverySession(fromUrl);
    return fromUrl;
  }

  return readCachedRecoverySession();
}

function RecoveryPasswordPage() {
  const navigate = useNavigate();
  const [{ session: recoverySession, isInvalid: isLinkInvalid }] = useState(
    () => {
      const session = resolveInitialRecoverySession();
      return { session, isInvalid: !session };
    },
  );
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (recoverySession) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [recoverySession]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }));
  }

  function validateForm() {
    const nextErrors = {};

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

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validateForm() || !recoverySession) return;

    setIsLoading(true);

    const result = await recoveryPasswordWithApi({
      accessToken: recoverySession.accessToken,
      refreshToken: recoverySession.refreshToken,
      password: formData.newPassword,
    });

    setIsLoading(false);

    if (!result.success) {
      setErrors({ form: result.error });
      toast.error("Could not reset password", {
        description: result.error,
      });
      return;
    }

    clearRecoverySession();
    toast.success("Password updated", {
      description: "You can now log in with your new password",
    });
    navigate("/login");
  }

  if (isLinkInvalid) {
    return (
      <AuthLayout>
        <section className="w-full max-w-[440px] rounded-3xl bg-stone-300/40 px-8 py-10 md:px-10 md:py-12">
          <h1 className="mb-4 text-center text-3xl font-bold text-stone-950">
            Invalid link
          </h1>
          <p className="mb-8 text-center text-sm text-stone-600">
            This password reset link is invalid or has expired. Please request a
            new one.
          </p>
          <p className="text-center text-sm text-stone-600">
            <Link
              to="/forgot-password"
              className="font-medium text-stone-950 underline underline-offset-2 hover:text-stone-700"
            >
              Request a new reset link
            </Link>
          </p>
        </section>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <section className="w-full max-w-[440px] rounded-3xl bg-stone-300/40 px-8 py-10 md:px-10 md:py-12">
        <h1 className="mb-4 text-center text-3xl font-bold text-stone-950">
          Set new password
        </h1>
        <p className="mb-8 text-center text-sm text-stone-600">
          Choose a new password for your account.
        </p>

        <form
          className="flex flex-col gap-5"
          onSubmit={handleSubmit}
          noValidate
        >
          <AuthFormField
            id="newPassword"
            name="newPassword"
            label="New password"
            type="password"
            placeholder="New password"
            value={formData.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
            autoComplete="new-password"
          />
          <AuthFormField
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm new password"
            type="password"
            placeholder="Confirm new password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            autoComplete="new-password"
          />

          {errors.form && (
            <p className="text-sm text-red-500" role="alert">
              {errors.form}
            </p>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="mt-2 h-12 w-full rounded-full bg-stone-950 text-base font-medium text-white hover:bg-stone-800"
          >
            {isLoading ? "Saving…" : "Update password"}
          </Button>
        </form>
      </section>
    </AuthLayout>
  );
}

export default RecoveryPasswordPage;
