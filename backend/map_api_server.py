"""
Housing Demand Map API Server

Provides REST API endpoints for housing demand geographical data,
including property coordinates, demand hotspots, and heatmap data.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import json
import os
from typing import Dict, List, Any, Optional
from pydantic import BaseModel
import uvicorn

app = FastAPI(
    title="Housing Demand Map API",
    description="API for housing demand geographical visualization and hotspot mapping",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global map data storage
map_data_cache = None

def load_map_data():
    """Load map data from JSON file"""
    global map_data_cache
    
    if map_data_cache is not None:
        return map_data_cache
    
    try:
        # Look for map file in the same directory as this script
        script_dir = os.path.dirname(os.path.abspath(__file__))
        map_file = os.path.join(script_dir, "housing_demand_map_data.json")
        
        if os.path.exists(map_file):
            with open(map_file, 'r') as f:
                map_data_cache = json.load(f)
            print(f"✅ Loaded map data: {len(map_data_cache.get('properties', []))} properties, {len(map_data_cache.get('hotspots', []))} hotspots")
            return map_data_cache
        else:
            print(f"❌ Map data file not found: {map_file}")
            return None
    except Exception as e:
        print(f"❌ Error loading map data: {e}")
        return None

# Pydantic models
class MapConfig(BaseModel):
    center: Dict[str, float]
    bounds: Dict[str, float]
    default_zoom: int
    max_zoom: int
    min_zoom: int

class Property(BaseModel):
    id: str
    name: str
    address: str
    area: str
    city: str
    price: float
    price_text: str
    area_sqft: float
    bedrooms: str
    bathrooms: str
    latitude: float
    longitude: float
    demand_score: float
    dataset_source: str
    description: str
    nearby_locations: str

class Hotspot(BaseModel):
    id: str
    area: str
    city: str
    latitude: float
    longitude: float
    demand_score: float
    intensity: float
    property_count: int
    total_properties: int
    avg_price: float
    price_range: Dict[str, float]

class Statistics(BaseModel):
    avg_demand_score: float
    max_demand_score: float
    min_demand_score: float
    price_stats: Dict[str, float]
    areas_covered: int
    cities_covered: int

@app.on_event("startup")
async def startup_event():
    """Load map data on startup"""
    print("🚀 Starting Housing Demand Map API Server...")
    load_map_data()

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "service": "Housing Demand Map API",
        "version": "1.0.0",
        "description": "Geographical visualization API for housing demand hotspots",
        "endpoints": {
            "map_config": "/api/map/config",
            "properties": "/api/map/properties",
            "hotspots": "/api/map/hotspots",
            "heatmap_data": "/api/map/heatmap",
            "statistics": "/api/map/statistics",
            "all_data": "/api/map/all"
        }
    }

@app.get("/api/map/config")
async def get_map_config():
    """Get map configuration (center, bounds, zoom levels)"""
    data = load_map_data()
    if not data:
        raise HTTPException(status_code=500, detail="Map data not available")
    
    return data.get("map_config", {})

@app.get("/api/map/properties")
async def get_properties(
    limit: Optional[int] = None,
    city: Optional[str] = None,
    min_demand: Optional[float] = None,
    max_price: Optional[float] = None
):
    """Get property data with optional filtering"""
    data = load_map_data()
    if not data:
        raise HTTPException(status_code=500, detail="Map data not available")
    
    properties = data.get("properties", [])
    
    # Apply filters
    if city:
        properties = [p for p in properties if p.get("city", "").lower() == city.lower()]
    
    if min_demand is not None:
        properties = [p for p in properties if p.get("demand_score", 0) >= min_demand]
    
    if max_price is not None:
        properties = [p for p in properties if p.get("price", 0) <= max_price]
    
    # Apply limit
    if limit:
        properties = properties[:limit]
    
    return {
        "total_count": len(properties),
        "properties": properties
    }

@app.get("/api/map/hotspots")
async def get_hotspots(
    limit: Optional[int] = None,
    min_score: Optional[float] = None,
    city: Optional[str] = None
):
    """Get demand hotspots with optional filtering"""
    data = load_map_data()
    if not data:
        raise HTTPException(status_code=500, detail="Map data not available")
    
    hotspots = data.get("hotspots", [])
    
    # Apply filters
    if city:
        hotspots = [h for h in hotspots if h.get("city", "").lower() == city.lower()]
    
    if min_score is not None:
        hotspots = [h for h in hotspots if h.get("demand_score", 0) >= min_score]
    
    # Apply limit
    if limit:
        hotspots = hotspots[:limit]
    
    return {
        "total_count": len(hotspots),
        "hotspots": hotspots
    }

@app.get("/api/map/heatmap")
async def get_heatmap_data():
    """Get heatmap data points for visualization"""
    data = load_map_data()
    if not data:
        raise HTTPException(status_code=500, detail="Map data not available")
    
    heatmap_data = data.get("heatmap_data", [])
    
    return {
        "total_points": len(heatmap_data),
        "heatmap_data": heatmap_data
    }

@app.get("/api/map/statistics")
async def get_statistics():
    """Get map statistics and metadata"""
    data = load_map_data()
    if not data:
        raise HTTPException(status_code=500, detail="Map data not available")
    
    return {
        "metadata": data.get("metadata", {}),
        "statistics": data.get("statistics", {})
    }

@app.get("/api/map/all")
async def get_all_map_data():
    """Get complete map data"""
    data = load_map_data()
    if not data:
        raise HTTPException(status_code=500, detail="Map data not available")
    
    return data

@app.get("/api/map/search/area/{area_name}")
async def search_by_area(area_name: str):
    """Search properties by area name"""
    data = load_map_data()
    if not data:
        raise HTTPException(status_code=500, detail="Map data not available")
    
    properties = data.get("properties", [])
    area_properties = [p for p in properties if area_name.lower() in p.get("area", "").lower()]
    
    if not area_properties:
        raise HTTPException(status_code=404, detail=f"No properties found in area: {area_name}")
    
    # Calculate area statistics
    total_properties = len(area_properties)
    avg_demand = sum(p.get("demand_score", 0) for p in area_properties) / total_properties
    avg_price = sum(p.get("price", 0) for p in area_properties) / total_properties
    
    return {
        "area_name": area_name,
        "total_properties": total_properties,
        "avg_demand_score": round(avg_demand, 1),
        "avg_price": round(avg_price, 1),
        "properties": area_properties
    }

@app.get("/api/map/top-hotspots/{count}")
async def get_top_hotspots(count: int):
    """Get top N demand hotspots"""
    data = load_map_data()
    if not data:
        raise HTTPException(status_code=500, detail="Map data not available")
    
    hotspots = data.get("hotspots", [])
    top_hotspots = hotspots[:min(count, len(hotspots))]
    
    return {
        "requested_count": count,
        "returned_count": len(top_hotspots),
        "hotspots": top_hotspots
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    data = load_map_data()
    is_healthy = data is not None
    
    return {
        "status": "healthy" if is_healthy else "unhealthy",
        "map_data_loaded": is_healthy,
        "total_properties": len(data.get("properties", [])) if data else 0,
        "total_hotspots": len(data.get("hotspots", [])) if data else 0
    }

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={"error": "Endpoint not found", "detail": str(exc)}
    )

@app.exception_handler(500)
async def internal_server_error_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "detail": str(exc)}
    )

if __name__ == "__main__":
    print("🗺️  Starting Housing Demand Map API Server...")
    print("📊 Loading geographical housing data...")
    print("🌐 API will be available at: http://localhost:8000")
    print("📋 API documentation at: http://localhost:8000/docs")
    
    uvicorn.run(
        "map_api_server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )