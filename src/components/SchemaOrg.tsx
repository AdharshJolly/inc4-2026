"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  getInC4EventSchema,
  getOrganizationSchema,
  getBreadcrumbSchema,
} from "@/lib/schema";

export const SchemaOrg = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Add Event Schema
    const eventScript = document.createElement("script");
    eventScript.type = "application/ld+json";
    eventScript.textContent = JSON.stringify(getInC4EventSchema());
    document.head.appendChild(eventScript);

    // Add Organization Schema
    const orgScript = document.createElement("script");
    orgScript.type = "application/ld+json";
    orgScript.textContent = JSON.stringify(getOrganizationSchema());
    document.head.appendChild(orgScript);

    // Add Breadcrumb Schema based on current route
    const breadcrumbMap: Record<
      string,
      Array<{ name: string; url: string }>
    > = {
      "/": [{ name: "Home", url: "https://ic4.co.in/" }],
      "/about": [
        { name: "Home", url: "https://ic4.co.in/" },
        { name: "About", url: "https://ic4.co.in/about" },
      ],
      "/committee": [
        { name: "Home", url: "https://ic4.co.in/" },
        { name: "Committee", url: "https://ic4.co.in/committee" },
      ],
      "/call-for-papers": [
        { name: "Home", url: "https://ic4.co.in/" },
        { name: "Call for Papers", url: "https://ic4.co.in/call-for-papers" },
      ],
      "/registration": [
        { name: "Home", url: "https://ic4.co.in/" },
        { name: "Registration", url: "https://ic4.co.in/registration" },
      ],
      "/important-dates": [
        { name: "Home", url: "https://ic4.co.in/" },
        { name: "Important Dates", url: "https://ic4.co.in/important-dates" },
      ],
      "/schedule": [
        { name: "Home", url: "https://ic4.co.in/" },
        { name: "Schedule", url: "https://ic4.co.in/schedule" },
      ],
      "/speakers": [
        { name: "Home", url: "https://ic4.co.in/" },
        { name: "Speakers", url: "https://ic4.co.in/speakers" },
      ],
      "/contact": [
        { name: "Home", url: "https://ic4.co.in/" },
        { name: "Contact", url: "https://ic4.co.in/contact" },
      ],
    };

    const breadcrumbs = breadcrumbMap[pathname] || [
      { name: "Home", url: "https://ic4.co.in/" },
    ];

    const breadcrumbScript = document.createElement("script");
    breadcrumbScript.type = "application/ld+json";
    breadcrumbScript.textContent = JSON.stringify(
      getBreadcrumbSchema(breadcrumbs)
    );
    document.head.appendChild(breadcrumbScript);

    return () => {
      document.head.removeChild(eventScript);
      document.head.removeChild(orgScript);
      document.head.removeChild(breadcrumbScript);
    };
  }, [pathname]);

  return null;
};
