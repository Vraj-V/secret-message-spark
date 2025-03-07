
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Create from "./pages/Create";
import View from "./pages/View";
import NotFound from "./pages/NotFound";
import { cleanupExpiredMessages } from "./utils/storage";

const queryClient = new QueryClient();

const App = () => {
  // Clean up expired messages periodically
  useEffect(() => {
    // Clean up on initial load
    cleanupExpiredMessages();
    
    // Set up an interval to clean up every minute
    const cleanup = setInterval(() => {
      cleanupExpiredMessages();
    }, 60000); // 60 seconds
    
    return () => clearInterval(cleanup);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" closeButton />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/create" element={<Create />} />
            <Route path="/view/:id" element={<View />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
