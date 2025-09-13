# PropertyHub - Real Estate Web Application

A modern, mobile-responsive real estate web application built with React, TypeScript, and AI-powered insights. Similar to Housing.com and MagicBricks, featuring property listings, advanced search, and demand predictions.

## 🏡 Features

- **Professional UI**: Modern real estate interface with dynamic gradients and animations
- **Mobile-First Design**: Fully responsive design optimized for all devices
- **Property Listings**: Advanced property cards with images, details, and interactive elements
- **Smart Search**: Location-based search with advanced filtering options
- **AI Insights**: Property demand predictions and market analytics
- **Interactive Maps**: Geographic visualization of properties and demand hotspots
- **Verified Listings**: All properties are thoroughly verified for authenticity

## 🚀 Tech Stack

### Frontend
- **⚡ Vite** - Lightning fast build tool with HMR
- **⚛️ React 18+** - Latest React with TypeScript support
- **🎨 Tailwind CSS** - Utility-first CSS framework with custom real estate styling
- **🔧 TypeScript** - Type safety and better developer experience
- **📦 State Management** - React hooks for component state management
- **🌐 Routing** - React Router for client-side navigation
- **🔍 Code Quality** - ESLint + Prettier for consistent code
- **🎯 Icons** - Lucide React for beautiful SVG icons
- **📡 HTTP Client** - Axios for API requests
- **🔄 Server State** - React Query for server state management

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/     # Reusable React components
├── pages/         # Page components for routing
├── stores/        # Zustand state stores
├── App.tsx        # Main application component
├── main.tsx       # Application entry point
└── index.css      # Tailwind CSS imports
```

## 🎯 Getting Started

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:5173`

3. Edit `src/App.tsx` to start building your application

## 📦 Installed Packages

### Core Dependencies
- `react` - React library
- `react-dom` - React DOM renderer
- `react-router-dom` - Client-side routing
- `zustand` - State management
- `axios` - HTTP client
- `@tanstack/react-query` - Server state management
- `lucide-react` - Icon library
- `clsx` - Utility for constructing className strings
- `tailwindcss` - Utility-first CSS framework

### Development Dependencies
- `typescript` - TypeScript support
- `vite` - Build tool and dev server
- `eslint` - Code linting
- `prettier` - Code formatting
- `@vitejs/plugin-react` - Vite React plugin

## 🎨 Styling

This project uses Tailwind CSS for styling. The configuration is already set up in:
- `tailwind.config.js` - Tailwind configuration
- `postcss.config.js` - PostCSS configuration
- `src/index.css` - Tailwind imports

## 🔧 Configuration Files

- `.eslintrc.json` - ESLint configuration
- `.prettierrc.json` - Prettier configuration
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite configuration

## 📝 VS Code Extensions

The following extensions are recommended and should be installed:
- ESLint - Code linting
- Prettier - Code formatting
- Tailwind CSS IntelliSense - Tailwind class autocomplete
- TypeScript Importer - Auto import for TypeScript

Happy coding! 🎉
