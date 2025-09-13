import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Users, 
  MapPin, 
  Award, 
  CheckCircle, 
  Home,
  Zap,
  Star,
  TrendingUp,
  Heart
} from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { allocateHousing, generateSampleApplicants, type Applicant } from '../utils/housingAllocation';

export function FairHousingAllocator() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [allocatedApplicants, setAllocatedApplicants] = useState<Applicant[]>([]);
  const [availableUnits, setAvailableUnits] = useState(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Generate initial sample data
    const sampleApplicants = generateSampleApplicants(25);
    setApplicants(sampleApplicants);
  }, []);

  const handleAllocateHousing = () => {
    setLoading(true);
    setAllocatedApplicants([]); // Clear previous results with animation
    
    // Simulate processing time with realistic loading states
    setTimeout(() => {
      const allocated = allocateHousing(applicants, availableUnits);
      setAllocatedApplicants(allocated);
      setLoading(false);
    }, 1500);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="p-8 bg-gradient-to-br from-white via-orange-50 to-red-50 shadow-2xl border border-orange-200/50 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3 flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-4 shadow-lg transform hover:rotate-6 transition-transform duration-300">
            <Award className="w-7 h-7 text-white" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600">
            Fair Housing Allocator
          </span>
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          🏠 AI-powered fair allocation system based on income, family size, disability status, and commute distance
        </p>
      </div>

      {/* Enhanced Controls */}
      <div className="mb-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-200">
        <div className="flex items-center space-x-3">
          <Home className="w-6 h-6 text-blue-600" />
          <label htmlFor="units" className="text-lg font-semibold text-gray-800">
            Available Units:
          </label>
          <input
            id="units"
            type="number"
            min="1"
            max="25"
            value={availableUnits}
            onChange={(e) => setAvailableUnits(parseInt(e.target.value) || 1)}
            className="w-24 px-4 py-2 border-2 border-blue-300 rounded-xl text-lg font-bold text-center focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300"
          />
        </div>
        <Button
          onClick={handleAllocateHousing}
          disabled={loading}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2 group"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="animate-pulse">Processing Algorithm...</span>
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 group-hover:animate-bounce transition-all duration-300" />
              <span>Run Fair Allocation</span>
            </>
          )}
        </Button>
      </div>

      {/* Enhanced Statistics with Real Estate Colors and Modern Loading States */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:rotate-1 group cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <Users className="w-8 h-8 text-blue-100 group-hover:scale-110 transition-transform duration-300" />
            <Star className="w-6 h-6 text-yellow-300 animate-pulse group-hover:animate-bounce" />
          </div>
          <p className="text-3xl font-extrabold mb-1 group-hover:scale-110 transition-transform duration-300">{applicants.length}</p>
          <p className="text-blue-100 font-medium group-hover:text-white transition-colors duration-300">Total Applicants</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:rotate-1 group cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <Home className="w-8 h-8 text-green-100 group-hover:scale-110 transition-transform duration-300" />
            <CheckCircle className="w-6 h-6 text-green-200 group-hover:animate-pulse" />
          </div>
          <p className="text-3xl font-extrabold mb-1 group-hover:scale-110 transition-transform duration-300">{availableUnits}</p>
          <p className="text-green-100 font-medium group-hover:text-white transition-colors duration-300">Units Available</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-2xl text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:rotate-1 group cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <Award className="w-8 h-8 text-purple-100 group-hover:scale-110 transition-transform duration-300" />
            <TrendingUp className="w-6 h-6 text-pink-200 animate-bounce group-hover:animate-pulse" />
          </div>
          <p className="text-3xl font-extrabold mb-1 group-hover:scale-110 transition-transform duration-300">
            {loading ? (
              <span className="animate-pulse">...</span>
            ) : (
              allocatedApplicants.length
            )}
          </p>
          <p className="text-purple-100 font-medium group-hover:text-white transition-colors duration-300">Allocated</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-2xl text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:rotate-1 group cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <Users className="w-8 h-8 text-orange-100 group-hover:scale-110 transition-transform duration-300" />
            <Zap className="w-6 h-6 text-yellow-300 animate-pulse group-hover:animate-bounce" />
          </div>
          <p className="text-3xl font-extrabold mb-1 group-hover:scale-110 transition-transform duration-300">
            {loading ? (
              <span className="animate-pulse">...</span>
            ) : (
              applicants.length - allocatedApplicants.length
            )}
          </p>
          <p className="text-orange-100 font-medium group-hover:text-white transition-colors duration-300">Waitlist</p>
        </div>
      </div>

      {/* Enhanced Allocated Applicants Table with Loading States */}
      {loading && (
        <div className="mb-8">
          <div className="flex items-center justify-center p-12 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-purple-200">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4 animate-pulse">
                <Award className="w-8 h-8 text-white animate-bounce" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Fair Allocation Algorithm</h3>
              <p className="text-gray-600 mb-4">Analyzing {applicants.length} applications using AI-powered fairness scoring...</p>
              <div className="w-64 bg-gray-200 rounded-full h-2 mx-auto">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {allocatedApplicants.length > 0 && !loading && (
        <div className="overflow-x-auto animate-fade-in">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3 animate-bounce">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">
              🏆 Allocated Housing Units ({allocatedApplicants.length})
            </span>
          </h3>
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden shadow-2xl border border-gray-200 transform hover:scale-[1.01] transition-all duration-300">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-800 to-gray-900">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    <div className="flex items-center group">
                      <Star className="w-4 h-4 mr-2 text-yellow-300 group-hover:animate-spin" />
                      Applicant
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    <div className="flex items-center group">
                      <DollarSign className="w-4 h-4 mr-2 text-green-300 group-hover:animate-bounce" />
                      Income
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    <div className="flex items-center group">
                      <Users className="w-4 h-4 mr-2 text-blue-300 group-hover:animate-pulse" />
                      Family Size
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    <div className="flex items-center group">
                      <Heart className="w-4 h-4 mr-2 text-purple-300 group-hover:animate-pulse" />
                      Disability
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    <div className="flex items-center group">
                      <MapPin className="w-4 h-4 mr-2 text-orange-300 group-hover:animate-bounce" />
                      Distance
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    <div className="flex items-center group">
                      <Award className="w-4 h-4 mr-2 text-yellow-300 group-hover:animate-spin" />
                      Score
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {allocatedApplicants.map((applicant, index) => (
                  <tr 
                    key={applicant.id} 
                    className={`hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-300 transform hover:scale-[1.01] ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } ${index < 3 ? 'border-l-4 border-l-orange-500' : ''} animate-slide-up`}
                    style={{animationDelay: `${index * 100}ms`}}
                  >
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        {index < 3 && (
                          <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-3 animate-pulse hover:animate-bounce transition-all duration-300">
                            <span className="text-white font-bold text-sm">{index + 1}</span>
                          </div>
                        )}
                        <div>
                          <div className="text-lg font-bold text-gray-900 hover:text-orange-600 transition-colors duration-300">{applicant.name}</div>
                          <div className="text-sm text-gray-500 font-medium">{applicant.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-lg font-bold text-gray-900 hover:text-green-600 transition-colors duration-300">{formatCurrency(applicant.income)}</div>
                      <div className="text-sm text-gray-500 font-medium">Annual</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300 hover:scale-105 transition-transform duration-300">
                        <Users className="w-4 h-4 mr-1" />
                        {applicant.familySize} {applicant.familySize === 1 ? 'person' : 'people'}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {applicant.hasDisability ? (
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300 hover:scale-105 transition-transform duration-300">
                          <Heart className="w-4 h-4 mr-1 animate-pulse" />
                          Priority
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-300 hover:scale-105 transition-transform duration-300">
                          No
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-lg font-bold text-gray-900 hover:text-orange-600 transition-colors duration-300">{applicant.distanceToWork} miles</div>
                      <div className="text-sm text-gray-500 font-medium">to work</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 hover:scale-110 transition-transform duration-300">
                          {applicant.fairnessScore?.toFixed(1)}
                        </div>
                        <div className="flex-1">
                          <div className="w-20 bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 h-3 rounded-full shadow-lg transition-all duration-1000 animate-slide-right"
                              style={{ width: `${Math.min((applicant.fairnessScore || 0) / 100 * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Enhanced Help Text */}
      <div className="mt-8 p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border border-blue-200 shadow-lg">
        <h4 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2" />
          🎯 How Fair Allocation Algorithm Works:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ul className="space-y-3 text-blue-800">
            <li className="flex items-center">
              <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-xs font-bold">40%</span>
              </div>
              <div>
                <strong className="text-blue-900">Income Priority:</strong> Lower income families receive higher priority
              </div>
            </li>
            <li className="flex items-center">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-xs font-bold">25%</span>
              </div>
              <div>
                <strong className="text-blue-900">Family Size:</strong> Larger families receive higher priority
              </div>
            </li>
          </ul>
          <ul className="space-y-3 text-blue-800">
            <li className="flex items-center">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-xs font-bold">20%</span>
              </div>
              <div>
                <strong className="text-blue-900">Disability Status:</strong> Applicants with disabilities receive priority
              </div>
            </li>
            <li className="flex items-center">
              <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-xs font-bold">15%</span>
              </div>
              <div>
                <strong className="text-blue-900">Commute Distance:</strong> Shorter work commute receives higher priority
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
}