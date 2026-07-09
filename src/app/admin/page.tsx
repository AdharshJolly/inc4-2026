"use client";

import { useContext, useState, useEffect } from "react";
import { PageTitle } from "@/components/common/PageTitle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Calendar, Mic, Eye } from "lucide-react";
import { isCompleted } from "@/lib/dateUtils";
import { CommitteeManager } from "@/components/admin/CommitteeManager";
import { SpeakersManager } from "@/components/admin/SpeakersManager";
import { DatesManager } from "@/components/admin/DatesManager";
import { PartnersManager } from "@/components/admin/PartnersManager";
import { AdminSessionContext } from "./AdminSessionProvider";
import { createClient } from "@/utils/supabase/client";

export default function AdminDashboard() {
  const session = useContext(AdminSessionContext);

  const [upcomingDates, setUpcomingDates] = useState(0);
  const [partnersCount, setPartnersCount] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [speakersCount, setSpeakersCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient();
      
      const { data: dData } = await supabase.from("important_dates").select("event_date");
      if (dData) {
        setUpcomingDates(dData.filter((d: any) => !isCompleted(d.event_date)).length);
      }
      
      const { count: pCount } = await supabase.from("partners").select("*", { count: "exact", head: true });
      if (pCount !== null) {
        setPartnersCount(pCount);
      }

      const { count: sCount } = await supabase.from("speakers").select("*", { count: "exact", head: true });
      if (sCount !== null) {
        setSpeakersCount(sCount);
      }

      const { data: cData } = await supabase.from("committee_members").select("category_id");
      if (cData) {
        setTotalMembers(cData.length);
        const uniqueCategories = new Set(cData.map(c => c.category_id));
        setCategoriesCount(uniqueCategories.size);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    {
      title: "Committee Members",
      value: totalMembers,
      icon: Users,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "Categories",
      value: categoriesCount,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Keynote Speakers",
      value: speakersCount,
      icon: Mic,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "Upcoming Events",
      value: upcomingDates,
      icon: Calendar,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Partners",
      value: partnersCount,
      icon: Users,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  const handlePreview = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-background pt-[110px]">
      <div className="container mx-auto px-4 pb-4 flex items-center justify-between">
        <PageTitle title="Admin Dashboard" />
        <div className="flex items-center gap-3">
          {session?.logout && (
            <Button
              onClick={session.logout}
              variant="outline"
              size="sm"
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            >
              Logout
            </Button>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {stats.map((stat) => (
            <Card
              key={stat.title}
              className="border-primary/20 hover:border-primary/40 transition-colors"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-full`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Content Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="committee" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="committee">
                  <Users className="w-4 h-4 mr-2" />
                  Committee
                </TabsTrigger>
                <TabsTrigger value="speakers">
                  <Mic className="w-4 h-4 mr-2" />
                  Speakers
                </TabsTrigger>
                <TabsTrigger value="dates">
                  <Calendar className="w-4 h-4 mr-2" />
                  Important Dates
                </TabsTrigger>
                <TabsTrigger value="partners">
                  <Users className="w-4 h-4 mr-2" />
                  Partners
                </TabsTrigger>
              </TabsList>

              <TabsContent value="committee" className="space-y-4">
                <div className="flex justify-end mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview("/committee")}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Committee Page
                  </Button>
                </div>
                <CommitteeManager />
              </TabsContent>

              <TabsContent value="speakers" className="space-y-4">
                <div className="flex justify-end mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview("/speakers")}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Speakers Page
                  </Button>
                </div>
                <SpeakersManager />
              </TabsContent>

              <TabsContent value="dates" className="space-y-4">
                <div className="flex justify-end mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview("/important-dates")}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Important Dates
                  </Button>
                </div>
                <DatesManager />
              </TabsContent>

              <TabsContent value="partners" className="space-y-4">
                <div className="flex justify-end mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview("/")}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Partners (Home)
                  </Button>
                </div>
                <PartnersManager />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

