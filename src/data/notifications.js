export const MOCK_NOTIFICATIONS = [
  {
    id: "notif-1",
    name: "Thompson P.",
    message: "Published new article.",
    time: "2 hours ago",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face",
  },
  {
    id: "notif-2",
    name: "Jacob Lash",
    message: "Comment on the article you have commented on.",
    time: "12 September 2024 at 18:30",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=face",
  },
];

export const ADMIN_MOCK_NOTIFICATIONS = [
  {
    id: "admin-notif-1",
    name: "Jacob Lash",
    type: "comment",
    articleTitle: "The Secret Language of Cats: Decoding Feline Communication",
    comment:
      "I loved this article! It really explains why my cat is so independent yet loving. The purring section was super interesting.",
    time: "4 hours ago",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=face",
    href: "/post/article-2",
  },
  {
    id: "admin-notif-2",
    name: "Jacob Lash",
    type: "like",
    articleTitle: "The Secret Language of Cats: Decoding Feline Communication",
    time: "4 hours ago",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=face",
    href: "/post/article-2",
  },
];
