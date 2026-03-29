import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import EcoStepsApp from "./components/EcoStepsApp";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <EcoStepsApp />
      <Toaster />
    </QueryClientProvider>
  );
}
