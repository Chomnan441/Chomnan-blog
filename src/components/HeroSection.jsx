const HERO_IMAGE_URL =
  'https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg'

const AUTHOR = {
  label: 'Author',
  name: 'Thompson P.',
  bio: 'I am a pet enthusiast and freelance writer who specializes in animal behavior and care. With a deep love for cats, I enjoy sharing insights on feline companionship and wellness. When I\'m not writing, I spends time volunteering at my local animal shelter, helping cats find loving homes.',
}

function HeroSection() {
  return (
    <section className="bg-blog-page">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 md:px-8 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:gap-12 lg:px-16 lg:py-16">
        <div className="flex flex-col gap-6 lg:max-w-md">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-stone-950 md:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
            Stay Informed,
            <br />
            Stay Inspired
          </h1>

          <p className="text-base leading-relaxed text-stone-600 md:text-lg">
            Discover a World of Knowledge at Your Fingertips. Your Daily Dose
            of Inspiration and Information.
          </p>

          <div>
            <a
              href="#"
              className="inline-flex h-12 items-center justify-center rounded-full bg-stone-950 px-8 text-sm font-semibold text-white transition-colors hover:bg-stone-800"
            >
              Read My Blog
            </a>
          </div>
        </div>

        <figure className="mx-auto w-full max-w-xs lg:max-w-sm">
          <img
            src={HERO_IMAGE_URL}
            alt="A man with a cat on his shoulder standing in a snowy forest with autumn leaves"
            className="aspect-3/4 w-full rounded-2xl object-cover"
          />
        </figure>

        <aside className="flex flex-col gap-3 lg:max-w-sm lg:justify-self-end">
          <p className="text-sm font-medium text-stone-500">- {AUTHOR.label}</p>
          <h2 className="text-2xl font-bold text-stone-950">{AUTHOR.name}</h2>
          <p className="text-sm leading-relaxed text-stone-600 md:text-base">
            {AUTHOR.bio}
          </p>
        </aside>
      </div>
    </section>
  )
}

export default HeroSection
