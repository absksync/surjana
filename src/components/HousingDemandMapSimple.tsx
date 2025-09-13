import { useState, useEffect } from 'react';
import { MapPin, TrendingUp, Building, Users } from 'lucide-react';
import { Card } from './ui/Card';

interface HousingDemandData {
  area: string;
  coordinates: [number, number];
  demandScore: number;
  availableUnits: number;
  averageRent: number;
  population: number;
}

export function HousingDemandMapSimple() {
  const [demandData, setDemandData] = useState<HousingDemandData[]>([]);
  const [selectedArea, setSelectedArea] = useState<HousingDemandData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate mock housing demand data
    const mockData: HousingDemandData[] = [
      {
        area: 'Downtown Delhi',
        coordinates: [28.6139, 77.2090],
        demandScore: 85,
        availableUnits: 45,
        averageRent: 15000,
        population: 25000
      },
      {
        area: 'Sector 15, Gurgaon',
        coordinates: [28.4595, 77.0266],
        demandScore: 78,
        availableUnits: 32,
        averageRent: 12000,
        population: 18000
      },
      {
        area: 'Sector 21, Faridabad',
        coordinates: [28.3670, 77.3155],
        demandScore: 72,
        availableUnits: 58,
        averageRent: 10000,
        population: 22000
      },
      {
        area: 'Sector 12, Noida',
        coordinates: [28.5355, 77.3910],
        demandScore: 90,
        availableUnits: 28,
        averageRent: 16000,
        population: 30000
      },
      {
        area: 'Dwarka, New Delhi',
        coordinates: [28.5921, 77.0460],
        demandScore: 68,
        availableUnits: 67,
        averageRent: 11000,
        population: 20000
      },
      {
        area: 'Vasant Kunj, Delhi',
        coordinates: [28.5200, 77.1588],
        demandScore: 82,
        availableUnits: 38,
        averageRent: 14000,
        population: 28000
      }
    ];

    setTimeout(() => {
      setDemandData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const getDemandColor = (score: number) => {
    if (score >= 80) return 'bg-red-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getDemandLabel = (score: number) => {
    if (score >= 80) return 'High Demand';
    if (score >= 60) return 'Medium Demand';
    return 'Low Demand';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <Card className="p-6 bg-gradient-to-br from-white via-blue-50 to-purple-50 shadow-xl border border-blue-200/50 hover:shadow-2xl transition-all duration-500">
        <div className="animate-pulse">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl animate-pulse mr-3"></div>
            <div className="h-6 bg-gradient-to-r from-blue-200 to-purple-200 rounded w-1/3"></div>
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-2/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg animate-pulse" style={{animationDelay: `${i * 100}ms`}}></div>
              ))}
            </div>
            <div className="h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 bg-gradient-to-br from-white via-blue-50 to-purple-50 shadow-2xl border border-blue-200/50 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3 flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4 shadow-lg transform hover:rotate-6 transition-transform duration-300">
            <MapPin className="w-7 h-7 text-white" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Housing Demand Map
          </span>
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          🏗️ AI-powered analysis of housing demand across different areas with real-time insights
        </p>
      </div>

      {/* Enhanced Map Visualization with Modern Interactions */}
      <div className="mb-8">
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200/50 shadow-inner hover:shadow-lg transition-all duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demandData.map((area, index) => (
              <div
                key={index}
                onClick={() => setSelectedArea(area)}
                className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:rotate-1 group ${
                  selectedArea?.area === area.area
                    ? 'bg-gradient-to-br from-white to-blue-50 shadow-2xl ring-4 ring-blue-400/50 scale-105 animate-glow'
                    : 'bg-white shadow-lg hover:shadow-2xl hover-lift'
                } animate-slide-up`}
                style={{animationDelay: `${index * 100}ms`}}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 text-base group-hover:text-blue-600 transition-colors duration-300">{area.area}</h3>
                  <div className={`w-4 h-4 rounded-full ${getDemandColor(area.demandScore)} group-hover:scale-125 transition-transform duration-300 shadow-lg animate-pulse`}></div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-medium">Demand Score:</span>
                    <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{area.demandScore}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-medium">Available:</span>
                    <span className="font-bold text-green-600 group-hover:scale-110 transition-transform duration-300">{area.availableUnits} units</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-medium">Avg Rent:</span>
                    <span className="font-bold text-purple-600 group-hover:scale-110 transition-transform duration-300">{formatCurrency(area.averageRent)}</span>
                  </div>
                  
                  {/* Modern Progress Bar */}
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-1000 ${getDemandColor(area.demandScore).replace('bg-', 'bg-gradient-to-r from-')} to-opacity-80 group-hover:animate-pulse`}
                        style={{ width: `${area.demandScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Selected Area Details with Modern Styling */}
      {selectedArea && (
        <div className="mb-8 p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border-2 border-blue-300/50 shadow-xl animate-fade-in">
          <h3 className="text-2xl font-bold text-blue-900 mb-6 flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-3 animate-float">
              <Building className="w-6 h-6 text-white" />
            </div>
            {selectedArea.area} - Detailed Analysis
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center group">
              <div className="text-4xl font-extrabold text-blue-900 mb-2 group-hover:scale-110 transition-transform duration-300">{selectedArea.demandScore}</div>
              <div className="text-sm text-blue-700 font-semibold mb-2">Demand Score</div>
              <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold text-white ${getDemandColor(selectedArea.demandScore)} shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                {getDemandLabel(selectedArea.demandScore)}
              </div>
            </div>
            <div className="text-center group">
              <div className="text-4xl font-extrabold text-green-600 mb-2 group-hover:scale-110 transition-transform duration-300">{selectedArea.availableUnits}</div>
              <div className="text-sm text-blue-700 font-semibold">Available Units</div>
              <div className="text-xs text-gray-500 mt-1">Ready to Allocate</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl font-extrabold text-purple-600 mb-2 group-hover:scale-110 transition-transform duration-300">{formatCurrency(selectedArea.averageRent)}</div>
              <div className="text-sm text-blue-700 font-semibold">Average Rent</div>
              <div className="text-xs text-gray-500 mt-1">Per Month</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl font-extrabold text-orange-600 mb-2 group-hover:scale-110 transition-transform duration-300">{selectedArea.population.toLocaleString()}</div>
              <div className="text-sm text-blue-700 font-semibold">Population</div>
              <div className="text-xs text-gray-500 mt-1">Total Residents</div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Summary Statistics with Modern Styling */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:rotate-1 group cursor-pointer">
          <div className="flex items-center mb-4">
            <Building className="w-8 h-8 text-green-100 mr-3 group-hover:scale-110 group-hover:animate-bounce transition-all duration-300" />
            <span className="text-lg font-bold text-green-100 group-hover:text-white transition-colors duration-300">Total Units</span>
          </div>
          <p className="text-4xl font-extrabold text-white group-hover:scale-110 transition-transform duration-300">
            {demandData.reduce((sum, area) => sum + area.availableUnits, 0)}
          </p>
          <p className="text-green-100 text-sm mt-2 group-hover:text-white transition-colors duration-300">Available for Allocation</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:rotate-1 group cursor-pointer">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-8 h-8 text-blue-100 mr-3 group-hover:scale-110 group-hover:animate-bounce transition-all duration-300" />
            <span className="text-lg font-bold text-blue-100 group-hover:text-white transition-colors duration-300">Avg Demand</span>
          </div>
          <p className="text-4xl font-extrabold text-white group-hover:scale-110 transition-transform duration-300">
            {Math.round(demandData.reduce((sum, area) => sum + area.demandScore, 0) / demandData.length)}
          </p>
          <p className="text-blue-100 text-sm mt-2 group-hover:text-white transition-colors duration-300">Demand Score Index</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-2xl text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:rotate-1 group cursor-pointer">
          <div className="flex items-center mb-4">
            <MapPin className="w-8 h-8 text-purple-100 mr-3 group-hover:scale-110 group-hover:animate-bounce transition-all duration-300" />
            <span className="text-lg font-bold text-purple-100 group-hover:text-white transition-colors duration-300">Areas Covered</span>
          </div>
          <p className="text-4xl font-extrabold text-white group-hover:scale-110 transition-transform duration-300">{demandData.length}</p>
          <p className="text-purple-100 text-sm mt-2 group-hover:text-white transition-colors duration-300">Geographic Regions</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-2xl text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:rotate-1 group cursor-pointer">
          <div className="flex items-center mb-4">
            <Users className="w-8 h-8 text-orange-100 mr-3 group-hover:scale-110 group-hover:animate-bounce transition-all duration-300" />
            <span className="text-lg font-bold text-orange-100 group-hover:text-white transition-colors duration-300">Total Population</span>
          </div>
          <p className="text-4xl font-extrabold text-white group-hover:scale-110 transition-transform duration-300">
            {(demandData.reduce((sum, area) => sum + area.population, 0) / 1000).toFixed(0)}k
          </p>
          <p className="text-orange-100 text-sm mt-2 group-hover:text-white transition-colors duration-300">Potential Applicants</p>
        </div>
      </div>

      {/* Modern Enhanced Legend */}
      <div className="p-6 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-6 h-6 mr-3 text-blue-600" />
          🎯 Demand Score Legend:
        </h4>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-8 text-base">
          <div className="flex items-center group cursor-pointer">
            <div className="w-4 h-4 rounded-full bg-green-500 mr-3 group-hover:scale-125 group-hover:shadow-lg transition-all duration-300"></div>
            <span className="text-gray-700 font-medium group-hover:text-green-600 transition-colors duration-300">Low Demand (0-59)</span>
          </div>
          <div className="flex items-center group cursor-pointer">
            <div className="w-4 h-4 rounded-full bg-yellow-500 mr-3 group-hover:scale-125 group-hover:shadow-lg transition-all duration-300"></div>
            <span className="text-gray-700 font-medium group-hover:text-yellow-600 transition-colors duration-300">Medium Demand (60-79)</span>
          </div>
          <div className="flex items-center group cursor-pointer">
            <div className="w-4 h-4 rounded-full bg-red-500 mr-3 group-hover:scale-125 group-hover:shadow-lg transition-all duration-300"></div>
            <span className="text-gray-700 font-medium group-hover:text-red-600 transition-colors duration-300">High Demand (80-100)</span>
          </div>
        </div>
        <div className="mt-4 p-4 bg-white/50 rounded-xl border border-blue-200/50">
          <p className="text-sm text-gray-600 leading-relaxed">
            💡 <strong>Pro Tip:</strong> Areas with high demand scores typically have limited housing supply relative to population needs. 
            Our AI algorithm prioritizes fair allocation based on multiple factors including demand intensity and demographic requirements.
          </p>
        </div>
      </div>
    </Card>
  );
}