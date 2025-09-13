import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Define types
interface Property {
  id: string;
  name: string;
  address: string;
  area: string;
  city: string;
  price: number;
  price_text: string;
  area_sqft: number;
  bedrooms: string;
  bathrooms: string;
  latitude: number;
  longitude: number;
  demand_score: number;
  dataset_source: string;
  description: string;
  nearby_locations: string;
}

interface Hotspot {
  id: string;
  area: string;
  city: string;
  latitude: number;
  longitude: number;
  demand_score: number;
  intensity: number;
  property_count: number;
  total_properties: number;
  avg_price: number;
  price_range: {
    min: number;
    max: number;
  };
}

interface MapData {
  metadata: {
    generated_at: string;
    total_properties: number;
    total_hotspots: number;
    data_sources: string[];
    coverage_area: string;
  };
  map_config: {
    center: {
      latitude: number;
      longitude: number;
    };
    bounds: {
      north: number;
      south: number;
      east: number;
      west: number;
    };
    default_zoom: number;
    max_zoom: number;
    min_zoom: number;
  };
  properties: Property[];
  hotspots: Hotspot[];
  heatmap_data: number[][];
  statistics: {
    avg_demand_score: number;
    max_demand_score: number;
    min_demand_score: number;
    price_stats: {
      avg_price: number;
      max_price: number;
      min_price: number;
    };
    areas_covered: number;
    cities_covered: number;
  };
}

// Simple Circle Heatmap Component using CircleMarkers
const SimpleHeatmapLayer: React.FC<{ data: number[][] }> = ({ data }) => {
  if (!data || data.length === 0) return null;
  
  return (
    <>
      {data.map((point, index) => {
        const [lat, lng, intensity] = point;
        if (!lat || !lng || isNaN(lat) || isNaN(lng) || isNaN(intensity)) return null;
        
        const radius = Math.max(5, intensity * 30); // Scale radius based on intensity
        const opacity = Math.max(0.3, intensity);
        const color = intensity >= 0.7 ? '#ff4444' : 
                     intensity >= 0.5 ? '#ff8800' : 
                     intensity >= 0.3 ? '#ffaa00' : '#44aa44';
        
        return (
          <CircleMarker
            key={`heatpoint-${index}`}
            center={[lat, lng]}
            radius={radius}
            pathOptions={{
              fillColor: color,
              color: color,
              weight: 1,
              opacity: opacity,
              fillOpacity: opacity * 0.6
            }}
          />
        );
      })}
    </>
  );
};

