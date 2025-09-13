export function About() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
          About This Project
        </h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Technologies Used
          </h2>
          <ul className="space-y-2 text-gray-600">
            <li>• <strong>React 18+</strong> - Modern React with hooks and concurrent features</li>
            <li>• <strong>TypeScript</strong> - Type safety and better developer experience</li>
            <li>• <strong>Vite</strong> - Fast build tool with hot module replacement</li>
            <li>• <strong>React Router</strong> - Client-side routing</li>
            <li>• <strong>Zustand</strong> - Lightweight state management</li>
            <li>• <strong>Tailwind CSS</strong> - Utility-first CSS framework</li>
            <li>• <strong>Lucide React</strong> - Beautiful SVG icons</li>
            <li>• <strong>Axios</strong> - HTTP client for API requests</li>
            <li>• <strong>React Query</strong> - Server state management</li>
            <li>• <strong>ESLint</strong> - Code linting and error detection</li>
            <li>• <strong>Prettier</strong> - Code formatting</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Development Commands
          </h2>
          <div className="bg-gray-50 rounded-md p-4">
            <code className="text-sm">
              npm run dev     # Start development server<br/>
              npm run build   # Build for production<br/>
              npm run lint    # Run ESLint<br/>
              npm run format  # Format code with Prettier
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}