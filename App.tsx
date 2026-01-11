import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Listings from './pages/Listings';
import Upload from './pages/Upload';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import { ViewState, Property, PropertyContextType } from './types';
import { INITIAL_PROPERTIES } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  
  // Global filter state
  const [filterState, setFilterState] = useState('');
  const [filterLGA, setFilterLGA] = useState('');

  const addProperty = (newProperty: Property) => {
    setProperties(prev => [newProperty, ...prev]);
  };

  const deleteProperty = (id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id));
  };

  const propertyContext: PropertyContextType = {
    properties,
    addProperty,
    deleteProperty,
    filterState,
    filterLGA,
    setFilterState,
    setFilterLGA
  };

  const renderView = () => {
    switch (currentView) {
      case 'HOME':
        return <Home propertyContext={propertyContext} onNavigate={setCurrentView} />;
      case 'LISTINGS':
        return <Listings propertyContext={propertyContext} />;
      case 'UPLOAD':
        return <Upload propertyContext={propertyContext} onNavigate={setCurrentView} />;
      case 'CONTACT':
        return <Contact />;
      case 'ADMIN':
        return <Admin propertyContext={propertyContext} />;
      default:
        return <Home propertyContext={propertyContext} onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Navbar currentView={currentView} onNavigate={setCurrentView} />
      <main className="flex-grow">
        {renderView()}
      </main>
      <Footer />
    </div>
  );
};

export default App;