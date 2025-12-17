import { PageTitle } from "@/components/PageTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User2 } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import committeeCategories from "@/data/committee.json";

export default function Committee() {
  useSEO({
    title: "Conference Committee | InC4 2026",
    description:
      "Meet the organizing committee members of InC4 2026. View the patrons, chairs, committee members, and program committee of the International Conference on Contemporary Computing and Communications.",
    keywords:
      "InC4 committee, conference organizers, IEEE, academic committee, program committee, conference chairs",
    canonicalUrl: "https://ic4.co.in/committee",
  });

  return (
    <div className="min-h-screen bg-background">
      <PageTitle title="Committee" />

      <div className="container mx-auto px-4 pb-20">
        <Tabs defaultValue="chief-patron" className="space-y-12">
          {/* Scrollable Tabs List */}
          <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
            <TabsList className="w-full justify-start md:justify-center bg-transparent gap-2 h-auto flex-wrap min-w-max md:min-w-0">
              {committeeCategories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-primary/20 border border-transparent rounded-full px-4 py-2 text-sm whitespace-nowrap transition-all hover:bg-muted font-medium"
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
              className="animate-fade-in focus-visible:outline-none"
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {category.members.map((member, index) => (
                  <Card
                    key={index}
                    className="group border-primary/10 bg-card/50 backdrop-blur-sm hover:border-primary/40 hover:shadow-card-hover transition-all duration-300 overflow-hidden"
                  >
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
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
