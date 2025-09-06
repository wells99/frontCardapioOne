import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./services";
import AntProvider from "./contexts/AntContext";
import Paths from "./routes/Paths";
import { AuthProvider } from "./AuthContext";

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <AntProvider>
       <AuthProvider><Paths /></AuthProvider>
      </AntProvider>
    </QueryClientProvider>
  )
}

export default App
