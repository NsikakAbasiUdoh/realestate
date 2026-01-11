import React from 'react';
import { Property, PropertyType } from '../types';
import { MapPin, Bed, Bath, ArrowRight, Phone, Calendar } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  // Format price to Naira
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0
    }).format(price);
  };

  const isRent = property.type === PropertyType.RENT;

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-white/20 flex flex-col h-full group hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative h-60 overflow-hidden">
        <img 
          src={property.imageUrl} 
          alt={property.title} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg border border-white/10">
          {property.type}
        </div>
        <div className="absolute top-4 left-4 bg-secondary/90 backdrop-blur text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg border border-white/10">
          {property.category}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <p className="text-white font-bold text-xl truncate drop-shadow-md">{formatPrice(property.price)}{isRent && '/yr'}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-secondary transition-colors">
          {property.title}
        </h3>
        
        <div className="flex items-start text-gray-600 mb-4 text-sm">
          <MapPin size={16} className="mr-1 mt-0.5 flex-shrink-0 text-secondary" />
          <span className="line-clamp-2">{property.location.address}, {property.location.lga}, {property.location.state}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
          {property.description}
        </p>

        {/* Features Preview */}
        <div className="flex flex-wrap gap-2 mb-4">
          {property.features.slice(0, 3).map((feat, idx) => (
            <span key={idx} className="text-xs bg-gray-100/80 border border-gray-200 text-gray-700 px-2 py-1 rounded-md font-medium">
              {feat}
            </span>
          ))}
          {property.features.length > 3 && (
            <span className="text-xs bg-gray-100/80 border border-gray-200 text-gray-700 px-2 py-1 rounded-md font-medium">
              +{property.features.length - 3} more
            </span>
          )}
        </div>

        <div className="border-t border-gray-200 pt-4 mt-auto flex justify-between items-center">
          <div className="flex items-center text-secondary font-semibold text-sm">
            <Phone size={14} className="mr-1" />
            {property.contactPhone}
          </div>
          <button className="text-primary hover:text-secondary font-medium text-sm flex items-center transition-colors">
            View Details <ArrowRight size={14} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;