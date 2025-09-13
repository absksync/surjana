"""
FastAPI Backend for Housing Demand Prediction System

RESTful API endpoints for:
- Running demand predictions
- Accessing forecast data
- City planning insights
- Model management
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import json
import os
from datetime import datetime
from typing import Dict, List, Optional
import uvicorn

# Import our prediction system
from simple_demand_predictor import SimpleDemandPredictor

app = FastAPI(
    title="Housing Demand Prediction API",
    description="AI-powered housing demand forecasting for city planning",
    version="1.0.0"
)

# Add CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global state
prediction_state = {
    "last_analysis": None,
    "analysis_running": False,
    "results_available": False
}

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Housing Demand Prediction API",
        "version": "1.0.0",
        "status": "active",
        "endpoints": {
            "predictions": "/api/predictions",
            "forecast": "/api/forecast",
            "hotspots": "/api/hotspots",
            "cities": "/api/cities",
            "run_analysis": "/api/run-analysis"
        }
    }

@app.get("/api/status")
async def get_status():
    """Get current analysis status"""
    return {
        "analysis_running": prediction_state["analysis_running"],
        "results_available": prediction_state["results_available"],
        "last_analysis": prediction_state["last_analysis"]
    }

@app.post("/api/run-analysis")
async def run_analysis(background_tasks: BackgroundTasks):
    """Trigger new housing demand analysis"""
    if prediction_state["analysis_running"]:
        raise HTTPException(status_code=409, detail="Analysis already running")
    
    background_tasks.add_task(execute_analysis)
    return {"message": "Analysis started", "status": "running"}

async def execute_analysis():
    """Execute the demand prediction analysis in background"""
    try:
        prediction_state["analysis_running"] = True
        prediction_state["results_available"] = False
        
        # Run the prediction
        predictor = SimpleDemandPredictor()
        houses_data, cleaned_data = predictor.load_datasets()
        processed_properties = predictor.process_data(houses_data, cleaned_data)
        location_stats = predictor.analyze_location_trends(processed_properties)
        hotspots = predictor.predict_demand_hotspots(location_stats, top_k=15)
        forecast = predictor.generate_2year_forecast(hotspots)
        
        # Create output
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
        predictor.save_results(output, "api_housing_predictions.json")
        
        prediction_state["last_analysis"] = datetime.now().isoformat()
        prediction_state["results_available"] = True
        
    except Exception as e:
        print(f"Analysis error: {e}")
    finally:
        prediction_state["analysis_running"] = False

@app.get("/api/predictions")
async def get_predictions():
    """Get complete prediction results"""
    if not prediction_state["results_available"]:
        # Try to load existing results
        if os.path.exists("housing_demand_predictions.json"):
            try:
                with open("housing_demand_predictions.json", 'r') as f:
                    data = json.load(f)
                return data
            except:
                pass
        
        raise HTTPException(status_code=404, detail="No predictions available. Run analysis first.")
    
    try:
        with open("api_housing_predictions.json", 'r') as f:
            data = json.load(f)
        return data
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Prediction results not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading predictions: {e}")

@app.get("/api/forecast")
async def get_forecast():
    """Get 2-year demand forecast"""
    try:
        # Try API results first, then fallback to main results
        filename = "api_housing_predictions.json" if prediction_state["results_available"] else "housing_demand_predictions.json"
        
        with open(filename, 'r') as f:
            data = json.load(f)
        
        if 'demand_forecast' in data:
            return data['demand_forecast']
        else:
            raise HTTPException(status_code=404, detail="Forecast data not found")
            
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="No forecast data available. Run analysis first.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading forecast: {e}")

@app.get("/api/hotspots")
async def get_hotspots(limit: int = 15):
    """Get top demand hotspots"""
    try:
        filename = "api_housing_predictions.json" if prediction_state["results_available"] else "housing_demand_predictions.json"
        
        with open(filename, 'r') as f:
            data = json.load(f)
        
        if 'demand_forecast' in data and 'hotspots' in data['demand_forecast']:
            hotspots = data['demand_forecast']['hotspots'][:limit]
            return {
                "total_hotspots": len(data['demand_forecast']['hotspots']),
                "returned_hotspots": len(hotspots),
                "hotspots": hotspots
            }
        else:
            raise HTTPException(status_code=404, detail="Hotspot data not found")
            
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="No hotspot data available. Run analysis first.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading hotspots: {e}")

@app.get("/api/cities")
async def get_city_rankings():
    """Get city rankings by demand"""
    try:
        filename = "api_housing_predictions.json" if prediction_state["results_available"] else "housing_demand_predictions.json"
        
        with open(filename, 'r') as f:
            data = json.load(f)
        
        if 'demand_forecast' in data and 'city_rankings' in data['demand_forecast']:
            return {
                "city_rankings": data['demand_forecast']['city_rankings'],
                "market_trends": data['demand_forecast'].get('market_trends', {}),
                "recommendations": data['demand_forecast'].get('recommendations', [])
            }
        else:
            raise HTTPException(status_code=404, detail="City ranking data not found")
            
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="No city data available. Run analysis first.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading city data: {e}")

@app.get("/api/cities/{city_name}")
async def get_city_details(city_name: str):
    """Get detailed information for a specific city"""
    try:
        filename = "api_housing_predictions.json" if prediction_state["results_available"] else "housing_demand_predictions.json"
        
        with open(filename, 'r') as f:
            data = json.load(f)
        
        if 'demand_forecast' in data and 'hotspots' in data['demand_forecast']:
            city_hotspots = [
                spot for spot in data['demand_forecast']['hotspots'] 
                if spot['city'].lower() == city_name.lower()
            ]
            
            if not city_hotspots:
                raise HTTPException(status_code=404, detail=f"No data found for city: {city_name}")
            
            # Calculate city statistics
            total_demand = sum(spot['demand_score'] for spot in city_hotspots)
            avg_demand = total_demand / len(city_hotspots)
            
            return {
                "city_name": city_name.title(),
                "total_hotspots": len(city_hotspots),
                "average_demand_score": round(avg_demand, 1),
                "hotspots": city_hotspots,
                "top_areas": [spot['area'] for spot in city_hotspots[:5]]
            }
        else:
            raise HTTPException(status_code=404, detail="City data not found")
            
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="No city data available. Run analysis first.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading city details: {e}")

@app.get("/api/areas/{area_name}")
async def get_area_details(area_name: str):
    """Get detailed forecast for a specific area"""
    try:
        filename = "api_housing_predictions.json" if prediction_state["results_available"] else "housing_demand_predictions.json"
        
        with open(filename, 'r') as f:
            data = json.load(f)
        
        if 'demand_forecast' in data and 'hotspots' in data['demand_forecast']:
            area_data = next(
                (spot for spot in data['demand_forecast']['hotspots'] 
                 if spot['area'].lower() == area_name.lower()), 
                None
            )
            
            if not area_data:
                raise HTTPException(status_code=404, detail=f"No data found for area: {area_name}")
            
            return area_data
        else:
            raise HTTPException(status_code=404, detail="Area data not found")
            
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="No area data available. Run analysis first.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading area details: {e}")

@app.get("/api/market-trends")
async def get_market_trends():
    """Get overall market trends and insights"""
    try:
        filename = "api_housing_predictions.json" if prediction_state["results_available"] else "housing_demand_predictions.json"
        
        with open(filename, 'r') as f:
            data = json.load(f)
        
        forecast = data.get('demand_forecast', {})
        
        return {
            "market_trends": forecast.get('market_trends', {}),
            "city_rankings": forecast.get('city_rankings', []),
            "recommendations": forecast.get('recommendations', []),
            "forecast_summary": {
                "total_hotspots": forecast.get('total_hotspots', 0),
                "forecast_period": forecast.get('forecast_period', '24 months'),
                "methodology": forecast.get('methodology', 'Statistical analysis')
            }
        }
        
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="No market data available. Run analysis first.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading market trends: {e}")

@app.get("/api/summary")
async def get_analysis_summary():
    """Get analysis summary and key metrics"""
    try:
        filename = "api_housing_predictions.json" if prediction_state["results_available"] else "housing_demand_predictions.json"
        
        with open(filename, 'r') as f:
            data = json.load(f)
        
        summary = data.get('analysis_summary', {})
        forecast = data.get('demand_forecast', {})
        data_quality = data.get('data_quality', {})
        
        # Extract key insights
        hotspots = forecast.get('hotspots', [])
        top_5_areas = [spot['area'] for spot in hotspots[:5]]
        
        return {
            "analysis_summary": summary,
            "data_quality": data_quality,
            "key_insights": {
                "top_demand_areas": top_5_areas,
                "total_hotspots": len(hotspots),
                "market_sentiment": forecast.get('market_trends', {}).get('market_sentiment', 'Unknown'),
                "leading_cities": forecast.get('market_trends', {}).get('leading_cities', [])
            },
            "last_updated": prediction_state.get("last_analysis", summary.get('analysis_date'))
        }
        
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="No analysis summary available. Run analysis first.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading summary: {e}")

if __name__ == "__main__":
    # Check if predictions exist on startup
    if os.path.exists("housing_demand_predictions.json"):
        prediction_state["results_available"] = True
        try:
            with open("housing_demand_predictions.json", 'r') as f:
                data = json.load(f)
                if 'analysis_summary' in data:
                    prediction_state["last_analysis"] = data['analysis_summary'].get('analysis_date')
        except:
            pass
    
    print("🚀 Starting Housing Demand Prediction API...")
    print("📊 Available endpoints:")
    print("   GET  /api/predictions     - Complete prediction results")
    print("   GET  /api/forecast        - 2-year demand forecast") 
    print("   GET  /api/hotspots        - Top demand hotspots")
    print("   GET  /api/cities          - City rankings")
    print("   GET  /api/market-trends   - Market insights")
    print("   POST /api/run-analysis    - Trigger new analysis")
    print("🌐 API running at: http://localhost:8000")
    print("📖 Documentation: http://localhost:8000/docs")
    
    uvicorn.run(app, host="0.0.0.0", port=8000)