import { useContext } from "react";
import { PageTitle } from "@/components/PageTitle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Calendar, Mic, Eye } from "lucide-react";
import { PendingChangesCounter } from "@/components/Admin/PendingChangesCounter";
import committeeData from "@/data/committee.json";
import speakersData from "@/data/speakers.json";
import datesData from "@/data/important-dates.json";
import type {
  CommitteeData,
  SpeakersData,
  ImportantDatesData,
} from "@/types/data";
import { CommitteeManager } from "@/components/Admin/CommitteeManager";
import { SpeakersManager } from "@/components/Admin/SpeakersManager";
import { DatesManager } from "@/components/Admin/DatesManager";
import { AdminSessionContext } from "./ProtectedAdminRoute";
import { getPendingChanges } from "@/lib/githubSync";
import { enablePreviewMode } from "@/lib/previewMode";
import type { PreviewData } from "@/lib/previewMode";

export default function AdminDashboard() {
  const session = useContext(AdminSessionContext);
  const committee = (committeeData as CommitteeData).root;
  const speakers = (speakersData as SpeakersData).root;
  const dates = (datesData as ImportantDatesData).root;

  // Calculate stats
  const totalMembers = committee.reduce(
    (sum, cat) => sum + cat.members.length,
    0
  );
  const categoriesCount = committee.length;
  const speakersCount = speakers.length;
  const upcomingDates = dates.filter((d) => d.status === "upcoming").length;

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
  ];

  const handlePreview = (url: string) => {
    const pending = getPendingChanges();
    if (pending.length === 0) {
      // No changes, just open the page
      window.open(url, "_blank");
      return;
    }

    // Build preview data object - ensure content is always a string
    const previewData: PreviewData = {};
    pending.forEach((change) => {
      // If content is an object, stringify it; if it's already a string, keep it
      previewData[change.path] =
        typeof change.content === "string"
          ? change.content
          : JSON.stringify(change.content);
    });

    // Enable preview mode and open
    enablePreviewMode(previewData);
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pb-4 flex items-center justify-between">
        <PageTitle title="Admin Dashboard" />
        <div className="flex items-center gap-3">
          <PendingChangesCounter />
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
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        {/* Category Breakdown */}
        <Card className="mb-8 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-500" />
              Committee Breakdown by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {committee.map((category) => (
                <div
                  key={category.id}
                  className="p-4 rounded-lg border border-border hover:border-primary/40 transition-colors"
                >
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {category.label}
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {category.members.length}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Management Tabs */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Content Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="committee" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
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
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
