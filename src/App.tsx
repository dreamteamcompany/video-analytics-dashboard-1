
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import YunaPage from "./yuna/YunaPage";
import YunaDashboardPage from "./yuna/YunaDashboardPage";
import YunaSessionPage from "./yuna/YunaSessionPage";
import YunaSettingsPage from "./yuna/YunaSettingsPage";
import YunaLoginPage from "./yuna/YunaLoginPage";
import RequireAuth from "./yuna/RequireAuth";
import PresentationPage from "./presentation/PresentationPage";
import Presentation2Page from "./presentation/Presentation2Page";
import SpeechPage from "./pages/SpeechPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/yuna/login" element={<YunaLoginPage />} />
          <Route path="/yuna" element={<RequireAuth><YunaDashboardPage /></RequireAuth>} />
          <Route path="/yuna/work" element={<RequireAuth><YunaPage /></RequireAuth>} />
          <Route path="/yuna/settings" element={<RequireAuth><YunaSettingsPage /></RequireAuth>} />
          <Route path="/yuna/:id" element={<RequireAuth><YunaSessionPage /></RequireAuth>} />
          <Route path="/presentation" element={<PresentationPage />} />
          <Route path="/presentation-2" element={<Presentation2Page />} />
          <Route path="/speech" element={<SpeechPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;