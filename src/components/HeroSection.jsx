import { useEffect, useState } from "react";
import { fetchSiteAuthor } from "@/lib/authApi";
import { fetchSiteSettings } from "@/lib/siteSettingsApi";

const HERO_IMAGE_URL = "https://i.ibb.co/Z1wqS9vj/Profile.jpg";
const HERO_IMAGE_HOVER_URL = "https://i.ibb.co/W48T8Vpw/Profile-Hover.png";

const FALLBACK_AUTHOR = {
  label: "Author",
  name: "",
  bio: "",
};

function HeroSection() {
  const [author, setAuthor] = useState(FALLBACK_AUTHOR);
  const [imageUrl, setImageUrl] = useState(HERO_IMAGE_URL);
  const [hoverImageUrl, setHoverImageUrl] = useState(HERO_IMAGE_HOVER_URL);

  useEffect(() => {
    let cancelled = false;

    async function loadHero() {
      try {
        const [siteAuthor, settings] = await Promise.all([
          fetchSiteAuthor(),
          fetchSiteSettings(),
        ]);
        if (cancelled) return;

        setAuthor({
          label: "Author",
          name: siteAuthor.name || "",
          bio: siteAuthor.bio || "",
        });

        // รูป Hero จาก site_settings — ไม่ใช้ profilePic ของแอดมิน
        setImageUrl(settings.heroImage || HERO_IMAGE_URL);
        setHoverImageUrl(settings.heroImageHover || HERO_IMAGE_HOVER_URL);
      } catch {
        if (cancelled) return;
        // คง fallback รูป + ชื่อว่างไว้ถ้า API ล้ม
      }
    }

    loadHero();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="bg-blog-page">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 md:px-8 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:gap-12 lg:px-16 lg:py-16">
        <div className="flex flex-col gap-6 lg:max-w-md">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-stone-950 md:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
            Decoding
            <br />
            the Cosmic Blueprint
          </h1>

          <p className="text-base leading-relaxed text-stone-600 md:text-lg">
            Move beyond daily newspaper horoscopes and explore the profound
            concepts of Western Astrology. Discover the planetary positions at
            your birth, and let them reveal the gifts you were given to create
            something new in this lifetime. Seek knowledge to move forward, not
            to fear
          </p>
        </div>

        <figure className="group mx-auto w-full max-w-xs shrink-0 lg:w-80 lg:max-w-sm">
          <span className="relative block aspect-3/4 w-full overflow-hidden rounded-2xl shadow-xl shadow-stone-900/20">
            <img
              src={imageUrl}
              alt={
                author.name
                  ? `${author.name} hero portrait`
                  : "Site hero portrait"
              }
              className="absolute inset-0 h-full w-full object-cover opacity-100 transition-opacity duration-300 ease-in-out group-hover:opacity-0"
            />
            <img
              src={hoverImageUrl}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
            />
          </span>
        </figure>

        <aside className="flex flex-col gap-3 lg:max-w-sm lg:justify-self-end">
          <p className="text-sm font-medium text-stone-500">- {author.label}</p>
          {author.name ? (
            <h2 className="text-2xl font-bold text-stone-950">{author.name}</h2>
          ) : null}
          {author.bio ? (
            <p className="text-sm leading-relaxed text-stone-600 md:text-base">
              {author.bio}
            </p>
          ) : null}
        </aside>
      </div>
    </section>
  );
}

export default HeroSection;
