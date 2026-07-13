import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Pencil, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  deleteAdminCategory,
  filterAdminCategories,
  getAdminCategories,
} from "@/lib/adminCategories";

function AdminCategoriesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(() => getAdminCategories());
  const [keyword, setKeyword] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const filteredCategories = useMemo(
    () => filterAdminCategories(categories, keyword),
    [categories, keyword],
  );

  function handleConfirmDelete() {
    if (!categoryToDelete) return;

    const result = deleteAdminCategory(categoryToDelete.id);
    if (!result.success) {
      toast.error("Could not delete category", {
        description: result.error,
      });
      return;
    }

    setCategories(getAdminCategories());
    setCategoryToDelete(null);
    toast.success("Category deleted", {
      description: "The category has been removed successfully.",
    });
  }

  return (
    <section className="px-6 py-8 md:px-10 md:py-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-stone-950">
          Category management
        </h1>
        <Button
          className="h-11 rounded-full bg-stone-950 px-6 text-base font-medium text-white hover:bg-stone-800"
          asChild
        >
          <Link to="/admin/categories/create">+ Create category</Link>
        </Button>
      </header>

      <div className="relative mb-6 max-w-xl">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-stone-400"
          aria-hidden="true"
        />
        <Input
          type="search"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Search..."
          aria-label="Search categories"
          className="h-11 rounded-lg border-stone-200 bg-white pl-10"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-stone-200">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50 text-sm text-stone-500">
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.length === 0 ? (
              <tr>
                <td
                  colSpan={2}
                  className="px-4 py-10 text-center text-sm text-stone-500"
                >
                  No categories found.
                </td>
              </tr>
            ) : (
              filteredCategories.map((category) => (
                <tr
                  key={category.id}
                  className="border-b border-stone-100 transition-colors last:border-b-0 hover:bg-stone-50"
                >
                  <td className="px-4 py-4 text-sm font-medium text-stone-900">
                    {category.name}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        className="rounded-md p-2 text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-800"
                        aria-label={`Edit ${category.name}`}
                        onClick={() =>
                          navigate(`/admin/categories/${category.id}/edit`)
                        }
                      >
                        <Pencil className="size-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className="rounded-md p-2 text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-800"
                        aria-label={`Delete ${category.name}`}
                        onClick={() => setCategoryToDelete(category)}
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AlertDialog
        open={Boolean(categoryToDelete)}
        onOpenChange={(open) => {
          if (!open) setCategoryToDelete(null);
        }}
      >
        <AlertDialogContent className="max-w-md rounded-2xl border-stone-200 p-8 sm:max-w-md">
          <button
            type="button"
            onClick={() => setCategoryToDelete(null)}
            className="absolute top-4 right-4 rounded-md p-1 text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-800"
            aria-label="Close dialog"
          >
            <X className="size-5" aria-hidden="true" />
          </button>

          <AlertDialogTitle className="text-center text-2xl font-bold text-stone-950">
            Delete category
          </AlertDialogTitle>
          <AlertDialogDescription className="mt-2 text-center text-base text-stone-600">
            Do you want to delete this category?
          </AlertDialogDescription>

          <AlertDialogFooter className="mt-6 border-0 bg-transparent p-0 sm:justify-center">
            <AlertDialogCancel className="h-11 rounded-full border-stone-950 bg-white px-8 text-base font-medium text-stone-950 hover:bg-stone-100">
              Cancel
            </AlertDialogCancel>
            <Button
              type="button"
              className="h-11 rounded-full bg-stone-950 px-8 text-base font-medium text-white hover:bg-stone-800"
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

export default AdminCategoriesPage;
