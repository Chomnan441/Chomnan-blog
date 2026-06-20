function ArticleCard({
  category,
  title,
  excerpt,
  author,
  authorAvatar,
  date,
  image,
  imageAlt,
}) {
  return (
    <article className="flex flex-col gap-4">
      <a href="#" className="block overflow-hidden rounded-2xl">
        <img
          src={image}
          alt={imageAlt}
          className="aspect-3/2 w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
        />
      </a>

      <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">
        {category}
      </span>

      <h3 className="text-xl font-bold leading-snug text-stone-950">
        <a href="#" className="transition-colors hover:text-stone-700">
          {title}
        </a>
      </h3>

      <p className="line-clamp-3 text-sm leading-relaxed text-stone-600 md:text-base">
        {excerpt}
      </p>

      <footer className="mt-auto flex items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-3">
          <img
            src={authorAvatar}
            alt={`${author} profile`}
            className="size-10 rounded-full object-cover"
          />
          <span className="text-sm font-semibold text-stone-950">{author}</span>
        </div>
        <time
          dateTime="2024-09-11"
          className="text-sm text-stone-500"
        >
          {date}
        </time>
      </footer>
    </article>
  )
}

export default ArticleCard
