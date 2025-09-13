export function Settings() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
          Settings
        </h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Project Configuration
          </h2>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-semibold text-gray-700">Development Server</h3>
              <p className="text-gray-600">Port: 5173 (Vite default)</p>
              <p className="text-gray-600">Hot Module Replacement: Enabled</p>
            </div>
            <div className="border-b pb-4">
              <h3 className="font-semibold text-gray-700">Code Quality</h3>
              <p className="text-gray-600">ESLint: Configured with React and TypeScript rules</p>
              <p className="text-gray-600">Prettier: Configured for consistent formatting</p>
            </div>
            <div className="border-b pb-4">
              <h3 className="font-semibold text-gray-700">Styling</h3>
              <p className="text-gray-600">Tailwind CSS: Utility-first CSS framework</p>
              <p className="text-gray-600">PostCSS: Configured with Autoprefixer</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">State Management</h3>
              <p className="text-gray-600">Zustand: Lightweight state management</p>
              <p className="text-gray-600">React Query: Server state management (installed)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}