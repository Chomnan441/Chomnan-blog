import { api } from "@/lib/api";
import { DEFAULT_AVATAR } from "@/lib/auth";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { formatCommentDate } from "@/lib/formatDate";

function formatRelativeTime(isoDate) {
  if (!isoDate) return "";

  const diffMs = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diffMs / 60000);

  if (Number.isNaN(minutes) || minutes < 0) {
    return formatCommentDate(isoDate);
  }
  if (minutes < 1) return "Just now";
  if (minutes === 1) return "1 minute ago";
  if (minutes < 60) return `${minutes} minutes ago`;

  const hours = Math.floor(minutes / 60);
  if (hours === 1) return "1 hour ago";
  if (hours < 24) return `${hours} hours ago`;

  return formatCommentDate(isoDate);
}

function mapNotification(row) {
  const type = row.type || "comment";
  const name = row.actor_name || "Someone";
  const articleTitle = row.article_title || "an article";

  let message;
  if (type === "like") {
    message = "liked your article.";
  } else if (type === "comment") {
    message = "commented on your article.";
  } else {
    message = row.message || "sent a notification.";
  }

  return {
    id: row.id,
    type,
    name,
    message,
    articleTitle,
    comment: row.comment_text || row.message || "",
    time: formatRelativeTime(row.created_at),
    createdAt: row.created_at,
    avatar: row.actor_avatar || DEFAULT_AVATAR,
    href: row.post_id ? `/post/${row.post_id}` : "/",
    isRead: Boolean(row.is_read),
  };
}

export async function fetchNotifications() {
  try {
    const { data } = await api.get("/notifications");
    const rows = Array.isArray(data?.notifications) ? data.notifications : [];
    return {
      success: true,
      notifications: rows.map(mapNotification),
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to load notifications"),
      notifications: [],
    };
  }
}

export async function markAllNotificationsRead() {
  try {
    await api.put("/notifications/read-all");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to mark notifications as read"),
    };
  }
}
