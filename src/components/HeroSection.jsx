const HERO_IMAGE_URL =
  'https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg'

function HeroSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-20">
        <div className="flex flex-col gap-6 text-center lg:text-left">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
            Stay Informed,
            <br />
            Stay Inspired
          </h1>

          <p className="text-base leading-relaxed text-gray-600 md:text-lg">
            Discover a World of Knowledge at Your Fingertips. Your Daily Dose
            of Inspiration and Information.
          </p>

          <div>
            <a
              href="#"
              className="inline-block rounded-full bg-gray-900 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
            >
              Read My Blog
            </a>
          </div>
        </div>

        <figure className="mx-auto w-full max-w-md lg:max-w-none">
          <img
            src={HERO_IMAGE_URL}
            alt="A man with a cat on his shoulder standing in a snowy forest with autumn leaves"
            className="aspect-3/4 w-full rounded-2xl object-cover shadow-lg"
          />
        </figure>
      </div>
    </section>
  )
}

export default HeroSection
