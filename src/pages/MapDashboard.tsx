import React from 'react';
import HousingDemandMap from '../components/HousingDemandMap';

const MapDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Housing Demand Hotspot Map
          </h1>
          <p className="text-lg text-gray-600">
            Interactive geographical visualization of housing demand across NCR region
          </p>
        </div>
        
        {/* Map Section */}
        <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Interactive Demand Map
            </h2>
            <p className="text-gray-600">
              Explore housing demand hotspots with heatmap visualization, property markers, and demand analytics.
              Use the controls to filter by demand score, price, and location.
            </p>
          </div>
          
          {/* Full-width Map */}
          <div className="w-full" style={{ height: '600px' }}>
            <HousingDemandMap />
          </div>
        </div>
        
        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 text-xl">🔥</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 ml-3">Demand Hotspots</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Red areas indicate high housing demand zones with scores above 70/100. 
              These locations show strong investment potential and market activity.
            </p>
            <div className="text-xs text-gray-500">
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span>High Demand (70-100)</span>
              </div>
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                <span>Medium-High (60-69)</span>
              </div>
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span>Medium (50-59)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>Lower Demand (&lt;50)</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">🏠</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 ml-3">Property Markers</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Individual property markers show exact locations with detailed information including 
              price, area, demand score, and nearby amenities.
            </p>
            <div className="text-xs text-gray-500">
              <div className="mb-2">
                <strong>Click markers</strong> to view:
              </div>
              <ul className="list-disc list-inside space-y-1">
                <li>Property details & pricing</li>
                <li>Demand score analysis</li>
                <li>Area and bedroom count</li>
                <li>Nearby locations & amenities</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 ml-3">Interactive Controls</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Use the control panel to filter properties by demand score, price range, 
              and city. Toggle layers to focus on specific data points.
            </p>
            <div className="text-xs text-gray-500">
              <div className="mb-2">
                <strong>Available filters:</strong>
              </div>
              <ul className="list-disc list-inside space-y-1">
                <li>Minimum demand score slider</li>
                <li>Maximum price range</li>
                <li>City selection filter</li>
                <li>Layer visibility toggles</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="bg-white rounded-xl shadow-xl p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Map Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">🗺️ Visualization Layers</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <div>
                    <strong>Heatmap Layer:</strong> Color-coded density visualization showing demand intensity across regions
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <div>
                    <strong>Property Markers:</strong> Individual property locations with detailed popup information
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <div>
                    <strong>Hotspot Markers:</strong> Aggregated high-demand zones with area statistics
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <div>
                    <strong>Multiple Base Maps:</strong> Switch between OpenStreetMap and satellite imagery
                  </div>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">⚙️ Advanced Controls</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <div>
                    <strong>Dynamic Filtering:</strong> Real-time updates based on demand score and price criteria
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <div>
                    <strong>City-based Views:</strong> Focus on specific cities (Gurgaon, Faridabad, Delhi)
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-teal-500 mr-2">•</span>
                  <div>
                    <strong>Layer Toggles:</strong> Show/hide specific data layers for cleaner visualization
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <div>
                    <strong>Interactive Popups:</strong> Detailed property information with demand analytics
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Data Sources */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">📊 Data Sources & Coverage</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <strong>Dataset Sources:</strong>
              <ul className="mt-1 space-y-1">
                <li>• houses.csv (1,044 properties)</li>
                <li>• house_cleaned.csv (964 properties)</li>
                <li>• Total: 2,008 property records</li>
              </ul>
            </div>
            <div>
              <strong>Geographic Coverage:</strong>
              <ul className="mt-1 space-y-1">
                <li>• Gurgaon/Gurugram (Primary)</li>
                <li>• Faridabad (Secondary)</li>
                <li>• Delhi NCR (Extended)</li>
                <li>• 89+ areas mapped</li>
              </ul>
            </div>
            <div>
              <strong>Analysis Metrics:</strong>
              <ul className="mt-1 space-y-1">
                <li>• Demand scoring algorithm</li>
                <li>• Price accessibility analysis</li>
                <li>• Location desirability factors</li>
                <li>• Connectivity & amenities</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapDashboard;