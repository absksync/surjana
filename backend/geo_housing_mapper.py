"""
Geographical Housing Demand Mapping System

This module processes housing data to create geographical coordinates 
and demand hotspot mapping data for visualization on interactive maps.
"""

import csv
import json
import os
import re
from typing import Dict, List, Tuple, Any
from collections import defaultdict
from datetime import datetime


class GeoHousingMapper:
    """
    Processes housing data and creates geographical mapping data
    with demand hotspots for interactive map visualization
    """
    
    def __init__(self, data_dir: str = "../datasets"):
        self.data_dir = data_dir
        self.location_coordinates = {}
        self.demand_hotspots = []
        self.property_markers = []
        
        # Approximate coordinates for major areas in Gurgaon/NCR region
        self.area_coordinates = {
            # Gurgaon Sectors
            'sector_17a': (28.4734, 77.0261),
            'sector_21a': (28.4501, 77.0648),
            'sector_51': (28.4418, 77.0685),
            'sector_54': (28.4403, 77.0889),
            'sector_66': (28.3899, 77.0648),
            'sector_70a': (28.3953, 77.0648),
            'sector_109': (28.4089, 77.0648),
            
            # DLF Areas
            'dlf_phase_1': (28.4595, 77.0266),
            'dlf_phase_2': (28.4692, 77.0266),
            'dlf_phase_3': (28.4595, 77.0390),
            'dlf_phase_4': (28.4494, 77.0266),
            'dlf_phase_5': (28.4329, 77.0266),
            
            # Sushant Lok
            'sushant_lok': (28.4595, 77.0461),
            'sushant_lok_phase_1': (28.4595, 77.0461),
            'sushant_lok_phase_2': (28.4519, 77.0461),
            
            # Other Areas
            'golf_course_road': (28.4316, 77.0266),
            'mg_road': (28.4618, 77.0312),
            'cyber_city': (28.4890, 77.0905),
            'udyog_vihar': (28.4871, 77.0737),
            'iffco_chowk': (28.5245, 77.0648),
            
            # Faridabad
            'faridabad': (28.4089, 77.3178),
            'sector_21a_faridabad': (28.4089, 77.3178),
            
            # Delhi areas
            'delhi': (28.7041, 77.1025),
            
            # Default Gurgaon center
            'gurgaon': (28.4595, 77.0266),
            'gurugram': (28.4595, 77.0266),
            'unknown': (28.4595, 77.0266)
        }
    
    def load_datasets(self) -> Tuple[List[Dict], List[Dict]]:
        """Load both housing datasets"""
        houses_path = os.path.join(self.data_dir, "houses.csv")
        cleaned_path = os.path.join(self.data_dir, "house_cleaned.csv")
        
        print("Loading datasets for geographical mapping...")
        
        houses_data = []
        cleaned_data = []
        
        # Load houses.csv
        try:
            with open(houses_path, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                houses_data = list(reader)
        except Exception as e:
            print(f"Error loading houses.csv: {e}")
        
        # Load house_cleaned.csv
        try:
            with open(cleaned_path, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                cleaned_data = list(reader)
        except Exception as e:
            print(f"Error loading house_cleaned.csv: {e}")
        
        print(f"Loaded {len(houses_data)} + {len(cleaned_data)} = {len(houses_data) + len(cleaned_data)} records")
        return houses_data, cleaned_data
    
    def extract_coordinates(self, address: str, area: str, city: str) -> Tuple[float, float]:
        """Extract or estimate coordinates for a property"""
        
        # First, try to match exact area
        area_key = area.lower().replace(' ', '_')
        if area_key in self.area_coordinates:
            base_lat, base_lng = self.area_coordinates[area_key]
            # Add small random offset for properties in same area
            import random
            lat_offset = random.uniform(-0.01, 0.01)
            lng_offset = random.uniform(-0.01, 0.01)
            return (base_lat + lat_offset, base_lng + lng_offset)
        
        # Try to parse sector from address
        if address:
            address_lower = address.lower()
            sector_match = re.search(r'sector\s*(\d+[a-z]*)', address_lower)
            if sector_match:
                sector_num = sector_match.group(1)
                sector_key = f"sector_{sector_num}"
                if sector_key in self.area_coordinates:
                    base_lat, base_lng = self.area_coordinates[sector_key]
                    import random
                    lat_offset = random.uniform(-0.005, 0.005)
                    lng_offset = random.uniform(-0.005, 0.005)
                    return (base_lat + lat_offset, base_lng + lng_offset)
        
        # Try city-based coordinates
        city_key = city.lower()
        if city_key in self.area_coordinates:
            base_lat, base_lng = self.area_coordinates[city_key]
            import random
            lat_offset = random.uniform(-0.02, 0.02)
            lng_offset = random.uniform(-0.02, 0.02)
            return (base_lat + lat_offset, base_lng + lng_offset)
        
        # Default to Gurgaon center
        import random
        lat_offset = random.uniform(-0.03, 0.03)
        lng_offset = random.uniform(-0.03, 0.03)
        return (28.4595 + lat_offset, 77.0266 + lng_offset)
    
    def extract_price(self, price_text: str) -> float:
        """Extract numeric price from text (in crores)"""
        if not price_text:
            return 0
        
        price_str = str(price_text).lower().replace(',', '')
        
        try:
            if 'crore' in price_str:
                crore_match = re.search(r'([\d.]+)\s*crore', price_str)
                if crore_match:
                    return float(crore_match.group(1))
            elif 'lakh' in price_str:
                lakh_match = re.search(r'([\d.]+)\s*lakh', price_str)
                if lakh_match:
                    return float(lakh_match.group(1)) / 100
            else:
                numeric_match = re.search(r'[\d.]+', price_str)
                if numeric_match:
                    value = float(numeric_match.group())
                    if value > 1000:
                        return value / 100
                    return value
        except:
            pass
        
        return 0
    
    def extract_area_sqft(self, area_text: str) -> float:
        """Extract area in square feet"""
        if not area_text:
            return 0
        
        area_str = str(area_text).lower()
        
        try:
            numeric_match = re.search(r'([\d.]+)', area_str)
            if numeric_match:
                value = float(numeric_match.group(1))
                
                if 'sq.m' in area_str or 'sq m' in area_str:
                    return value * 10.764
                elif 'yard' in area_str:
                    return value * 9
                else:
                    return value
        except:
            pass
        
        return 0
    
    def calculate_demand_score(self, price: float, area_sqft: float, address: str, description: str, nearby: str) -> float:
        """Calculate demand score for mapping"""
        score = 0
        
        # Price accessibility (inverse relationship)
        if price > 0:
            if price <= 3:
                score += 30
            elif price <= 5:
                score += 25
            elif price <= 10:
                score += 20
            else:
                score += 10
        
        # Location desirability
        address_lower = str(address).lower()
        prime_locations = ['dlf', 'cyber city', 'golf course', 'mg road', 'sushant lok']
        if any(loc in address_lower for loc in prime_locations):
            score += 25
        elif 'gurgaon' in address_lower:
            score += 20
        else:
            score += 15
        
        # Connectivity
        nearby_lower = str(nearby).lower()
        connectivity_keywords = ['metro', 'airport', 'highway', 'expressway']
        connectivity_count = sum(1 for keyword in connectivity_keywords if keyword in nearby_lower)
        score += min(connectivity_count * 5, 20)
        
        # Investment potential
        description_lower = str(description).lower()
        if any(keyword in description_lower for keyword in ['investment', 'rental', 'income']):
            score += 15
        
        # Amenities
        amenity_keywords = ['hospital', 'school', 'mall', 'bank', 'park']
        amenity_count = sum(1 for keyword in amenity_keywords if keyword in nearby_lower)
        score += min(amenity_count * 2, 10)
        
        return min(score, 100)
    
    def process_properties_for_mapping(self, houses_data: List[Dict], cleaned_data: List[Dict]) -> List[Dict]:
        """Process all properties and create mapping data"""
        print("Processing properties for geographical mapping...")
        
        all_properties = []
        
        # Process houses dataset
        for row in houses_data:
            try:
                # Extract basic info
                address = row.get('address', '')
                price = self.extract_price(row.get('price', ''))
                area_sqft = self.extract_area_sqft(row.get('area', ''))
                
                if price <= 0 or area_sqft <= 0:
                    continue
                
                # Extract location details
                address_lower = address.lower()
                
                # Determine area
                area = 'unknown'
                if 'dlf' in address_lower:
                    phase_match = re.search(r'phase\s*(\d+)', address_lower)
                    if phase_match:
                        area = f"dlf_phase_{phase_match.group(1)}"
                    else:
                        area = 'dlf_phase_1'
                elif 'sushant lok' in address_lower:
                    area = 'sushant_lok'
                else:
                    sector_match = re.search(r'sector\s*(\d+[a-z]*)', address_lower)
                    if sector_match:
                        area = f"sector_{sector_match.group(1)}"
                
                # Determine city
                city = 'gurgaon'
                if 'faridabad' in address_lower:
                    city = 'faridabad'
                elif 'delhi' in address_lower:
                    city = 'delhi'
                
                # Get coordinates
                lat, lng = self.extract_coordinates(address, area, city)
                
                # Calculate demand score
                demand_score = self.calculate_demand_score(
                    price, area_sqft, address, 
                    row.get('description', ''), 
                    row.get('nearbyLocations', '')
                )
                
                property_data = {
                    'id': f"houses_{len(all_properties)}",
                    'name': row.get('property_name', 'Unknown Property'),
                    'address': address,
                    'area': area,
                    'city': city,
                    'price': price,
                    'price_text': row.get('price', ''),
                    'area_sqft': area_sqft,
                    'bedrooms': row.get('bedRoom', ''),
                    'bathrooms': row.get('bathroom', ''),
                    'latitude': lat,
                    'longitude': lng,
                    'demand_score': demand_score,
                    'dataset_source': 'houses',
                    'description': row.get('description', '')[:200] + '...' if len(row.get('description', '')) > 200 else row.get('description', ''),
                    'nearby_locations': row.get('nearbyLocations', '')
                }
                
                all_properties.append(property_data)
                
            except Exception as e:
                continue
        
        # Process cleaned dataset
        for row in cleaned_data:
            try:
                # Extract basic info
                address = row.get('address', '')
                price = self.extract_price(str(row.get('price', '')))
                area_sqft = self.extract_area_sqft(str(row.get('area', '')))
                
                if price <= 0 or area_sqft <= 0:
                    continue
                
                # Extract location details
                address_lower = address.lower()
                
                # Determine area
                area = 'unknown'
                if 'dlf' in address_lower:
                    phase_match = re.search(r'phase\s*(\d+)', address_lower)
                    if phase_match:
                        area = f"dlf_phase_{phase_match.group(1)}"
                    else:
                        area = 'dlf_phase_1'
                elif 'sushant lok' in address_lower:
                    area = 'sushant_lok'
                else:
                    sector_match = re.search(r'sector\s*(\d+[a-z]*)', address_lower)
                    if sector_match:
                        area = f"sector_{sector_match.group(1)}"
                
                # Determine city
                city = 'gurgaon'
                if 'faridabad' in address_lower:
                    city = 'faridabad'
                elif 'delhi' in address_lower:
                    city = 'delhi'
                
                # Get coordinates
                lat, lng = self.extract_coordinates(address, area, city)
                
                # Calculate demand score
                demand_score = self.calculate_demand_score(
                    price, area_sqft, address, 
                    row.get('description', ''), 
                    row.get('nearbyLocations', '')
                )
                
                property_data = {
                    'id': f"cleaned_{len(all_properties)}",
                    'name': row.get('property_name', 'Unknown Property'),
                    'address': address,
                    'area': area,
                    'city': city,
                    'price': price,
                    'price_text': str(row.get('price', '')),
                    'area_sqft': area_sqft,
                    'bedrooms': row.get('bedRoom', ''),
                    'bathrooms': row.get('bathroom', ''),
                    'latitude': lat,
                    'longitude': lng,
                    'demand_score': demand_score,
                    'dataset_source': 'cleaned',
                    'description': row.get('description', '')[:200] + '...' if len(row.get('description', '')) > 200 else row.get('description', ''),
                    'nearby_locations': row.get('nearbyLocations', '')
                }
                
                all_properties.append(property_data)
                
            except Exception as e:
                continue
        
        print(f"Processed {len(all_properties)} properties with coordinates")
        return all_properties
    
    def create_demand_hotspots(self, properties: List[Dict]) -> List[Dict]:
        """Create aggregated demand hotspots for heatmap"""
        print("Creating demand hotspots...")
        
        # Group properties by area
        area_data = defaultdict(lambda: {
            'properties': [],
            'total_demand': 0,
            'avg_lat': 0,
            'avg_lng': 0,
            'property_count': 0
        })
        
        for prop in properties:
            area_key = f"{prop['city']}_{prop['area']}"
            area_info = area_data[area_key]
            
            area_info['properties'].append(prop)
            area_info['total_demand'] += prop['demand_score']
            area_info['avg_lat'] += prop['latitude']
            area_info['avg_lng'] += prop['longitude']
            area_info['property_count'] += 1
            area_info['area_name'] = prop['area']
            area_info['city_name'] = prop['city']
        
        # Create hotspot data
        hotspots = []
        for area_key, data in area_data.items():
            if data['property_count'] >= 2:  # Minimum 2 properties for hotspot
                avg_demand = data['total_demand'] / data['property_count']
                avg_lat = data['avg_lat'] / data['property_count']
                avg_lng = data['avg_lng'] / data['property_count']
                
                # Calculate intensity for heatmap (0-1 scale)
                intensity = min(avg_demand / 100, 1.0)
                
                hotspot = {
                    'id': area_key,
                    'area': data['area_name'],
                    'city': data['city_name'],
                    'latitude': avg_lat,
                    'longitude': avg_lng,
                    'demand_score': round(avg_demand, 1),
                    'intensity': intensity,
                    'property_count': data['property_count'],
                    'total_properties': len(data['properties']),
                    'avg_price': round(sum(p['price'] for p in data['properties']) / len(data['properties']), 1),
                    'price_range': {
                        'min': round(min(p['price'] for p in data['properties']), 1),
                        'max': round(max(p['price'] for p in data['properties']), 1)
                    }
                }
                
                hotspots.append(hotspot)
        
        # Sort by demand score
        hotspots.sort(key=lambda x: x['demand_score'], reverse=True)
        
        print(f"Created {len(hotspots)} demand hotspots")
        return hotspots
    
    def create_heatmap_data(self, properties: List[Dict]) -> List[List[float]]:
        """Create heatmap data points for Leaflet heatmap"""
        heatmap_points = []
        
        for prop in properties:
            # Each point: [latitude, longitude, intensity]
            intensity = prop['demand_score'] / 100  # Normalize to 0-1
            heatmap_points.append([
                prop['latitude'], 
                prop['longitude'], 
                intensity
            ])
        
        return heatmap_points
    
    def generate_map_data(self) -> Dict[str, Any]:
        """Generate complete mapping data"""
        print("=== Generating Housing Demand Map Data ===")
        
        # Load and process data
        houses_data, cleaned_data = self.load_datasets()
        properties = self.process_properties_for_mapping(houses_data, cleaned_data)
        hotspots = self.create_demand_hotspots(properties)
        heatmap_data = self.create_heatmap_data(properties)
        
        # Calculate bounds for map view
        if properties:
            lats = [p['latitude'] for p in properties]
            lngs = [p['longitude'] for p in properties]
            bounds = {
                'north': max(lats),
                'south': min(lats),
                'east': max(lngs),
                'west': min(lngs)
            }
            center = {
                'latitude': sum(lats) / len(lats),
                'longitude': sum(lngs) / len(lngs)
            }
        else:
            # Default to Gurgaon center
            bounds = {
                'north': 28.5,
                'south': 28.4,
                'east': 77.1,
                'west': 77.0
            }
            center = {'latitude': 28.4595, 'longitude': 77.0266}
        
        # Create complete map data
        map_data = {
            'metadata': {
                'generated_at': datetime.now().isoformat(),
                'total_properties': len(properties),
                'total_hotspots': len(hotspots),
                'data_sources': ['houses.csv', 'house_cleaned.csv'],
                'coverage_area': 'NCR Region (Gurgaon, Faridabad, Delhi)'
            },
            'map_config': {
                'center': center,
                'bounds': bounds,
                'default_zoom': 11,
                'max_zoom': 16,
                'min_zoom': 9
            },
            'properties': properties,
            'hotspots': hotspots,
            'heatmap_data': heatmap_data,
            'statistics': {
                'avg_demand_score': round(sum(p['demand_score'] for p in properties) / len(properties), 1) if properties else 0,
                'max_demand_score': max(p['demand_score'] for p in properties) if properties else 0,
                'min_demand_score': min(p['demand_score'] for p in properties) if properties else 0,
                'price_stats': {
                    'avg_price': round(sum(p['price'] for p in properties) / len(properties), 1) if properties else 0,
                    'max_price': round(max(p['price'] for p in properties), 1) if properties else 0,
                    'min_price': round(min(p['price'] for p in properties), 1) if properties else 0
                },
                'areas_covered': len(set(p['area'] for p in properties)),
                'cities_covered': len(set(p['city'] for p in properties))
            }
        }
        
        return map_data
    
    def save_map_data(self, map_data: Dict[str, Any], filename: str = "housing_demand_map_data.json"):
        """Save map data to JSON file"""
        try:
            with open(filename, 'w') as f:
                json.dump(map_data, f, indent=2, default=str)
            print(f"Map data saved to {filename}")
        except Exception as e:
            print(f"Error saving map data: {e}")


def main():
    """Main execution function"""
    print("=== Housing Demand Geographical Mapping System ===")
    
    mapper = GeoHousingMapper()
    
    try:
        # Generate map data
        map_data = mapper.generate_map_data()
        
        # Save data
        mapper.save_map_data(map_data)
        
        # Print summary
        metadata = map_data['metadata']
        stats = map_data['statistics']
        
        print(f"\n=== MAPPING RESULTS ===")
        print(f"✅ Processed {metadata['total_properties']} properties")
        print(f"✅ Created {metadata['total_hotspots']} demand hotspots")
        print(f"✅ Coverage: {stats['areas_covered']} areas in {stats['cities_covered']} cities")
        print(f"✅ Demand Score Range: {stats['min_demand_score']:.1f} - {stats['max_demand_score']:.1f}")
        print(f"✅ Price Range: ₹{stats['price_stats']['min_price']:.1f}Cr - ₹{stats['price_stats']['max_price']:.1f}Cr")
        
        print(f"\n=== TOP 5 DEMAND HOTSPOTS ===")
        for i, hotspot in enumerate(map_data['hotspots'][:5], 1):
            print(f"{i}. {hotspot['area']} ({hotspot['city'].title()})")
            print(f"   📍 Location: {hotspot['latitude']:.4f}, {hotspot['longitude']:.4f}")
            print(f"   📊 Demand Score: {hotspot['demand_score']}/100")
            print(f"   🏠 Properties: {hotspot['property_count']}")
            print(f"   💰 Avg Price: ₹{hotspot['avg_price']}Cr")
            print()
        
        print("✅ Map data ready for visualization!")
        return map_data
        
    except Exception as e:
        print(f"❌ Error generating map data: {e}")
        import traceback
        traceback.print_exc()
        return None


if __name__ == "__main__":
    main()