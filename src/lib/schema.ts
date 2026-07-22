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
  url: "https://github.com/AdharshJolly",
  image: "https://github.com/AdharshJolly.png",
  sameAs: [
    "https://github.com/AdharshJolly",
    "https://linkedin.com/in/adharsh-jolly",
  ],
  jobTitle: "Full Stack Developer & Web Engineer",
  description: "Developer and creator of the InC4 2026 conference website (ic4.co.in). Built with Next.js, React, and modern web technologies.",
  knowsAbout: [
    "Web Development",
    "Next.js",
    "React",
    "TypeScript",
    "Full Stack Development",
    "UI/UX Design",
    "Performance Optimization",
  ],
  worksFor: {
    "@type": "Organization",
    name: "InC4 2026 / IEEE Computer Society Bangalore Chapter",
    url: "https://ic4.co.in",
  },
  mainEntityOfPage: {
    "@type": "WebSite",
    "@id": "https://ic4.co.in",
    name: "InC4 2026",
    description: "Website developed and maintained by Adharsh Jolly",
  },
});

// SoftwareApplication schema for the website itself
export const getWebsiteAppSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "InC4 2026 Conference Website",
  url: "https://ic4.co.in",
  description: "Official website for InC4 2026 - IEEE International Conference on Contemporary Computing and Communications",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  creator: {
    "@type": "Person",
    name: "Adharsh Jolly",
    url: "https://github.com/AdharshJolly",
    sameAs: [
      "https://github.com/AdharshJolly",
      "https://linkedin.com/in/adharsh-jolly",
    ],
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
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

// FAQ Schema for common conference questions
export const getFAQSchema = () => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is InC4 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "InC4 2026 is the 2026 IEEE International Conference on Contemporary Computing and Communications (Conference#70839), organized by IEEE Computer Society Bangalore Chapter at CHRIST University, Bengaluru on August 7-8, 2026.",
      },
    },
    {
      "@type": "Question",
      name: "When and where is InC4 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "InC4 2026 will be held on August 7-8, 2026 at CHRIST University, Kengeri Campus, Bengaluru, India.",
      },
    },
    {
      "@type": "Question",
      name: "How do I register for InC4 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can register for InC4 2026 through the Explara registration portal. Visit the registration page on ic4.co.in for fees and categories.",
      },
    },
    {
      "@type": "Question",
      name: "What are the paper submission guidelines for InC4 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Papers must follow the standard IEEE two-column format and be no more than 6 pages. Accepted papers will be submitted for inclusion in IEEE Xplore digital library.",
      },
    },
    {
      "@type": "Question",
      name: "What topics are covered at InC4 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "InC4 2026 covers contemporary computing and communications topics including AI/ML, cloud computing, IoT, cybersecurity, data science, and more.",
      },
    },
  ],
});
