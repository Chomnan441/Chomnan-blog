import { api } from "@/lib/api";

export async function fetchPublicPosts({
  page,
  limit,
  category,
  keyword,
  signal,
}) {
  const params = { page, limit };
  if (category) params.category = category;
  if (keyword) params.keyword = keyword;

  const { data } = await api.get("/posts", {
    params,
    signal,
    skipAuth: true,
  });
  return data;
}
