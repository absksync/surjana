import { useState, useEffect } from "react";
import { BarChart, TrendingUp, Database, Activity } from "lucide-react";

interface AnalysisResults {
  dataset_info?: {
    shape: [number, number];
    columns: string[];
    missing_values: Record<string, number>;
  };
  basic_stats?: Record<string, unknown>;
  model_info?: {
    target: string;
    features: string[];
    coefficients: Record<string, number>;
  };
}

export function DataDashboard() {
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnalysisResults = async () => {
    console.log('Loading analysis results...');
    setLoading(true);
    setError(null);
    
    try {
      // Load the analysis results from the public directory
      const response = await fetch('/analysis_results.json');
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error('Analysis results not found. Please run the Python analysis first.');
      }
      const data = await response.json();
      console.log('Data loaded:', data);
      setAnalysisResults(data);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analysis results');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalysisResults();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-semibold mb-2">Error Loading Data</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <div className="bg-white border border-red-200 rounded p-4">
          <h4 className="font-semibold mb-2">To fix this:</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Navigate to the python-analysis directory</li>
            <li>Install Python dependencies: <code className="bg-gray-100 px-1 rounded">pip install -r requirements.txt</code></li>
            <li>Run the analysis: <code className="bg-gray-100 px-1 rounded">python house_price_analysis.py</code></li>
            <li>Refresh this page</li>
          </ol>
        </div>
        <button 
          onClick={loadAnalysisResults}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  if (!analysisResults) {
    return (
      <div className="text-center py-12">
        <Database className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Data</h3>
        <p className="text-gray-600">Run the Python analysis script to see results here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <BarChart className="h-6 w-6 text-blue-600" />
          House Price Analysis Dashboard
        </h2>

        {/* Dataset Info */}
        {analysisResults.dataset_info && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-800">Dataset Size</h3>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {analysisResults.dataset_info.shape[0].toLocaleString()} rows
              </p>
              <p className="text-sm text-blue-600">
                {analysisResults.dataset_info.shape[1]} columns
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-green-800">Data Quality</h3>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {Object.values(analysisResults.dataset_info.missing_values).reduce((a, b) => a + b, 0)} missing
              </p>
              <p className="text-sm text-green-600">values total</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-purple-800">Features</h3>
              </div>
              <p className="text-2xl font-bold text-purple-600">
                {analysisResults.dataset_info.columns.length}
              </p>
              <p className="text-sm text-purple-600">total columns</p>
            </div>
          </div>
        )}

        {/* Columns List */}
        {analysisResults.dataset_info && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Dataset Columns</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {analysisResults.dataset_info.columns.map((column) => (
                <div key={column} className="bg-gray-100 rounded px-3 py-2 text-sm">
                  {column}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Model Info */}
        {analysisResults.model_info && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Model Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Target Variable</h4>
                <div className="bg-blue-100 rounded px-3 py-2 font-mono text-sm">
                  {analysisResults.model_info.target}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Feature Count</h4>
                <div className="bg-green-100 rounded px-3 py-2 font-mono text-sm">
                  {analysisResults.model_info.features.length} features
                </div>
              </div>
            </div>

            {/* Feature Coefficients */}
            <div className="mt-6">
              <h4 className="font-medium text-gray-700 mb-3">Feature Importance (Coefficients)</h4>
              <div className="space-y-2">
                {Object.entries(analysisResults.model_info.coefficients).map(([feature, coef]) => (
                  <div key={feature} className="flex items-center justify-between bg-gray-50 rounded px-4 py-2">
                    <span className="font-mono text-sm">{feature}</span>
                    <span className={`font-mono text-sm ${coef > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {coef.toFixed(4)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-yellow-800 font-semibold mb-2">Next Steps</h3>
        <ul className="text-yellow-700 space-y-1 text-sm">
          <li>• Add chart visualizations using Chart.js or Recharts</li>
          <li>• Create interactive filters for the data</li>
          <li>• Add prediction interface for new house prices</li>
          <li>• Integrate real-time data updates</li>
        </ul>
      </div>
    </div>
  );
}