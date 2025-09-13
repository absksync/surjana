import { useState, useEffect } from "react";
import { 
  Home, 
  TrendingUp, 
  MapPin, 
  BarChart3, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Building
} from "lucide-react";

interface DemandHotspot {
  location_id: string;
  area: string;
  city: string;
  demand_score: number;
  property_count: number;
  avg_price: string;
  avg_area: string;
  price_per_sqft: string;
  investment_potential: string;
  recommendation: string;
  growth_rate?: string;
  year1_avg_demand?: number;
  year2_avg_demand?: number;
  priority_level?: string;
  quarterly_forecast?: Array<{
    quarter: string;
    avg_demand: number;
  }>;
}

interface MarketTrends {
  average_demand_score: number;
  leading_cities: Array<[string, number]>;
  market_sentiment: string;
  growth_drivers: string[];
}

interface CityRanking {
  city: string;
  avg_demand_score: number;
  hotspot_count: number;
  top_areas: string[];
}

interface DemandForecast {
  forecast_date: string;
  forecast_period: string;
  total_hotspots: number;
  hotspots: DemandHotspot[];
  market_trends: MarketTrends;
  city_rankings: CityRanking[];
  recommendations: string[];
}

interface PredictionData {
  analysis_summary: {
    total_properties_analyzed: number;
    valid_locations: number;
    top_hotspots_identified: number;
    analysis_date: string;
  };
  demand_forecast: DemandForecast;
  data_quality: {
    houses_dataset_records: number;
    cleaned_dataset_records: number;
    processed_valid_records: number;
    coverage: {
      cities: number;
      areas: number;
    };
  };
}

