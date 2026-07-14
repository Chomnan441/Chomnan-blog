import { ARTICLE_STATUS } from "@/data/categories";
import { getCategoryNames } from "@/lib/adminCategories";

const ARTICLES_KEY = "chomnan_blog_admin_articles";

function getDefaultCategory() {
  return getCategoryNames()[0] || "General";
}

const SEED_ARTICLES = [
  {
    id: "article-1",
    title:
      "Understanding Cat Behavior: Why Your Feline Friend Acts the Way They Do",
    category: "Cat",
    status: ARTICLE_STATUS.PUBLISHED,
    image:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&h=533&q=80",
    author: "Thompson P.",
    description:
      "Dive into the curious world of cat behavior, exploring why cats knead, purr, and chase imaginary prey.",
    content:
      "## Independent Yet Affectionate\n\nCats balance independence with deep bonds to their humans.\n\n## Playful Personalities\n\nDaily play keeps cats healthy and emotionally fulfilled.",
    createdAt: "2024-09-11T10:00:00.000Z",
    updatedAt: "2024-09-11T10:00:00.000Z",
  },
  {
    id: "article-2",
    title: "The Secret Language of Cats: Decoding Feline Communication",
    category: "Cat",
    status: ARTICLE_STATUS.PUBLISHED,
    image:
      "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=800&h=533&q=80",
    author: "Thompson P.",
    description:
      "Learn how cats communicate through body language, vocal cues, and subtle everyday signals.",
    content:
      "## Reading the Signs\n\nCats speak through posture, tail movement, and quiet sounds that often go unnoticed.\n\n## Building Trust\n\nUnderstanding feline communication helps deepen the bond between cats and their people.",
    createdAt: "2024-09-10T10:00:00.000Z",
    updatedAt: "2024-09-10T10:00:00.000Z",
  },
  {
    id: "article-3",
    title: "Finding Motivation: What Cats Can Teach Us About Focus",
    category: "Inspiration",
    status: ARTICLE_STATUS.DRAFT,
    image:
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&h=533&q=80",
    author: "Thompson P.",
    description:
      "A gentle look at how observing pets can renew motivation and creative energy.",
    content:
      "## Start Small\n\nLike a cat stalking prey, focus on one clear target at a time.",
    createdAt: "2024-09-09T10:00:00.000Z",
    updatedAt: "2024-09-09T10:00:00.000Z",
  },
  {
    id: "article-4",
    title: "Unlocking Creativity: How Pets Spark Fresh Ideas for Writers",
    category: "General",
    status: ARTICLE_STATUS.PUBLISHED,
    image:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&h=533&q=80",
    author: "Thompson P.",
    description:
      "Discover how daily moments with animals can unlock new stories and characters.",
    content:
      "## Muse Moments\n\nPets offer quiet company that often unlocks unexpected ideas.",
    createdAt: "2024-09-08T10:00:00.000Z",
    updatedAt: "2024-09-08T10:00:00.000Z",
  },
];

function readArticles() {
  const stored = localStorage.getItem(ARTICLES_KEY);
  if (!stored) {
    localStorage.setItem(ARTICLES_KEY, JSON.stringify(SEED_ARTICLES));
    return [...SEED_ARTICLES];
  }

  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      return [...SEED_ARTICLES];
    }

    // Keep seed article-2 title in sync for existing local data
    let changed = false;
    const nextTitle =
      "The Secret Language of Cats: Decoding Feline Communication";
    const articles = parsed.map((article) => {
      if (article.id !== "article-2" || article.title === nextTitle) {
        return article;
      }

      changed = true;
      return {
        ...article,
        title: nextTitle,
      };
    });

    if (changed) {
      writeArticles(articles);
    }
    return articles;
  } catch {
    return [...SEED_ARTICLES];
  }
}

function writeArticles(articles) {
  localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
}

export function getAdminArticles() {
  return readArticles().sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
  );
}

export function getAdminArticleById(articleId) {
  return readArticles().find((article) => article.id === articleId) || null;
}

export function createAdminArticle(articleData) {
  const articles = readArticles();
  const now = new Date().toISOString();
  const newArticle = {
    id: crypto.randomUUID(),
    title: articleData.title.trim(),
    category: articleData.category || getDefaultCategory(),
    status: articleData.status,
    image: articleData.image || "",
    author: articleData.author.trim(),
    description: articleData.description.trim(),
    content: articleData.content.trim(),
    createdAt: now,
    updatedAt: now,
  };

  articles.unshift(newArticle);
  writeArticles(articles);
  return newArticle;
}

export function updateAdminArticle(articleId, articleData) {
  const articles = readArticles();
  const index = articles.findIndex((article) => article.id === articleId);

  if (index === -1) {
    return { success: false, error: "Article not found" };
  }

  articles[index] = {
    ...articles[index],
    title: articleData.title.trim(),
    category: articleData.category || getDefaultCategory(),
    status: articleData.status,
    image: articleData.image || "",
    author: articleData.author.trim(),
    description: articleData.description.trim(),
    content: articleData.content.trim(),
    updatedAt: new Date().toISOString(),
  };

  writeArticles(articles);
  return { success: true, article: articles[index] };
}

export function deleteAdminArticle(articleId) {
  const articles = readArticles();
  const next = articles.filter((article) => article.id !== articleId);

  if (next.length === articles.length) {
    return { success: false, error: "Article not found" };
  }

  writeArticles(next);
  return { success: true };
}

export function renameArticleCategory(previousName, nextName) {
  const articles = readArticles();
  let changed = false;

  const updated = articles.map((article) => {
    if (article.category !== previousName) {
      return article;
    }

    changed = true;
    return {
      ...article,
      category: nextName,
      updatedAt: new Date().toISOString(),
    };
  });

  if (changed) {
    writeArticles(updated);
  }
}

export function filterAdminArticles(
  articles,
  { keyword = "", status = "all", category = "all" } = {},
) {
  const normalizedKeyword = keyword.trim().toLowerCase();

  return articles.filter((article) => {
    const matchesKeyword =
      !normalizedKeyword ||
      article.title.toLowerCase().includes(normalizedKeyword) ||
      article.description.toLowerCase().includes(normalizedKeyword);

    const matchesStatus = status === "all" || article.status === status;
    const matchesCategory =
      category === "all" || article.category === category;

    return matchesKeyword && matchesStatus && matchesCategory;
  });
}
