import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createAdminCategory,
  getAdminCategoryById,
  updateAdminCategory,
} from "@/lib/adminCategories";
import { renameArticleCategory } from "@/lib/adminArticles";

function AdminCategoryFormPage() {
  const { categoryId } = useParams();
  const isEditMode = Boolean(categoryId);
  const navigate = useNavigate();

  const existingCategory = useMemo(
    () => (isEditMode ? getAdminCategoryById(categoryId) : null),
    [isEditMode, categoryId],
  );

  const [name, setName] = useState(() => existingCategory?.name || "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditMode) {
      setName("");
      return;
    }

    const category = getAdminCategoryById(categoryId);
    if (category) {
      setName(category.name);
    }
  }, [categoryId, isEditMode]);

  if (isEditMode && !existingCategory) {
    return <Navigate to="/admin/categories" replace />;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

    if (isEditMode) {
      const result = updateAdminCategory(categoryId, { name });
      if (!result.success) {
        setError(result.error);
        toast.error("Could not update category", {
          description: result.error,
        });
        return;
      }

      if (result.previousName !== result.category.name) {
        renameArticleCategory(result.previousName, result.category.name);
      }

      toast.success("Category updated", {
        description: "Category has been successfully updated.",
      });
    } else {
      const result = createAdminCategory({ name });
      if (!result.success) {
        setError(result.error);
        toast.error("Could not create category", {
          description: result.error,
        });
        return;
      }

      toast.success("Create category", {
        description: "Category has been successfully created.",
      });
    }

    navigate("/admin/categories");
  }

  return (
    <section className="px-6 py-8 md:px-10 md:py-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <h1 className="text-3xl font-bold text-stone-950">
          {isEditMode ? "Edit category" : "Create category"}
        </h1>
        <Button
          type="submit"
          form="category-form"
          className="h-11 rounded-full bg-stone-950 px-8 text-base font-medium text-white hover:bg-stone-800"
        >
          Save
        </Button>
      </header>

      <form
        id="category-form"
        onSubmit={handleSubmit}
        noValidate
        className="mx-auto flex max-w-xl flex-col gap-6"
      >
        <h2 className="text-2xl font-bold text-stone-950">
          {isEditMode ? "Edit category" : "Create category"}
        </h2>

        <div className="flex flex-col gap-2">
          <Label htmlFor="category-name" className="text-stone-800">
            Category name
          </Label>
          <Input
            id="category-name"
            name="name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setError("");
            }}
            placeholder="Category name"
            className="h-11 rounded-xl border-stone-300 bg-white"
            aria-invalid={Boolean(error)}
          />
          {error && (
            <p className="text-sm text-red-500" role="alert">
              {error}
            </p>
          )}
        </div>

        <p className="text-sm text-stone-500">
          <Link
            to="/admin/categories"
            className="underline underline-offset-2 hover:text-stone-800"
          >
            Back to category management
          </Link>
        </p>
      </form>
    </section>
  );
}

export default AdminCategoryFormPage;
