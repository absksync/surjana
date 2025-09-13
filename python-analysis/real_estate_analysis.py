# Real Estate Data Analysis - Using Actual Datasets
# Analyzes the uploaded houses.csv and house_cleaned.csv files

import json
import os
import csv
from typing import Dict, List, Any, Optional

def read_csv_file(filepath: str) -> List[Dict[str, Any]]:
    """Read CSV file and return as list of dictionaries"""
    data = []
    try:
        with open(filepath, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                data.append(row)
        print(f"✅ Successfully loaded {len(data)} records from {os.path.basename(filepath)}")
        return data
    except Exception as e:
        print(f"❌ Error reading {filepath}: {e}")
        return []

def analyze_price_data(data: List[Dict[str, Any]], price_field: str) -> Dict[str, Any]:
    """Analyze price data and extract statistics"""
    prices = []
    
    for row in data:
        try:
            price_str = row.get(price_field, '0')
            if isinstance(price_str, str):
                # Handle different price formats
                price_str = price_str.replace('Crore', '').replace('crore', '').strip()
                price_value = float(price_str)
                if price_field == 'price' and price_value < 100:  # Assume crores
                    price_value = price_value * 10000000  # Convert crores to rupees
                prices.append(price_value)
        except (ValueError, TypeError):
            continue
    
    if not prices:
        return {"error": "No valid prices found"}
    
    prices.sort()
    n = len(prices)
    
    return {
        "count": n,
        "min": min(prices),
        "max": max(prices),
        "mean": sum(prices) / n,
        "median": prices[n // 2] if n % 2 == 1 else (prices[n // 2 - 1] + prices[n // 2]) / 2,
        "prices_sample": prices[:10]  # First 10 prices for display
    }

def analyze_area_data(data: List[Dict[str, Any]], area_field: str) -> Dict[str, Any]:
    """Analyze area data and extract statistics"""
    areas = []
    
    for row in data:
        try:
            area_str = row.get(area_field, '0')
            if isinstance(area_str, str):
                # Extract numeric value from area string
                area_str = area_str.replace(',', '')
                # Try to extract first number
                import re
                numbers = re.findall(r'\d+\.?\d*', area_str)
                if numbers:
                    area_value = float(numbers[0])
                    areas.append(area_value)
        except (ValueError, TypeError):
            continue
    
    if not areas:
        return {"error": "No valid areas found"}
    
    areas.sort()
    n = len(areas)
    
    return {
        "count": n,
        "min": min(areas),
        "max": max(areas),
        "mean": sum(areas) / n,
        "median": areas[n // 2] if n % 2 == 1 else (areas[n // 2 - 1] + areas[n // 2]) / 2
    }

def analyze_categorical_data(data: List[Dict[str, Any]], field: str) -> Dict[str, int]:
    """Analyze categorical data and return frequency counts"""
    counts = {}
    
    for row in data:
        value = row.get(field, 'Unknown')
        if value:
            value = str(value).strip()
            counts[value] = counts.get(value, 0) + 1
    
    # Return top 10 most frequent values
    sorted_counts = sorted(counts.items(), key=lambda x: x[1], reverse=True)
    return dict(sorted_counts[:10])

def calculate_price_correlations(data: List[Dict[str, Any]]) -> Dict[str, float]:
    """Calculate simple correlations between price and other numeric features"""
    correlations = {}
    
    # Extract price data
    prices = []
    bedrooms = []
    bathrooms = []
    areas = []
    
    for row in data:
        try:
            # Price
            price_str = row.get('price', '0')
            if isinstance(price_str, str):
                price_str = price_str.replace('Crore', '').replace('crore', '').strip()
                price_value = float(price_str)
                if price_value < 100:  # Assume crores
                    price_value = price_value * 10000000
            else:
                price_value = float(price_str)
            
            # Bedrooms
            bedroom_str = row.get('bedRoom', '0')
            bedroom_value = float(str(bedroom_str).replace('+', ''))
            
            # Bathrooms  
            bathroom_str = row.get('bathroom', '0')
            bathroom_value = float(str(bathroom_str).replace('+', ''))
            
            # Area
            area_str = row.get('area', '0')
            if isinstance(area_str, str):
                import re
                numbers = re.findall(r'\d+\.?\d*', area_str)
                area_value = float(numbers[0]) if numbers else 0
            else:
                area_value = float(area_str)
            
            prices.append(price_value)
            bedrooms.append(bedroom_value)
            bathrooms.append(bathroom_value)
            areas.append(area_value)
            
        except (ValueError, TypeError):
            continue
    
    # Calculate correlations
    if len(prices) > 1:
        price_mean = sum(prices) / len(prices)
        
        for feature_name, feature_values in [('bedrooms', bedrooms), ('bathrooms', bathrooms), ('area', areas)]:
            if len(feature_values) == len(prices):
                feature_mean = sum(feature_values) / len(feature_values)
                
                numerator = sum((prices[i] - price_mean) * (feature_values[i] - feature_mean) 
                               for i in range(len(prices)))
                
                price_variance = sum((x - price_mean)**2 for x in prices)
                feature_variance = sum((x - feature_mean)**2 for x in feature_values)
                
                if price_variance > 0 and feature_variance > 0:
                    correlation = numerator / (price_variance * feature_variance)**0.5
                    correlations[feature_name] = round(correlation, 3)
    
    return correlations

def analyze_datasets():
    """Main function to analyze both datasets"""
    print("🏠 Real Estate Data Analysis")
    print("=" * 60)
    
    datasets_dir = os.path.join(os.path.dirname(__file__), '..', 'datasets')
    
    # File paths
    houses_file = os.path.join(datasets_dir, 'houses.csv')
    cleaned_file = os.path.join(datasets_dir, 'house_cleaned.csv')
    
    results = {
        "analysis_info": {
            "timestamp": "2025-09-13",
            "datasets_analyzed": []
        },
        "datasets": {}
    }
    
    # Analyze houses.csv
    if os.path.exists(houses_file):
        print("\\n📊 Analyzing houses.csv...")
        houses_data = read_csv_file(houses_file)
        
        if houses_data:
            # Get basic info
            columns = list(houses_data[0].keys()) if houses_data else []
            
            # Analyze price data
            price_stats = analyze_price_data(houses_data, 'price')
            
            # Analyze area data  
            area_stats = analyze_area_data(houses_data, 'area')
            
            # Analyze categorical data
            bedroom_dist = analyze_categorical_data(houses_data, 'bedRoom')
            location_dist = analyze_categorical_data(houses_data, 'address')
            
            # Calculate correlations
            correlations = calculate_price_correlations(houses_data)
            
            results["datasets"]["houses"] = {
                "filename": "houses.csv",
                "record_count": len(houses_data),
                "columns": columns,
                "column_count": len(columns),
                "price_analysis": price_stats,
                "area_analysis": area_stats,
                "bedroom_distribution": bedroom_dist,
                "location_distribution": location_dist,
                "correlations": correlations
            }
            
            results["analysis_info"]["datasets_analyzed"].append("houses.csv")
            
            print(f"✅ Houses dataset: {len(houses_data)} records, {len(columns)} columns")
            if "error" not in price_stats:
                print(f"✅ Price range: ₹{price_stats['min']:,.0f} - ₹{price_stats['max']:,.0f}")
                print(f"✅ Average price: ₹{price_stats['mean']:,.0f}")
    
    # Analyze house_cleaned.csv
    if os.path.exists(cleaned_file):
        print("\\n📊 Analyzing house_cleaned.csv...")
        cleaned_data = read_csv_file(cleaned_file)
        
        if cleaned_data:
            # Get basic info
            columns = list(cleaned_data[0].keys()) if cleaned_data else []
            
            # Analyze price data
            price_stats = analyze_price_data(cleaned_data, 'price')
            
            # Analyze area data
            area_stats = analyze_area_data(cleaned_data, 'area')
            
            # Analyze categorical data
            bedroom_dist = analyze_categorical_data(cleaned_data, 'bedRoom')
            property_type_dist = analyze_categorical_data(cleaned_data, 'property_type')
            society_dist = analyze_categorical_data(cleaned_data, 'society')
            
            # Calculate correlations
            correlations = calculate_price_correlations(cleaned_data)
            
            results["datasets"]["house_cleaned"] = {
                "filename": "house_cleaned.csv",
                "record_count": len(cleaned_data),
                "columns": columns,
                "column_count": len(columns),
                "price_analysis": price_stats,
                "area_analysis": area_stats,
                "bedroom_distribution": bedroom_dist,
                "property_type_distribution": property_type_dist,
                "society_distribution": society_dist,
                "correlations": correlations
            }
            
            results["analysis_info"]["datasets_analyzed"].append("house_cleaned.csv")
            
            print(f"✅ Cleaned dataset: {len(cleaned_data)} records, {len(columns)} columns")
            if "error" not in price_stats:
                print(f"✅ Price range: ₹{price_stats['min']:,.0f} - ₹{price_stats['max']:,.0f}")
                print(f"✅ Average price: ₹{price_stats['mean']:,.0f}")
    
    # Create summary for React integration
    total_records = sum(dataset["record_count"] for dataset in results["datasets"].values())
    
    results["summary"] = {
        "total_datasets": len(results["datasets"]),
        "total_records": total_records,
        "datasets_analyzed": results["analysis_info"]["datasets_analyzed"]
    }
    
    return results

def export_results_for_react(results: Dict[str, Any]):
    """Export analysis results for React dashboard"""
    
    # Prepare data in the format expected by React dashboard
    react_data = {
        "dataset_info": {
            "shape": [results["summary"]["total_records"], 
                     max(dataset["column_count"] for dataset in results["datasets"].values()) if results["datasets"] else 0],
            "columns": [],
            "missing_values": {},
            "datasets_analyzed": results["summary"]["datasets_analyzed"]
        },
        "analysis_results": results,
        "model_info": {
            "features": ["bedrooms", "bathrooms", "area", "location"],
            "datasets": list(results["datasets"].keys()),
            "total_records": results["summary"]["total_records"]
        }
    }
    
    # Get columns from the first available dataset
    if results["datasets"]:
        first_dataset = list(results["datasets"].values())[0]
        react_data["dataset_info"]["columns"] = first_dataset["columns"]
        # Assume no missing values for now
        react_data["dataset_info"]["missing_values"] = {col: 0 for col in first_dataset["columns"]}
    
    # Save to React public directory
    output_path = os.path.join(os.path.dirname(__file__), '..', 'public', 'analysis_results.json')
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(react_data, f, indent=2, ensure_ascii=False)
    
    print(f"\\n💾 Results exported to {output_path}")
    
    # Also save detailed results
    detailed_output = os.path.join(os.path.dirname(__file__), 'detailed_analysis.json')
    with open(detailed_output, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    return react_data

def main():
    """Main execution function"""
    print("🚀 Starting Real Estate Data Analysis...")
    
    try:
        # Analyze datasets
        results = analyze_datasets()
        
        if not results["datasets"]:
            print("\\n❌ No datasets found or could be processed")
            print("Please ensure houses.csv and/or house_cleaned.csv exist in the datasets folder")
            return
        
        # Export for React
        react_data = export_results_for_react(results)
        
        print("\\n" + "=" * 60)
        print("✅ Analysis Complete!")
        print(f"📊 Analyzed {results['summary']['total_datasets']} datasets")
        print(f"📋 Total records: {results['summary']['total_records']:,}")
        print("\\n🎯 Next Steps:")
        print("   1. Open your React app at http://localhost:5173/data-analysis")
        print("   2. The dashboard will display your real estate data")
        print("   3. Explore the analysis results and insights")
        
        return react_data
        
    except Exception as e:
        print(f"\\n❌ Error during analysis: {e}")
        return None

if __name__ == "__main__":
    main()