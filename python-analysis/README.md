# Python Data Analysis Setup

This directory contains Python scripts for data analysis that can complement your React web application.

## Setup Instructions

1. **Install Python** (if not already installed):
   - Download from https://python.org
   - Make sure to add Python to PATH during installation

2. **Create a virtual environment** (recommended):
   ```bash
   python -m venv venv
   
   # On Windows:
   venv\Scripts\activate
   
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install required packages**:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

### Running the House Price Analysis
```bash
python house_price_analysis.py
```

This script will:
- Load the Kaggle house price dataset
- Perform basic data analysis
- Create visualizations
- Build a simple machine learning model
- Export results to JSON for web integration

### Files Generated
- `analysis_results.json` - Summary data for web integration
- `house_price_analysis.png` - Data visualizations

## Integration with React App

The analysis results are exported to JSON format, which can be easily consumed by your React application:

```javascript
// In your React app
import analysisResults from '../python-analysis/analysis_results.json';

function DataDashboard() {
  return (
    <div>
      <h2>House Price Analysis Results</h2>
      <p>Dataset shape: {analysisResults.dataset_info.shape}</p>
      {/* Display other analysis results */}
    </div>
  );
}
```

## Available Scripts

- `house_price_analysis.py` - Main analysis script
- `requirements.txt` - Python dependencies

## Next Steps

1. Run the Python analysis
2. Import the generated JSON into your React app
3. Create visualizations using libraries like Chart.js or D3.js
4. Build an interactive dashboard