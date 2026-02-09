import { APP_NAME, APP_DESCRIPTION, APP_URL } from "./constants";

/**
 * Dynamically set SEO meta tags
 */
export const setSEO = ({
  title = APP_NAME,
  description = APP_DESCRIPTION,
  keywords = "",
  image = `${APP_URL}/assets/og-image.png`,
  url = APP_URL,
}) => {
  document.title = title;

  const setMeta = (name, content, property = false) => {
    const attr = property ? "property" : "name";
    let tag = document.querySelector(`meta[${attr}="${name}"]`);

    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute(attr, name);
      document.head.appendChild(tag);
    }

    tag.setAttribute("content", content);
  };

  setMeta("description", description);
  setMeta("keywords", keywords);
  setMeta("author", "Your Name");

  // Open Graph tags
  setMeta("og:title", title, true);
  setMeta("og:description", description, true);
  setMeta("og:image", image, true);
  setMeta("og:url", url, true);
  setMeta("og:type", "website", true);

  // Twitter Card tags
  setMeta("twitter:card", "summary_large_image");
  setMeta("twitter:title", title);
  setMeta("twitter:description", description);
  setMeta("twitter:image", image);
};
