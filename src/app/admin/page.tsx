"use client";

import { useContext, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { isCompleted } from "@/lib/dateUtils";
import { CommitteeManager } from "@/components/admin/CommitteeManager";
import { SpeakersManager } from "@/components/admin/SpeakersManager";
import { DatesManager } from "@/components/admin/DatesManager";
import { PartnersManager } from "@/components/admin/PartnersManager";
import { ScheduleManager } from "@/components/admin/ScheduleManager";
import { AdminSessionContext } from "./AdminSessionProvider";
import { createClient } from "@/utils/supabase/client";
import {
  Users,
  Calendar,
  Mic,
  Eye,
  LayoutDashboard,
  Database,
  LogOut,
  Building2,
  Globe,
  TrendingUp,
  ChevronRight,
  ExternalLink,
  Layers,
  ListOrdered,
} from "lucide-react";

const cmsItems = [
  {
    id: "committee",
    label: "Committee",
    icon: Users,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    previewUrl: "/committee",
  },
  {
    id: "speakers",
    label: "Speakers",
    icon: Mic,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    previewUrl: "/speakers",
  },
  {
    id: "dates",
    label: "Important Dates",
    icon: Calendar,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    previewUrl: "/important-dates",
  },
  {
    id: "partners",
    label: "Partners",
    icon: Globe,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    previewUrl: "/",
  },
  {
    id: "schedule",
    label: "Schedule",
    icon: ListOrdered,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    previewUrl: "/schedule",
  },
];

export default function AdminDashboard() {
  const session = useContext(AdminSessionContext);
  const [activeSection, setActiveSection] = useState<"overview" | "cms">("overview");
  const [activeCmsTab, setActiveCmsTab] = useState("committee");

  const [upcomingDates, setUpcomingDates] = useState(0);
  const [partnersCount, setPartnersCount] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [speakersCount, setSpeakersCount] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient();
      const [dResult, pResult, sResult, cResult, schResult] = await Promise.all([
        supabase.from("important_dates").select("event_date"),
        supabase.from("partners").select("*", { count: "exact", head: true }),
        supabase.from("speakers").select("*", { count: "exact", head: true }),
        supabase.from("committee_members").select("category_id"),
        supabase.from("schedule_events").select("*", { count: "exact", head: true }),
      ]);
      if (dResult.data) setUpcomingDates(dResult.data.filter((d: any) => !isCompleted(d.event_date)).length);
      if (pResult.count !== null) setPartnersCount(pResult.count);
      if (sResult.count !== null) setSpeakersCount(sResult.count);
      if (schResult.count !== null) setEventsCount(schResult.count);
      if (cResult.data) {
        setTotalMembers(cResult.data.length);
        setCategoriesCount(new Set(cResult.data.map((c: any) => c.category_id)).size);
      }
      setIsLoading(false);
    };
    fetchStats();
  }, []);

  const stats = [
    {
      title: "Committee Members",
      value: totalMembers,
      sub: `${categoriesCount} categories`,
      icon: Users,
      gradient: "from-violet-500/15 via-violet-500/5 to-transparent",
      border: "border-violet-500/25 hover:border-violet-500/50",
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-500",
      ring: "ring-violet-500/20",
      trendIcon: TrendingUp,
    },
    {
      title: "Keynote Speakers",
      value: speakersCount,
      sub: "Invited experts",
      icon: Mic,
      gradient: "from-orange-500/15 via-orange-500/5 to-transparent",
      border: "border-orange-500/25 hover:border-orange-500/50",
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-500",
      ring: "ring-orange-500/20",
      trendIcon: TrendingUp,
    },
    {
      title: "Upcoming Events",
      value: upcomingDates,
      sub: "On schedule",
      icon: Calendar,
      gradient: "from-blue-500/15 via-blue-500/5 to-transparent",
      border: "border-blue-500/25 hover:border-blue-500/50",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
      ring: "ring-blue-500/20",
      trendIcon: TrendingUp,
    },
    {
      title: "Partner Institutions",
      value: partnersCount,
      sub: "Global network",
      icon: Building2,
      gradient: "from-emerald-500/15 via-emerald-500/5 to-transparent",
      border: "border-emerald-500/25 hover:border-emerald-500/50",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
      ring: "ring-emerald-500/20",
      trendIcon: Globe,
    },
    {
      title: "Schedule Events",
      value: eventsCount,
      sub: "Across 2 days",
      icon: ListOrdered,
      gradient: "from-cyan-500/15 via-cyan-500/5 to-transparent",
      border: "border-cyan-500/25 hover:border-cyan-500/50",
      iconBg: "bg-cyan-500/10",
      iconColor: "text-cyan-500",
      ring: "ring-cyan-500/20",
      trendIcon: TrendingUp,
    },
  ];

  const activeCmsItem = cmsItems.find((i) => i.id === activeCmsTab)!;

  return (
    <div className="min-h-screen bg-background flex text-sm">

      {/* ─────────── SIDEBAR ─────────── */}
      <aside className="fixed top-0 left-0 h-full w-60 bg-card/80 backdrop-blur-xl border-r border-border/60 flex flex-col z-40">

        {/* Brand */}
        <div className="px-5 pt-6 pb-5 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/30">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-black text-foreground leading-none">InC4 2026</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-widest">Admin</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-2 pb-1.5">Navigation</p>

          {/* Overview */}
          <SidebarButton
            active={activeSection === "overview"}
            onClick={() => setActiveSection("overview")}
            icon={LayoutDashboard}
            label="Overview"
          />

          {/* CMS */}
          <SidebarButton
            active={activeSection === "cms"}
            onClick={() => setActiveSection("cms")}
            icon={Database}
            label="Content"
          />

          {activeSection === "cms" && (
            <div className="mt-1 ml-3 pl-3 border-l border-border/60 space-y-0.5">
              {cmsItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveCmsTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all duration-150 ${
                    activeCmsTab === item.id
                      ? "bg-muted text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <item.icon className={`w-3.5 h-3.5 shrink-0 ${activeCmsTab === item.id ? item.color : ""}`} />
                  {item.label}
                  {activeCmsTab === item.id && <ChevronRight className="w-3 h-3 ml-auto opacity-50" />}
                </button>
              ))}
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="px-3 pb-5 pt-3 border-t border-border/60 space-y-0.5">
          <button
            onClick={() => window.open("/", "_blank")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-150"
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            View Live Site
          </button>
          {session?.logout && (
            <button
              onClick={session.logout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-500/8 transition-all duration-150"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Sign Out
            </button>
          )}
        </div>
      </aside>

      {/* ─────────── MAIN ─────────── */}
      <div className="flex-1 ml-60 min-h-screen flex flex-col">

        {/* Top bar */}
        <header className="sticky top-0 z-30 h-14 bg-background/80 backdrop-blur-xl border-b border-border/60 flex items-center px-8 gap-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <span className="font-medium text-foreground">
              {activeSection === "overview" ? "Overview" : "Content Management"}
            </span>
            {activeSection === "cms" && (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="flex items-center gap-1.5">
                  <activeCmsItem.icon className={`w-3.5 h-3.5 ${activeCmsItem.color}`} />
                  {activeCmsItem.label}
                </span>
              </>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2">
            {activeSection === "cms" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(activeCmsItem.previewUrl, "_blank")}
                className="h-8 text-xs gap-1.5 border-border/60"
              >
                <Eye className="w-3.5 h-3.5" />
                Preview
              </Button>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-8 py-8">

          {/* ── OVERVIEW ── */}
          {activeSection === "overview" && (
            <div className="max-w-5xl">
              <div className="mb-8">
                <h1 className="text-2xl font-black tracking-tight text-foreground">Dashboard Overview</h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Here&apos;s what&apos;s happening with InC4 2026.
                </p>
              </div>

              {/* Stat grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                {stats.map((stat) => (
                  <div
                    key={stat.title}
                    className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${stat.gradient} ${stat.border} p-5 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-default group`}
                  >
                    {/* Glow orb */}
                    <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full ${stat.iconBg} blur-2xl opacity-50 group-hover:opacity-80 transition-opacity`} />

                    <div className="relative z-10">
                      <div className={`inline-flex p-2.5 rounded-xl ${stat.iconBg} ring-1 ${stat.ring} mb-4`}>
                        <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
                      </div>
                      <p className="text-xs font-medium text-muted-foreground mb-0.5">{stat.title}</p>
                      <p className="text-4xl font-black tracking-tight text-foreground">
                        {isLoading ? (
                          <span className="inline-block w-10 h-8 bg-muted rounded animate-pulse" />
                        ) : stat.value}
                      </p>
                      <div className={`flex items-center gap-1 mt-3 text-xs font-semibold ${stat.iconColor}`}>
                        <stat.trendIcon className="w-3 h-3" />
                        {stat.sub}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CMS shortcuts */}
              <div className="rounded-2xl border border-border/60 bg-card/60 p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Manage Content</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {cmsItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => { setActiveSection("cms"); setActiveCmsTab(item.id); }}
                      className="group flex flex-col items-start gap-3 p-4 rounded-xl border border-border/60 bg-background hover:border-primary/40 hover:bg-primary/3 transition-all duration-200 text-left"
                    >
                      <div className={`p-2.5 rounded-xl ${item.bg} group-hover:scale-110 transition-transform duration-200`}>
                        <item.icon className={`w-4 h-4 ${item.color}`} />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{item.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Edit & manage</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── CMS ── */}
          {activeSection === "cms" && (
            <div className="max-w-6xl">
              <div className="mb-6">
                <h1 className="text-2xl font-black tracking-tight text-foreground">Content Management</h1>
                <p className="text-muted-foreground text-sm mt-1">Changes go live immediately on the public site.</p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-card/60 overflow-hidden" style={{ minHeight: "640px" }}>
                <div className="p-6">
                  {activeCmsTab === "committee" && <CommitteeManager />}
                  {activeCmsTab === "speakers" && <SpeakersManager />}
                  {activeCmsTab === "dates" && <DatesManager />}
                  {activeCmsTab === "partners" && <PartnersManager />}
                  {activeCmsTab === "schedule" && <ScheduleManager />}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ── Shared sidebar button ──
function SidebarButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
        active
          ? "bg-primary/10 text-primary border border-primary/20"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
      }`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      {label}
      {active && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-60" />}
    </button>
  );
}