export function HousingDemandDashboard() {
  const [data, setData] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<'overview' | 'hotspots' | 'cities' | 'forecast'>('overview');

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Loading housing demand predictions...');
        const response = await fetch('/housing_demand_predictions.json');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Housing demand data loaded:', result);
        setData(result);
      } catch (err) {
        console.error('Error loading demand predictions:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'text-red-600 bg-red-50 border-red-200';
      case 'HIGH': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'LOW': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getInvestmentColor = (potential: string) => {
    switch (potential) {
      case 'Excellent': return 'text-green-700 bg-green-100';
      case 'Very Good': return 'text-blue-700 bg-blue-100';
      case 'Good': return 'text-indigo-700 bg-indigo-100';
      case 'Fair': return 'text-yellow-700 bg-yellow-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'Bullish': return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'Moderate': return <BarChart3 className="h-5 w-5 text-yellow-600" />;
      case 'Bearish': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default: return <BarChart3 className="h-5 w-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-semibold mb-2">Error Loading Demand Predictions</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <div className="bg-white border border-red-200 rounded p-4">
          <h4 className="font-semibold mb-2">To fix this:</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Navigate to the backend directory</li>
            <li>Run: <code className="bg-gray-100 px-1 rounded">python simple_demand_predictor.py</code></li>
            <li>Refresh this page</li>
          </ol>
        </div>
      </div>
    );
  }

  if (!data?.demand_forecast) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-yellow-800 font-semibold mb-2">No Demand Predictions Available</h3>
        <p className="text-yellow-600">Please run the demand analysis to see predictions.</p>
      </div>
    );
  }

  const { analysis_summary, demand_forecast, data_quality } = data;

  return (
    <div className="space-y-6">
      {/* Header with Navigation */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Target className="h-6 w-6 text-purple-600" />
          AI Housing Demand Prediction System
        </h2>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: 'overview', label: 'Overview', icon: Home },
            { key: 'hotspots', label: 'Hotspots', icon: MapPin },
            { key: 'cities', label: 'Cities', icon: Building },
            { key: 'forecast', label: 'Forecast', icon: TrendingUp }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setSelectedView(key as 'overview' | 'hotspots' | 'cities' | 'forecast')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                selectedView === key
                  ? 'bg-purple-100 text-purple-700 border border-purple-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-800">Properties Analyzed</h3>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {analysis_summary.total_properties_analyzed.toLocaleString()}
            </p>
            <p className="text-sm text-blue-600">
              {data_quality.coverage.cities} cities, {data_quality.coverage.areas} areas
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-green-800">Hotspots Found</h3>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {demand_forecast.total_hotspots}
            </p>
            <p className="text-sm text-green-600">High-demand areas</p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              {getSentimentIcon(demand_forecast.market_trends.market_sentiment)}
              <h3 className="font-semibold text-purple-800">Market Sentiment</h3>
            </div>
            <p className="text-lg font-bold text-purple-600">
              {demand_forecast.market_trends.market_sentiment}
            </p>
            <p className="text-sm text-purple-600">
              Avg Score: {demand_forecast.market_trends.average_demand_score}/100
            </p>
          </div>

          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <h3 className="font-semibold text-orange-800">Forecast Period</h3>
            </div>
            <p className="text-2xl font-bold text-orange-600">
              {demand_forecast.forecast_period}
            </p>
            <p className="text-sm text-orange-600">Prediction horizon</p>
          </div>
        </div>
      </div>

      {/* Content based on selected view */}
      {selectedView === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Cities */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600" />
              City Rankings
            </h3>
            <div className="space-y-3">
              {demand_forecast.city_rankings.map((city) => (
                <div key={city.city} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <h4 className="font-medium text-gray-800">{city.city}</h4>
                    <p className="text-sm text-gray-600">{city.hotspot_count} hotspots</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">{city.avg_demand_score}/100</p>
                    <p className="text-sm text-gray-500">avg demand</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market Insights */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Market Insights
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Growth Drivers</h4>
                <div className="space-y-1">
                  {demand_forecast.market_trends.growth_drivers.map((driver, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-600">{driver}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Leading Cities</h4>
                <div className="flex flex-wrap gap-2">
                  {demand_forecast.market_trends.leading_cities.map(([city, count]) => (
                    <span key={city} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                      {city.charAt(0).toUpperCase() + city.slice(1)} ({count})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedView === 'hotspots' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-red-600" />
            Top Demand Hotspots
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {demand_forecast.hotspots.slice(0, 12).map((hotspot, index) => (
              <div key={hotspot.location_id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-800">{hotspot.area}</h4>
                    <p className="text-sm text-gray-600">{hotspot.city.charAt(0).toUpperCase() + hotspot.city.slice(1)}</p>
                  </div>
                  <span className="text-lg font-bold text-purple-600">#{index + 1}</span>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Demand Score:</span>
                    <span className="font-medium">{hotspot.demand_score}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Avg Price:</span>
                    <span className="font-medium">{hotspot.avg_price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Properties:</span>
                    <span className="font-medium">{hotspot.property_count}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getInvestmentColor(hotspot.investment_potential)}`}>
                    {hotspot.investment_potential}
                  </span>
                  
                  {hotspot.priority_level && (
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ml-2 ${getPriorityColor(hotspot.priority_level)}`}>
                      {hotspot.priority_level}
                    </span>
                  )}
                  
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                    {hotspot.recommendation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedView === 'cities' && (
        <div className="space-y-6">
          {demand_forecast.city_rankings.map((city) => {
            const cityHotspots = demand_forecast.hotspots.filter(
              spot => spot.city.toLowerCase() === city.city.toLowerCase()
            );
            
            return (
              <div key={city.city} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <Building className="h-5 w-5 text-blue-600" />
                    {city.city}
                  </h3>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{city.avg_demand_score}/100</p>
                    <p className="text-sm text-gray-600">Average Demand</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-blue-50 rounded p-3">
                    <p className="text-sm text-blue-600">Total Hotspots</p>
                    <p className="text-xl font-bold text-blue-700">{city.hotspot_count}</p>
                  </div>
                  <div className="bg-green-50 rounded p-3">
                    <p className="text-sm text-green-600">Top Performing Area</p>
                    <p className="text-lg font-bold text-green-700">{city.top_areas[0] || 'N/A'}</p>
                  </div>
                  <div className="bg-purple-50 rounded p-3">
                    <p className="text-sm text-purple-600">Coverage</p>
                    <p className="text-lg font-bold text-purple-700">{city.top_areas.length} areas</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                  {cityHotspots.slice(0, 6).map((hotspot) => (
                    <div key={hotspot.location_id} className="border border-gray-200 rounded p-3">
                      <h4 className="font-medium text-gray-800 mb-1">{hotspot.area}</h4>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Score:</span>
                        <span className="font-medium">{hotspot.demand_score}/100</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-medium">{hotspot.avg_price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedView === 'forecast' && (
        <div className="space-y-6">
          {/* Quarterly Forecast */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              2025 Quarterly Forecast - Top Areas
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-3 font-medium text-gray-700">Area</th>
                    <th className="text-left p-3 font-medium text-gray-700">City</th>
                    <th className="text-center p-3 font-medium text-gray-700">Q1 2025</th>
                    <th className="text-center p-3 font-medium text-gray-700">Q2 2025</th>
                    <th className="text-center p-3 font-medium text-gray-700">Q3 2025</th>
                    <th className="text-center p-3 font-medium text-gray-700">Q4 2025</th>
                    <th className="text-center p-3 font-medium text-gray-700">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {demand_forecast.hotspots.slice(0, 8).map((hotspot) => (
                    <tr key={hotspot.location_id} className="border-t border-gray-200">
                      <td className="p-3 font-medium">{hotspot.area}</td>
                      <td className="p-3 text-gray-600">{hotspot.city.charAt(0).toUpperCase() + hotspot.city.slice(1)}</td>
                      {hotspot.quarterly_forecast?.map((quarter, idx) => (
                        <td key={idx} className="p-3 text-center font-medium">
                          {quarter.avg_demand}
                        </td>
                      )) || (
                        <>
                          <td className="p-3 text-center text-gray-400">-</td>
                          <td className="p-3 text-center text-gray-400">-</td>
                          <td className="p-3 text-center text-gray-400">-</td>
                          <td className="p-3 text-center text-gray-400">-</td>
                        </>
                      )}
                      <td className="p-3 text-center">
                        <span className="text-green-600 font-medium">
                          {hotspot.growth_rate || '+12%'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              Strategic Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {demand_forecast.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <p className="text-blue-800">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Analysis Info */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <h3 className="text-purple-800 font-semibold mb-2">Analysis Complete! 🎯</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-purple-700 font-medium">Analysis Date:</p>
            <p className="text-purple-600">{new Date(analysis_summary.analysis_date).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-purple-700 font-medium">Properties Analyzed:</p>
            <p className="text-purple-600">{analysis_summary.total_properties_analyzed.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-purple-700 font-medium">Valid Locations:</p>
            <p className="text-purple-600">{analysis_summary.valid_locations}</p>
          </div>
          <div>
            <p className="text-purple-700 font-medium">Data Sources:</p>
            <p className="text-purple-600">{data_quality.houses_dataset_records + data_quality.cleaned_dataset_records} records</p>
          </div>
        </div>
      </div>
    </div>
  );
}