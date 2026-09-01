import { fetchSiteAuthor } from "@/lib/authApi";

let cachedSiteAuthor = null;
let siteAuthorPromise = null;

const EMPTY_SITE_AUTHOR = { name: "", bio: "", profilePic: "" };

export async function getSiteAuthor() {
  if (cachedSiteAuthor) {
    return cachedSiteAuthor;
  }

  if (!siteAuthorPromise) {
    siteAuthorPromise = fetchSiteAuthor()
      .then((data) => {
        cachedSiteAuthor = data;
        return data;
      })
      .catch(() => {
        siteAuthorPromise = null;
        return EMPTY_SITE_AUTHOR;
      });
  }

  return siteAuthorPromise;
}
