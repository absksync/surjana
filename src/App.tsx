import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { Properties } from "./pages/Properties";
import { About } from "./pages/About";
import { Settings } from "./pages/Settings";
import { DataAnalysis } from "./pages/DataAnalysis";
import { DemandPrediction } from "./pages/DemandPrediction";
import { TestDataPage } from "./pages/TestDataPage";
import MapDashboard from "./pages/MapDashboard";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/data-analysis" element={<DataAnalysis />} />
            <Route path="/demand-prediction" element={<DemandPrediction />} />
            <Route path="/map-dashboard" element={<MapDashboard />} />
            <Route path="/test-data" element={<TestDataPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
