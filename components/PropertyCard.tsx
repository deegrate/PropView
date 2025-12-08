import React from 'react';
import { Property } from '../types';
import { Bed, Bath, Square, Home, DollarSign } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  isSelected: boolean;
  onClick: () => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, isSelected, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        flex flex-row md:flex-col gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 border
        ${isSelected 
          ? 'bg-slate-800 border-blue-500 shadow-lg shadow-blue-900/20' 
          : 'bg-slate-800/50 border-slate-700 hover:border-slate-600 hover:bg-slate-800'}
      `}
    >
      <div className="relative w-32 h-24 md:w-full md:h-48 shrink-0">
        <img 
          src={property.imageUrl} 
          alt={property.address} 
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute top-2 left-2 bg-slate-900/90 text-white text-xs px-2 py-1 rounded-full border border-slate-700 font-medium">
          {property.status}
        </div>
      </div>
      
      <div className="flex flex-col justify-between w-full">
        <div>
            <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-white">${property.price.toLocaleString()}</h3>
            <span className="text-emerald-400 text-xs font-mono bg-emerald-400/10 px-2 py-1 rounded">Est. Rent ${property.estimatedRent}</span>
            </div>
            <p className="text-slate-400 text-sm truncate">{property.address}, {property.city}</p>
        </div>

        <div className="flex items-center gap-3 mt-3 text-slate-400 text-xs md:text-sm">
            <div className="flex items-center gap-1">
                <Bed size={14} /> <span>{property.beds}</span>
            </div>
            <div className="flex items-center gap-1">
                <Bath size={14} /> <span>{property.baths}</span>
            </div>
            <div className="flex items-center gap-1">
                <Square size={14} /> <span>{property.sqft.toLocaleString()}</span>
            </div>
             <div className="flex items-center gap-1 ml-auto">
                <Home size={14} /> <span>{property.propertyType === 'Single Family' ? 'SFR' : 'MFR'}</span>
            </div>
        </div>
      </div>
    </div>
  );
};
