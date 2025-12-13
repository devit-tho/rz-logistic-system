import Authentication from "@/components/authentication";
import { Toaster } from "@/components/ui/sonner";
import Router from "@/routes";

// ----------------------------------------------------------------------

function App() {
  return (
    <Authentication>
      <Router />
      <Toaster position="top-right" richColors />
    </Authentication>
  );
}

export default App;
