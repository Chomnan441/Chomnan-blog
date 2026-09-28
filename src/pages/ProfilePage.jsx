import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import AccountLayout from "@/components/AccountLayout";
import AuthFormField from "@/components/AuthFormField";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { DEFAULT_AVATAR } from "@/lib/auth";
import { resizeImageFile } from "@/lib/resizeImage";

function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    avatar: user?.avatar || DEFAULT_AVATAR,
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    setFormData({
      name: user.name || "",
      username: user.username || "",
      email: user.email || "",
      avatar: user.avatar || DEFAULT_AVATAR,
    });
  }, [user]);

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }));
  }

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file", {
        description: "Please upload an image file",
      });
      return;
    }

    try {
      const resized = await resizeImageFile(file, {
        maxSize: 512,
        quality: 0.85,
      });
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      setAvatarFile(resized);
      setAvatarPreview(URL.createObjectURL(resized));
    } catch (error) {
      toast.error("Could not process image", {
        description: error.message || "Please try another image",
      });
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {};
    if (!formData.name.trim()) {
      nextErrors.name = "Name is required";
    }
    if (!formData.username.trim()) {
      nextErrors.username = "Username is required";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSaving(true);

    const result = await updateProfile({
      name: formData.name,
      username: formData.username,
      avatarFile,
    });

    setIsSaving(false);

    if (!result.success) {
      setErrors({ form: result.error });
      toast.error("Could not save profile", {
        description: result.error,
      });
      return;
    }

    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(null);
    setAvatarPreview("");
    setErrors({});
    toast.success("Saved profile", {
      description: "Your profile has been successfully updated",
    });
  }

  const previewAvatar =
    avatarPreview || formData.avatar || DEFAULT_AVATAR;

  return (
    <AccountLayout title="Profile">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-3xl bg-stone-300/40 px-6 py-8 md:px-10 md:py-10"
      >
        <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <img
            src={previewAvatar}
            alt="Profile preview"
            className="size-28 rounded-full object-cover md:size-32"
          />
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-full border-stone-950 bg-white px-5 text-sm font-medium text-stone-950 hover:bg-stone-100"
              onClick={handleUploadClick}
            >
              Upload profile picture
            </Button>
          </div>
        </div>

        <div className="flex max-w-md flex-col gap-5">
          <AuthFormField
            id="name"
            label="Name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            autoComplete="name"
          />
          <AuthFormField
            id="username"
            label="Username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            autoComplete="username"
          />
          <AuthFormField
            id="email"
            label="Email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            readOnly
            autoComplete="email"
          />

          {errors.form && (
            <p className="text-sm text-red-500" role="alert">
              {errors.form}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSaving}
            className="mt-2 h-11 w-fit rounded-full bg-stone-950 px-8 text-base font-medium text-white hover:bg-stone-800"
          >
            {isSaving ? "Saving…" : "Save"}
          </Button>
        </div>
      </form>
    </AccountLayout>
  );
}

export default ProfilePage;
