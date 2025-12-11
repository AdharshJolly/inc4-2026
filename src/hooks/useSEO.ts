import { useEffect } from "react";

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  canonicalUrl?: string;
}

export const useSEO = ({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage = "https://ic4.co.in/images/InC4 Logo White.png",
  twitterTitle,
  twitterDescription,
  canonicalUrl,
}: SEOProps) => {
  useEffect(() => {
    // Set document title
    document.title = title;

    // Helper function to set or update meta tags
    const setMetaTag = (selector: string, content: string) => {
      let element = document.querySelector(selector);
      if (element) {
        element.setAttribute("content", content);
      } else {
        element = document.createElement("meta");
        const selectorParts = selector.match(/\[(.+)=["'](.+)["']\]/);
        if (selectorParts) {
          const [, attr, value] = selectorParts;
          element.setAttribute(attr, value);
          element.setAttribute("content", content);
          document.head.appendChild(element);
        }
      }
    };

    // Set basic meta tags
    setMetaTag('meta[name="description"]', description);
    if (keywords) {
      setMetaTag('meta[name="keywords"]', keywords);
    }

    // Set Open Graph tags
    setMetaTag('meta[property="og:title"]', ogTitle || title);
    setMetaTag('meta[property="og:description"]', ogDescription || description);
    setMetaTag('meta[property="og:image"]', ogImage);
    if (canonicalUrl) {
      setMetaTag('meta[property="og:url"]', canonicalUrl);
    }

    // Set Twitter Card tags
    setMetaTag('meta[name="twitter:title"]', twitterTitle || ogTitle || title);
    setMetaTag(
      'meta[name="twitter:description"]',
      twitterDescription || ogDescription || description
    );
    setMetaTag('meta[name="twitter:image"]', ogImage);

    // Set canonical URL
    if (canonicalUrl) {
      let linkElement = document.querySelector('link[rel="canonical"]');
      if (linkElement) {
        linkElement.setAttribute("href", canonicalUrl);
      } else {
        linkElement = document.createElement("link");
        linkElement.setAttribute("rel", "canonical");
        linkElement.setAttribute("href", canonicalUrl);
        document.head.appendChild(linkElement);
      }
    }
  }, [
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    twitterTitle,
    twitterDescription,
    canonicalUrl,
  ]);
};
