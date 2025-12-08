import React, { useState, useEffect } from 'react';
import { MOCK_PROPERTIES, INITIAL_FINANCIALS } from './constants';
import { Property, FinancialAnalysis } from './types';
import { PropertyCard } from './components/PropertyCard';
import { Calculator } from './components/Calculator';
import { AIAnalysis } from './components/AIAnalysis';
import { ScanBot } from './components/ScanBot';
import { Map, List, LayoutDashboard, Search, Settings, Bell, ChevronLeft, MapPin, Bot } from 'lucide-react';

const App: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [activeTab, setActiveTab] = useState<'details' | 'financials' | 'ai'>('details');
  const [financials, setFinancials] = useState<FinancialAnalysis>(INITIAL_FINANCIALS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isScanBotOpen, setIsScanBotOpen] = useState(false);

  // Reset financials when a new property is selected
  useEffect(() => {
    if (selectedProperty) {
      setFinancials({
        ...INITIAL_FINANCIALS,
        monthlyIncome: selectedProperty.estimatedRent,
        // Trigger initial calculation in Calculator component via its internal useEffect
      });
      setActiveTab('details');
    }
  }, [selectedProperty]);

  const filteredProperties = properties.filter(p => 
    p.address.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.zip.includes(searchTerm)
  );

  const handleImportProperties = (newProperties: Property[]) => {
      setProperties(prev => [...newProperties, ...prev]);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside className="w-16 lg:w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 transition-all duration-300">
        <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-800">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
             <LayoutDashboard className="text-white w-5 h-5" />
          </div>
          <span className="hidden lg:block ml-3 font-bold text-white text-lg tracking-tight">PropVision</span>
        </div>
        
        <nav className="flex-1 py-6 flex flex-col gap-2 px-2">
          <button className="flex items-center gap-3 px-3 py-2 bg-indigo-600/10 text-indigo-400 rounded-lg">
            <Search size={20} /> <span className="hidden lg:block font-medium">Search</span>
          </button>
          
          <button 
             onClick={() => setIsScanBotOpen(true)}
             className="flex items-center gap-3 px-3 py-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors border border-emerald-500/20"
          >
            <Bot size={20} /> <span className="hidden lg:block font-medium">Scan Bot</span>
          </button>

          <button className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            <List size={20} /> <span className="hidden lg:block font-medium">My Lists</span>
          </button>
           <button className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            <Map size={20} /> <span className="hidden lg:block font-medium">Driving for Dollars</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
           <button className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white transition-colors">
            <Settings size={20} /> <span className="hidden lg:block font-medium">Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <header className="h-16 bg-slate-900/50 backdrop-blur-sm border-b border-slate-800 flex items-center justify-between px-6 z-10">
           <div className="flex items-center bg-slate-800 rounded-lg px-3 py-1.5 w-full max-w-md border border-slate-700 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
              <Search className="text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search by address, city, or zip..." 
                className="bg-transparent border-none focus:outline-none text-sm text-white ml-2 w-full placeholder-slate-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           
           <div className="flex items-center gap-4">
              <button className="text-slate-400 hover:text-white relative">
                 <Bell size={20} />
                 <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600"></div>
           </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* Left Panel: List/Map View */}
          <div className={`
             flex flex-col border-r border-slate-800 transition-all duration-300
             ${selectedProperty ? 'hidden md:flex md:w-1/3 lg:w-1/3 xl:w-1/4' : 'w-full'}
          `}>
             <div className="p-4 flex items-center justify-between border-b border-slate-800">
                <h2 className="text-white font-semibold">{filteredProperties.length} Properties</h2>
                <div className="flex bg-slate-800 rounded-lg p-1">
                   <button 
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-slate-700 text-white shadow' : 'text-slate-400'}`}
                   >
                     <List size={16} />
                   </button>
                   <button 
                    onClick={() => setViewMode('map')}
                    className={`p-1.5 rounded ${viewMode === 'map' ? 'bg-slate-700 text-white shadow' : 'text-slate-400'}`}
                   >
                     <Map size={16} />
                   </button>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-900/30">
                {viewMode === 'list' ? (
                   filteredProperties.map(prop => (
                     <PropertyCard 
                       key={prop.id} 
                       property={prop} 
                       isSelected={selectedProperty?.id === prop.id}
                       onClick={() => setSelectedProperty(prop)}
                     />
                   ))
                ) : (
                  <div className="h-full w-full bg-slate-800 rounded-lg relative overflow-hidden border border-slate-700 group">
                      {/* Fake Map Implementation */}
                      <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/-97.7431,30.2672,12,0/800x600?access_token=pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGlqaXFqbnYwMGZkM2VwZnJqZnp2Z2dpIn0.123')] bg-cover opacity-50 grayscale group-hover:grayscale-0 transition-all duration-500"></div>
                      <div className="absolute inset-0 flex items-center justify-center text-slate-500 font-mono text-sm pointer-events-none">
                         Map View Simulation
                      </div>
                       {filteredProperties.map((prop, idx) => (
                          <button
                             key={prop.id}
                             onClick={() => setSelectedProperty(prop)}
                             className="absolute w-3 h-3 bg-indigo-500 rounded-full border-2 border-white hover:scale-150 transition-transform shadow-lg shadow-indigo-500/50"
                             style={{ top: `${prop.coordinates.y}%`, left: `${prop.coordinates.x}%` }}
                             title={prop.address}
                          />
                       ))}
                  </div>
                )}
             </div>
          </div>

          {/* Right Panel: Details/Analysis */}
          {selectedProperty ? (
            <div className="flex-1 flex flex-col bg-slate-900 overflow-y-auto">
               
               {/* Detail Header */}
               <div className="relative h-64 shrink-0">
                  <img src={selectedProperty.imageUrl} className="w-full h-full object-cover mask-image-b" alt="Cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
                  
                  <button 
                    onClick={() => setSelectedProperty(null)}
                    className="absolute top-4 left-4 md:hidden bg-black/50 p-2 rounded-full text-white backdrop-blur-sm"
                  >
                    <ChevronLeft />
                  </button>

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                           <div className="flex items-center gap-2 text-indigo-400 mb-1">
                              <MapPin size={16} /> 
                              <span className="text-sm font-medium">{selectedProperty.city}, {selectedProperty.state} {selectedProperty.zip}</span>
                           </div>
                           <h1 className="text-3xl font-bold text-white mb-2">{selectedProperty.address}</h1>
                           <div className="flex gap-4 text-slate-300 text-sm">
                              <span><b className="text-white">{selectedProperty.beds}</b> Beds</span>
                              <span><b className="text-white">{selectedProperty.baths}</b> Baths</span>
                              <span><b className="text-white">{selectedProperty.sqft.toLocaleString()}</b> SqFt</span>
                              <span>Built <b className="text-white">{selectedProperty.yearBuilt}</b></span>
                           </div>
                        </div>
                        <div className="text-left md:text-right">
                           <div className="text-3xl font-bold text-white">${selectedProperty.price.toLocaleString()}</div>
                           <div className="text-emerald-400 font-medium">Est. Value: ${(selectedProperty.price * 1.05).toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                        </div>
                      </div>
                  </div>
               </div>

               {/* Tabs */}
               <div className="flex border-b border-slate-800 px-6 sticky top-0 bg-slate-900/95 backdrop-blur z-10">
                  {['details', 'financials', 'ai'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`
                        px-6 py-4 font-medium text-sm border-b-2 transition-colors
                        ${activeTab === tab 
                           ? 'border-indigo-500 text-white' 
                           : 'border-transparent text-slate-400 hover:text-slate-200'}
                      `}
                    >
                      {tab === 'details' && 'Property Details'}
                      {tab === 'financials' && 'Financial Analysis'}
                      {tab === 'ai' && 'AI Insight'}
                    </button>
                  ))}
               </div>

               {/* Tab Content */}
               <div className="p-6 max-w-5xl mx-auto w-full">
                  {activeTab === 'details' && (
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                           <section>
                              <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                              <p className="text-slate-400 leading-relaxed">
                                {selectedProperty.description}
                              </p>
                           </section>
                           
                           <section>
                              <h3 className="text-lg font-semibold text-white mb-3">Features</h3>
                              <div className="flex flex-wrap gap-2">
                                 {selectedProperty.features.map(f => (
                                    <span key={f} className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-300 border border-slate-700">
                                       {f}
                                    </span>
                                 ))}
                              </div>
                           </section>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
                               <h3 className="text-sm uppercase text-slate-400 font-semibold mb-4">Public Record</h3>
                               <div className="space-y-3">
                                  <div className="flex justify-between border-b border-slate-700 pb-2">
                                     <span className="text-slate-400">Last Sale Date</span>
                                     <span className="text-white">{selectedProperty.lastSoldDate}</span>
                                  </div>
                                   <div className="flex justify-between border-b border-slate-700 pb-2">
                                     <span className="text-slate-400">Last Sale Price</span>
                                     <span className="text-white">${selectedProperty.lastSoldPrice.toLocaleString()}</span>
                                  </div>
                                   <div className="flex justify-between border-b border-slate-700 pb-2">
                                     <span className="text-slate-400">Lot Size</span>
                                     <span className="text-white">{selectedProperty.lotSize.toLocaleString()} sqft</span>
                                  </div>
                                   <div className="flex justify-between">
                                     <span className="text-slate-400">APN / Parcel ID</span>
                                     <span className="text-white font-mono">12-34-567-890</span>
                                  </div>
                               </div>
                            </div>
                        </div>
                     </div>
                  )}

                  {activeTab === 'financials' && (
                     <div className="animate-fade-in">
                        <Calculator 
                           property={selectedProperty} 
                           financials={financials} 
                           setFinancials={setFinancials} 
                        />
                     </div>
                  )}

                  {activeTab === 'ai' && (
                     <AIAnalysis property={selectedProperty} financials={financials} />
                  )}
               </div>

            </div>
          ) : (
            /* Empty State */
            <div className="flex-1 hidden md:flex flex-col items-center justify-center bg-slate-950 text-slate-500 p-8 text-center">
                <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mb-6">
                   <LayoutDashboard className="w-10 h-10 text-slate-700" />
                </div>
                <h2 className="text-xl font-semibold text-slate-300 mb-2">Select a Property to Analyze</h2>
                <p className="max-w-sm">Choose a property from the list or map to view details, run financial models, and get AI-powered investment advice.</p>
            </div>
          )}
        </div>
      </main>
      
      {/* Scan Bot Modal */}
      <ScanBot 
        isOpen={isScanBotOpen} 
        onClose={() => setIsScanBotOpen(false)} 
        onImportProperties={handleImportProperties}
      />

    </div>
  );
};

export default App;