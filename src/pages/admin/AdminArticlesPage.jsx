import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Pencil, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { ARTICLE_STATUS } from "@/data/categories";
import {
  deleteAdminArticle,
  fetchAdminArticles,
  fetchPostLookups,
} from "@/lib/adminArticles";
import { cn } from "@/lib/utils";

function AdminArticlesPage() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);

  const loadArticles = useCallback(
    async (targetPage = page) => {
      setIsLoading(true);
      const result = await fetchAdminArticles({
        page: targetPage,
        keyword,
        category: categoryFilter,
        status: statusFilter,
      });

      if (!result.success) {
        toast.error("Could not load articles", {
          description: result.error,
        });
        setArticles([]);
        setTotalPages(0);
        setTotalPosts(0);
        setIsLoading(false);
        return;
      }

      if (result.articles.length === 0 && targetPage > 1) {
        setPage(targetPage - 1);
        return;
      }

      setArticles(result.articles);
      setTotalPages(result.totalPages);
      setTotalPosts(result.totalPosts);
      setIsLoading(false);
    },
    [page, keyword, statusFilter, categoryFilter],
  );

  useEffect(() => {
    loadArticles(page);
  }, [page, loadArticles]);

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        const lookups = await fetchPostLookups();
        if (!cancelled) {
          setCategories(lookups.categories.map((item) => item.name));
        }
      } catch {
        if (!cancelled) setCategories([]);
      }
    }

    loadCategories();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleKeywordChange(event) {
    setKeyword(event.target.value);
    setPage(1);
  }

  function handleStatusFilterChange(value) {
    setStatusFilter(value);
    setPage(1);
  }

  function handleCategoryFilterChange(value) {
    setCategoryFilter(value);
    setPage(1);
  }

  async function handleConfirmDelete() {
    if (!articleToDelete || isDeleting) return;

    setIsDeleting(true);
    const result = await deleteAdminArticle(articleToDelete.id);
    setIsDeleting(false);

    if (!result.success) {
      toast.error("Could not delete article", {
        description: result.error,
      });
      return;
    }

    setArticleToDelete(null);
    toast.success("Article deleted", {
      description: "The article has been removed successfully.",
    });
    await loadArticles(page);
  }

  return (
    <section className="px-6 py-8 md:px-10 md:py-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-stone-950">
          Article management
        </h1>
        <Button
          className="h-11 rounded-full bg-stone-950 px-6 text-base font-medium text-white hover:bg-stone-800"
          asChild
        >
          <Link to="/admin/articles/create">+ Create article</Link>
        </Button>
      </header>

      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-stone-400"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={keyword}
            onChange={handleKeywordChange}
            placeholder="Search..."
            aria-label="Search articles"
            className="h-11 rounded-lg border-stone-200 bg-white pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger
              className="h-11 min-w-36 rounded-lg border-stone-200 bg-white px-3"
              aria-label="Filter by status"
            >
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Status</SelectItem>
              <SelectItem value={ARTICLE_STATUS.DRAFT}>Draft</SelectItem>
              <SelectItem value={ARTICLE_STATUS.PUBLISHED}>
                Published
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={categoryFilter}
            onValueChange={handleCategoryFilterChange}
          >
            <SelectTrigger
              className="h-11 min-w-36 rounded-lg border-stone-200 bg-white px-3"
              aria-label="Filter by category"
            >
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Category</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-stone-200">
        <table className="w-full min-w-[40rem] border-collapse text-left">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50 text-sm text-stone-500">
              <th className="px-4 py-3 font-medium">Article title</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-sm text-stone-500"
                >
                  Loading articles...
                </td>
              </tr>
            ) : articles.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-sm text-stone-500"
                >
                  No articles found.
                </td>
              </tr>
            ) : (
              articles.map((article) => {
                const isPublished =
                  article.status === ARTICLE_STATUS.PUBLISHED;

                return (
                  <tr
                    key={article.id}
                    className="border-b border-stone-100 last:border-b-0"
                  >
                    <td className="max-w-md px-4 py-4 text-sm font-medium text-stone-900">
                      <span className="line-clamp-2">{article.title}</span>
                    </td>
                    <td className="px-4 py-4 text-sm text-stone-600">
                      {article.category}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5",
                          isPublished ? "text-emerald-600" : "text-stone-500",
                        )}
                      >
                        <span
                          className={cn(
                            "size-1.5 rounded-full",
                            isPublished ? "bg-emerald-500" : "bg-stone-400",
                          )}
                          aria-hidden="true"
                        />
                        {isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          className="rounded-md p-2 text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-800"
                          aria-label={`Edit ${article.title}`}
                          onClick={() =>
                            navigate(`/admin/articles/${article.id}/edit`)
                          }
                        >
                          <Pencil className="size-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="rounded-md p-2 text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-800"
                          aria-label={`Delete ${article.title}`}
                          onClick={() => setArticleToDelete(article)}
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && totalPages > 1 && (
        <nav
          className="mt-6 flex flex-wrap items-center justify-between gap-4"
          aria-label="Article list pagination"
        >
          <p className="text-sm text-stone-500">
            Page {page} of {totalPages}
            {totalPosts > 0 ? ` (${totalPosts} articles)` : ""}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-lg border-stone-200 px-4"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-lg border-stone-200 px-4"
              disabled={page >= totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </Button>
          </div>
        </nav>
      )}

      <AlertDialog
        open={Boolean(articleToDelete)}
        onOpenChange={(open) => {
          if (!open) setArticleToDelete(null);
        }}
      >
        <AlertDialogContent className="max-w-md rounded-2xl border-stone-200 p-8 sm:max-w-md">
          <button
            type="button"
            onClick={() => setArticleToDelete(null)}
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

export default AdminArticlesPage;
