import { useState, useEffect } from "react";

interface DataType {
  dataset_info?: {
    shape?: [number, number];
    columns?: string[];
  };
  model_info?: {
    target?: string;
    r2_score?: number;
    features?: string[];
  };
}

export function SimpleDataDashboard() {
  const [data, setData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Fetching data...');
        const response = await fetch('/analysis_results.json');
        console.log('Response:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Data loaded:', result);
        setData(result);
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-semibold mb-2">Error</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-yellow-800 font-semibold mb-2">No Data</h3>
        <p className="text-yellow-600">No analysis results found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Analysis Results (Simple)
      </h2>
      
      {data.dataset_info && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Dataset Info</h3>
          <p>Shape: {data.dataset_info.shape?.[0]} rows × {data.dataset_info.shape?.[1]} columns</p>
          <p>Columns: {data.dataset_info.columns?.join(', ')}</p>
        </div>
      )}

      {data.model_info && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Model Info</h3>
          <p>Target: {data.model_info.target}</p>
          <p>R² Score: {data.model_info.r2_score}</p>
          <p>Features: {data.model_info.features?.join(', ')}</p>
        </div>
      )}

      <div className="bg-gray-50 rounded p-4">
        <h4 className="font-medium mb-2">Raw Data Preview</h4>
        <pre className="text-xs overflow-auto max-h-40">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}