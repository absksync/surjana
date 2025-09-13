import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  BarChart3, 
  Target, 
  MapPin, 
  Menu, 
  X,
  Search,
  Heart,
  Bell,
  Brain
} from "lucide-react";
import { Button } from "./ui/Button";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/properties", label: "Properties", icon: Search },
    { path: "/ai-housing", label: "AI Housing", icon: Brain },
    { path: "/data-analysis", label: "Market Insights", icon: BarChart3 },
    { path: "/demand-prediction", label: "AI Predictions", icon: Target },
    { path: "/map-dashboard", label: "Map View", icon: MapPin },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Modern Glassmorphism Navigation */}
      <nav className="bg-white/20 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Modern Logo with Housing.com Style */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105 group-hover:rotate-3">
                <Home className="h-7 w-7 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-2xl font-black text-white">
                  HOUSING<span className="text-yellow-400">.com</span>
                </span>
                <div className="text-xs text-purple-200 font-medium">Find Your Dream Home</div>
              </div>
              <span className="text-xl font-black text-white sm:hidden">
                H<span className="text-yellow-400">.com</span>
              </span>
            </Link>

            {/* Modern Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 group ${
                      isActive(item.path)
                        ? 'bg-white/30 backdrop-blur-md text-white shadow-lg transform scale-105 border border-white/30'
                        : 'text-purple-200 hover:bg-white/20 hover:text-white hover:backdrop-blur-md hover:border border-white/20'
                    }`}
                  >
                    <Icon size={18} className={`${isActive(item.path) ? 'text-white' : 'group-hover:text-white'} transition-colors`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Modern Desktop Right Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              <button className="p-3 text-purple-200 hover:text-white hover:bg-white/20 hover:backdrop-blur-md rounded-2xl transition-all duration-300 border border-transparent hover:border-white/20">
                <Heart size={20} />
              </button>
              <button className="p-3 text-purple-200 hover:text-white hover:bg-white/20 hover:backdrop-blur-md rounded-2xl transition-all duration-300 relative border border-transparent hover:border-white/20">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-yellow-400 rounded-full animate-pulse"></span>
              </button>
              <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/20 hover:backdrop-blur-md">
                Sign In
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl text-white font-semibold px-6">
                Pay Rent
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-3">
              <button className="p-2 text-purple-200 hover:text-white">
                <Heart size={20} />
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-purple-200 hover:text-white rounded-lg hover:bg-white/20"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Modern Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-purple-900/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="fixed inset-y-0 right-0 w-72 bg-white/10 backdrop-blur-xl border-l border-white/20 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 border-b border-white/20">
                <span className="text-xl font-bold text-white">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-purple-200 hover:text-white rounded-lg hover:bg-white/20"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="py-6">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-4 px-6 py-4 text-base font-medium transition-all duration-300 ${
                        isActive(item.path)
                          ? "bg-white/20 text-white border-r-4 border-yellow-400 backdrop-blur-md"
                          : "text-purple-200 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <Icon size={22} />
                      {item.label}
                    </Link>
                  );
                })}
                
                <div className="border-t border-white/20 mt-6 pt-6 px-6 space-y-3">
                  <Button fullWidth variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/20">
                    Sign In
                  </Button>
                  <Button fullWidth size="sm" className="bg-gradient-to-r from-green-500 to-emerald-500">
                    Pay Rent
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Modern Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-xl border-t border-white/20 z-40">
        <div className="grid grid-cols-6 h-20">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center py-2 transition-all duration-300 ${
                  isActive(item.path)
                    ? "text-yellow-400 transform scale-110"
                    : "text-purple-300 hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span className="text-xs mt-1 font-medium">{item.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}