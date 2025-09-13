import { useState, useEffect } from "react";
import { BarChart3, Home, DollarSign, MapPin, TrendingUp, Database, Bed } from "lucide-react";

interface RealEstateData {
  dataset_info?: {
    shape: [number, number];
    columns: string[];
    missing_values: Record<string, number>;
    datasets_analyzed: string[];
  };
  analysis_results?: {
    datasets: {
      houses?: {
        record_count: number;
        price_analysis: {
          min: number;
          max: number;
          mean: number;
          count: number;
        };
        area_analysis: {
          min: number;
          max: number;
          mean: number;
        };
        bedroom_distribution: Record<string, number>;
        location_distribution: Record<string, number>;
        correlations: Record<string, number>;
      };
      house_cleaned?: {
        record_count: number;
        price_analysis: {
          min: number;
          max: number;
          mean: number;
          count: number;
        };
        property_type_distribution: Record<string, number>;
        society_distribution: Record<string, number>;
        correlations: Record<string, number>;
      };
    };
    summary: {
      total_datasets: number;
      total_records: number;
    };
  };
}

export function RealEstateDataDashboard() {
  const [data, setData] = useState<RealEstateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Fetching real estate data...');
        const response = await fetch('/analysis_results.json');
        console.log('Response:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Real estate data loaded:', result);
        setData(result);
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  const formatArea = (area: number) => {
    return `${area.toLocaleString()} sq ft`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-semibold mb-2">Error Loading Real Estate Data</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <div className="bg-white border border-red-200 rounded p-4">
          <h4 className="font-semibold mb-2">To fix this:</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Navigate to the python-analysis directory</li>
            <li>Run: <code className="bg-gray-100 px-1 rounded">python real_estate_analysis.py</code></li>
            <li>Refresh this page</li>
          </ol>
        </div>
      </div>
    );
  }

  if (!data?.analysis_results) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-yellow-800 font-semibold mb-2">No Real Estate Data</h3>
        <p className="text-yellow-600">No analysis results found. Please run the analysis script.</p>
      </div>
    );
  }

  const { analysis_results } = data;
  const housesData = analysis_results.datasets.houses;
  const cleanedData = analysis_results.datasets.house_cleaned;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Home className="h-6 w-6 text-blue-600" />
          Real Estate Analysis Dashboard
        </h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Database className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-800">Total Records</h3>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {analysis_results.summary.total_records.toLocaleString()}
            </p>
            <p className="text-sm text-blue-600">
              {analysis_results.summary.total_datasets} datasets
            </p>
          </div>

          {housesData && (
            <>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-green-800">Avg Price</h3>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {formatPrice(housesData.price_analysis.mean)}
                </p>
                <p className="text-sm text-green-600">houses.csv</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold text-purple-800">Price Range</h3>
                </div>
                <p className="text-lg font-bold text-purple-600">
                  {formatPrice(housesData.price_analysis.min)}
                </p>
                <p className="text-sm text-purple-600">
                  to {formatPrice(housesData.price_analysis.max)}
                </p>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-5 w-5 text-orange-600" />
                  <h3 className="font-semibold text-orange-800">Avg Area</h3>
                </div>
                <p className="text-2xl font-bold text-orange-600">
                  {formatArea(housesData.area_analysis.mean)}
                </p>
                <p className="text-sm text-orange-600">average size</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Dataset Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Houses Dataset */}
        {housesData && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Home className="h-5 w-5 text-blue-600" />
              Houses Dataset
            </h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded p-4">
                <h4 className="font-medium text-gray-700 mb-2">Dataset Overview</h4>
                <p className="text-sm text-gray-600">Records: {housesData.record_count.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Price Range: {formatPrice(housesData.price_analysis.min)} - {formatPrice(housesData.price_analysis.max)}</p>
              </div>

              {/* Bedroom Distribution */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <Bed className="h-4 w-4" />
                  Bedroom Distribution
                </h4>
                <div className="space-y-1">
                  {Object.entries(housesData.bedroom_distribution).slice(0, 5).map(([bedrooms, count]) => (
                    <div key={bedrooms} className="flex justify-between text-sm">
                      <span>{bedrooms} bedrooms</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Locations */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Top Locations
                </h4>
                <div className="space-y-1">
                  {Object.entries(housesData.location_distribution).slice(0, 3).map(([location, count]) => (
                    <div key={location} className="flex justify-between text-sm">
                      <span className="truncate">{location.substring(0, 30)}...</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Correlations */}
              {Object.keys(housesData.correlations).length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Price Correlations</h4>
                  <div className="space-y-1">
                    {Object.entries(housesData.correlations).map(([feature, corr]) => (
                      <div key={feature} className="flex justify-between text-sm">
                        <span className="capitalize">{feature}</span>
                        <span className={`font-medium ${corr > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {corr.toFixed(3)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cleaned Dataset */}
        {cleanedData && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              Cleaned Dataset
            </h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded p-4">
                <h4 className="font-medium text-gray-700 mb-2">Dataset Overview</h4>
                <p className="text-sm text-gray-600">Records: {cleanedData.record_count.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Price Range: {formatPrice(cleanedData.price_analysis.min)} - {formatPrice(cleanedData.price_analysis.max)}</p>
              </div>

              {/* Property Types */}
              {cleanedData.property_type_distribution && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Property Types</h4>
                  <div className="space-y-1">
                    {Object.entries(cleanedData.property_type_distribution).map(([type, count]) => (
                      <div key={type} className="flex justify-between text-sm">
                        <span className="capitalize">{type}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Top Societies */}
              {cleanedData.society_distribution && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Top Societies</h4>
                  <div className="space-y-1">
                    {Object.entries(cleanedData.society_distribution).slice(0, 5).map(([society, count]) => (
                      <div key={society} className="flex justify-between text-sm">
                        <span className="truncate capitalize">{society.substring(0, 20)}...</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Correlations */}
              {Object.keys(cleanedData.correlations).length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Price Correlations</h4>
                  <div className="space-y-1">
                    {Object.entries(cleanedData.correlations).map(([feature, corr]) => (
                      <div key={feature} className="flex justify-between text-sm">
                        <span className="capitalize">{feature}</span>
                        <span className={`font-medium ${corr > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {corr.toFixed(3)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Datasets Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Datasets Analyzed</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.dataset_info?.datasets_analyzed.map((dataset) => (
            <div key={dataset} className="bg-blue-50 rounded p-4">
              <h4 className="font-medium text-blue-800">{dataset}</h4>
              <p className="text-sm text-blue-600">
                {dataset === 'houses.csv' ? housesData?.record_count.toLocaleString() : cleanedData?.record_count.toLocaleString()} records
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-blue-800 font-semibold mb-2">Analysis Complete! 🎉</h3>
        <ul className="text-blue-700 space-y-1 text-sm">
          <li>• {analysis_results.summary.total_records.toLocaleString()} real estate records analyzed</li>
          <li>• Price trends and correlations calculated</li>
          <li>• Location and property type distributions mapped</li>
          <li>• Ready for advanced visualizations and ML models</li>
        </ul>
      </div>
    </div>
  );
}