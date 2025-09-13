import { useState, useEffect } from 'react';
import { Grid, List, Filter as FilterIcon } from 'lucide-react';
import { PropertyCard } from '../components/PropertyCard';
import { SearchBar } from '../components/SearchBar';
import type { Property } from '../components/PropertyCard';
import type { SearchFilters } from '../components/SearchBar';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [likedProperties, setLikedProperties] = useState<Set<string>>(new Set());
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Mock data - replace with API call
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        // Simulating API call
        const mockProperties: Property[] = Array.from({ length: 50 }, (_, i) => ({
          id: `prop-${i + 1}`,
          name: `Beautiful ${i % 3 === 0 ? 'Villa' : i % 2 === 0 ? 'Apartment' : 'House'} in ${['Gurgaon', 'Faridabad', 'Delhi'][i % 3]}`,
          address: `Sector ${10 + (i % 40)}, ${['Gurgaon', 'Faridabad', 'Delhi'][i % 3]}`,
          price: Math.floor(Math.random() * 50000000) + 1000000,
          priceText: '₹50L - ₹2Cr',
          area: Math.floor(Math.random() * 2000) + 500,
          bedrooms: `${Math.floor(Math.random() * 4) + 1}`,
          bathrooms: `${Math.floor(Math.random() * 3) + 1}`,
          propertyType: ['apartment', 'house', 'villa'][i % 3],
          images: [
            '/api/placeholder/400/240',
            '/api/placeholder/400/240',
            '/api/placeholder/400/240'
          ],
          description: `Spacious and well-designed property with modern amenities. Perfect for families looking for comfort and convenience. Located in a prime area with excellent connectivity.`,
          amenities: ['Parking', 'Security', 'Gym', 'Swimming Pool', 'Garden'].slice(0, Math.floor(Math.random() * 5) + 1),
          verified: Math.random() > 0.3,
          featured: Math.random() > 0.8,
          demandScore: Math.floor(Math.random() * 40) + 60,
          location: {
            latitude: 28.4 + Math.random() * 0.2,
            longitude: 77.0 + Math.random() * 0.2,
            area: `Sector ${10 + (i % 40)}`,
            city: ['Gurgaon', 'Faridabad', 'Delhi'][i % 3]
          },
          contact: {
            name: 'Property Agent',
            phone: '+91 98765 43210',
            email: 'agent@example.com'
          },
          postedDate: `${Math.floor(Math.random() * 30) + 1} days ago`
        }));
        
        setProperties(mockProperties);
        setFilteredProperties(mockProperties);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleSearch = (query: string, filters: SearchFilters) => {
    let filtered = [...properties];

    // Apply location filter
    if (query.trim()) {
      filtered = filtered.filter(property =>
        property.address.toLowerCase().includes(query.toLowerCase()) ||
        property.location.area.toLowerCase().includes(query.toLowerCase()) ||
        property.location.city.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Apply filters
    if (filters.propertyType !== 'all') {
      filtered = filtered.filter(property => property.propertyType === filters.propertyType);
    }

    if (filters.priceRange.min > 0) {
      filtered = filtered.filter(property => property.price >= filters.priceRange.min);
    }

    if (filters.priceRange.max < 10000000) {
      filtered = filtered.filter(property => property.price <= filters.priceRange.max);
    }

    if (filters.bedrooms !== 'any') {
      filtered = filtered.filter(property => {
        if (filters.bedrooms === '5+') {
          return parseInt(property.bedrooms) >= 5;
        }
        return property.bedrooms === filters.bedrooms;
      });
    }

    if (filters.bathrooms !== 'any') {
      filtered = filtered.filter(property => {
        if (filters.bathrooms === '5+') {
          return parseInt(property.bathrooms) >= 5;
        }
        return property.bathrooms === filters.bathrooms;
      });
    }

    if (filters.areaRange.min > 0) {
      filtered = filtered.filter(property => property.area >= filters.areaRange.min);
    }

    if (filters.areaRange.max < 5000) {
      filtered = filtered.filter(property => property.area <= filters.areaRange.max);
    }

    if (filters.amenities.length > 0) {
      filtered = filtered.filter(property =>
        filters.amenities.some(amenity => property.amenities.includes(amenity))
      );
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'area-large':
        filtered.sort((a, b) => b.area - a.area);
        break;
      case 'demand-high':
        filtered.sort((a, b) => (b.demandScore || 0) - (a.demandScore || 0));
        break;
      case 'newest':
        // Sort by featured first, then by posting date
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
        break;
      default:
        // Relevance - featured first, then verified, then by demand score
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          if (a.verified && !b.verified) return -1;
          if (!a.verified && b.verified) return 1;
          return (b.demandScore || 0) - (a.demandScore || 0);
        });
    }

    setFilteredProperties(filtered);
    setCurrentPage(1);
  };

  const handleLike = (propertyId: string) => {
    setLikedProperties(prev => {
      const newSet = new Set(prev);
      if (newSet.has(propertyId)) {
        newSet.delete(propertyId);
      } else {
        newSet.add(propertyId);
      }
      return newSet;
    });
  };

  const handleShare = (propertyId: string) => {
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: 'Check out this property',
        url: window.location.href + `/${propertyId}`
      });
    } else {
      // Fallback for browsers without native share
      navigator.clipboard.writeText(window.location.href + `/${propertyId}`);
      alert('Property link copied to clipboard!');
    }
  };

  const handleContact = (propertyId: string) => {
    // Implement contact functionality
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      window.open(`tel:${property.contact.phone}`, '_self');
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProperties = filteredProperties.slice(startIndex, endIndex);

  const locationSuggestions = [
    'Sector 17, Gurgaon',
    'DLF Phase 1, Gurgaon',
    'Cyber City, Gurgaon',
    'Sector 21, Faridabad',
    'Sushant Lok, Gurgaon',
    'Golf Course Road, Gurgaon'
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-8 pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="mb-10">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 mb-4">
            🏠 Find Your Dream Property
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            Discover premium properties in your preferred location with AI-powered insights
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar
          onSearch={handleSearch}
          suggestions={locationSuggestions}
          loading={loading}
        />

        {/* Enhanced Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 bg-white rounded-2xl p-6 shadow-lg border border-orange-200">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🎯 {filteredProperties.length} Properties Found
            </h2>
            <p className="text-gray-600 font-medium">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredProperties.length)} of {filteredProperties.length} premium results
            </p>
          </div>

          {/* Enhanced View Toggle */}
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">View Style:</span>
            <div className="flex rounded-xl border-2 border-orange-200 overflow-hidden bg-orange-50">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-orange-100'
                }`}
              >
                <Grid size={18} className="mr-2 inline" />
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  viewMode === 'list'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-orange-100'
                }`}
              >
                <List size={18} className="mr-2 inline" />
                List
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced No Results State */}
        {currentProperties.length === 0 ? (
          <Card className="text-center py-16 bg-white shadow-lg border border-orange-200">
            <div className="mb-6">
              <FilterIcon size={64} className="mx-auto text-orange-400 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No properties found 🏠
              </h3>
              <p className="text-gray-600 text-lg">
                Try adjusting your search criteria or explore different filters
              </p>
            </div>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-8 py-3 text-lg font-semibold shadow-lg"
            >
              Reset Filters
            </Button>
          </Card>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {currentProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onLike={handleLike}
                onShare={handleShare}
                onContact={handleContact}
                liked={likedProperties.has(property.id)}
                compact={viewMode === 'list'}
              />
            ))}
          </div>
        )}

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="flex items-center space-x-3 bg-white rounded-2xl p-4 shadow-lg border border-orange-200">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="border-orange-300 text-orange-600 hover:bg-orange-50 disabled:opacity-50 font-medium"
              >
                ← Previous
              </Button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                if (page > totalPages) return null;
                
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'primary' : 'outline'}
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page 
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' 
                      : 'border-orange-300 text-orange-600 hover:bg-orange-50'
                    }
                  >
                    {page}
                  </Button>
                );
              })}
              
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className="text-gray-500 font-medium">...</span>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(totalPages)}
                    className="border-orange-300 text-orange-600 hover:bg-orange-50"
                  >
                    {totalPages}
                  </Button>
                </>
              )}
              
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="border-orange-300 text-orange-600 hover:bg-orange-50 disabled:opacity-50 font-medium"
              >
                Next →
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}