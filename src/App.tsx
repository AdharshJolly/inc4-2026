import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import PageTransition from "./components/PageTransition";
import ScrollToTop from "./components/ScrollToTop";
import { AnimatePresence } from "framer-motion";
import About from "./pages/About";
import Committee from "./pages/Committee";
import CRCSubmissions from "./pages/CRCSubmissions";
import CallForPapers from "./pages/CallForPapers";
import Registration from "./pages/Registration";
import ImportantDates from "./pages/ImportantDates";
import Schedule from "./pages/Schedule";
import Speakers from "./pages/Speakers";
import Contact from "./pages/Contact";
import {
  getInC4EventSchema,
  getOrganizationSchema,
  getBreadcrumbSchema,
} from "./hooks/useSchemaOrg";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const contentPadding = isLanding ? "" : "pt-[110px]";

  // Create a custom key that groups committee routes together
  // This prevents page transition animations when switching between committee tabs
  const getRouteKey = (pathname: string) => {
    if (pathname.startsWith("/committee")) {
      return "/committee"; // All committee routes share the same key
    }
    return pathname; // Other routes use their full path as key
  };

  const routeKey = getRouteKey(location.pathname);

  return (
    <div className={contentPadding}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={routeKey}>
          <Route
            path="/"
            element={
              <PageTransition>
                <Index />
              </PageTransition>
            }
          />
          <Route
            path="/about"
            element={
              <PageTransition>
                <About />
              </PageTransition>
            }
          />
          <Route
            path="/committee"
            element={
              <PageTransition>
                <Committee />
              </PageTransition>
            }
          />
          <Route
            path="/committee/:category"
            element={
              <PageTransition>
                <Committee />
              </PageTransition>
            }
          />
          {/* <Route path="/crc-submissions" element={<PageTransition><CRCSubmissions /></PageTransition>} /> */}
          <Route
            path="/call-for-papers"
            element={
              <PageTransition>
                <CallForPapers />
              </PageTransition>
            }
          />
          <Route
            path="/registration"
            element={
              <PageTransition>
                <Registration />
              </PageTransition>
            }
          />
          <Route
            path="/important-dates"
            element={
              <PageTransition>
                <ImportantDates />
              </PageTransition>
            }
          />
          <Route
            path="/schedule"
            element={
              <PageTransition>
                <Schedule />
              </PageTransition>
            }
          />
          <Route
            path="/speakers"
            element={
              <PageTransition>
                <Speakers />
              </PageTransition>
            }
          />
          <Route
            path="/contact"
            element={
              <PageTransition>
                <Contact />
              </PageTransition>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route
            path="*"
            element={
              <PageTransition>
                <NotFound />
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  );
};

const SchemaorgScripts = () => {
  const location = useLocation();

  useEffect(() => {
    // Add Event Schema
    const eventScript = document.createElement("script");
    eventScript.type = "application/ld+json";
    eventScript.textContent = JSON.stringify(getInC4EventSchema());
    document.head.appendChild(eventScript);

    // Add Organization Schema
    const orgScript = document.createElement("script");
    orgScript.type = "application/ld+json";
    orgScript.textContent = JSON.stringify(getOrganizationSchema());
    document.head.appendChild(orgScript);

    // Add Breadcrumb Schema based on current route
    const breadcrumbMap: Record<
      string,
      Array<{ name: string; url: string }>
    > = {
      "/": [{ name: "Home", url: "https://ic4.co.in/" }],
      "/about": [
        { name: "Home", url: "https://ic4.co.in/" },
        { name: "About", url: "https://ic4.co.in/about" },
      ],
      "/committee": [
        { name: "Home", url: "https://ic4.co.in/" },
        { name: "Committee", url: "https://ic4.co.in/committee" },
      ],
      "/call-for-papers": [
        { name: "Home", url: "https://ic4.co.in/" },
        { name: "Call for Papers", url: "https://ic4.co.in/call-for-papers" },
      ],
      "/registration": [
        { name: "Home", url: "https://ic4.co.in/" },
        { name: "Registration", url: "https://ic4.co.in/registration" },
      ],
      "/important-dates": [
        { name: "Home", url: "https://ic4.co.in/" },
        { name: "Important Dates", url: "https://ic4.co.in/important-dates" },
      ],
      "/schedule": [
        { name: "Home", url: "https://ic4.co.in/" },
        { name: "Schedule", url: "https://ic4.co.in/schedule" },
      ],
      "/speakers": [
        { name: "Home", url: "https://ic4.co.in/" },
        { name: "Speakers", url: "https://ic4.co.in/speakers" },
      ],
      "/contact": [
        { name: "Home", url: "https://ic4.co.in/" },
        { name: "Contact", url: "https://ic4.co.in/contact" },
      ],
    };

    const breadcrumbs = breadcrumbMap[location.pathname] || [
      { name: "Home", url: "https://ic4.co.in/" },
    ];

    const breadcrumbScript = document.createElement("script");
    breadcrumbScript.type = "application/ld+json";
    breadcrumbScript.textContent = JSON.stringify(
      getBreadcrumbSchema(breadcrumbs)
    );
    document.head.appendChild(breadcrumbScript);

    return () => {
      document.head.removeChild(eventScript);
      document.head.removeChild(orgScript);
      document.head.removeChild(breadcrumbScript);
    };
  }, [location.pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Toaster />
        <Sonner />
        <SchemaorgScripts />
        <Navbar />
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
