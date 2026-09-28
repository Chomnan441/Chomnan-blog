import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { fetchNotifications } from "@/lib/notificationsApi";

function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      const result = await fetchNotifications();
      if (cancelled) return;

      if (!result.success) {
        toast.error("Could not load notifications", {
          description: result.error,
        });
        setNotifications([]);
      } else {
        setNotifications(result.notifications);
      }
      setIsLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="px-6 py-8 md:px-10 md:py-10">
      <header className="mb-8 border-b border-stone-200 pb-6">
        <h1 className="text-3xl font-bold text-stone-950">Notification</h1>
      </header>

      {isLoading ? (
        <p className="text-sm text-stone-500">Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p className="text-sm text-stone-500">No notifications yet.</p>
      ) : (
        <ul className="divide-y divide-stone-200">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className="flex flex-col gap-4 py-6 sm:flex-row sm:items-start sm:justify-between"
            >
              <article className="flex min-w-0 gap-4">
                <span className="size-12 shrink-0 overflow-hidden rounded-full bg-stone-200">
                  <img
                    src={notification.avatar}
                    alt={`${notification.name} avatar`}
                    className="size-full object-cover"
                  />
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-stone-800 md:text-base">
                    <span className="font-semibold">{notification.name}</span>{" "}
                    {notification.type === "comment"
                      ? "Commented on your article:"
                      : "liked your article:"}{" "}
                    <span className="font-medium">
                      {notification.articleTitle}
                    </span>
                  </p>
                  {notification.type === "comment" && notification.comment && (
                    <p className="mt-2 text-sm text-stone-500">
                      &ldquo;{notification.comment}&rdquo;
                    </p>
                  )}
                  <p className="mt-2 text-sm text-orange-400">
                    {notification.time}
                  </p>
                </div>
              </article>

              <Link
                to={notification.href}
                className="shrink-0 self-start text-sm font-medium text-stone-950 underline underline-offset-2 hover:text-stone-700 sm:pt-1"
              >
                View
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default AdminNotificationsPage;
