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

## � Key Components

- **Landing Page**: Hero section, featured properties, popular locations
- **Properties Listing**: Search, filter, sort, and pagination
- **Property Cards**: Professional cards with images, pricing, and amenities
- **Navigation**: Responsive navbar with mobile hamburger menu
- **Search Bar**: Advanced location search with suggestions
- **UI Components**: Reusable Button, Input, Card components

## 🎨 Design Features

- **Real Estate Colors**: Orange/red gradients with professional styling
- **Dynamic Animations**: Hover effects, scale transforms, and transitions
- **Glassmorphism**: Modern backdrop blur effects
- **Mobile Optimization**: Touch-friendly interface with bottom navigation
- **Progressive Enhancement**: Works seamlessly across all devices

## 🔧 Getting Started

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/absksync/surjana.git
cd surjana
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Start the development server:
```bash
npm run dev
```

5. Start the backend server:
```bash
cd backend
python main.py
```

## � Project Structure

```
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # UI component library
│   │   ├── PropertyCard.tsx # Property listing cards
│   │   ├── SearchBar.tsx   # Advanced search component
│   │   └── Navbar.tsx      # Navigation component
│   ├── pages/              # Page components
│   │   ├── Home.tsx        # Landing page
│   │   ├── Properties.tsx  # Property listings
│   │   └── MapDashboard.tsx # Interactive map
│   └── App.tsx             # Main app component
├── backend/                # Python backend
│   ├── main.py            # FastAPI server
│   ├── geo_housing_mapper.py # Geographic mapping
│   └── housing_demand_predictor.py # AI predictions
└── python-analysis/       # Data analysis scripts
```

## 🌟 Features Implemented

- ✅ **Responsive UI System**: Mobile-first design with Tailwind CSS
- ✅ **Property Listing Components**: Professional cards with all details
- ✅ **Search & Filter System**: Advanced filtering like Housing.com
- ✅ **Modern Landing Page**: Hero section with featured properties
- ✅ **Properties Listing Page**: Full search, filter, and pagination
- ✅ **Mobile Optimization**: Touch interactions and mobile navigation
- ✅ **Dynamic UI Enhancement**: Real estate colors and animations
- 🔄 **Backend Integration**: Connecting APIs for real data

## 📱 Mobile Features

- Responsive navigation with hamburger menu
- Bottom navigation bar for mobile users
- Touch-optimized property cards and buttons
- Mobile-friendly search and filter interfaces
- Proper spacing and sizing for mobile screens

## 🎯 Upcoming Features

- Real property data integration
- User authentication and profiles
- Saved searches and favorites
- Property comparison tool
- Mortgage calculator
- Virtual property tours

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Team 8** - Building the future of real estate technology

---

**PropertyHub** - Find Your Perfect Dream Home 🏠✨
