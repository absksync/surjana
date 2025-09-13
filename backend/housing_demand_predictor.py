"""
AI-Based Housing Demand Prediction System

This module creates a machine learning model to predict housing demand 
hotspots based on historical real estate data for city planning decisions.

Problem: Cities don't know where affordable housing demands will spike
Solution: ML model forecasting demand patterns for next 2 years
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from sklearn.cluster import KMeans
import joblib
import json
import os
import re
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Any
import warnings
warnings.filterwarnings('ignore')


class HousingDemandPredictor:
    """
    Advanced ML model for predicting housing demand patterns
    Uses historical property data to forecast demand hotspots
    """
    
    def __init__(self, data_dir: str = "../datasets"):
        self.data_dir = data_dir
        self.models = {}
        self.scalers = {}
        self.encoders = {}
        self.demand_clusters = None
        self.feature_importance = {}
        self.prediction_history = []
        
    def load_datasets(self) -> Tuple[pd.DataFrame, pd.DataFrame]:
        """Load and combine both housing datasets"""
        houses_path = os.path.join(self.data_dir, "houses.csv")
        cleaned_path = os.path.join(self.data_dir, "house_cleaned.csv")
        
        print("Loading housing datasets...")
        
        # Load datasets
        houses_df = pd.read_csv(houses_path)
        cleaned_df = pd.read_csv(cleaned_path)
        
        print(f"Houses dataset: {len(houses_df)} records")
        print(f"Cleaned dataset: {len(cleaned_df)} records")
        
        return houses_df, cleaned_df
    
    def extract_location_features(self, address: str) -> Dict[str, Any]:
        """Extract detailed location features from address string"""
        if pd.isna(address) or address == "":
            return {
                'area': 'unknown',
                'sector': 'unknown', 
                'phase': 'unknown',
                'city': 'unknown',
                'is_prime_location': 0
            }
        
        address = str(address).lower()
        
        # Extract area/sector information
        area = 'unknown'
        sector = 'unknown'
        phase = 'unknown'
        city = 'unknown'
        
        # Extract sector numbers
        sector_match = re.search(r'sector\s*(\d+[a-z]*)', address)
        if sector_match:
            sector = f"sector_{sector_match.group(1)}"
            area = sector
        
        # Extract phase information
        phase_match = re.search(r'phase\s*(\d+)', address)
        if phase_match:
            phase = f"phase_{phase_match.group(1)}"
        
        # Extract city
        if 'gurgaon' in address or 'gurugram' in address:
            city = 'gurgaon'
        elif 'faridabad' in address:
            city = 'faridabad'
        elif 'delhi' in address:
            city = 'delhi'
        
        # Identify prime locations
        prime_areas = ['dlf', 'sushant lok', 'cyber city', 'golf course', 'mg road']
        is_prime = 1 if any(prime in address for prime in prime_areas) else 0
        
        return {
            'area': area,
            'sector': sector,
            'phase': phase, 
            'city': city,
            'is_prime_location': is_prime
        }
    
    def calculate_demand_score(self, df: pd.DataFrame) -> pd.Series:
        """
        Calculate housing demand score based on multiple factors:
        - Property density in area
        - Price accessibility (inverse of price)
        - Connectivity features
        - Investment mentions in descriptions
        """
        demand_scores = []
        
        for idx, row in df.iterrows():
            score = 0
            
            # Base demand from property density
            area_count = len(df[df['address'].str.contains(
                row.get('area', ''), case=False, na=False)])
            density_score = min(area_count / 50, 1.0)  # Normalize to 0-1
            score += density_score * 30
            
            # Affordability factor (inverse price relationship)
            price = row.get('price_numeric', 0)
            if price > 0:
                # Higher demand for properties under 5 crores
                if price <= 5:
                    affordability_score = 1.0
                elif price <= 10:
                    affordability_score = 0.7
                else:
                    affordability_score = 0.3
                score += affordability_score * 25
            
            # Investment potential mentions
            description = str(row.get('description', '')).lower()
            if any(keyword in description for keyword in ['investment', 'rental', 'income']):
                score += 20
            
            # Connectivity and amenities
            nearby = str(row.get('nearbyLocations', '')).lower()
            amenity_keywords = ['metro', 'hospital', 'school', 'mall', 'bank', 'airport']
            amenity_count = sum(1 for keyword in amenity_keywords if keyword in nearby)
            score += (amenity_count / len(amenity_keywords)) * 15
            
            # Property features
            features = str(row.get('features', '')).lower()
            if 'connectivity5' in features or 'connectivity4' in features:
                score += 10
                
            demand_scores.append(min(score, 100))  # Cap at 100
        
        return pd.Series(demand_scores)
    
    def preprocess_data(self, houses_df: pd.DataFrame, cleaned_df: pd.DataFrame) -> pd.DataFrame:
        """Comprehensive data preprocessing and feature engineering"""
        print("Preprocessing and engineering features...")
        
        # Combine datasets with common columns
        combined_data = []
        
        # Process houses dataset
        for _, row in houses_df.iterrows():
            processed_row = {
                'property_name': row.get('property_name', ''),
                'society': row.get('society', ''),
                'price_text': row.get('price', ''),
                'rate': row.get('rate', ''),
                'area': row.get('area', ''),
                'bedRoom': row.get('bedRoom', 0),
                'bathroom': row.get('bathroom', 0),
                'address': row.get('address', ''),
                'facing': row.get('facing', ''),
                'agePossession': row.get('agePossession', ''),
                'nearbyLocations': row.get('nearbyLocations', ''),
                'description': row.get('description', ''),
                'features': row.get('features', ''),
                'rating': row.get('rating', ''),
                'dataset_source': 'houses'
            }
            combined_data.append(processed_row)
        
        # Process cleaned dataset
        for _, row in cleaned_df.iterrows():
            processed_row = {
                'property_name': row.get('property_name', ''),
                'society': row.get('society', ''),
                'price_text': str(row.get('price', '')),
                'rate': '',  # Not available in cleaned dataset
                'area': row.get('area', ''),
                'bedRoom': row.get('bedRoom', 0),
                'bathroom': row.get('bathroom', 0),
                'address': row.get('address', ''),
                'facing': row.get('facing', ''),
                'agePossession': row.get('agePossession', ''),
                'nearbyLocations': row.get('nearbyLocations', ''),
                'description': row.get('description', ''),
                'features': row.get('features', ''),
                'rating': row.get('rating', ''),
                'dataset_source': 'cleaned'
            }
            combined_data.append(processed_row)
        
        df = pd.DataFrame(combined_data)
        
        # Extract numeric price
        df['price_numeric'] = df['price_text'].apply(self._extract_price)
        
        # Extract location features
        location_features = df['address'].apply(self.extract_location_features)
        for key in ['area', 'sector', 'phase', 'city', 'is_prime_location']:
            df[key] = [loc[key] for loc in location_features]
        
        # Extract numeric bedrooms
        df['bedrooms_num'] = df['bedRoom'].apply(self._extract_numeric)
        df['bathrooms_num'] = df['bathroom'].apply(self._extract_numeric)
        
        # Extract area numeric
        df['area_sqft'] = df['area'].apply(self._extract_area)
        
        # Calculate price per sqft
        df['price_per_sqft'] = df.apply(
            lambda x: x['price_numeric'] * 10000000 / x['area_sqft'] 
            if x['area_sqft'] > 0 and x['price_numeric'] > 0 else 0, axis=1
        )
        
        # Property age encoding
        df['property_age'] = df['agePossession'].apply(self._encode_age)
        
        # Calculate demand score (target variable)
        df['demand_score'] = self.calculate_demand_score(df)
        
        # Remove rows with missing critical data
        df = df.dropna(subset=['price_numeric', 'area_sqft', 'address'])
        df = df[df['price_numeric'] > 0]
        df = df[df['area_sqft'] > 0]
        
        print(f"Processed dataset: {len(df)} records with {df.columns.size} features")
        return df
    
    def _extract_price(self, price_text: str) -> float:
        """Extract numeric price from text (in crores)"""
        if pd.isna(price_text):
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
    
    def _extract_numeric(self, value: Any) -> int:
        """Extract numeric value from text"""
        if pd.isna(value):
            return 0
        
        try:
            # Handle direct numeric values
            if isinstance(value, (int, float)):
                return int(value)
            
            # Extract from text
            numeric_match = re.search(r'\d+', str(value))
            if numeric_match:
                return int(numeric_match.group())
        except:
            pass
        
        return 0
    
    def _extract_area(self, area_text: str) -> float:
        """Extract area in square feet"""
        if pd.isna(area_text):
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
    
    def _encode_age(self, age_text: str) -> int:
        """Encode property age to numeric value"""
        if pd.isna(age_text):
            return 5  # Default to 5 years
        
        age_str = str(age_text).lower()
        
        if 'new' in age_str or 'under construction' in age_str:
            return 0
        elif '0 to 1' in age_str or 'within 6 months' in age_str:
            return 1
        elif '1 to 5' in age_str:
            return 3
        elif '5 to 10' in age_str:
            return 7
        elif '10 to 15' in age_str:
            return 12
        elif 'more than 15' in age_str:
            return 20
        
        return 5  # Default
    
    def prepare_features(self, df: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray]:
        """Prepare feature matrix for ML models"""
        print("Preparing features for ML models...")
        
        # Select and encode features
        feature_columns = [
            'price_numeric', 'area_sqft', 'price_per_sqft',
            'bedrooms_num', 'bathrooms_num', 'property_age',
            'is_prime_location', 'city', 'area'
        ]
        
        # Create feature matrix
        X = df[feature_columns].copy()
        
        # Encode categorical variables
        categorical_cols = ['city', 'area']
        for col in categorical_cols:
            if col not in self.encoders:
                self.encoders[col] = LabelEncoder()
                X[col] = self.encoders[col].fit_transform(X[col].astype(str))
            else:
                # Handle unseen values
                unique_values = set(self.encoders[col].classes_)
                X[col] = X[col].apply(lambda x: x if x in unique_values else 'unknown')
                X[col] = self.encoders[col].transform(X[col].astype(str))
        
        # Target variable
        y = df['demand_score'].values
        
        print(f"Feature matrix shape: {X.shape}")
        print(f"Target shape: {y.shape}")
        
        return X.values, y
    
    def train_models(self, X: np.ndarray, y: np.ndarray) -> Dict[str, Dict]:
        """Train multiple ML models for demand prediction"""
        print("Training ML models...")
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Scale features
        self.scalers['standard'] = StandardScaler()
        X_train_scaled = self.scalers['standard'].fit_transform(X_train)
        X_test_scaled = self.scalers['standard'].transform(X_test)
        
        # Define models
        models_config = {
            'random_forest': RandomForestRegressor(
                n_estimators=100, max_depth=10, random_state=42
            ),
            'gradient_boosting': GradientBoostingRegressor(
                n_estimators=100, max_depth=6, random_state=42
            ),
            'linear_regression': LinearRegression()
        }
        
        results = {}
        
        for name, model in models_config.items():
            print(f"Training {name}...")
            
            # Train model
            if name == 'linear_regression':
                model.fit(X_train_scaled, y_train)
                y_pred = model.predict(X_test_scaled)
            else:
                model.fit(X_train, y_train)
                y_pred = model.predict(X_test)
            
            # Evaluate
            mse = mean_squared_error(y_test, y_pred)
            r2 = r2_score(y_test, y_pred)
            mae = mean_absolute_error(y_test, y_pred)
            
            results[name] = {
                'model': model,
                'mse': mse,
                'r2': r2,
                'mae': mae,
                'predictions': y_pred[:10].tolist()  # Sample predictions
            }
            
            # Store model
            self.models[name] = model
            
            print(f"{name} - R²: {r2:.3f}, MSE: {mse:.3f}, MAE: {mae:.3f}")
            
            # Feature importance for tree-based models
            if hasattr(model, 'feature_importances_'):
                self.feature_importance[name] = model.feature_importances_.tolist()
        
        # Select best model
        best_model_name = max(results.keys(), key=lambda k: results[k]['r2'])
        self.best_model = best_model_name
        
        print(f"Best model: {best_model_name} (R² = {results[best_model_name]['r2']:.3f})")
        
        return results
    
    def predict_demand_hotspots(self, df: pd.DataFrame, top_k: int = 20) -> List[Dict]:
        """Predict top demand hotspots for next 2 years"""
        print(f"Predicting top {top_k} demand hotspots...")
        
        if self.best_model not in self.models:
            raise ValueError("No trained model available")
        
        # Prepare features
        X, _ = self.prepare_features(df)
        
        # Make predictions
        model = self.models[self.best_model]
        if self.best_model == 'linear_regression':
            X = self.scalers['standard'].transform(X)
        
        predictions = model.predict(X)
        
        # Create results with location details
        results = []
        for idx, (_, row) in enumerate(df.iterrows()):
            result = {
                'area': row['area'],
                'city': row['city'],
                'sector': row['sector'],
                'address': row['address'],
                'predicted_demand': float(predictions[idx]),
                'current_price_range': f"₹{row['price_numeric']:.1f} Cr",
                'avg_area': f"{row['area_sqft']:.0f} sq ft",
                'connectivity_score': 1 if row['is_prime_location'] else 0,
                'investment_potential': 'High' if predictions[idx] > 70 else 'Medium' if predictions[idx] > 50 else 'Low'
            }
            results.append(result)
        
        # Sort by predicted demand and group by area
        results.sort(key=lambda x: x['predicted_demand'], reverse=True)
        
        # Get top unique areas
        seen_areas = set()
        unique_results = []
        for result in results:
            area_key = f"{result['city']}_{result['area']}"
            if area_key not in seen_areas:
                seen_areas.add(area_key)
                unique_results.append(result)
                if len(unique_results) >= top_k:
                    break
        
        return unique_results
    
    def generate_2year_forecast(self, hotspots: List[Dict]) -> Dict[str, Any]:
        """Generate 2-year demand forecast with trends"""
        current_date = datetime.now()
        
        forecast = {
            'forecast_date': current_date.isoformat(),
            'forecast_period': '24 months',
            'hotspots': [],
            'market_trends': {},
            'recommendations': []
        }
        
        for spot in hotspots:
            base_demand = spot['predicted_demand']
            
            # Project demand growth (simulated trend analysis)
            growth_factors = {
                'gurgaon': 1.15,  # 15% growth
                'faridabad': 1.12,  # 12% growth  
                'delhi': 1.08   # 8% growth
            }
            
            city_growth = growth_factors.get(spot['city'], 1.10)
            connectivity_boost = 1.05 if spot['connectivity_score'] > 0 else 1.0
            
            # Monthly projections
            monthly_projections = []
            for month in range(1, 25):
                projected_demand = base_demand * (city_growth ** (month/12)) * connectivity_boost
                monthly_projections.append({
                    'month': month,
                    'demand_score': round(projected_demand, 1),
                    'date': (current_date + timedelta(days=month*30)).strftime('%Y-%m')
                })
            
            forecast_spot = {
                **spot,
                'growth_projection': f"{((city_growth - 1) * 100):.0f}% annually",
                'peak_demand_month': max(monthly_projections, key=lambda x: x['demand_score'])['month'],
                'monthly_projections': monthly_projections[-6:],  # Last 6 months
                'recommendation': self._generate_recommendation(spot)
            }
            
            forecast['hotspots'].append(forecast_spot)
        
        # Market trends
        forecast['market_trends'] = {
            'high_growth_cities': ['Gurgaon', 'Faridabad'],
            'emerging_sectors': [h['area'] for h in hotspots[:5]],
            'price_trend': 'Upward with 10-15% annual growth',
            'demand_drivers': [
                'Metro connectivity expansion',
                'IT sector growth', 
                'Affordable housing schemes',
                'Infrastructure development'
            ]
        }
        
        # Recommendations
        forecast['recommendations'] = [
            'Focus on Gurgaon sectors for maximum ROI',
            'Invest in properties near metro stations',
            'Target affordable housing segment (2-5 Cr range)',
            'Monitor government policy changes',
            'Consider properties with investment potential mentions'
        ]
        
        return forecast
    
    def _generate_recommendation(self, spot: Dict) -> str:
        """Generate specific recommendation for each hotspot"""
        demand = spot['predicted_demand']
        price = float(spot['current_price_range'].replace('₹', '').replace(' Cr', ''))
        
        if demand > 80:
            return "PRIORITY: High demand area - immediate development recommended"
        elif demand > 60:
            return "RECOMMENDED: Strong demand potential - plan development within 6 months"
        elif demand > 40:
            return "MONITOR: Moderate demand - evaluate market conditions"
        else:
            return "LOW PRIORITY: Consider other locations first"
    
    def save_models(self, filepath: str = "demand_prediction_models.pkl"):
        """Save trained models and preprocessing objects"""
        model_data = {
            'models': self.models,
            'scalers': self.scalers,
            'encoders': self.encoders,
            'feature_importance': self.feature_importance,
            'best_model': self.best_model if hasattr(self, 'best_model') else None
        }
        
        joblib.dump(model_data, filepath)
        print(f"Models saved to {filepath}")
    
    def load_models(self, filepath: str = "demand_prediction_models.pkl"):
        """Load trained models and preprocessing objects"""
        model_data = joblib.load(filepath)
        
        self.models = model_data['models']
        self.scalers = model_data['scalers']
        self.encoders = model_data['encoders']
        self.feature_importance = model_data['feature_importance']
        self.best_model = model_data.get('best_model')
        
        print(f"Models loaded from {filepath}")


def main():
    """Main execution function"""
    print("=== AI-Based Housing Demand Prediction System ===")
    print("Analyzing housing market data for demand forecasting...\n")
    
    # Initialize predictor
    predictor = HousingDemandPredictor()
    
    try:
        # Load and process data
        houses_df, cleaned_df = predictor.load_datasets()
        processed_df = predictor.preprocess_data(houses_df, cleaned_df)
        
        # Prepare features and train models
        X, y = predictor.prepare_features(processed_df)
        training_results = predictor.train_models(X, y)
        
        # Generate predictions
        hotspots = predictor.predict_demand_hotspots(processed_df, top_k=15)
        forecast = predictor.generate_2year_forecast(hotspots)
        
        # Save results
        output = {
            'model_performance': {
                name: {
                    'r2_score': results['r2'],
                    'mse': results['mse'],
                    'mae': results['mae']
                }
                for name, results in training_results.items()
            },
            'demand_forecast': forecast,
            'feature_importance': predictor.feature_importance,
            'data_summary': {
                'total_properties_analyzed': len(processed_df),
                'cities_covered': processed_df['city'].nunique(),
                'areas_analyzed': processed_df['area'].nunique(),
                'price_range': {
                    'min': f"₹{processed_df['price_numeric'].min():.1f} Cr",
                    'max': f"₹{processed_df['price_numeric'].max():.1f} Cr",
                    'avg': f"₹{processed_df['price_numeric'].mean():.1f} Cr"
                }
            }
        }
        
        # Save to file
        with open('housing_demand_predictions.json', 'w') as f:
            json.dump(output, f, indent=2, default=str)
        
        # Save models
        predictor.save_models()
        
        print(f"\n=== RESULTS ===")
        print(f"✅ Analyzed {len(processed_df)} properties")
        print(f"✅ Best model: {predictor.best_model} (R² = {training_results[predictor.best_model]['r2']:.3f})")
        print(f"✅ Identified {len(hotspots)} demand hotspots")
        print(f"✅ Generated 2-year forecast")
        print(f"✅ Results saved to housing_demand_predictions.json")
        
        print(f"\n=== TOP 5 DEMAND HOTSPOTS ===")
        for i, spot in enumerate(hotspots[:5], 1):
            print(f"{i}. {spot['area']} ({spot['city']})")
            print(f"   Demand Score: {spot['predicted_demand']:.1f}/100")
            print(f"   Investment Potential: {spot['investment_potential']}")
            print(f"   Recommendation: {spot.get('recommendation', 'N/A')}")
            print()
        
        return output
        
    except FileNotFoundError as e:
        print(f"❌ Error: Dataset files not found - {e}")
        print("Please ensure houses.csv and house_cleaned.csv are in the datasets folder")
        return None
    except Exception as e:
        print(f"❌ Error during prediction: {e}")
        return None


if __name__ == "__main__":
    main()