import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import SEO from "./components/SEO";
import { partnerUp, youth, socialJustice } from "./content/site";
import { SectionPage, DetailPage, PublicationsPage, AboutPage } from "./pages/ContentPages";

const Donate = lazy(() => import("./pages/Donate"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const PageFallback = () => (
  <div className="min-h-screen bg-background" aria-hidden="true" />
);

// Old addresses from the previous website, sent to their new place
const redirects: Record<string, string> = {
  "/about/history": "/about",
  "/about/team": "/about",
  "/about/sponsors": "/about",
  "/contact": "/about",
  "/volunteer": "/about",
  "/news": "/publications",
  "/events": "/publications",
  "/gallery": "/",
  "/programs/research": "/partnerup",
  "/programs/ghetto-youths": "/youth/ghetto-youth",
  "/programs/youth-leadership": "/youth/ghetto-youth",
  "/programs/digital-associates": "/youth/economic-empowerment",
  "/programs/uji-sato": "/youth/uji-sato",
  "/programs/mathare-resilience": "/social-justice/mathare-resilience-hub",
  "/programs/ghetto-stories": "/social-justice/ghetto-stories",
  "/programs/civic-education": "/social-justice",
  "/programs/community-projects": "/social-justice",
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SEO />
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            {[partnerUp, youth, socialJustice].map((s) => [
              <Route key={s.path} path={s.path} element={<SectionPage section={s} />} />,
              <Route key={s.path + "/:slug"} path={`${s.path}/:slug`} element={<DetailPage section={s} />} />,
            ])}
            <Route path="/publications" element={<PublicationsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/donate" element={<Donate />} />
            {Object.entries(redirects).map(([from, to]) => (
              <Route key={from} path={from} element={<Navigate to={to} replace />} />
            ))}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
