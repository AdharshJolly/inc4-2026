import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import About from "./pages/About";
import Committee from "./pages/Committee";
import CRCSubmissions from "./pages/CRCSubmissions";
import CallForPapers from "./pages/CallForPapers";
import Registration from "./pages/Registration";
import ImportantDates from "./pages/ImportantDates";
import Schedule from "./pages/Schedule";
import Speakers from "./pages/Speakers";
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const contentPadding = isLanding ? "" : "pt-[110px]";

  return (
    <div className={contentPadding}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/committee" element={<Committee />} />
        <Route path="/crc-submissions" element={<CRCSubmissions />} />
        <Route path="/call-for-papers" element={<CallForPapers />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/important-dates" element={<ImportantDates />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/speakers" element={<Speakers />} />
        <Route path="/contact" element={<Contact />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Toaster />
        <Sonner />
        <Navbar />
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
