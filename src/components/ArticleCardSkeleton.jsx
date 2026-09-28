// ArticleCardSkeleton = placeholder ขณะโหลดบทความ
// จัดโครงสร้างและความสูงให้ใกล้เคียง ArticleCard เพื่อลด layout shift ตอนเปลี่ยนหมวดหมู่
function ArticleCardSkeleton() {
  return (
    <article
      className="flex flex-col gap-4"
      aria-hidden="true"
    >
      <div className="aspect-3/2 w-full animate-pulse rounded-2xl bg-stone-200" />

      <div className="h-7 w-20 animate-pulse rounded-full bg-stone-200" />

      <div className="space-y-2">
        <div className="h-6 w-full animate-pulse rounded-md bg-stone-200" />
        <div className="h-6 w-4/5 animate-pulse rounded-md bg-stone-200" />
      </div>

      <div className="space-y-2">
        <div className="h-4 w-full animate-pulse rounded-md bg-stone-100" />
        <div className="h-4 w-full animate-pulse rounded-md bg-stone-100" />
        <div className="h-4 w-3/4 animate-pulse rounded-md bg-stone-100" />
      </div>

      <footer className="mt-auto flex items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-3">
          <div className="size-10 animate-pulse rounded-full bg-stone-200" />
          <div className="h-4 w-24 animate-pulse rounded-md bg-stone-200" />
        </div>
        <div className="h-4 w-28 animate-pulse rounded-md bg-stone-100" />
      </footer>
    </article>
  );
}

export default ArticleCardSkeleton;
