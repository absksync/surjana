import { useState } from 'react';
import { Search, Filter, MapPin, IndianRupee, Bed, Bath, Square, X } from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

export interface SearchFilters {
  location: string;
  propertyType: string;
  priceRange: {
    min: number;
    max: number;
  };
  bedrooms: string;
  bathrooms: string;
  areaRange: {
    min: number;
    max: number;
  };
  amenities: string[];
  sortBy: string;
}

interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  suggestions?: string[];
  loading?: boolean;
}

const propertyTypes = [
  { value: 'all', label: 'All Types' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'villa', label: 'Villa' },
  { value: 'plot', label: 'Plot' },
  { value: 'commercial', label: 'Commercial' }
];

const bedroomOptions = [
  { value: 'any', label: 'Any' },
  { value: '1', label: '1 BHK' },
  { value: '2', label: '2 BHK' },
  { value: '3', label: '3 BHK' },
  { value: '4', label: '4 BHK' },
  { value: '5+', label: '5+ BHK' }
];

const amenitiesList = [
  'Parking', 'Gym', 'Swimming Pool', 'Security', 'Power Backup',
  'Lift', 'Garden', 'Club House', 'Children Play Area', 'CCTV'
];

const sortOptions = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'area-large', label: 'Area: Largest First' },
  { value: 'newest', label: 'Newest First' },
  { value: 'demand-high', label: 'High Demand' }
];

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  suggestions = [],
  loading = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    propertyType: 'all',
    priceRange: { min: 0, max: 10000000 },
    bedrooms: 'any',
    bathrooms: 'any',
    areaRange: { min: 0, max: 5000 },
    amenities: [],
    sortBy: 'relevance'
  });

  const handleSearch = () => {
    onSearch(searchQuery, filters);
    setShowSuggestions(false);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string | number | { min: number; max: number } | string[]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleAmenity = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      propertyType: 'all',
      priceRange: { min: 0, max: 10000000 },
      bedrooms: 'any',
      bathrooms: 'any',
      areaRange: { min: 0, max: 5000 },
      amenities: [],
      sortBy: 'relevance'
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.propertyType !== 'all') count++;
    if (filters.priceRange.min > 0 || filters.priceRange.max < 10000000) count++;
    if (filters.bedrooms !== 'any') count++;
    if (filters.bathrooms !== 'any') count++;
    if (filters.areaRange.min > 0 || filters.areaRange.max < 5000) count++;
    if (filters.amenities.length > 0) count++;
    return count;
  };

  return (
    <div className="w-full">
      {/* Main Search Bar */}
      <Card className="mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Location Search */}
          <div className="flex-1 relative">
            <Input
              placeholder="Search by location, project, or locality"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(e.target.value.length > 0);
              }}
              onFocus={() => setShowSuggestions(searchQuery.length > 0)}
              leftIcon={<MapPin size={18} />}
              className="pr-10"
            />
            
            {/* Search Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1">
                {suggestions.slice(0, 5).map((suggestion, index) => (
                  <button
                    key={index}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                    onClick={() => {
                      setSearchQuery(suggestion);
                      setShowSuggestions(false);
                    }}
                  >
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-2 text-gray-400" />
                      {suggestion}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Property Type */}
          <div className="sm:w-48">
            <select
              value={filters.propertyType}
              onChange={(e) => handleFilterChange('propertyType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {propertyTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              icon={<Filter size={18} />}
              className="relative"
            >
              Filters
              {getActiveFilterCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getActiveFilterCount()}
                </span>
              )}
            </Button>
            <Button
              onClick={handleSearch}
              loading={loading}
              icon={<Search size={18} />}
            >
              Search
            </Button>
          </div>
        </div>
      </Card>

      {/* Advanced Filters */}
      {showFilters && (
        <Card className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <IndianRupee size={16} className="inline mr-1" />
                Price Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Min Price"
                  value={filters.priceRange.min || ''}
                  onChange={(e) => handleFilterChange('priceRange', {
                    ...filters.priceRange,
                    min: Number(e.target.value)
                  })}
                />
                <Input
                  type="number"
                  placeholder="Max Price"
                  value={filters.priceRange.max || ''}
                  onChange={(e) => handleFilterChange('priceRange', {
                    ...filters.priceRange,
                    max: Number(e.target.value)
                  })}
                />
              </div>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Bed size={16} className="inline mr-1" />
                Bedrooms
              </label>
              <select
                value={filters.bedrooms}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {bedroomOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Bath size={16} className="inline mr-1" />
                Bathrooms
              </label>
              <select
                value={filters.bathrooms}
                onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {bedroomOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.value === 'any' ? 'Any' : `${option.value} Bath`}
                  </option>
                ))}
              </select>
            </div>

            {/* Area Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Square size={16} className="inline mr-1" />
                Area (sq ft)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Min Area"
                  value={filters.areaRange.min || ''}
                  onChange={(e) => handleFilterChange('areaRange', {
                    ...filters.areaRange,
                    min: Number(e.target.value)
                  })}
                />
                <Input
                  type="number"
                  placeholder="Max Area"
                  value={filters.areaRange.max || ''}
                  onChange={(e) => handleFilterChange('areaRange', {
                    ...filters.areaRange,
                    max: Number(e.target.value)
                  })}
                />
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Amenities */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Amenities
            </label>
            <div className="flex flex-wrap gap-2">
              {amenitiesList.map(amenity => (
                <button
                  key={amenity}
                  onClick={() => toggleAmenity(amenity)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    filters.amenities.includes(amenity)
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
            <Button onClick={handleSearch} icon={<Search size={18} />}>
              Apply Filters
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};