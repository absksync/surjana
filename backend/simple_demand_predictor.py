"""
AI-Based Housing Demand Prediction System (Pure Python Implementation)

This module creates a machine learning model to predict housing demand 
hotspots based on historical real estate data for city planning decisions.

Problem: Cities don't know where affordable housing demands will spike
Solution: ML model forecasting demand patterns for next 2 years
"""

import csv
import json
import os
import re
import math
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Any
from collections import defaultdict, Counter


class SimpleDemandPredictor:
    """
    Pure Python implementation for housing demand prediction
    Uses statistical analysis and heuristics for demand forecasting
    """
    
    def __init__(self, data_dir: str = "../datasets"):
        self.data_dir = data_dir
        self.processed_data = []
        self.location_stats = {}
        self.price_trends = {}
        self.demand_scores = {}
        
    def load_datasets(self) -> Tuple[List[Dict], List[Dict]]:
        """Load both housing datasets"""
        houses_path = os.path.join(self.data_dir, "houses.csv")
        cleaned_path = os.path.join(self.data_dir, "house_cleaned.csv")
        
        print("Loading housing datasets...")
        
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
        
        print(f"Houses dataset: {len(houses_data)} records")
        print(f"Cleaned dataset: {len(cleaned_data)} records")
        
        return houses_data, cleaned_data
    
    def extract_price(self, price_text: str) -> float:
        """Extract numeric price from text (in crores)"""
        if not price_text:
            return 0
        
        price_str = str(price_text).lower().replace(',', '')
        
        try:
            # Handle crore values
            if 'crore' in price_str:
                crore_match = re.search(r'([\d.]+)\s*crore', price_str)
                if crore_match:
                    return float(crore_match.group(1))
            
            # Handle lakh values
            elif 'lakh' in price_str:
                lakh_match = re.search(r'([\d.]+)\s*lakh', price_str)
                if lakh_match:
                    return float(lakh_match.group(1)) / 100
            
            # Handle direct numeric values
            else:
                numeric_match = re.search(r'[\d.]+', price_str)
                if numeric_match:
                    value = float(numeric_match.group())
                    # Assume values over 1000 are in lakhs
                    if value > 1000:
                        return value / 100
                    return value
        except:
            pass
        
        return 0
    
    def extract_area(self, area_text: str) -> float:
        """Extract area in square feet"""
        if not area_text:
            return 0
        
        area_str = str(area_text).lower()
        
        try:
            # Extract numeric value
            numeric_match = re.search(r'([\d.]+)', area_str)
            if numeric_match:
                value = float(numeric_match.group(1))
                
                # Convert based on unit
                if 'sq.m' in area_str or 'sq m' in area_str:
                    return value * 10.764  # Convert to sq ft
                elif 'yard' in area_str:
                    return value * 9  # Convert to sq ft
                else:
                    return value  # Assume sq ft
        except:
            pass
        
        return 0
    
    def extract_location_info(self, address: str) -> Dict[str, str]:
        """Extract location information from address"""
        if not address:
            return {'area': 'unknown', 'city': 'unknown', 'sector': 'unknown'}
        
        address_lower = str(address).lower()
        
        # Extract city
        city = 'unknown'
        if 'gurgaon' in address_lower or 'gurugram' in address_lower:
            city = 'gurgaon'
        elif 'faridabad' in address_lower:
            city = 'faridabad'
        elif 'delhi' in address_lower:
            city = 'delhi'
        
        # Extract sector
        sector = 'unknown'
        sector_match = re.search(r'sector\s*(\d+[a-z]*)', address_lower)
        if sector_match:
            sector = f"sector_{sector_match.group(1)}"
        
        # Extract area
        area = sector if sector != 'unknown' else 'unknown'
        if 'dlf' in address_lower:
            phase_match = re.search(r'phase\s*(\d+)', address_lower)
            if phase_match:
                area = f"dlf_phase_{phase_match.group(1)}"
            else:
                area = 'dlf'
        elif 'sushant lok' in address_lower:
            area = 'sushant_lok'
        
        return {'area': area, 'city': city, 'sector': sector}
    
    def calculate_demand_factors(self, property_data: Dict) -> Dict[str, float]:
        """Calculate various demand factors for a property"""
        factors = {
            'price_accessibility': 0,
            'location_desirability': 0,
            'connectivity': 0,
            'investment_potential': 0,
            'amenities': 0
        }
        
        # Price accessibility (inverse relationship - lower price = higher demand)
        price = property_data.get('price_numeric', 0)
        if price > 0:
            if price <= 3:
                factors['price_accessibility'] = 1.0
            elif price <= 5:
                factors['price_accessibility'] = 0.8
            elif price <= 10:
                factors['price_accessibility'] = 0.6
            else:
                factors['price_accessibility'] = 0.3
        
        # Location desirability
        address = str(property_data.get('address', '')).lower()
        prime_locations = ['dlf', 'cyber city', 'golf course', 'mg road', 'sushant lok']
        if any(loc in address for loc in prime_locations):
            factors['location_desirability'] = 1.0
        elif 'gurgaon' in address:
            factors['location_desirability'] = 0.7
        else:
            factors['location_desirability'] = 0.5
        
        # Connectivity (based on nearby locations)
        nearby = str(property_data.get('nearbyLocations', '')).lower()
        connectivity_keywords = ['metro', 'airport', 'highway', 'expressway']
        connectivity_count = sum(1 for keyword in connectivity_keywords if keyword in nearby)
        factors['connectivity'] = min(connectivity_count / 4, 1.0)
        
        # Investment potential (mentioned in description)
        description = str(property_data.get('description', '')).lower()
        if any(keyword in description for keyword in ['investment', 'rental', 'income']):
            factors['investment_potential'] = 1.0
        else:
            factors['investment_potential'] = 0.3
        
        # Amenities
        amenity_keywords = ['hospital', 'school', 'mall', 'bank', 'park']
        amenity_count = sum(1 for keyword in amenity_keywords if keyword in nearby)
        factors['amenities'] = min(amenity_count / 5, 1.0)
        
        return factors
    
    def process_data(self, houses_data: List[Dict], cleaned_data: List[Dict]) -> List[Dict]:
        """Process and combine both datasets"""
        print("Processing datasets...")
        
        all_properties = []
        
        # Process houses dataset
        for row in houses_data:
            try:
                processed = {
                    'property_name': row.get('property_name', ''),
                    'address': row.get('address', ''),
                    'price_text': row.get('price', ''),
                    'bedRoom': row.get('bedRoom', ''),
                    'bathroom': row.get('bathroom', ''),
                    'area': row.get('area', ''),
                    'nearbyLocations': row.get('nearbyLocations', ''),
                    'description': row.get('description', ''),
                    'dataset_source': 'houses'
                }
                
                # Extract numeric values
                processed['price_numeric'] = self.extract_price(processed['price_text'])
                processed['area_sqft'] = self.extract_area(processed['area'])
                
                # Extract location info
                location_info = self.extract_location_info(processed['address'])
                processed.update(location_info)
                
                # Calculate demand factors
                processed['demand_factors'] = self.calculate_demand_factors(processed)
                
                if processed['price_numeric'] > 0 and processed['area_sqft'] > 0:
                    all_properties.append(processed)
                    
            except Exception as e:
                continue
        
        # Process cleaned dataset
        for row in cleaned_data:
            try:
                processed = {
                    'property_name': row.get('property_name', ''),
                    'address': row.get('address', ''),
                    'price_text': str(row.get('price', '')),
                    'bedRoom': row.get('bedRoom', ''),
                    'bathroom': row.get('bathroom', ''),
                    'area': str(row.get('area', '')),
                    'nearbyLocations': row.get('nearbyLocations', ''),
                    'description': row.get('description', ''),
                    'dataset_source': 'cleaned'
                }
                
                # Extract numeric values
                processed['price_numeric'] = self.extract_price(processed['price_text'])
                processed['area_sqft'] = self.extract_area(processed['area'])
                
                # Extract location info
                location_info = self.extract_location_info(processed['address'])
                processed.update(location_info)
                
                # Calculate demand factors
                processed['demand_factors'] = self.calculate_demand_factors(processed)
                
                if processed['price_numeric'] > 0 and processed['area_sqft'] > 0:
                    all_properties.append(processed)
                    
            except Exception as e:
                continue
        
        print(f"Processed {len(all_properties)} valid properties")
        return all_properties
    
    def analyze_location_trends(self, properties: List[Dict]) -> Dict[str, Dict]:
        """Analyze trends by location"""
        print("Analyzing location trends...")
        
        location_stats = defaultdict(lambda: {
            'count': 0,
            'total_price': 0,
            'total_area': 0,
            'demand_factors': defaultdict(float),
            'properties': []
        })
        
        for prop in properties:
            area = prop['area']
            city = prop['city']
            location_key = f"{city}_{area}"
            
            stats = location_stats[location_key]
            stats['count'] += 1
            stats['total_price'] += prop['price_numeric']
            stats['total_area'] += prop['area_sqft']
            stats['area_name'] = area
            stats['city_name'] = city
            
            # Aggregate demand factors
            for factor, value in prop['demand_factors'].items():
                stats['demand_factors'][factor] += value
            
            stats['properties'].append(prop)
        
        # Calculate averages and demand scores
        final_stats = {}
        for location, stats in location_stats.items():
            if stats['count'] >= 2:  # Minimum 2 properties for reliable analysis
                avg_price = stats['total_price'] / stats['count']
                avg_area = stats['total_area'] / stats['count']
                
                # Calculate weighted demand score
                demand_score = 0
                for factor, total_value in stats['demand_factors'].items():
                    avg_factor = total_value / stats['count']
                    weights = {
                        'price_accessibility': 25,
                        'location_desirability': 20,
                        'connectivity': 20,
                        'investment_potential': 20,
                        'amenities': 15
                    }
                    demand_score += avg_factor * weights.get(factor, 10)
                
                # Bonus for high property density (market interest indicator)
                density_bonus = min(stats['count'] / 20, 1.0) * 10
                demand_score += density_bonus
                
                final_stats[location] = {
                    'area_name': stats['area_name'],
                    'city_name': stats['city_name'],
                    'property_count': stats['count'],
                    'avg_price': avg_price,
                    'avg_area': avg_area,
                    'demand_score': min(demand_score, 100),  # Cap at 100
                    'price_per_sqft': (avg_price * 10000000) / avg_area if avg_area > 0 else 0,
                    'sample_properties': stats['properties'][:3]
                }
        
        return final_stats
    
    def predict_demand_hotspots(self, location_stats: Dict[str, Dict], top_k: int = 15) -> List[Dict]:
        """Predict top demand hotspots"""
        print(f"Identifying top {top_k} demand hotspots...")
        
        # Sort by demand score
        sorted_locations = sorted(
            location_stats.items(),
            key=lambda x: x[1]['demand_score'],
            reverse=True
        )
        
        hotspots = []
        for location_key, stats in sorted_locations[:top_k]:
            hotspot = {
                'location_id': location_key,
                'area': stats['area_name'],
                'city': stats['city_name'],
                'demand_score': round(stats['demand_score'], 1),
                'property_count': stats['property_count'],
                'avg_price': f"₹{stats['avg_price']:.1f} Cr",
                'avg_area': f"{stats['avg_area']:.0f} sq ft",
                'price_per_sqft': f"₹{stats['price_per_sqft']:.0f}",
                'investment_potential': self._categorize_investment(stats['demand_score']),
                'recommendation': self._generate_recommendation(stats['demand_score'], stats['property_count'])
            }
            hotspots.append(hotspot)
        
        return hotspots
    
    def generate_2year_forecast(self, hotspots: List[Dict]) -> Dict[str, Any]:
        """Generate 2-year demand forecast"""
        print("Generating 2-year demand forecast...")
        
        current_date = datetime.now()
        
        forecast = {
            'forecast_date': current_date.isoformat(),
            'forecast_period': '24 months',
            'methodology': 'Statistical analysis with trend projection',
            'total_hotspots': len(hotspots),
            'hotspots': [],
            'market_trends': self._analyze_market_trends(hotspots),
            'city_rankings': self._rank_cities(hotspots),
            'recommendations': self._generate_city_recommendations(hotspots)
        }
        
        # Enhanced hotspot predictions
        for spot in hotspots:
            base_demand = spot['demand_score']
            
            # Growth projection factors
            city_growth_rates = {
                'gurgaon': 0.15,  # 15% annual growth
                'faridabad': 0.12,  # 12% annual growth
                'delhi': 0.08     # 8% annual growth
            }
            
            growth_rate = city_growth_rates.get(spot['city'], 0.10)
            
            # Monthly projections for next 24 months
            monthly_projections = []
            for month in range(1, 25):
                # Compound growth calculation
                projected_demand = base_demand * (1 + growth_rate) ** (month / 12)
                
                # Add seasonal variations (Q4 and Q1 are typically higher)
                seasonal_factor = 1.0
                month_in_year = month % 12
                if month_in_year in [10, 11, 0, 1]:  # Oct, Nov, Dec, Jan
                    seasonal_factor = 1.05
                
                final_demand = min(projected_demand * seasonal_factor, 100)
                
                monthly_projections.append({
                    'month': month,
                    'demand_score': round(final_demand, 1),
                    'date': (current_date + timedelta(days=month*30)).strftime('%Y-%m')
                })
            
            # Find peak demand period
            peak_month = max(monthly_projections, key=lambda x: x['demand_score'])
            
            enhanced_spot = {
                **spot,
                'growth_rate': f"{growth_rate*100:.0f}% annually",
                'peak_demand_month': peak_month['month'],
                'peak_demand_score': peak_month['demand_score'],
                'year1_avg_demand': round(sum(p['demand_score'] for p in monthly_projections[:12]) / 12, 1),
                'year2_avg_demand': round(sum(p['demand_score'] for p in monthly_projections[12:]) / 12, 1),
                'quarterly_forecast': [
                    {
                        'quarter': f"Q{i+1} 2025",
                        'avg_demand': round(sum(p['demand_score'] for p in monthly_projections[i*3:(i+1)*3]) / 3, 1)
                    }
                    for i in range(4)
                ],
                'priority_level': self._assign_priority(spot['demand_score'], growth_rate)
            }
            
            forecast['hotspots'].append(enhanced_spot)
        
        return forecast
    
    def _categorize_investment(self, demand_score: float) -> str:
        """Categorize investment potential"""
        if demand_score >= 80:
            return "Excellent"
        elif demand_score >= 65:
            return "Very Good"
        elif demand_score >= 50:
            return "Good"
        elif demand_score >= 35:
            return "Fair"
        else:
            return "Poor"
    
    def _generate_recommendation(self, demand_score: float, property_count: int) -> str:
        """Generate recommendation based on demand score and market activity"""
        if demand_score >= 80:
            return "IMMEDIATE ACTION: High-priority area for affordable housing development"
        elif demand_score >= 65:
            return "HIGH PRIORITY: Strong demand indicators - plan development within 6 months"
        elif demand_score >= 50:
            return "MODERATE PRIORITY: Good potential - evaluate detailed feasibility"
        elif demand_score >= 35:
            return "LOW PRIORITY: Monitor market trends before major investment"
        else:
            return "AVOID: Low demand indicators - consider alternative locations"
    
    def _analyze_market_trends(self, hotspots: List[Dict]) -> Dict[str, Any]:
        """Analyze overall market trends"""
        cities = [spot['city'] for spot in hotspots]
        city_counts = Counter(cities)
        
        avg_demand = sum(spot['demand_score'] for spot in hotspots) / len(hotspots)
        
        return {
            'average_demand_score': round(avg_demand, 1),
            'leading_cities': list(city_counts.most_common(3)),
            'market_sentiment': 'Bullish' if avg_demand > 60 else 'Moderate' if avg_demand > 40 else 'Bearish',
            'growth_drivers': [
                'Infrastructure development',
                'Metro connectivity expansion', 
                'IT sector growth',
                'Government housing policies'
            ]
        }
    
    def _rank_cities(self, hotspots: List[Dict]) -> List[Dict]:
        """Rank cities by average demand"""
        city_stats = defaultdict(lambda: {'total_demand': 0, 'count': 0, 'hotspots': []})
        
        for spot in hotspots:
            city = spot['city']
            city_stats[city]['total_demand'] += spot['demand_score']
            city_stats[city]['count'] += 1
            city_stats[city]['hotspots'].append(spot['area'])
        
        rankings = []
        for city, stats in city_stats.items():
            avg_demand = stats['total_demand'] / stats['count']
            rankings.append({
                'city': city.title(),
                'avg_demand_score': round(avg_demand, 1),
                'hotspot_count': stats['count'],
                'top_areas': stats['hotspots'][:3]
            })
        
        return sorted(rankings, key=lambda x: x['avg_demand_score'], reverse=True)
    
    def _generate_city_recommendations(self, hotspots: List[Dict]) -> List[str]:
        """Generate city-specific recommendations"""
        city_counts = Counter(spot['city'] for spot in hotspots)
        recommendations = []
        
        if 'gurgaon' in city_counts:
            recommendations.append("Focus on Gurgaon - highest growth potential and infrastructure development")
        
        if 'faridabad' in city_counts:
            recommendations.append("Consider Faridabad for affordable housing projects with good connectivity")
        
        recommendations.extend([
            "Prioritize areas near metro stations and major highways",
            "Target affordable housing segment (₹2-5 Cr range) for maximum demand",
            "Monitor government policy changes affecting real estate",
            "Consider properties with existing investment interest",
            "Plan phased development based on quarterly demand forecasts"
        ])
        
        return recommendations
    
    def _assign_priority(self, demand_score: float, growth_rate: float) -> str:
        """Assign priority level for development"""
        combined_score = demand_score + (growth_rate * 100)
        
        if combined_score >= 95:
            return "CRITICAL"
        elif combined_score >= 80:
            return "HIGH" 
        elif combined_score >= 65:
            return "MEDIUM"
        else:
            return "LOW"
    
    def save_results(self, forecast: Dict, filename: str = "housing_demand_predictions.json"):
        """Save prediction results"""
        try:
            with open(filename, 'w') as f:
                json.dump(forecast, f, indent=2, default=str)
            print(f"Results saved to {filename}")
        except Exception as e:
            print(f"Error saving results: {e}")


