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
} from "./hooks/useSchemaOrg";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const contentPadding = isLanding ? "" : "pt-[110px]";

  return (
    <div className={contentPadding}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Index /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/committee" element={<PageTransition><Committee /></PageTransition>} />
          <Route path="/crc-submissions" element={<PageTransition><CRCSubmissions /></PageTransition>} />
          <Route path="/call-for-papers" element={<PageTransition><CallForPapers /></PageTransition>} />
          <Route path="/registration" element={<PageTransition><Registration /></PageTransition>} />
          <Route path="/important-dates" element={<PageTransition><ImportantDates /></PageTransition>} />
          <Route path="/schedule" element={<PageTransition><Schedule /></PageTransition>} />
          <Route path="/speakers" element={<PageTransition><Speakers /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  );
};

const SchemaorgScripts = () => {
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

    return () => {
      document.head.removeChild(eventScript);
      document.head.removeChild(orgScript);
    };
  }, []);

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
