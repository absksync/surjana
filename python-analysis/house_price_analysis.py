# House Price Prediction Data Analysis
# Install dependencies as needed:
# pip install kagglehub pandas numpy matplotlib seaborn scikit-learn

import kagglehub
from kagglehub import KaggleDatasetAdapter
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

def load_house_price_data():
    """Load the house price prediction dataset from Kaggle"""
    try:
        # Set the path to the file you'd like to load
        file_path = ""  # Leave empty to load all files
        
        # Load the latest version
        df = kagglehub.load_dataset(
            KaggleDatasetAdapter.PANDAS,
            "jenilhareshbhaighori/house-price-prediction",
            file_path,
        )
        
        print("Dataset loaded successfully!")
        print(f"Dataset shape: {df.shape}")
        print("\nFirst 5 records:")
        print(df.head())
        
        print("\nDataset info:")
        print(df.info())
        
        print("\nBasic statistics:")
        print(df.describe())
        
        return df
        
    except Exception as e:
        print(f"Error loading dataset: {e}")
        print("Make sure you have kagglehub installed: pip install kagglehub")
        return None

def analyze_data(df):
    """Perform basic data analysis"""
    if df is None:
        return
    
    # Check for missing values
    print("\nMissing values:")
    print(df.isnull().sum())
    
    # Basic visualizations (if matplotlib is available)
    try:
        plt.figure(figsize=(12, 8))
        
        # If there's a price column, create distribution plot
        price_columns = [col for col in df.columns if 'price' in col.lower()]
        if price_columns:
            plt.subplot(2, 2, 1)
            df[price_columns[0]].hist(bins=30)
            plt.title(f'Distribution of {price_columns[0]}')
            plt.xlabel(price_columns[0])
            plt.ylabel('Frequency')
        
        # Correlation heatmap for numeric columns
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        if len(numeric_cols) > 1:
            plt.subplot(2, 2, 2)
            correlation_matrix = df[numeric_cols].corr()
            sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', center=0)
            plt.title('Correlation Heatmap')
        
        plt.tight_layout()
        plt.savefig('house_price_analysis.png')
        plt.show()
        
    except ImportError:
        print("Matplotlib/Seaborn not available for visualizations")
    except Exception as e:
        print(f"Error creating visualizations: {e}")

def simple_model(df):
    """Create a simple linear regression model"""
    if df is None:
        return
    
    try:
        # This is a generic approach - you'll need to adjust based on actual column names
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        
        if len(numeric_cols) < 2:
            print("Not enough numeric columns for modeling")
            return
        
        # Assume the target is the last numeric column or contains 'price'
        target_col = None
        for col in numeric_cols:
            if 'price' in col.lower() or 'target' in col.lower():
                target_col = col
                break
        
        if target_col is None:
            target_col = numeric_cols[-1]  # Use last numeric column as default
        
        feature_cols = [col for col in numeric_cols if col != target_col]
        
        if not feature_cols:
            print("No feature columns available for modeling")
            return
        
        print(f"\nUsing target: {target_col}")
        print(f"Using features: {feature_cols}")
        
        # Prepare data
        X = df[feature_cols].fillna(df[feature_cols].mean())
        y = df[target_col].fillna(df[target_col].mean())
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Train model
        model = LinearRegression()
        model.fit(X_train, y_train)
        
        # Make predictions
        y_pred = model.predict(X_test)
        
        # Evaluate
        mse = mean_squared_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        
        print(f"\nModel Performance:")
        print(f"Mean Squared Error: {mse:.2f}")
        print(f"R² Score: {r2:.4f}")
        
        # Feature importance
        print(f"\nFeature Importance:")
        for feature, coef in zip(feature_cols, model.coef_):
            print(f"{feature}: {coef:.4f}")
        
        return model
        
    except Exception as e:
        print(f"Error in modeling: {e}")
        return None

def export_results_for_web(df, model=None):
    """Export analysis results in JSON format for web integration"""
    if df is None:
        return
    
    try:
        results = {
            "dataset_info": {
                "shape": df.shape,
                "columns": df.columns.tolist(),
                "missing_values": df.isnull().sum().to_dict(),
            },
            "basic_stats": df.describe().to_dict(),
        }
        
        if model is not None:
            numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
            if len(numeric_cols) >= 2:
                target_col = None
                for col in numeric_cols:
                    if 'price' in col.lower():
                        target_col = col
                        break
                if target_col is None:
                    target_col = numeric_cols[-1]
                
                feature_cols = [col for col in numeric_cols if col != target_col]
                
                results["model_info"] = {
                    "target": target_col,
                    "features": feature_cols,
                    "coefficients": dict(zip(feature_cols, model.coef_.tolist()))
                }
        
        # Save to JSON file
        import json
        with open('analysis_results.json', 'w') as f:
            json.dump(results, f, indent=2, default=str)
        
        print("\nResults exported to analysis_results.json")
        
    except Exception as e:
        print(f"Error exporting results: {e}")

if __name__ == "__main__":
    print("Starting House Price Prediction Analysis...")
    
    # Load data
    df = load_house_price_data()
    
    if df is not None:
        # Analyze data
        analyze_data(df)
        
        # Create simple model
        model = simple_model(df)
        
        # Export results for web integration
        export_results_for_web(df, model)
        
        print("\nAnalysis complete! Check the generated files for results.")
    else:
        print("Could not load dataset. Please check your internet connection and try again.")