// Custom marker icons
const createCustomIcon = (score: number, isHotspot: boolean = false) => {
  const color = score >= 70 ? '#ff4444' : score >= 60 ? '#ff8800' : score >= 50 ? '#ffaa00' : '#44aa44';
  const size = isHotspot ? 25 : 15;
  
  return L.divIcon({
    html: `<div style="background-color: ${color}; width: ${size}px; height: ${size}px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: ${size > 20 ? '12px' : '10px'}; color: white;">${Math.round(score)}</div>`,
    className: 'custom-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
};

// Map controls component
interface MapFilters {
  minDemandScore: number;
  maxPrice: number;
  city: string;
  showHeatmap: boolean;
  showProperties: boolean;
  showHotspots: boolean;
}

interface Statistics {
  avg_demand_score: number;
  max_demand_score: number;
  min_demand_score: number;
  price_stats: {
    avg_price: number;
    max_price: number;
    min_price: number;
  };
  areas_covered: number;
  cities_covered: number;
}

const MapControls: React.FC<{
  onFilterChange: (filters: MapFilters) => void;
  statistics: Statistics;
}> = ({ onFilterChange, statistics }) => {
  const [filters, setFilters] = useState<MapFilters>({
    minDemandScore: 0,
    maxPrice: 100,
    city: 'all',
    showHeatmap: true,
    showProperties: true,
    showHotspots: true
  });
  
  const handleFilterChange = (key: keyof MapFilters, value: string | number | boolean) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  return (
    <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-[1000] max-w-xs">
      <h3 className="font-bold text-lg mb-3">Map Controls</h3>
      
      {/* Statistics Summary */}
      <div className="mb-4 p-2 bg-gray-50 rounded">
        <h4 className="font-semibold text-sm mb-1">Statistics</h4>
        <div className="text-xs space-y-1">
          <div>Properties: {statistics?.areas_covered || 0}</div>
          <div>Avg Demand: {statistics?.avg_demand_score || 0}/100</div>
          <div>Avg Price: ₹{statistics?.price_stats?.avg_price || 0}Cr</div>
        </div>
      </div>
      
      {/* Layer Controls */}
      <div className="mb-4">
        <h4 className="font-semibold text-sm mb-2">Layers</h4>
        <div className="space-y-2">
          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              checked={filters.showHeatmap}
              onChange={(e) => handleFilterChange('showHeatmap', e.target.checked)}
              className="mr-2"
            />
            Heatmap
          </label>
          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              checked={filters.showProperties}
              onChange={(e) => handleFilterChange('showProperties', e.target.checked)}
              className="mr-2"
            />
            Properties
          </label>
          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              checked={filters.showHotspots}
              onChange={(e) => handleFilterChange('showHotspots', e.target.checked)}
              className="mr-2"
            />
            Hotspots
          </label>
        </div>
      </div>
      
      {/* Filters */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Min Demand Score</label>
          <input
            type="range"
            min="0"
            max="100"
            value={filters.minDemandScore}
            onChange={(e) => handleFilterChange('minDemandScore', Number(e.target.value))}
            className="w-full"
          />
          <span className="text-xs text-gray-600">{filters.minDemandScore}/100</span>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Max Price (Cr)</label>
          <input
            type="range"
            min="0"
            max="50"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
            className="w-full"
          />
          <span className="text-xs text-gray-600">₹{filters.maxPrice}Cr</span>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <select
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            className="w-full p-1 border rounded text-sm"
          >
            <option value="all">All Cities</option>
            <option value="gurgaon">Gurgaon</option>
            <option value="faridabad">Faridabad</option>
            <option value="delhi">Delhi</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// Main map component
const HousingDemandMap: React.FC = () => {
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState<{
    properties: Property[];
    hotspots: Hotspot[];
    heatmapData: number[][];
  } | null>(null);
  const [filters, setFilters] = useState({
    minDemandScore: 0,
    maxPrice: 100,
    city: 'all',
    showHeatmap: true,
    showProperties: true,
    showHotspots: true
  });
  
  // Load map data
  useEffect(() => {
    const fetchMapData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/map/all');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setMapData(data);
        setFilteredData({
          properties: data.properties,
          hotspots: data.hotspots,
          heatmapData: data.heatmap_data
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load map data');
        console.error('Error loading map data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMapData();
  }, []);
  
  // Apply filters
  useEffect(() => {
    if (!mapData) return;
    
    let properties = mapData.properties;
    let hotspots = mapData.hotspots;
    let heatmapData = mapData.heatmap_data;
    
    // Apply filters
    if (filters.minDemandScore > 0) {
      properties = properties.filter(p => p.demand_score >= filters.minDemandScore);
      hotspots = hotspots.filter(h => h.demand_score >= filters.minDemandScore);
      heatmapData = heatmapData.filter(point => (point[2] * 100) >= filters.minDemandScore);
    }
    
    if (filters.maxPrice < 100) {
      properties = properties.filter(p => p.price <= filters.maxPrice);
      hotspots = hotspots.filter(h => h.avg_price <= filters.maxPrice);
    }
    
    if (filters.city !== 'all') {
      properties = properties.filter(p => p.city.toLowerCase() === filters.city);
      hotspots = hotspots.filter(h => h.city.toLowerCase() === filters.city);
    }
    
    setFilteredData({ properties, hotspots, heatmapData });
  }, [mapData, filters]);
  
  const handleFilterChange = (newFilters: MapFilters) => {
    setFilters(newFilters);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading housing demand map...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-red-50 rounded-lg border border-red-200">
        <div className="text-center p-6">
          <div className="text-red-600 text-xl mb-2">⚠️ Error Loading Map</div>
          <p className="text-red-700 mb-4">{error}</p>
          <p className="text-sm text-red-600">
            Make sure the backend server is running at http://localhost:8000
          </p>
        </div>
      </div>
    );
  }
  
  if (!mapData || !filteredData) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <p className="text-gray-600">No map data available</p>
      </div>
    );
  }
  
  const center: [number, number] = [
    mapData.map_config.center.latitude,
    mapData.map_config.center.longitude
  ];
  
  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
      {/* Error Boundary for Map */}
      {error ? (
        <div className="flex items-center justify-center h-full bg-red-50 border border-red-200">
          <div className="text-center p-6">
            <div className="text-red-600 text-xl mb-2">⚠️ Map Error</div>
            <p className="text-red-700 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      ) : (
        <MapContainer
          center={center}
          zoom={mapData.map_config.default_zoom}
          maxZoom={mapData.map_config.max_zoom}
          minZoom={mapData.map_config.min_zoom}
          style={{ height: '100%', width: '100%', minHeight: '400px' }}
          className="z-0"
          whenReady={() => {
            // Map is ready
            console.log('Map ready for heatmap');
          }}
        >
          <LayersControl position="topleft">
            <LayersControl.BaseLayer checked name="OpenStreetMap">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
            </LayersControl.BaseLayer>
            
            <LayersControl.BaseLayer name="Satellite">
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution='&copy; <a href="https://www.arcgis.com/">ArcGIS</a>'
              />
            </LayersControl.BaseLayer>
          </LayersControl>
          
          {/* Heatmap Layer - Using Circle Markers */}
          {filters.showHeatmap && filteredData.heatmapData.length > 0 && (
            <SimpleHeatmapLayer data={filteredData.heatmapData} />
          )}
          
          {/* Property Markers */}
          {filters.showProperties && filteredData.properties.map((property) => (
            <Marker
              key={property.id}
              position={[property.latitude, property.longitude]}
              icon={createCustomIcon(property.demand_score, false)}
            >
              <Popup className="custom-popup">
                <div className="max-w-xs">
                  <h3 className="font-bold text-lg mb-2">{property.name}</h3>
                  <div className="space-y-1 text-sm">
                    <div><strong>Address:</strong> {property.address}</div>
                    <div><strong>Price:</strong> ₹{property.price}Cr ({property.price_text})</div>
                    <div><strong>Area:</strong> {property.area_sqft} sq ft</div>
                    <div><strong>Bedrooms:</strong> {property.bedrooms}</div>
                    <div><strong>Bathrooms:</strong> {property.bathrooms}</div>
                    <div><strong>Demand Score:</strong> 
                      <span className={`ml-1 px-2 py-1 rounded text-xs ${
                        property.demand_score >= 70 ? 'bg-red-100 text-red-800' :
                        property.demand_score >= 60 ? 'bg-orange-100 text-orange-800' :
                        property.demand_score >= 50 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {property.demand_score}/100
                      </span>
                    </div>
                    {property.description && (
                      <div><strong>Description:</strong> {property.description}</div>
                    )}
                    {property.nearby_locations && (
                      <div><strong>Nearby:</strong> {property.nearby_locations}</div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
          
          {/* Hotspot Markers */}
          {filters.showHotspots && filteredData.hotspots.map((hotspot) => (
            <Marker
              key={hotspot.id}
              position={[hotspot.latitude, hotspot.longitude]}
              icon={createCustomIcon(hotspot.demand_score, true)}
            >
              <Popup className="custom-popup">
                <div className="max-w-xs">
                  <h3 className="font-bold text-lg mb-2">🔥 {hotspot.area} Hotspot</h3>
                  <div className="space-y-1 text-sm">
                    <div><strong>City:</strong> {hotspot.city}</div>
                    <div><strong>Demand Score:</strong> 
                      <span className="ml-1 px-2 py-1 rounded text-xs bg-red-100 text-red-800">
                        {hotspot.demand_score}/100
                      </span>
                    </div>
                    <div><strong>Properties:</strong> {hotspot.property_count}</div>
                    <div><strong>Avg Price:</strong> ₹{hotspot.avg_price}Cr</div>
                    <div><strong>Price Range:</strong> ₹{hotspot.price_range.min}Cr - ₹{hotspot.price_range.max}Cr</div>
                    <div><strong>Intensity:</strong> {Math.round(hotspot.intensity * 100)}%</div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
      
      {/* Map Controls */}
      <MapControls
        onFilterChange={handleFilterChange}
        statistics={mapData.statistics}
      />
    </div>
  );
};

export default HousingDemandMap;