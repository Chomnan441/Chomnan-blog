const CATEGORIES_KEY = "chomnan_blog_admin_categories";

const SEED_CATEGORIES = [
  {
    id: "category-1",
    name: "Cat",
    createdAt: "2024-09-01T10:00:00.000Z",
    updatedAt: "2024-09-01T10:00:00.000Z",
  },
  {
    id: "category-2",
    name: "General",
    createdAt: "2024-09-01T10:00:00.000Z",
    updatedAt: "2024-09-01T10:00:00.000Z",
  },
  {
    id: "category-3",
    name: "Inspiration",
    createdAt: "2024-09-01T10:00:00.000Z",
    updatedAt: "2024-09-01T10:00:00.000Z",
  },
];

function readCategories() {
  const stored = localStorage.getItem(CATEGORIES_KEY);
  if (!stored) {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(SEED_CATEGORIES));
    return [...SEED_CATEGORIES];
  }

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [...SEED_CATEGORIES];
  } catch {
    return [...SEED_CATEGORIES];
  }
}

function writeCategories(categories) {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}

export function getAdminCategories() {
  return readCategories().sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
  );
}

export function getCategoryNames() {
  return getAdminCategories().map((category) => category.name);
}

export function getAdminCategoryById(categoryId) {
  return readCategories().find((category) => category.id === categoryId) || null;
}

export function createAdminCategory({ name }) {
  const trimmedName = name.trim();
  if (!trimmedName) {
    return { success: false, error: "Category name is required" };
  }

  const categories = readCategories();
  const nameTaken = categories.some(
    (category) => category.name.toLowerCase() === trimmedName.toLowerCase(),
  );

  if (nameTaken) {
    return { success: false, error: "Category name already exists" };
  }

  const now = new Date().toISOString();
  const newCategory = {
    id: crypto.randomUUID(),
    name: trimmedName,
    createdAt: now,
    updatedAt: now,
  };

  categories.push(newCategory);
  writeCategories(categories);
  return { success: true, category: newCategory };
}

export function updateAdminCategory(categoryId, { name }) {
  const trimmedName = name.trim();
  if (!trimmedName) {
    return { success: false, error: "Category name is required" };
  }

  const categories = readCategories();
  const index = categories.findIndex((category) => category.id === categoryId);

  if (index === -1) {
    return { success: false, error: "Category not found" };
  }

  const nameTaken = categories.some(
    (category) =>
      category.id !== categoryId &&
      category.name.toLowerCase() === trimmedName.toLowerCase(),
  );

  if (nameTaken) {
    return { success: false, error: "Category name already exists" };
  }

  const previousName = categories[index].name;
  categories[index] = {
    ...categories[index],
    name: trimmedName,
    updatedAt: new Date().toISOString(),
  };

  writeCategories(categories);
  return { success: true, category: categories[index], previousName };
}

export function deleteAdminCategory(categoryId) {
  const categories = readCategories();
  const next = categories.filter((category) => category.id !== categoryId);

  if (next.length === categories.length) {
    return { success: false, error: "Category not found" };
  }

  writeCategories(next);
  return { success: true };
}

export function filterAdminCategories(categories, keyword = "") {
  const normalizedKeyword = keyword.trim().toLowerCase();
  if (!normalizedKeyword) {
    return categories;
  }

  return categories.filter((category) =>
    category.name.toLowerCase().includes(normalizedKeyword),
  );
}
