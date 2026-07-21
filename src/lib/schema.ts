// Pre-built schema for InC4 event
export const getInC4EventSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Event",
  name: "2026 IEEE International Conference on Contemporary Computing and Communications (InC4) - Conference#70839",
  description:
    "The fourth edition of 2026 IEEE International Conference on Contemporary Computing and Communications (InC4) - Conference#70839 at CHRIST University, Bengaluru.",
  startDate: "2026-08-07T09:00:00+05:30",
  endDate: "2026-08-08T17:00:00+05:30",
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
  name: "InC4 2026",
  url: "https://ic4.co.in",
  image: "https://ic4.co.in/images/InC4 Logo White.png",
  description:
    "International Conference on Contemporary Computing and Communications",
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

// Person schema generator for committee members
interface CommitteeMember {
  name: string;
  role?: string;
  affiliation: string;
  image?: string;
}

export const getCommitteePersonSchema = (members: CommitteeMember[]) => {
  return members.map((member) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    name: member.name,
    ...(member.role && { jobTitle: member.role }),
    affiliation: {
      "@type": "Organization",
      name: member.affiliation,
    },
    ...(member.image && { image: member.image }),
    url: `https://ic4.co.in/committee#${member.name
      .replace(/\s+/g, "-")
      .toLowerCase()}`,
  }));
};

// Developer schema — hidden in source, indexed by search engines
export const getDeveloperSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Adharsh Jolly",
  url: "https://ic4.co.in",
  sameAs: [
    "https://github.com/AdharshJolly",
    "https://linkedin.com/in/adharsh-jolly",
  ],
  jobTitle: "Web Developer",
  worksFor: {
    "@type": "Organization",
    name: "InC4 2026 / IEEE Computer Society Bangalore Chapter",
    url: "https://ic4.co.in",
  },
});

// WebSite schema with developer credit
export const getWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "InC4 2026",
  url: "https://ic4.co.in",
  description:
    "2026 IEEE International Conference on Contemporary Computing and Communications",
  publisher: {
    "@type": "Organization",
    name: "IEEE Computer Society Bangalore Chapter",
  },
  creator: {
    "@type": "Person",
    name: "Adharsh Jolly",
    url: "https://github.com/AdharshJolly",
  },
});
