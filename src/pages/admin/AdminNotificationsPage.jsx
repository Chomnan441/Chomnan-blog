import { Link } from "react-router-dom";
import { ADMIN_MOCK_NOTIFICATIONS } from "@/data/notifications";

function AdminNotificationsPage() {
  return (
    <section className="px-6 py-8 md:px-10 md:py-10">
      <header className="mb-8 border-b border-stone-200 pb-6">
        <h1 className="text-3xl font-bold text-stone-950">Notification</h1>
      </header>

      <ul className="divide-y divide-stone-200">
        {ADMIN_MOCK_NOTIFICATIONS.map((notification) => (
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
                {notification.comment && (
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
    </section>
  );
}

export default AdminNotificationsPage;
