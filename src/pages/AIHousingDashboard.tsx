import { Brain, BarChart3, Sparkles } from 'lucide-react';
import { FairHousingAllocator } from '../components/FairHousingAllocator';
import { HousingDemandMapSimple } from '../components/HousingDemandMapSimple';

export function AIHousingDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 relative overflow-hidden">
      {/* Housing.com Style Background with Building Silhouettes */}
      <div className="absolute inset-0">
        {/* Building Silhouettes */}
        <div className="absolute bottom-0 left-0 w-20 h-32 bg-purple-800/30 transform -skew-x-12"></div>
        <div className="absolute bottom-0 left-16 w-16 h-40 bg-purple-700/25"></div>
        <div className="absolute bottom-0 left-28 w-12 h-24 bg-purple-800/35 transform skew-x-6"></div>
        <div className="absolute bottom-0 left-36 w-24 h-48 bg-purple-700/20"></div>
        <div className="absolute bottom-0 left-56 w-18 h-36 bg-purple-800/30 transform -skew-x-8"></div>
        
        <div className="absolute bottom-0 right-0 w-28 h-44 bg-purple-800/25 transform skew-x-12"></div>
        <div className="absolute bottom-0 right-24 w-20 h-32 bg-purple-700/30"></div>
        <div className="absolute bottom-0 right-40 w-16 h-28 bg-purple-800/35 transform -skew-x-6"></div>
        <div className="absolute bottom-0 right-52 w-22 h-40 bg-purple-700/25"></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 via-transparent to-transparent"></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-24 h-24 bg-purple-400/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>

      {/* Main Header Section */}
      <header className="relative z-10 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          {/* Hero Content */}
          <div className="mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-2xl mb-8 transform hover:scale-110 hover:rotate-6 transition-all duration-500 group">
              <Brain className="w-10 h-10 text-white group-hover:animate-pulse" />
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Trusted place to find 
              <br />
              <span className="text-yellow-400">affordable housing</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
              10K+ applications processed daily and 64K+ total verified allocations
            </p>
          </div>

          {/* Search Section with Glassmorphism */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl hover:bg-white/15 transition-all duration-300 group">
              {/* Tab Navigation */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                <button className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
                  FAIR ALLOCATION
                </button>
                <button className="px-6 py-3 text-purple-200 font-semibold rounded-xl hover:bg-white/10 transition-all duration-300">
                  DEMAND ANALYSIS
                </button>
                <button className="px-6 py-3 text-purple-200 font-semibold rounded-xl hover:bg-white/10 transition-all duration-300">
                  APPLICATION STATUS
                </button>
              </div>
              
              {/* Search Input */}
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    placeholder="Select City or Area"
                    className="w-full px-6 py-4 bg-white/90 backdrop-blur-sm border border-white/30 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all duration-300"
                  />
                </div>
                <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-2xl hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <p className="text-purple-200 mb-2">✨ Are you a Housing Officer?</p>
            <button className="text-yellow-400 hover:text-yellow-300 font-semibold underline hover:no-underline transition-all duration-300">
              Manage Applications for FREE →
            </button>
          </div>
        </div>
      </header>

      {/* Housing Edge Services Section */}
      <section className="relative z-10 py-16 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-white mb-2">Housing Edge</h2>
              <p className="text-purple-200 text-lg">Explore property related services</p>
            </div>
            <button className="px-6 py-3 border border-purple-300 text-purple-200 rounded-xl hover:bg-purple-500/20 hover:border-purple-200 transition-all duration-300">
              Explore Services →
            </button>
          </div>

          {/* Service Cards with Hover Effects */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Fair Allocation Card */}
            <div className="group cursor-pointer">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/20 hover:border-white/30 hover:scale-105 hover:shadow-2xl transition-all duration-500 group">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-200 transition-colors duration-300">
                  Fair Allocation
                </h3>
                <p className="text-purple-200 text-sm group-hover:text-purple-100 transition-colors duration-300">
                  AI-powered fair housing allocation using advanced algorithms
                </p>
              </div>
            </div>

            {/* Demand Analysis Card */}
            <div className="group cursor-pointer">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/20 hover:border-white/30 hover:scale-105 hover:shadow-2xl transition-all duration-500">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors duration-300">
                  Housing Analytics
                </h3>
                <p className="text-purple-200 text-sm group-hover:text-purple-100 transition-colors duration-300">
                  Instant access to zero brokerage demand predictions
                </p>
              </div>
            </div>

            {/* Application Status Card */}
            <div className="group cursor-pointer">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/20 hover:border-white/30 hover:scale-105 hover:shadow-2xl transition-all duration-500">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-200 transition-colors duration-300">
                  Application Status
                </h3>
                <p className="text-purple-200 text-sm group-hover:text-purple-100 transition-colors duration-300">
                  Lowest interest rate offers for housing applications
                </p>
              </div>
            </div>

            {/* Housing Protect Card */}
            <div className="group cursor-pointer">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/20 hover:border-white/30 hover:scale-105 hover:shadow-2xl transition-all duration-500">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-200 transition-colors duration-300">
                  Housing Protect
                </h3>
                <p className="text-purple-200 text-sm group-hover:text-purple-100 transition-colors duration-300">
                  Protection against application frauds and scams
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Modern Cards */}
      <main className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-white mb-2">Housing's top picks</h2>
              <p className="text-purple-200 text-lg">Explore top allocation options with us</p>
            </div>
          </div>

          {/* Component Grid with Glassmorphism */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Fair Housing Allocator */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 hover:bg-white/15 hover:border-white/30 hover:scale-[1.02] hover:shadow-2xl transition-all duration-500 group">
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-purple-200 transition-colors duration-300">
                    Fair Housing Allocator
                  </h3>
                </div>
                <p className="text-purple-200 group-hover:text-purple-100 transition-colors duration-300">
                  Experience our AI-powered fair allocation system with real-time scoring and transparent algorithms.
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden group-hover:border-white/20 transition-all duration-300">
                <FairHousingAllocator />
              </div>
            </div>

            {/* Housing Demand Analysis */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 hover:bg-white/15 hover:border-white/30 hover:scale-[1.02] hover:shadow-2xl transition-all duration-500 group">
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-blue-200 transition-colors duration-300">
                    Housing Demand Analysis
                  </h3>
                </div>
                <p className="text-purple-200 group-hover:text-purple-100 transition-colors duration-300">
                  Explore comprehensive demand analysis with interactive maps and predictive insights.
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden group-hover:border-white/20 transition-all duration-300">
                <HousingDemandMapSimple />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}