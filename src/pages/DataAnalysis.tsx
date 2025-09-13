import { RealEstateDataDashboard } from "../components/RealEstateDataDashboard";

export function DataAnalysis() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
          Real Estate Data Analysis
        </h1>
        <div className="text-center mb-8">
          <p className="text-lg text-gray-600 mb-4">
            Comprehensive analysis of 2,000+ real estate properties with price trends and insights
          </p>
        </div>
        <RealEstateDataDashboard />
      </div>
    </div>
  );
}