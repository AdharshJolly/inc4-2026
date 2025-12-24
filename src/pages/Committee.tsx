import { PageTitle } from "@/components/PageTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Reveal } from "@/components/Reveal";
import { User2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { getCommitteePersonSchema } from "@/hooks/useSchemaOrg";
import committeeDataImport from "@/data/committee.json";
import { getPhotoUrl, normalizePhotoFields } from "@/lib/photoMigration";
import type { CommitteeData } from "@/types/data";
import { getPreviewData } from "@/lib/previewMode";

export default function Committee() {
  const { category } = useParams<{ category?: string }>();

  // Type-safe data normalization with photo field migration
  // Check for preview data first, fallback to imported data
  const previewData = getPreviewData("src/data/committee.json");
  const committeeData = previewData
    ? (JSON.parse(previewData) as CommitteeData)
    : (committeeDataImport as CommitteeData);
  const committeeCategories = committeeData.root.map((cat) => ({
    ...cat,
    members: normalizePhotoFields(cat.members),
  }));

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("chief-patron");

  useSEO({
    title: "Conference Committee | InC4 2026",
    description:
      "Meet the organizing committee members of InC4 2026. View the patrons, chairs, committee members, and program committee of the International Conference on Contemporary Computing and Communications.",
    keywords:
      "InC4 committee, conference organizers, IEEE, academic committee, program committee, conference chairs",
    ogType: "website",
    canonicalUrl: "https://ic4.co.in/committee",
  });

  // Handle URL path-based navigation
  useEffect(() => {
    if (
      committeeCategories &&
      category &&
      committeeCategories.some((cat: any) => cat.id === category)
    ) {
      setActiveTab(category);
    } else if (!category) {
      setActiveTab("chief-patron");
    }
  }, [category, committeeCategories]);
  // Update URL when tab changes
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    navigate(`/committee/${tabId}`);
  };

  // Preload all committee member images
  useEffect(() => {
    const imageUrls = committeeCategories.flatMap((category) =>
      category.members
        .filter((member: any) => getPhotoUrl(member.photo))
        .map((member: any) => getPhotoUrl(member.photo))
    );

    // Add preload link tags for critical images (first 12 for above-the-fold)
    const criticalImages = imageUrls.slice(0, 12);
    const preloadLinks: HTMLLinkElement[] = [];

    criticalImages.forEach((url) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = url;
      document.head.appendChild(link);
      preloadLinks.push(link);
    });

    // Preload remaining images using Image objects (lower priority)
    imageUrls.slice(12).forEach((url) => {
      const img = new Image();
      img.src = url;
    });

    // Cleanup: remove preload links on unmount
    return () => {
      preloadLinks.forEach((link) => link.remove());
    };
  }, [committeeCategories]);
  // Inject Person schemas for all committee members
  useEffect(() => {
    // Flatten all members from all categories
    const allMembers = committeeCategories.flatMap((category) =>
      category.members.map((member) => ({
        name: member.name,
        role: member.role,
        affiliation: member.affiliation,
        image: getPhotoUrl(member.photo),
      }))
    );

    // Generate Person schemas
    const personSchemas = getCommitteePersonSchema(allMembers);

    // Inject each schema into document head, tracking injected scripts
    const injectedScripts: HTMLScriptElement[] = [];
    personSchemas.forEach((schema) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(schema);
      // Mark scripts as originating from this component for clarity
      script.setAttribute("data-origin", "CommitteeComponent");
      document.head.appendChild(script);
      injectedScripts.push(script);
    });

    // Cleanup: only remove scripts injected by this component
    return () => {
      injectedScripts.forEach((script) => script.remove());
    };
  }, [committeeCategories]);

  return (
    <div className="min-h-screen bg-background">
      <PageTitle title="Committee" />

      <div className="container mx-auto px-4 pb-20">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="space-y-12"
        >
          {/* Scrollable Tabs List */}
          <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
            <TabsList className="w-full justify-start md:justify-center bg-transparent gap-2 h-auto flex-wrap min-w-max md:min-w-0">
              {committeeCategories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-primary/20 data-[state=active]:scale-105 border border-transparent rounded-full px-4 py-2 text-sm whitespace-nowrap transition-all duration-300 hover:bg-muted font-medium hover:scale-102"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {committeeCategories.map((category) => (
            <TabsContent
              key={category.id}
              value={category.id}
              className="focus-visible:outline-none animate-in fade-in duration-500 ease-out"
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr items-stretch gap-6 max-w-7xl mx-auto">
                {category.members.map((member, index) => (
                  <Reveal key={index} width="100%" className="h-full">
                    <Card className="group border-primary/10 bg-card/50 backdrop-blur-sm hover:border-primary/40 hover:shadow-card-hover transition-all duration-300 overflow-hidden h-full">
                      <CardContent className="p-0 flex flex-col h-full">
                        <div className="h-2 bg-gradient-to-r from-primary to-secondary opacity-80" />
                        <div className="p-6 flex flex-col items-center text-center flex-1">
                          {getPhotoUrl(member.photo) && (
                            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-500 overflow-hidden border-2 border-border group-hover:border-primary/50">
                              <img
                                src={getPhotoUrl(member.photo)}
                                alt={member.name}
                                loading={
                                  category.id === activeTab && index < 8
                                    ? "eager"
                                    : "lazy"
                                }
                                fetchPriority={
                                  category.id === activeTab && index < 4
                                    ? "high"
                                    : "auto"
                                }
                                className="w-full h-full object-cover object-top bg-white"
                              />
                            </div>
                          )}
                          <h3 className="font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                            {member.name}
                          </h3>
                          <p className="text-sm text-primary font-medium mb-2">
                            {member.role}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {member.affiliation}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Reveal>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
