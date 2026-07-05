import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Search, MapPin, Layers, Maximize2 } from 'lucide-react';
import api from '../../utils/api';
import { fmtKES } from '../../utils/helpers';
import toast from 'react-hot-toast';

// Fix for default marker icons in Leaflet with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const MapView = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    subcounty: '',
    ward: '',
    status: ''
  });
  const [showWards, setShowWards] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const mapRef = useRef();

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.subcounty) params.append('subcounty', filters.subcounty);
      if (filters.ward) params.append('ward', filters.ward);
      if (filters.status) params.append('status', filters.status);
      
      const response = await api.get(`/properties?${params.toString()}`);
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const getColor = (status) => {
    const colors = {
      compliant: '#1B7A4D',
      pending: '#B4791F',
      overdue: '#9A3324',
      unmapped: '#6B7680'
    };
    return colors[status] || '#6B7680';
  };

  const subcounties = ['Kisumu East', 'Kisumu West', 'Kisumu Central', 'Seme', 'Nyando', 'Muhoroni', 'Nyakach'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-navy">
            Live Map — Property & Building Intelligence
          </h1>
          <p className="text-ink-faint text-sm">
            Real-time pins for every mapped property across Kisumu County's 7 sub-counties and 35 wards.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-paper-raised border border-line rounded-lg p-3 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <select
            className="input text-sm"
            value={filters.subcounty}
            onChange={(e) => setFilters(prev => ({ ...prev, subcounty: e.target.value, ward: '' }))}
          >
            <option value="">All sub-counties</option>
            {subcounties.map(sc => <option key={sc} value={sc}>{sc}</option>)}
          </select>
          <select
            className="input text-sm"
            value={filters.ward}
            onChange={(e) => setFilters(prev => ({ ...prev, ward: e.target.value }))}
          >
            <option value="">All wards</option>
          </select>
          <select
            className="input text-sm"
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="">All statuses</option>
            <option value="compliant">Compliant</option>
            <option value="pending">Due / Pending</option>
            <option value="overdue">Overdue / High risk</option>
            <option value="unmapped">Unregistered / Unmapped</option>
          </select>
          <div className="flex gap-2">
            <button
              className={`btn btn-sm ${showWards ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setShowWards(!showWards)}
            >
              <Layers size={16} /> Wards
            </button>
            <button
              className={`btn btn-sm ${showHeatmap ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setShowHeatmap(!showHeatmap)}
            >
              <Maximize2 size={16} /> Heat
            </button>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="bg-paper-raised border border-line rounded-lg overflow-hidden">
        <div className="h-[400px] md:h-[500px] lg:h-[560px]">
          <MapContainer
            center={[-0.0917, 34.7680]}
            zoom={11}
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {properties.filter(p => p.isMapped).map((p) => (
              <React.Fragment key={p.id}>
                <Marker
                  position={[p.lat, p.lng]}
                  icon={L.divIcon({
                    className: 'bg-transparent',
                    html: `<div style="background:${getColor(p.status)};width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);"></div>`,
                    iconSize: [14, 14],
                    iconAnchor: [7, 7],
                  })}
                >
                  <Popup>
                    <div className="text-sm">
                      <div className="font-semibold">{p.owner}</div>
                      <div className="text-xs text-ink-faint">{p.buildingName}</div>
                      <div className="text-xs text-ink-faint">{p.subcounty} · {p.ward}</div>
                      <div className="font-mono text-xs font-medium">{fmtKES(p.assessedAmount)}</div>
                      <button className="btn btn-sm btn-primary mt-2 w-full" onClick={() => {}}>
                        Open record →
                      </button>
                    </div>
                  </Popup>
                </Marker>
                
                {showHeatmap && p.status === 'overdue' && (
                  <Circle
                    center={[p.lat, p.lng]}
                    radius={900}
                    color="transparent"
                    fillColor="#9A3324"
                    fillOpacity={0.12}
                  />
                )}
              </React.Fragment>
            ))}

            {showWards && (
              <>
                {subcounties.map(sc => {
                  const centre = {
                    'Kisumu East': [-0.0850, 34.8100],
                    'Kisumu West': [-0.0750, 34.6950],
                    'Kisumu Central': [-0.0950, 34.7600],
                    'Seme': [-0.0500, 34.6200],
                    'Nyando': [-0.1750, 34.9300],
                    'Muhoroni': [-0.1450, 35.1900],
                    'Nyakach': [-0.3100, 34.9500]
                  }[sc];
                  return (
                    <Circle
                      key={sc}
                      center={centre}
                      radius={5500}
                      color="#0E6B6B"
                      weight={1.5}
                      fillOpacity={0.03}
                      dashArray="4,4"
                    >
                      <Popup>{sc}</Popup>
                    </Circle>
                  );
                })}
              </>
            )}
          </MapContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 px-4 py-3 border-t border-line-soft text-xs text-ink-faint">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green" />
            Compliant
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber" />
            Due / Pending
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-danger" />
            Overdue / High risk
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-gray-400" />
            Unregistered / Unmapped
          </span>
        </div>
      </div>

      <div className="bg-paper-raised border border-line rounded-lg p-4 text-xs text-ink-faint border-dashed">
        This map uses OpenStreetMap tiles. The structure is ready for a live Google Maps API key
        to be substituted in when available.
      </div>
    </div>
  );
};

export default MapView;