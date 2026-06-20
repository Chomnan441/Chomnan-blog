import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import ArticleCard from '@/components/ArticleCard'
import { ARTICLES } from '@/data/articles'

const CATEGORIES = [
  { value: 'highlight', label: 'Highlight' },
  { value: 'cat', label: 'Cat' },
  { value: 'inspiration', label: 'Inspiration' },
  { value: 'general', label: 'General' },
]

function ArticleSection() {
  return (
    <section className="bg-blog-page px-4 pb-12 md:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl rounded-3xl bg-white px-5 py-8 md:px-8 md:py-10">
        <h2 className="text-2xl font-bold text-stone-950 md:text-3xl">
          Latest articles
        </h2>

        <div className="mt-6 flex flex-col gap-6 md:hidden">
          <div className="relative w-full">
            <Input
              type="search"
              placeholder="Search"
              readOnly
              aria-label="Search articles"
              className="h-12 w-full rounded-xl border-stone-200 bg-white pr-11 text-base text-stone-950 placeholder:text-stone-400"
            />
            <Search
              className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-stone-400"
              aria-hidden="true"
            />
          </div>

          <div className="flex w-full flex-col gap-1">
            <Label
              htmlFor="article-category"
              className="text-sm font-medium text-stone-500"
            >
              Category
            </Label>
            <Select defaultValue="highlight">
              <SelectTrigger
                id="article-category"
                className="h-12 w-full min-w-0 rounded-xl border-stone-200 bg-white px-4 text-base text-stone-950 data-[size=default]:h-12 [&_svg]:size-5 [&_svg]:text-stone-400"
              >
                <SelectValue placeholder="Highlight" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6 hidden items-center justify-between gap-6 rounded-2xl bg-stone-100 p-3 md:flex">
          <ul className="flex flex-wrap items-center gap-2" aria-label="Article categories">
            {CATEGORIES.map((category, index) => (
              <li key={category.value}>
                <button
                  type="button"
                  className={
                    index === 0
                      ? 'rounded-full bg-stone-800 px-4 py-2 text-sm font-medium text-white'
                      : 'rounded-full px-4 py-2 text-sm font-medium text-stone-500'
                  }
                >
                  {category.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="relative w-full max-w-xs shrink-0">
            <Input
              type="search"
              placeholder="Search"
              readOnly
              aria-label="Search articles"
              className="h-11 rounded-xl border-stone-200 bg-white pr-11 text-sm text-stone-950 placeholder:text-stone-400"
            />
            <Search
              className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-stone-400"
              aria-hidden="true"
            />
          </div>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-x-8 md:gap-y-12">
          {ARTICLES.map((article) => (
            <li key={article.id}>
              <ArticleCard {...article} />
            </li>
          ))}
        </ul>

        <div className="mt-12 flex justify-center md:mt-16">
          <a
            href="#"
            className="text-base font-medium text-stone-800 underline underline-offset-4 transition-colors hover:text-stone-600"
          >
            View more
          </a>
        </div>
      </div>
    </section>
  )
}

export default ArticleSection
