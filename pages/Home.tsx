import React, { useContext, useMemo } from 'react';
import { NIGERIAN_STATES } from '../constants';
import { ViewState, PropertyContextType } from '../types';
import PropertyCard from '../components/PropertyCard';
import { Search, MapPin } from 'lucide-react';

interface HomeProps {
  propertyContext: PropertyContextType;
  onNavigate: (view: ViewState) => void;
}

const Home: React.FC<HomeProps> = ({ propertyContext, onNavigate }) => {
  const { properties, setFilterState, setFilterLGA, filterState, filterLGA } = propertyContext;

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterState(e.target.value);
    setFilterLGA(''); // Reset LGA when state changes
  };

  const handleSearch = () => {
    onNavigate('LISTINGS');
  };

  // Get LGAs for selected state
  const availableLgas = useMemo(() => {
    const state = NIGERIAN_STATES.find(s => s.name === filterState);
    return state ? state.lgas : [];
  }, [filterState]);

  // Featured properties (latest 3)
  const featuredProperties = properties.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section - Using Global Background */}
      <div className="relative h-[600px] flex items-center justify-center">
        {/* No inner image needed, body bg serves as hero */}
        
        <div className="relative z-10 w-full max-w-4xl px-4 text-center">
          <div className="bg-black/30 backdrop-blur-sm p-8 rounded-2xl border border-white/10 shadow-2xl flex flex-col items-center">
            
            {/* Hero Logo */}
            <img 
              src="/logo.png" 
              alt="Neutech Real Estate" 
              className="h-24 md:h-32 w-auto mb-6 object-contain drop-shadow-2xl"
              onError={(e) => e.currentTarget.style.display = 'none'}
            />

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
              Find Your <span className="text-secondary">Dream Property</span> in Nigeria
            </h1>
            <p className="text-lg md:text-xl text-gray-100 mb-10 max-w-2xl mx-auto drop-shadow-md">
              From modern duplexes in Uyo to commercial hubs in Lagos. Browse verified lands and houses for rent and sale.
            </p>

            {/* Search Box */}
            <div className="bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-2xl flex flex-col md:flex-row gap-4 max-w-3xl w-full mx-auto items-center border border-white/20">
              
              <div className="flex-1 w-full md:w-auto relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={filterState}
                  onChange={handleStateChange}
                  className="block w-full pl-10 pr-3 py-3 text-base border-gray-300 bg-gray-50/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-shadow cursor-pointer appearance-none text-gray-700"
                >
                  <option value="">Select State</option>
                  {NIGERIAN_STATES.map((state) => (
                    <option key={state.name} value={state.name}>{state.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex-1 w-full md:w-auto relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={filterLGA}
                  onChange={(e) => setFilterLGA(e.target.value)}
                  disabled={!filterState}
                  className="block w-full pl-10 pr-3 py-3 text-base border-gray-300 bg-gray-50/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-shadow cursor-pointer appearance-none text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select L.G.A</option>
                  {availableLgas.map((lga) => (
                    <option key={lga} value={lga}>{lga}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSearch}
                className="w-full md:w-auto bg-secondary hover:bg-amber-600 text-primary font-bold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center shadow-lg transform hover:scale-105"
              >
                <Search className="mr-2 h-5 w-5" />
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Section */}
      <section className="py-20 bg-white/90 backdrop-blur-md border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Properties</h2>
            <div className="w-24 h-1 bg-secondary mx-auto rounded-full"></div>
            <p className="mt-4 text-gray-600">Discover our hand-picked selection of premium properties.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => onNavigate('LISTINGS')}
              className="inline-flex items-center text-primary font-bold border-b-2 border-secondary pb-1 hover:text-secondary transition-colors"
            >
              View All Properties <ArrowRightIcon />
            </button>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-white/95 backdrop-blur-xl border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-16 h-16 bg-blue-50 text-accent rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Verified Listings</h3>
              <p className="text-gray-600">Every property is vetted to ensure authenticity and legal standing.</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-amber-50 text-secondary rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-100">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Best Prices</h3>
              <p className="text-gray-600">We negotiate directly with owners to bring you the best deals in the market.</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">Our dedicated team is always available to answer your questions.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const ArrowRightIcon = () => (
  <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

export default Home;