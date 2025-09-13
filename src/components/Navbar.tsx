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
  Bell
} from "lucide-react";
import { Button } from "./ui/Button";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/properties", label: "Properties", icon: Search },
    { path: "/data-analysis", label: "Market Insights", icon: BarChart3 },
    { path: "/demand-prediction", label: "AI Predictions", icon: Target },
    { path: "/map-dashboard", label: "Map View", icon: MapPin },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Desktop & Mobile Header */}
      <nav className="bg-white shadow-xl border-b border-orange-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            {/* Enhanced Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                <Home className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                  PropertyHub
                </span>
                <div className="text-xs text-gray-500 font-medium">Find Your Dream Home</div>
              </div>
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 sm:hidden">
                PH
              </span>
            </Link>

            {/* Enhanced Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105'
                        : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                    }`}
                  >
                    <Icon size={18} className={`${isActive(item.path) ? 'text-white' : 'group-hover:text-orange-600'} transition-colors`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Enhanced Desktop Right Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              <button className="p-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300">
                <Heart size={20} />
              </button>
              <button className="p-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-300 relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
              </button>
              <Button size="sm" variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50">
                Sign In
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg">
                List Property
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-3">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Heart size={20} />
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="fixed inset-y-0 right-0 w-64 bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 border-b">
                <span className="text-lg font-semibold text-gray-900">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="py-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                        isActive(item.path)
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <Icon size={20} />
                      {item.label}
                    </Link>
                  );
                })}
                
                <div className="border-t mt-4 pt-4 px-4 space-y-2">
                  <Button fullWidth variant="outline" size="sm">
                    Sign In
                  </Button>
                  <Button fullWidth size="sm">
                    List Property
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center py-2 transition-colors ${
                  isActive(item.path)
                    ? "text-blue-600"
                    : "text-gray-400 hover:text-gray-600"
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