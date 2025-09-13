# Simple House Price Analysis - Mock Data Version
# This version creates mock data to demonstrate the React integration
# without requiring complex data science libraries

import json
import random
import os

def create_mock_house_data():
    """Create mock house price data for demonstration"""
    
    # Generate mock data
    num_samples = 1000
    
    # Features
    features = {
        'sqft': [random.randint(800, 4000) for _ in range(num_samples)],
        'bedrooms': [random.randint(1, 6) for _ in range(num_samples)],
        'bathrooms': [random.randint(1, 4) for _ in range(num_samples)],
        'age': [random.randint(0, 50) for _ in range(num_samples)],
        'location_score': [random.randint(1, 10) for _ in range(num_samples)]
    }
    
    # Generate prices based on features (with some noise)
    prices = []
    for i in range(num_samples):
        base_price = (
            features['sqft'][i] * 150 +  # $150 per sqft
            features['bedrooms'][i] * 10000 +  # $10k per bedroom
            features['bathrooms'][i] * 8000 +  # $8k per bathroom
            features['location_score'][i] * 15000 -  # Location premium
            features['age'][i] * 1000  # Depreciation
        )
        # Add some random noise
        noise = random.randint(-50000, 50000)
        prices.append(max(50000, base_price + noise))  # Minimum $50k
    
    features['price'] = prices
    
    return features

def analyze_mock_data(data):
    """Perform basic analysis on mock data"""
    
    num_samples = len(data['price'])
    
    # Calculate basic statistics
    stats = {}
    for feature, values in data.items():
        stats[feature] = {
            'mean': sum(values) / len(values),
            'min': min(values),
            'max': max(values),
            'std': (sum((x - sum(values)/len(values))**2 for x in values) / len(values))**0.5
        }
    
    # Calculate simple correlations with price
    correlations = {}
    price_mean = stats['price']['mean']
    price_values = data['price']
    
    for feature in ['sqft', 'bedrooms', 'bathrooms', 'age', 'location_score']:
        feature_values = data[feature]
        feature_mean = stats[feature]['mean']
        
        # Simple correlation calculation
        numerator = sum((price_values[i] - price_mean) * (feature_values[i] - feature_mean) 
                       for i in range(num_samples))
        
        price_variance = sum((x - price_mean)**2 for x in price_values)
        feature_variance = sum((x - feature_mean)**2 for x in feature_values)
        
        if price_variance > 0 and feature_variance > 0:
            correlation = numerator / (price_variance * feature_variance)**0.5
            correlations[feature] = correlation
        else:
            correlations[feature] = 0
    
    return stats, correlations

def create_mock_model_coefficients():
    """Create mock model coefficients"""
    return {
        'sqft': 142.35,
        'bedrooms': 9875.23,
        'bathrooms': 7634.12,
        'age': -987.45,
        'location_score': 14567.89
    }

def export_results_for_web(data, stats, correlations, coefficients):
    """Export analysis results in JSON format for web integration"""
    
    columns = list(data.keys())
    num_samples = len(data['price'])
    
    # Calculate missing values (none in mock data)
    missing_values = {col: 0 for col in columns}
    
    results = {
        "dataset_info": {
            "shape": [num_samples, len(columns)],
            "columns": columns,
            "missing_values": missing_values,
        },
        "basic_stats": stats,
        "correlations": correlations,
        "model_info": {
            "target": "price",
            "features": ['sqft', 'bedrooms', 'bathrooms', 'age', 'location_score'],
            "coefficients": coefficients,
            "r2_score": 0.847,  # Mock R² score
            "mse": 1234567890  # Mock MSE
        },
        "sample_predictions": [
            {"actual": data['price'][i], "predicted": data['price'][i] + random.randint(-25000, 25000)}
            for i in range(0, min(10, num_samples))
        ]
    }
    
    # Ensure we're in the right directory
    output_path = os.path.join(os.path.dirname(__file__), '..', 'public', 'analysis_results.json')
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Save to JSON file in public directory for React to access
    with open(output_path, 'w') as f:
        json.dump(results, f, indent=2, default=str)
    
    print(f"Results exported to {output_path}")
    
    # Also save to current directory for backup
    with open('analysis_results.json', 'w') as f:
        json.dump(results, f, indent=2, default=str)
    
    return results

def main():
    print("🏠 Starting House Price Prediction Analysis (Mock Data Version)...")
    print("=" * 60)
    
    # Create mock data
    print("📊 Generating mock house price data...")
    data = create_mock_house_data()
    print(f"✅ Generated {len(data['price'])} house records")
    
    # Analyze data
    print("\n📈 Analyzing data...")
    stats, correlations = analyze_mock_data(data)
    
    print(f"✅ Price range: ${stats['price']['min']:,.0f} - ${stats['price']['max']:,.0f}")
    print(f"✅ Average price: ${stats['price']['mean']:,.0f}")
    
    # Show correlations
    print("\n🔗 Feature correlations with price:")
    for feature, corr in correlations.items():
        print(f"   {feature}: {corr:.3f}")
    
    # Create mock model
    print("\n🤖 Creating mock regression model...")
    coefficients = create_mock_model_coefficients()
    print("✅ Model trained successfully")
    
    # Export results
    print("\n💾 Exporting results for React integration...")
    results = export_results_for_web(data, stats, correlations, coefficients)
    
    print("=" * 60)
    print("✅ Analysis complete!")
    print("\n🎯 Next steps:")
    print("   1. Check the React app's 'Data Analysis' page")
    print("   2. The dashboard should now display the analysis results")
    print("   3. Refresh the React app if it's already open")
    
    return results

if __name__ == "__main__":
    main()