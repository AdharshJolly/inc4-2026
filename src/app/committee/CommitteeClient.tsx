"use client";

import { PageTitle } from "@/components/common/PageTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Reveal } from "@/components/common/Reveal";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCommitteePersonSchema } from "@/lib/schema";
import committeeDataImport from "@/data/committee.json";
import { getPhotoUrl, normalizePhotoFields } from "@/lib/photoMigration";
import type { CommitteeData } from "@/types/data";
import { getPreviewData } from "@/lib/previewMode";

export default function CommitteeClient() {
  const params = useParams();
  const category = params?.category as string | undefined;
  const router = useRouter();

  const [committeeCategories, setCommitteeCategories] = useState(() => {
     const committeeData = committeeDataImport as CommitteeData;
     return committeeData.root.map((cat) => ({
        ...cat,
        members: normalizePhotoFields(cat.members),
      }));
  });

  const [activeTab, setActiveTab] = useState(() => {
    if (
      category &&
      committeeCategories.some((cat) => cat.id === category)
    ) {
      return category;
    }
    return "chief-patron";
  });

  useEffect(() => {
    const previewData = getPreviewData("src/data/committee.json");
    if (previewData) {
      try {
        const committeeData = JSON.parse(previewData) as CommitteeData;
        setCommitteeCategories(committeeData.root.map((cat) => ({
          ...cat,
          members: normalizePhotoFields(cat.members),
        })));
      } catch (e) {
        console.error("Failed to parse preview data", e);
      }
    }
  }, []);

  // Handle URL path-based navigation
  useEffect(() => {
    if (
      committeeCategories &&
      category &&
      committeeCategories.some((cat) => cat.id === category)
    ) {
      setActiveTab(category);
    } else if (!category) {
      setActiveTab("chief-patron");
    }
  }, [category, committeeCategories]);

  // Update URL when tab changes
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    router.push(`/committee/${tabId}`);
  };

  // Inject Person schemas for all committee members
  useEffect(() => {
    const allMembers = committeeCategories.flatMap((category) =>
      category.members.map((member) => ({
        name: member.name,
        role: member.role,
        affiliation: member.affiliation,
        image: getPhotoUrl(member.photo),
      }))
    );

    const personSchemas = getCommitteePersonSchema(allMembers);
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(personSchemas);
    script.setAttribute("data-origin", "CommitteeComponent");
    document.head.appendChild(script);

    return () => {
      script.remove();
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
              {activeTab === category.id && (
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
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
