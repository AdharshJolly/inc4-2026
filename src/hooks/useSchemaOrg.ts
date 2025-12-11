import { useEffect } from "react";

interface SchemaOrgProps {
  type: "Event" | "Organization" | "BreadcrumbList";
  data: Record<string, any>;
}

export const useSchemaOrg = ({ type, data }: SchemaOrgProps) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": type,
      ...data,
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [type, data]);
};

// Pre-built schema for InC4 event
export const getInC4EventSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Event",
  name: "IEEE InC4 2026 - International Conference on Contemporary Computing and Communications",
  description:
    "The fourth edition of IEEE International Conference on Contemporary Computing and Communications",
  startDate: "2026-03-13T09:00:00+05:30",
  endDate: "2026-03-14T17:00:00+05:30",
  eventAttendanceMode: "OfflineEventAttendanceMode",
  location: {
    "@type": "Place",
    name: "CHRIST University, Kengeri Campus",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Kengeri Campus",
      addressLocality: "Bengaluru",
      addressRegion: "Karnataka",
      postalCode: "560074",
      addressCountry: "IN",
    },
  },
  organizer: {
    "@type": "Organization",
    name: "IEEE Computer Society Bangalore Chapter",
    url: "https://ic4.co.in",
  },
  image: "https://ic4.co.in/images/InC4 Logo White.png",
  url: "https://ic4.co.in",
});

// Organization schema
export const getOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "IEEE InC4 2026",
  url: "https://ic4.co.in",
  image: "https://ic4.co.in/images/InC4 Logo White.png",
  description:
    "IEEE International Conference on Contemporary Computing and Communications",
  sameAs: [
    "https://twitter.com/ieeecomputers",
    "https://www.facebook.com/IEEEComputerSociety",
    "https://www.linkedin.com/company/ieee-computer-society/",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Conference Inquiry",
    email: "inc4.christ@conference.christuniversity.in",
  },
});

// Breadcrumb schema generator
export const getBreadcrumbSchema = (
  breadcrumbs: Array<{ name: string; url: string }>
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: breadcrumbs.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});