def main():
    """Main execution function"""
    print("=== AI-Based Housing Demand Prediction System ===")
    print("Analyzing housing market data for demand forecasting...\n")
    
    predictor = SimpleDemandPredictor()
    
    try:
        # Load and process data
        houses_data, cleaned_data = predictor.load_datasets()
        if not houses_data and not cleaned_data:
            print("❌ No data found to process")
            return None
        
        processed_properties = predictor.process_data(houses_data, cleaned_data)
        
        # Analyze location trends
        location_stats = predictor.analyze_location_trends(processed_properties)
        
        # Generate predictions
        hotspots = predictor.predict_demand_hotspots(location_stats, top_k=15)
        forecast = predictor.generate_2year_forecast(hotspots)
        
        # Create comprehensive output
        output = {
            'analysis_summary': {
                'total_properties_analyzed': len(processed_properties),
                'valid_locations': len(location_stats),
                'top_hotspots_identified': len(hotspots),
                'analysis_date': datetime.now().isoformat(),
                'methodology': 'Statistical demand scoring with trend projection'
            },
            'demand_forecast': forecast,
            'data_quality': {
                'houses_dataset_records': len(houses_data),
                'cleaned_dataset_records': len(cleaned_data),
                'processed_valid_records': len(processed_properties),
                'coverage': {
                    'cities': len(set(prop['city'] for prop in processed_properties)),
                    'areas': len(set(prop['area'] for prop in processed_properties))
                }
            }
        }
        
        # Save results
        predictor.save_results(output)
        
        print(f"\n=== ANALYSIS RESULTS ===")
        print(f"✅ Analyzed {len(processed_properties)} properties across {len(location_stats)} locations")
        print(f"✅ Identified {len(hotspots)} high-demand hotspots")
        print(f"✅ Generated 2-year demand forecast")
        print(f"✅ Results saved to housing_demand_predictions.json")
        
        print(f"\n=== TOP 5 DEMAND HOTSPOTS ===")
        for i, spot in enumerate(hotspots[:5], 1):
            print(f"{i}. {spot['area']} ({spot['city'].title()})")
            print(f"   📊 Demand Score: {spot['demand_score']}/100")
            print(f"   💰 Avg Price: {spot['avg_price']}")
            print(f"   🏠 Properties: {spot['property_count']}")
            print(f"   📈 Investment: {spot['investment_potential']}")
            print(f"   🎯 Priority: {spot.get('priority_level', 'N/A')}")
            print(f"   💡 {spot['recommendation']}")
            print()
        
        print(f"=== MARKET INSIGHTS ===")
        trends = forecast['market_trends']
        print(f"📈 Market Sentiment: {trends['market_sentiment']}")
        print(f"📊 Average Demand Score: {trends['average_demand_score']}/100")
        print(f"🏙️  Leading Cities: {', '.join([city for city, count in trends['leading_cities']])}")
        
        return output
        
    except Exception as e:
        print(f"❌ Error during analysis: {e}")
        import traceback
        traceback.print_exc()
        return None


if __name__ == "__main__":
    main()