import { api } from "@/lib/api";
import { DEFAULT_AVATAR } from "@/lib/auth";
import { formatBlogDate } from "@/lib/formatDate";

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

export function resolvePostAuthor(post, siteAuthor = {}) {
  const name = (post.author || siteAuthor.name || "").trim();
  const avatar = (post.author_image || siteAuthor.profilePic || "").trim();
  const bio = (post.author_bio || siteAuthor.bio || "").trim();

  return {
    name: name || "Unknown",
    avatar: avatar || DEFAULT_AVATAR,
    bio,
  };
}

export function mapPostToCard(post, siteAuthor) {
  const author = resolvePostAuthor(post, siteAuthor);

  return {
    id: post.id,
    category: post.category,
    title: post.title,
    excerpt: post.description,
    author: author.name,
    authorAvatar: author.avatar,
    date: formatBlogDate(post.date),
    dateTime: post.date,
    image: post.image,
    imageAlt: post.title,
  };
}
