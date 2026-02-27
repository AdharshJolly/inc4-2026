"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const SCROLL_THRESHOLDS = [25, 50, 75, 90, 100];
const DOWNLOAD_EXTENSIONS = new Set([
  "pdf",
  "doc",
  "docx",
  "ppt",
  "pptx",
  "xls",
  "xlsx",
  "csv",
  "zip",
  "rar",
]);

const isExternalLink = (url: URL) => url.origin !== window.location.origin;

const getFileExtension = (pathname: string) => {
  const parts = pathname.split(".");
  if (parts.length < 2) return null;
  return parts[parts.length - 1]?.toLowerCase() ?? null;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const trackEvent = (eventName: string, params: Record<string, unknown>) => {
  if (!window.gtag) return;
  window.gtag("event", eventName, params);
};

export const Analytics = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isPublicPage = useMemo(() => {
    if (!pathname) return false;
    return !pathname.startsWith("/admin");
  }, [pathname]);

  useEffect(() => {
    if (!isPublicPage || !pathname) return;
    const query = searchParams?.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;

    trackEvent("page_view", {
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [isPublicPage, pathname, searchParams]);

  useEffect(() => {
    if (!isPublicPage) return;

    const fired = new Set<number>();

    const onScroll = () => {
      const { documentElement } = document;
      const scrollTop = documentElement.scrollTop;
      const scrollHeight = documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const maxScroll = scrollHeight - viewportHeight;
      if (maxScroll <= 0) return;

      const percent = Math.round((scrollTop / maxScroll) * 100);
      for (const threshold of SCROLL_THRESHOLDS) {
        if (percent >= threshold && !fired.has(threshold)) {
          fired.add(threshold);
          trackEvent("scroll_depth", {
            percent_scrolled: threshold,
            page_path: window.location.pathname,
          });
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isPublicPage]);

  useEffect(() => {
    if (!isPublicPage) return;

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      if (href.startsWith("mailto:") || href.startsWith("tel:")) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }

      if (isExternalLink(url)) {
        trackEvent("outbound_click", {
          link_url: url.href,
          link_text: anchor.textContent?.trim() || undefined,
        });
      }

      const extension = getFileExtension(url.pathname);
      if (extension && DOWNLOAD_EXTENSIONS.has(extension)) {
        trackEvent("file_download", {
          file_extension: extension,
          file_name: url.pathname.split("/").pop() ?? undefined,
          link_url: url.href,
        });
      }
    };

    document.addEventListener("click", onClick, { capture: true });
    return () =>
      document.removeEventListener("click", onClick, { capture: true });
  }, [isPublicPage]);

  return null;
};
