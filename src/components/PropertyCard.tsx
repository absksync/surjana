import { Heart, MapPin, Bed, Bath, Square, Camera, Share2, Phone, Shield } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

export interface Property {
  id: string;
  name: string;
  address: string;
  price: number;
  priceText: string;
  area: number;
  bedrooms: string;
  bathrooms: string;
  propertyType: string;
  images: string[];
  description: string;
  amenities: string[];
  verified: boolean;
  featured: boolean;
  demandScore?: number;
  location: {
    latitude: number;
    longitude: number;
    area: string;
    city: string;
  };
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  postedDate: string;
}

interface PropertyCardProps {
  property: Property;
  onLike?: (propertyId: string) => void;
  onShare?: (propertyId: string) => void;
  onContact?: (propertyId: string) => void;
  liked?: boolean;
  compact?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onLike,
  onShare,
  onContact,
  liked = false,
  compact = false
}) => {
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)}Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const getDemandScoreColor = (score?: number) => {
    if (!score) return 'bg-gray-500';
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (compact) {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
        <div className="flex">
          <div className="relative w-32 h-24 flex-shrink-0">
            <img
              src={property.images[0] || '/api/placeholder/128/96'}
              alt={property.name}
              className="w-full h-full object-cover"
            />
            {property.featured && (
              <div className="absolute top-1 left-1 bg-orange-500 text-white text-xs px-1 py-0.5 rounded">
                Featured
              </div>
            )}
          </div>
          <div className="flex-1 p-3">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">
                {property.name}
              </h3>
              <button
                onClick={() => onLike?.(property.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Heart size={16} className={liked ? 'fill-red-500 text-red-500' : ''} />
              </button>
            </div>
            <p className="text-lg font-bold text-blue-600 mb-1">
              {formatPrice(property.price)}
            </p>
            <div className="flex items-center text-gray-500 text-xs mb-1">
              <MapPin size={12} className="mr-1" />
              <span className="line-clamp-1">{property.location.area}, {property.location.city}</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-gray-600">
              <span className="flex items-center">
                <Bed size={12} className="mr-1" />
                {property.bedrooms}
              </span>
              <span className="flex items-center">
                <Bath size={12} className="mr-1" />
                {property.bathrooms}
              </span>
              <span className="flex items-center">
                <Square size={12} className="mr-1" />
                {property.area} sq ft
              </span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group bg-white border border-gray-200 hover:border-orange-300 transform hover:scale-105">
      {/* Image Section */}
      <div className="relative">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={property.images[0] || '/api/placeholder/400/240'}
            alt={property.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {property.images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full flex items-center shadow-lg">
              <Camera size={14} className="mr-2" />
              {property.images.length} Photos
            </div>
          )}
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Enhanced Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {property.featured && (
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm px-3 py-1 rounded-full font-bold shadow-lg flex items-center">
              ⭐ FEATURED
            </span>
          )}
          {property.verified && (
            <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg flex items-center">
              <Shield size={12} className="mr-1" />
              VERIFIED
            </span>
          )}
          {property.demandScore && (
            <span className={`${getDemandScoreColor(property.demandScore)} text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg`}>
              🔥 Demand: {property.demandScore}%
            </span>
          )}
        </div>

        {/* Enhanced Action Buttons */}
        <div className="absolute top-3 right-3 flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShare?.(property.id);
            }}
            className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-orange-600 p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          >
            <Share2 size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike?.(property.id);
            }}
            className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          >
            <Heart size={16} className={liked ? 'fill-red-500 text-red-500' : 'hover:text-red-500'} />
          </button>
        </div>
      </div>

      {/* Enhanced Content Section */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-xl text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
            {property.name}
          </h3>
          <div className="text-right">
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
              {formatPrice(property.price)}
            </p>
            <p className="text-sm text-gray-500 font-medium">{property.priceText}</p>
          </div>
        </div>

        <div className="flex items-center text-gray-600 mb-4">
          <MapPin size={16} className="mr-2 text-orange-500" />
          <span className="text-sm font-medium">{property.location.area}, {property.location.city}</span>
        </div>

        {/* Enhanced Property Details */}
        <div className="flex items-center justify-between text-sm mb-4">
          <div className="flex items-center space-x-4">
            <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
              <Bed size={16} className="mr-2 text-blue-600" />
              <span className="font-medium">{property.bedrooms} Bed</span>
            </span>
            <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
              <Bath size={16} className="mr-2 text-green-600" />
              <span className="font-medium">{property.bathrooms} Bath</span>
            </span>
            <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
              <Square size={16} className="mr-2 text-purple-600" />
              <span className="font-medium">{property.area} sq ft</span>
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-700 line-clamp-2 mb-4 leading-relaxed">
          {property.description}
        </p>

        {/* Enhanced Amenities */}
        {property.amenities.length > 0 && (
          <div className="mb-5">
            <div className="flex flex-wrap gap-1">
              {property.amenities.slice(0, 3).map((amenity, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                >
                  {amenity}
                </span>
              ))}
              {property.amenities.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{property.amenities.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            Posted {property.postedDate}
          </div>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onContact?.(property.id);
              }}
              icon={<Phone size={14} />}
            >
              Contact
            </Button>
            <Button size="sm">
              View Details
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};