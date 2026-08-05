import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ImageIcon, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/context/AuthContext";
import { ARTICLE_STATUS } from "@/data/categories";
import {
  createAdminArticleWithUpload,
  deleteAdminArticle,
  fetchAdminArticleById,
  fetchPostLookups,
  updateAdminArticle,
} from "@/lib/adminArticles";

const INTRODUCTION_MAX = 120;

const EMPTY_FORM = {
  image: "",
  category: "",
  author: "",
  title: "",
  description: "",
  content: "",
};

function AdminArticleFormPage() {
  const { articleId } = useParams();
  const isEditMode = Boolean(articleId);
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [categories, setCategories] = useState([]); // [{ id, name }]

  const [formData, setFormData] = useState({
    ...EMPTY_FORM,
    author: user?.name || "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [errors, setErrors] = useState({});
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditMode);
  const [notFound, setNotFound] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        const lookups = await fetchPostLookups();
        if (!cancelled) {
          setCategories(
            lookups.categories.map((item) => ({
              id: String(item.id),
              name: item.name,
            })),
          );
        }
      } catch {
        if (!cancelled) {
          setCategories([]);
          toast.error("Could not load categories");
        }
      }
    }

    loadCategories();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  // โหมดแก้ไข: ดึงบทความจาก API ตาม id
  useEffect(() => {
    if (!isEditMode) {
      setFormData({
        ...EMPTY_FORM,
        author: user?.name || "",
      });
      setIsFetching(false);
      setNotFound(false);
      return;
    }

    let cancelled = false;

    async function loadArticle() {
      setIsFetching(true);
      setNotFound(false);

      const result = await fetchAdminArticleById(articleId);
      if (cancelled) return;

      if (!result.success || !result.article) {
        setNotFound(true);
        setIsFetching(false);
        return;
      }

      const article = result.article;
      // เก็บเป็น category id ถ้ามี — ไม่ก็ใช้ชื่อไปก่อน แล้ว map ทีหลังเมื่อ categories โหลดมา
      setFormData({
        image: article.image || "",
        category: article.categoryId
          ? String(article.categoryId)
          : article.category || "",
        author: article.author || user?.name || "",
        title: article.title || "",
        description: article.description || "",
        content: article.content || "",
      });
      setImageFile(null);
      setIsFetching(false);
    }

    loadArticle();

    return () => {
      cancelled = true;
    };
  }, [articleId, isEditMode, user?.name]);

  // โหมดแก้ไข: ถ้าโหลดบทความมาเป็นชื่อหมวด ให้แปลงเป็น id เมื่อรายการหมวดพร้อม
  useEffect(() => {
    if (!isEditMode || categories.length === 0 || !formData.category) return;

    const matchedById = categories.find(
      (item) => item.id === formData.category,
    );
    if (matchedById) return;

    const matchedByName = categories.find(
      (item) =>
        item.name.toLowerCase() === String(formData.category).toLowerCase(),
    );
    if (matchedByName) {
      setFormData((prev) => ({ ...prev, category: matchedByName.id }));
    }
  }, [categories, formData.category, isEditMode]);

  if (isEditMode && !isFetching && notFound) {
    return <Navigate to="/admin/articles" replace />;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleCategoryChange(value) {
    setFormData((prev) => ({ ...prev, category: value }));
    setErrors((prev) => ({ ...prev, category: undefined }));
  }

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file", {
        description: "Please upload a JPEG, PNG, GIF, or WebP image",
      });
      event.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File too large", {
        description: "Image must be 5MB or smaller",
      });
      event.target.value = "";
      return;
    }

    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }

    const previewUrl = URL.createObjectURL(file);
    setImageFile(file);
    setImagePreviewUrl(previewUrl);
    setFormData((prev) => ({ ...prev, image: previewUrl }));
    event.target.value = "";
  }

  function validateForm(status) {
    const nextErrors = {};

    if (!formData.title.trim()) {
      nextErrors.title = "Title is required";
    }

    if (!isEditMode) {
      if (!formData.category) {
        nextErrors.category = "Category is required";
      }
      if (!formData.description.trim()) {
        nextErrors.description = "Introduction is required";
      }
      if (!formData.content.trim()) {
        nextErrors.content = "Content is required";
      }
    }

    if (status === ARTICLE_STATUS.PUBLISHED) {
      if (!formData.category) {
        nextErrors.category = "Category is required";
      }
      if (!formData.author.trim()) {
        nextErrors.author = "Author name is required";
      }
      if (!formData.description.trim()) {
        nextErrors.description = "Introduction is required";
      }
      if (!formData.content.trim()) {
        nextErrors.content = "Content is required";
      }
    }

    if (formData.description.length > INTRODUCTION_MAX) {
      nextErrors.description = `Introduction must be at most ${INTRODUCTION_MAX} characters`;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function saveArticle(status) {
    if (!validateForm(status) || isLoading) {
      return;
    }

    if (isEditMode) {
      // ถ้ายังไม่เลือกไฟล์ใหม่ ต้องส่ง URL เดิมจาก server (ห้ามส่ง blob: preview)
      const imageUrl =
        imageFile || formData.image.startsWith("blob:")
          ? ""
          : formData.image;

      if (!imageFile && !imageUrl) {
        toast.error("Thumbnail required", {
          description: "Please upload a thumbnail image before saving.",
        });
        return;
      }

      setIsLoading(true);
      try {
        const result = await updateAdminArticle(articleId, {
          title: formData.title,
          category: formData.category,
          description: formData.description,
          content: formData.content,
          status,
          image: imageUrl,
          imageFile: imageFile || undefined,
        });

        if (!result.success) {
          toast.error("Could not save article", {
            description: result.error,
          });
          return;
        }

        if (status === ARTICLE_STATUS.DRAFT) {
          toast.success("Article saved as draft", {
            description: "You can publish this article later.",
          });
        } else {
          toast.success("Article published", {
            description: "Your article has been successfully published.",
          });
        }

        navigate("/admin/articles");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!imageFile) {
      toast.error("Thumbnail required", {
        description: "Please upload a thumbnail image before saving.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await createAdminArticleWithUpload({
        title: formData.title,
        category: formData.category,
        description: formData.description,
        content: formData.content,
        status,
        imageFile,
      });

      if (!result.success) {
        toast.error("Could not create article", {
          description: result.error,
        });
        return;
      }

      if (status === ARTICLE_STATUS.DRAFT) {
        toast.success("Create article and saved as draft", {
          description: "You can publish article later.",
        });
      } else {
        toast.success("Create article and published", {
          description: "Your article has been successfully published.",
        });
      }

      navigate("/admin/articles");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleConfirmDelete() {
    if (isDeleting) return;

    setIsDeleting(true);
    const result = await deleteAdminArticle(articleId);
    setIsDeleting(false);

    if (!result.success) {
      toast.error("Could not delete article", {
        description: result.error,
      });
      return;
    }

    setIsDeleteOpen(false);
    toast.success("Article deleted", {
      description: "The article has been removed successfully.",
    });
    navigate("/admin/articles");
  }

  if (isFetching) {
    return (
      <section className="px-6 py-8 md:px-10 md:py-10">
        <p className="text-sm text-stone-500">Loading article...</p>
      </section>
    );
  }

  return (
    <section className="px-6 py-8 md:px-10 md:py-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-stone-950">
          {isEditMode ? "Edit article" : "Create article"}
        </h1>
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-full border-stone-950 bg-white px-6 text-base font-medium text-stone-950 hover:bg-stone-100"
            onClick={() => saveArticle(ARTICLE_STATUS.DRAFT)}
            disabled={isLoading}
          >
            Save as draft
          </Button>
          <Button
            type="button"
            className="h-11 rounded-full bg-stone-950 px-6 text-base font-medium text-white hover:bg-stone-800"
            onClick={() => saveArticle(ARTICLE_STATUS.PUBLISHED)}
            disabled={isLoading}
          >
            {isEditMode ? "Save" : "Save and publish"}
          </Button>
        </div>
      </header>

      <form
        className="mx-auto flex max-w-3xl flex-col gap-6"
        onSubmit={(event) => event.preventDefault()}
        noValidate
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex size-40 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-stone-200">
            {formData.image ? (
              <img
                src={formData.image}
                alt="Article thumbnail preview"
                className="size-full object-cover"
              />
            ) : (
              <ImageIcon
                className="size-10 text-stone-400"
                aria-hidden="true"
              />
            )}
          </div>
          <div className="flex flex-col gap-2 pt-2">
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
              Upload thumbnail image
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="category" className="text-stone-800">
            Category
          </Label>
          <Select
            value={formData.category || undefined}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger
              id="category"
              className="h-11 w-full rounded-xl border-stone-300 bg-white px-3"
              aria-invalid={Boolean(errors.category)}
            >
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-sm text-red-500" role="alert">
              {errors.category}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="author" className="text-stone-800">
            Author name
          </Label>
          <Input
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="h-11 rounded-xl border-stone-300 bg-white"
            aria-invalid={Boolean(errors.author)}
          />
          {errors.author && (
            <p className="text-sm text-red-500" role="alert">
              {errors.author}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="title" className="text-stone-800">
            Title
          </Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Article title"
            className="h-11 rounded-xl border-stone-300 bg-white"
            aria-invalid={Boolean(errors.title)}
          />
          {errors.title && (
            <p className="text-sm text-red-500" role="alert">
              {errors.title}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="description" className="text-stone-800">
            Introduction (max {INTRODUCTION_MAX} letters)
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Introduction"
            maxLength={INTRODUCTION_MAX}
            rows={3}
            className="rounded-xl border-stone-300 bg-white"
            aria-invalid={Boolean(errors.description)}
          />
          <p className="text-xs text-stone-500">
            {formData.description.length}/{INTRODUCTION_MAX}
          </p>
          {errors.description && (
            <p className="text-sm text-red-500" role="alert">
              {errors.description}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="content" className="text-stone-800">
            Content
          </Label>
          <Textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Content"
            rows={12}
            className="rounded-xl border-stone-300 bg-white"
            aria-invalid={Boolean(errors.content)}
          />
          {errors.content && (
            <p className="text-sm text-red-500" role="alert">
              {errors.content}
            </p>
          )}
        </div>

        {isEditMode && (
          <div className="pt-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 text-sm text-stone-600 transition-colors hover:text-stone-950"
              onClick={() => setIsDeleteOpen(true)}
            >
              <Trash2 className="size-4" aria-hidden="true" />
              Delete article
            </button>
          </div>
        )}

        <p className="text-sm text-stone-500">
          <Link
            to="/admin/articles"
            className="underline underline-offset-2 hover:text-stone-800"
          >
            Back to article management
          </Link>
        </p>
      </form>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="max-w-md rounded-2xl border-stone-200 p-8 sm:max-w-md">
          <button
            type="button"
            onClick={() => setIsDeleteOpen(false)}
            className="absolute top-4 right-4 rounded-md p-1 text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-800"
            aria-label="Close dialog"
          >
            <X className="size-5" aria-hidden="true" />
          </button>

          <AlertDialogTitle className="text-center text-2xl font-bold text-stone-950">
            Delete article
          </AlertDialogTitle>
          <AlertDialogDescription className="mt-2 text-center text-base text-stone-600">
            Do you want to delete this article?
          </AlertDialogDescription>

          <AlertDialogFooter className="mt-6 border-0 bg-transparent p-0 sm:justify-center">
            <AlertDialogCancel className="h-11 rounded-full border-stone-950 bg-white px-8 text-base font-medium text-stone-950 hover:bg-stone-100">
              Cancel
            </AlertDialogCancel>
            <Button
              type="button"
              className="h-11 rounded-full bg-stone-950 px-8 text-base font-medium text-white hover:bg-stone-800"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

export default AdminArticleFormPage;
