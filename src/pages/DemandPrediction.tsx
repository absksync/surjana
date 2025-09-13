import { HousingDemandDashboard } from '../components/HousingDemandDashboard';

export function DemandPrediction() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
          AI Housing Demand Prediction
        </h1>
        <div className="text-center mb-8">
          <p className="text-lg text-gray-600 mb-4">
            Predicting housing demand hotspots for next 2 years using machine learning
          </p>
          <div className="max-w-4xl mx-auto bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-3">
              🎯 Problem & Solution
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="font-semibold text-red-700 mb-2">❌ Problem:</h3>
                <p className="text-gray-700">
                  Cities don't know where affordable housing demands will spike, 
                  leading to poor planning and resource allocation.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-green-700 mb-2">✅ Solution:</h3>
                <p className="text-gray-700">
                  AI-powered prediction model using real estate data to forecast 
                  demand hotspots for next 2 years with city planning insights.
                </p>
              </div>
            </div>
          </div>
        </div>
        <HousingDemandDashboard />
      </div>
    </div>
  );
}