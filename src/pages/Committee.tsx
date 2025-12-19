import { PageTitle } from "@/components/PageTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Reveal } from "@/components/Reveal";
import { User2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { getCommitteePersonSchema } from "@/hooks/useSchemaOrg";
import committeeCategories from "@/data/committee.json";

export default function Committee() {
  const location = useLocation();
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

  // Handle URL hash navigation
  useEffect(() => {
    // Extract hash from URL (e.g., #patrons from /committee#patrons)
    const hash = location.hash.slice(1); // Remove the # character

    if (hash && committeeCategories.some((cat) => cat.id === hash)) {
      setActiveTab(hash);
    } else {
      setActiveTab("chief-patron");
    }
  }, [location.hash]);

  // Update URL when tab changes
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    window.location.hash = tabId;
  };

  // Inject Person schemas for all committee members
  useEffect(() => {
    // Flatten all members from all categories
    const allMembers = committeeCategories.flatMap((category) =>
      category.members.map((member) => ({
        name: member.name,
        role: member.role,
        affiliation: member.affiliation,
        image: member.image,
      }))
    );

    // Generate Person schemas
    const personSchemas = getCommitteePersonSchema(allMembers);

    // Inject each schema into document head
    personSchemas.forEach((schema) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    // Cleanup function to remove scripts on unmount
    return () => {
      // Remove all person schemas (optional, but clean)
      const scripts = document.querySelectorAll(
        'script[type="application/ld+json"]'
      );
      scripts.forEach((script) => {
        if (
          script.textContent &&
          script.textContent.includes('"@type":"Person"')
        ) {
          script.remove();
        }
      });
    };
  }, []);

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
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {category.members.map((member, index) => (
                  <Reveal key={index} width="100%">
                    <Card className="group border-primary/10 bg-card/50 backdrop-blur-sm hover:border-primary/40 hover:shadow-card-hover transition-all duration-300 overflow-hidden h-full">
                      <CardContent className="p-0 flex flex-col h-full">
                        <div className="h-2 bg-gradient-to-r from-primary to-secondary opacity-80" />
                        <div className="p-6 flex flex-col items-center text-center flex-1">
                          {member.image && (
                            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-500 overflow-hidden border-2 border-border group-hover:border-primary/50">
                              <img
                                src={member.image}
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
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
