import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { DEFAULT_AVATAR } from "@/lib/auth";

const BIO_MAX = 120;

function AdminProfilePage() {
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    avatar: user?.avatar || DEFAULT_AVATAR,
    bio: user?.bio || "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!user) return;

    setFormData({
      name: user.name || "",
      username: user.username || "",
      email: user.email || "",
      avatar: user.avatar || DEFAULT_AVATAR,
      bio: user.bio || "",
    });
  }, [user]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }));
  }

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file", {
        description: "Please upload an image file",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        avatar: typeof reader.result === "string" ? reader.result : prev.avatar,
      }));
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {};
    if (!formData.name.trim()) {
      nextErrors.name = "Name is required";
    }
    if (!formData.username.trim()) {
      nextErrors.username = "Username is required";
    }
    if (formData.bio.length > BIO_MAX) {
      nextErrors.bio = `Bio must be at most ${BIO_MAX} characters`;
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const result = updateProfile({
      name: formData.name,
      username: formData.username,
      avatar: formData.avatar || DEFAULT_AVATAR,
      bio: formData.bio,
    });

    if (!result.success) {
      setErrors({ form: result.error });
      toast.error("Could not save profile", {
        description: result.error,
      });
      return;
    }

    setErrors({});
    toast.success("Saved profile", {
      description: "Your profile has been successfully updated",
    });
  }

  const previewAvatar = formData.avatar || DEFAULT_AVATAR;

  return (
    <section className="px-6 py-8 md:px-10 md:py-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <h1 className="text-3xl font-bold text-stone-950">Profile</h1>
        <Button
          type="submit"
          form="admin-profile-form"
          className="h-11 rounded-full bg-stone-950 px-8 text-base font-medium text-white hover:bg-stone-800"
        >
          Save
        </Button>
      </header>

      <form
        id="admin-profile-form"
        onSubmit={handleSubmit}
        noValidate
        className="mx-auto flex max-w-xl flex-col gap-6"
      >
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
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

        <div className="flex flex-col gap-2">
          <Label htmlFor="admin-name" className="text-stone-600">
            Name
          </Label>
          <Input
            id="admin-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="h-11 rounded-xl border-stone-300 bg-white"
            aria-invalid={Boolean(errors.name)}
            autoComplete="name"
          />
          {errors.name && (
            <p className="text-sm text-red-500" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="admin-username" className="text-stone-600">
            Username
          </Label>
          <Input
            id="admin-username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="h-11 rounded-xl border-stone-300 bg-white"
            aria-invalid={Boolean(errors.username)}
            autoComplete="username"
          />
          {errors.username && (
            <p className="text-sm text-red-500" role="alert">
              {errors.username}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="admin-email" className="text-stone-600">
            Email
          </Label>
          <Input
            id="admin-email"
            name="email"
            type="email"
            value={formData.email}
            readOnly
            className="h-11 rounded-xl border-stone-300 bg-stone-50 text-stone-600"
            autoComplete="email"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="admin-bio" className="text-stone-600">
            Bio (max {BIO_MAX} letters)
          </Label>
          <Textarea
            id="admin-bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            maxLength={BIO_MAX}
            rows={4}
            className="rounded-xl border-stone-300 bg-white"
            aria-invalid={Boolean(errors.bio)}
          />
          <p className="text-xs text-stone-500">
            {formData.bio.length}/{BIO_MAX}
          </p>
          {errors.bio && (
            <p className="text-sm text-red-500" role="alert">
              {errors.bio}
            </p>
          )}
        </div>

        {errors.form && (
          <p className="text-sm text-red-500" role="alert">
            {errors.form}
          </p>
        )}
      </form>
    </section>
  );
}

export default AdminProfilePage;
