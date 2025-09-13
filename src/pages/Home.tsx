import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, TrendingUp, Shield, Star, ArrowRight, Building, Home as HomeIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { PropertyCard } from '../components/PropertyCard';
import type { Property } from '../components/PropertyCard';

export function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock featured properties
  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      setLoading(true);
      try {
        // Simulate API call
        const mockProperties: Property[] = [
          {
            id: 'featured-1',
            name: 'Luxury Villa in Golf Course Road',
            address: 'Golf Course Road, Sector 54, Gurgaon',
            price: 35000000,
            priceText: '₹3.5 Cr',
            area: 3200,
            bedrooms: '4',
            bathrooms: '4',
            propertyType: 'villa',
            images: ['/api/placeholder/400/240', '/api/placeholder/400/240'],
            description: 'Spacious luxury villa with premium amenities and excellent connectivity.',
            amenities: ['Parking', 'Security', 'Swimming Pool', 'Garden', 'Gym'],
            verified: true,
            featured: true,
            demandScore: 92,
            location: {
              latitude: 28.4089,
              longitude: 77.0419,
              area: 'Golf Course Road',
              city: 'Gurgaon'
            },
            contact: {
              name: 'Premium Properties',
              phone: '+91 98765 43210',
              email: 'info@premiumproperties.com'
            },
            postedDate: '2 days ago'
          },
          {
            id: 'featured-2',
            name: 'Modern Apartment in DLF Phase 2',
            address: 'DLF Phase 2, Sector 25, Gurgaon',
            price: 12500000,
            priceText: '₹1.25 Cr',
            area: 1400,
            bedrooms: '3',
            bathrooms: '2',
            propertyType: 'apartment',
            images: ['/api/placeholder/400/240', '/api/placeholder/400/240'],
            description: 'Well-designed apartment in prime DLF location with modern amenities.',
            amenities: ['Parking', 'Security', 'Gym', 'Clubhouse'],
            verified: true,
            featured: true,
            demandScore: 88,
            location: {
              latitude: 28.4595,
              longitude: 77.0266,
              area: 'DLF Phase 2',
              city: 'Gurgaon'
            },
            contact: {
              name: 'DLF Properties',
              phone: '+91 98765 43211',
              email: 'info@dlfproperties.com'
            },
            postedDate: '1 day ago'
          },
          {
            id: 'featured-3',
            name: 'Spacious House in Sector 21',
            address: 'Sector 21, Faridabad',
            price: 8500000,
            priceText: '₹85 L',
            area: 1800,
            bedrooms: '3',
            bathrooms: '3',
            propertyType: 'house',
            images: ['/api/placeholder/400/240', '/api/placeholder/400/240'],
            description: 'Independent house with garden and parking in peaceful locality.',
            amenities: ['Parking', 'Garden', 'Security'],
            verified: true,
            featured: true,
            demandScore: 85,
            location: {
              latitude: 28.3670,
              longitude: 77.3155,
              area: 'Sector 21',
              city: 'Faridabad'
            },
            contact: {
              name: 'City Properties',
              phone: '+91 98765 43212',
              email: 'info@cityproperties.com'
            },
            postedDate: '3 days ago'
          },
          {
            id: 'featured-4',
            name: 'Premium Flat in Cyber City',
            address: 'Cyber City, DLF Phase 3, Gurgaon',
            price: 18000000,
            priceText: '₹1.8 Cr',
            area: 1600,
            bedrooms: '2',
            bathrooms: '2',
            propertyType: 'apartment',
            images: ['/api/placeholder/400/240', '/api/placeholder/400/240'],
            description: 'Premium apartment near IT hub with excellent connectivity.',
            amenities: ['Parking', 'Security', 'Gym', 'Swimming Pool'],
            verified: true,
            featured: true,
            demandScore: 95,
            location: {
              latitude: 28.4908,
              longitude: 77.0890,
              area: 'Cyber City',
              city: 'Gurgaon'
            },
            contact: {
              name: 'Tech Properties',
              phone: '+91 98765 43213',
              email: 'info@techproperties.com'
            },
            postedDate: '1 day ago'
          }
        ];
        
        setFeaturedProperties(mockProperties);
      } catch (error) {
        console.error('Error fetching featured properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  const handleSearch = () => {
    // Navigate to properties page with search query
    window.location.href = `/properties?q=${encodeURIComponent(searchQuery)}`;
  };

  const popularLocations = [
    { name: 'Golf Course Road', properties: 1250, image: '/api/placeholder/200/120' },
    { name: 'DLF Phase 1-5', properties: 890, image: '/api/placeholder/200/120' },
    { name: 'Sector 17', properties: 567, image: '/api/placeholder/200/120' },
    { name: 'Cyber City', properties: 423, image: '/api/placeholder/200/120' },
    { name: 'Sushant Lok', properties: 334, image: '/api/placeholder/200/120' },
    { name: 'Sector 21, Faridabad', properties: 289, image: '/api/placeholder/200/120' }
  ];

  const stats = [
    { icon: Building, label: 'Properties Listed', value: '10,000+' },
    { icon: Shield, label: 'Verified Properties', value: '95%' },
    { icon: HomeIcon, label: 'Happy Customers', value: '50,000+' },
    { icon: TrendingUp, label: 'Price Accuracy', value: '98%' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 pb-20 lg:pb-0">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-orange-900/20"></div>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-40">
          <div className="text-center">
            <h1 className="text-4xl lg:text-7xl font-extrabold mb-8 leading-tight">
              Find Your Perfect
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300 animate-pulse">Dream Home</span>
            </h1>
            <p className="text-xl lg:text-2xl mb-12 max-w-3xl mx-auto text-orange-100 leading-relaxed">
              🏡 Discover premium properties with AI-powered insights, verified listings & expert guidance
            </p>
            
            {/* Hero Search */}
            <div className="max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3 bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-2xl border border-white/20">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="🔍 Search by location, project, or builder..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="border-0 text-gray-900 text-lg h-14 bg-transparent placeholder:text-gray-500"
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  size="lg" 
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-10 h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Search className="w-6 h-6 mr-3" />
                  Search Properties
                </Button>
              </div>
            </div>

            {/* Quick Property Type Links */}
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link to="/properties?type=apartment" className="group flex items-center space-x-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 backdrop-blur-sm px-6 py-3 rounded-full transition-all duration-300 border border-white/20 hover:border-white/40">
                <Building size={20} className="group-hover:scale-110 transition-transform" />
                <span className="font-medium">Luxury Apartments</span>
              </Link>
              <Link to="/properties?type=house" className="group flex items-center space-x-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 backdrop-blur-sm px-6 py-3 rounded-full transition-all duration-300 border border-white/20 hover:border-white/40">
                <HomeIcon size={20} className="group-hover:scale-110 transition-transform" />
                <span className="font-medium">Independent Houses</span>
              </Link>
              <Link to="/properties?type=villa" className="group flex items-center space-x-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30 backdrop-blur-sm px-6 py-3 rounded-full transition-all duration-300 border border-white/20 hover:border-white/40">
                <Building size={20} className="group-hover:scale-110 transition-transform" />
                <span className="font-medium">Premium Villas</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-orange-100 via-red-50 to-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Trusted by Thousands</h2>
            <p className="text-gray-600">Join the community of successful property buyers</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center p-8 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-2xl transition-all duration-300 border border-orange-200/50 group">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 mb-3">{stat.value}</div>
                <div className="text-gray-700 font-medium">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">🏆 Featured Properties</h2>
              <p className="text-xl text-gray-600">Hand-picked premium properties with high investment potential</p>
            </div>
            <Link to="/properties">
              <Button variant="outline" className="hidden sm:flex bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 hover:from-orange-600 hover:to-red-600 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                View All Properties <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onLike={() => {}}
                  onShare={() => {}}
                  onContact={() => {}}
                  liked={false}
                />
              ))}
            </div>
          )}
          
          <div className="text-center mt-12 sm:hidden">
            <Link to="/properties">
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-8 py-3 text-lg font-semibold shadow-lg">
                View All Properties <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Locations */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">🌟 Popular Locations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Explore properties in prime locations with exceptional growth potential and connectivity
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {popularLocations.map((location, index) => (
              <Link
                key={index}
                to={`/properties?location=${encodeURIComponent(location.name)}`}
                className="group transform hover:scale-105 transition-all duration-300"
              >
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm border border-blue-200/50 group-hover:border-blue-300">
                  <div className="aspect-[3/2] relative">
                    <img
                      src={location.image}
                      alt={location.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-purple-600/40 to-transparent"></div>
                    <div className="absolute top-3 right-3">
                      <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                        HOT 🔥
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="font-bold text-sm mb-1 group-hover:text-yellow-300 transition-colors">{location.name}</h3>
                      <p className="text-xs text-blue-100 font-medium">{location.properties} premium properties</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">🚀 Why Choose PropertyHub?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We revolutionize real estate with cutting-edge AI technology and personalized expert guidance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <Card className="p-8 text-center bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 hover:shadow-2xl transition-all duration-300 group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">AI Demand Prediction</h3>
              <p className="text-gray-700 leading-relaxed">
                Our advanced AI analyzes market trends to predict property demand and future value appreciation with 95% accuracy
              </p>
            </Card>
            
            <Card className="p-8 text-center bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 hover:shadow-2xl transition-all duration-300 group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">100% Verified Listings</h3>
              <p className="text-gray-700 leading-relaxed">
                Every property undergoes thorough verification to ensure complete authenticity, legal compliance, and accurate pricing
              </p>
            </Card>
            
            <Card className="p-8 text-center bg-gradient-to-br from-purple-50 to-pink-100 border border-purple-200 hover:shadow-2xl transition-all duration-300 group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Star className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Expert Support 24/7</h3>
              <p className="text-gray-700 leading-relaxed">
                Get personalized guidance from certified real estate experts throughout your entire property buying journey
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-orange-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="relative max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
            🎯 Ready to Find Your Dream Property?
          </h2>
          <p className="text-2xl mb-12 text-orange-100 leading-relaxed max-w-3xl mx-auto">
            Join <span className="text-yellow-300 font-bold">50,000+</span> happy customers who found their perfect home through PropertyHub
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/properties">
              <Button size="lg" className="w-full sm:w-auto bg-white text-orange-600 hover:bg-gray-100 px-10 py-4 text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                <Search className="w-6 h-6 mr-3" />
                Browse Properties Now
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white hover:text-orange-600 px-10 py-4 text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                💬 Chat with Expert
              </Button>
            </Link>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-orange-200">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span className="font-medium">100% Secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-300" />
              <span className="font-medium">4.9/5 Rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span className="font-medium">₹500Cr+ Sold</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}