import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { DEFAULT_AVATAR } from "@/lib/auth";
import { resizeImageFile } from "@/lib/resizeImage";
import {
  fetchSiteSettings,
  updateSiteSettings,
} from "@/lib/siteSettingsApi";

const BIO_MAX = 120;

const DEFAULT_HERO_IMAGE = "https://i.ibb.co/Z1wqS9vj/Profile.jpg";
const DEFAULT_HERO_HOVER = "https://i.ibb.co/W48T8Vpw/Profile-Hover.png";

function AdminProfilePage() {
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef(null);
  const heroImageInputRef = useRef(null);
  const heroHoverInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    avatar: user?.avatar || DEFAULT_AVATAR,
    bio: user?.bio || "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [errors, setErrors] = useState({});

  // รูป Hero จาก site_settings (ไม่ใช่โปรไฟล์)
  const [heroImageUrl, setHeroImageUrl] = useState(null);
  const [heroHoverUrl, setHeroHoverUrl] = useState(null);
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [heroHoverFile, setHeroHoverFile] = useState(null);
  const [heroImagePreview, setHeroImagePreview] = useState("");
  const [heroHoverPreview, setHeroHoverPreview] = useState("");
  const [clearHeroImage, setClearHeroImage] = useState(false);
  const [clearHeroHover, setClearHeroHover] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  useEffect(() => {
    let cancelled = false;

    async function loadHeroSettings() {
      try {
        const settings = await fetchSiteSettings();
        if (cancelled) return;
        setHeroImageUrl(settings.heroImage);
        setHeroHoverUrl(settings.heroImageHover);
      } catch {
        if (cancelled) return;
        toast.error("Could not load hero images");
      }
    }

    loadHeroSettings();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      if (heroImagePreview) URL.revokeObjectURL(heroImagePreview);
      if (heroHoverPreview) URL.revokeObjectURL(heroHoverPreview);
    };
  }, [avatarPreview, heroImagePreview, heroHoverPreview]);

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

  function pickHeroFile(event, kind) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file", {
        description: "Please upload an image file",
      });
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    if (kind === "hero") {
      if (heroImagePreview) URL.revokeObjectURL(heroImagePreview);
      setHeroImageFile(file);
      setHeroImagePreview(previewUrl);
      setClearHeroImage(false);
    } else {
      if (heroHoverPreview) URL.revokeObjectURL(heroHoverPreview);
      setHeroHoverFile(file);
      setHeroHoverPreview(previewUrl);
      setClearHeroHover(false);
    }
  }

  function resetHeroToDefault(kind) {
    if (kind === "hero") {
      if (heroImagePreview) URL.revokeObjectURL(heroImagePreview);
      setHeroImageFile(null);
      setHeroImagePreview("");
      setClearHeroImage(true);
    } else {
      if (heroHoverPreview) URL.revokeObjectURL(heroHoverPreview);
      setHeroHoverFile(null);
      setHeroHoverPreview("");
      setClearHeroHover(true);
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
    if (formData.bio.length > BIO_MAX) {
      nextErrors.bio = `Bio must be at most ${BIO_MAX} characters`;
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSaving(true);

    const profileResult = await updateProfile({
      name: formData.name,
      username: formData.username,
      bio: formData.bio,
      avatarFile,
    });

    if (!profileResult.success) {
      setIsSaving(false);
      setErrors({ form: profileResult.error });
      toast.error("Could not save profile", {
        description: profileResult.error,
      });
      return;
    }

    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(null);
    setAvatarPreview("");

    const heroChanged =
      heroImageFile ||
      heroHoverFile ||
      clearHeroImage ||
      clearHeroHover;

    if (heroChanged) {
      const settingsResult = await updateSiteSettings({
        heroImageFile,
        heroImageHoverFile: heroHoverFile,
        clearHeroImage,
        clearHeroImageHover: clearHeroHover,
      });

      if (!settingsResult.success) {
        setIsSaving(false);
        setErrors({ form: settingsResult.error });
        toast.error("Profile saved, but hero images failed", {
          description: settingsResult.error,
        });
        return;
      }

      setHeroImageUrl(settingsResult.heroImage);
      setHeroHoverUrl(settingsResult.heroImageHover);
      if (heroImagePreview) URL.revokeObjectURL(heroImagePreview);
      if (heroHoverPreview) URL.revokeObjectURL(heroHoverPreview);
      setHeroImageFile(null);
      setHeroHoverFile(null);
      setHeroImagePreview("");
      setHeroHoverPreview("");
      setClearHeroImage(false);
      setClearHeroHover(false);
    }

    setIsSaving(false);
    setErrors({});
    toast.success("Saved profile", {
      description: "Your profile has been successfully updated",
    });
  }

  const previewAvatar =
    avatarPreview || formData.avatar || DEFAULT_AVATAR;
  const displayHeroImage =
    heroImagePreview ||
    (!clearHeroImage && heroImageUrl) ||
    DEFAULT_HERO_IMAGE;
  const displayHeroHover =
    heroHoverPreview ||
    (!clearHeroHover && heroHoverUrl) ||
    DEFAULT_HERO_HOVER;

  return (
    <section className="px-6 py-8 md:px-10 md:py-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <h1 className="text-3xl font-bold text-stone-950">Profile</h1>
        <Button
          type="submit"
          form="admin-profile-form"
          disabled={isSaving}
          className="h-11 rounded-full bg-stone-950 px-8 text-base font-medium text-white hover:bg-stone-800"
        >
          {isSaving ? "Saving…" : "Save"}
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

        <div className="flex flex-col gap-3 border-t border-stone-200 pt-6">
          <h2 className="text-lg font-semibold text-stone-950">Hero images</h2>
          <p className="text-sm text-stone-500">
            Used on the homepage hero. If empty, the site default images are
            shown.
          </p>

          <div className="flex flex-col gap-2">
            <Label className="text-stone-600">Hero image</Label>
            <img
              src={displayHeroImage}
              alt="Hero image preview"
              className="aspect-3/4 w-40 rounded-2xl object-cover shadow-md"
            />
            <input
              ref={heroImageInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => pickHeroFile(event, "hero")}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-full border-stone-950 bg-white px-4 text-sm font-medium text-stone-950 hover:bg-stone-100"
                onClick={() => heroImageInputRef.current?.click()}
              >
                Upload hero image
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="h-10 rounded-full px-4 text-sm text-stone-600"
                onClick={() => resetHeroToDefault("hero")}
              >
                Use default
              </Button>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <Label className="text-stone-600">Hero image (hover)</Label>
            <img
              src={displayHeroHover}
              alt="Hero hover image preview"
              className="aspect-3/4 w-40 rounded-2xl object-cover shadow-md"
            />
            <input
              ref={heroHoverInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => pickHeroFile(event, "hover")}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-full border-stone-950 bg-white px-4 text-sm font-medium text-stone-950 hover:bg-stone-100"
                onClick={() => heroHoverInputRef.current?.click()}
              >
                Upload hover image
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="h-10 rounded-full px-4 text-sm text-stone-600"
                onClick={() => resetHeroToDefault("hover")}
              >
                Use default
              </Button>
            </div>
          </div>
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
