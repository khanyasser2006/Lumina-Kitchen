import React, { useState, useEffect } from 'react';
import { getSalons, saveSalons, DEFAULT_SALONS } from '../../utils/storage';

export default function AdminSalons() {
  const [salons, setSalons] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const data = getSalons();
    setSalons(data);
    if (data.length > 0) {
      setSelectedId(data[0].id || 'london');
    }
  }, []);

  const activeSalon = salons.find((s) => s.id === selectedId) || salons[0];

  const handleFieldChange = (field, value) => {
    setSalons((prev) =>
      prev.map((s) => (s.id === selectedId ? { ...s, [field]: value } : s))
    );
  };

  const handleSave = () => {
    saveSalons(salons);
    setSaveMessage('✓ Global salon directory saved successfully.');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleReset = () => {
    setSalons(DEFAULT_SALONS);
    saveSalons(DEFAULT_SALONS);
    setSaveMessage('Reset salon directory to defaults.');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  if (!activeSalon) return null;

  return (
    <div className="space-y-8 animate-fade">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-hairline">
        <div>
          <h2 className="text-2xl font-editorial font-light text-deep">
            Global Salons & Atelier Manager
          </h2>
          <p className="text-xs text-graphite font-body mt-1">
            Update London, Milan, Zurich, and Tokyo showroom addresses, phone lines, and lead directors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-hairline-dark text-graphite text-xs font-body uppercase tracking-[0.1em] hover:text-deep transition-all cursor-pointer"
          >
            Reset Defaults
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-bronze text-page text-xs font-body uppercase tracking-[0.12em] font-medium rounded-full hover:bg-bronze-light transition-all cursor-pointer shadow-md"
          >
            Save All Changes
          </button>
        </div>
      </div>

      {saveMessage && (
        <div className="p-4 bg-surface border border-bronze text-bronze text-xs font-body font-medium animate-fade">
          {saveMessage}
        </div>
      )}

      {/* Salon Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {salons.map((salon) => (
          <button
            key={salon.id || salon.city}
            onClick={() => setSelectedId(salon.id || salon.city.toLowerCase())}
            className={`p-4 text-left border transition-all cursor-pointer ${
              (selectedId === salon.id || selectedId === salon.city.toLowerCase())
                ? 'border-bronze bg-surface text-deep font-medium'
                : 'border-hairline text-graphite hover:border-hairline-dark'
            }`}
          >
            <span className="text-[10px] font-body tracking-[0.15em] text-bronze uppercase block mb-1">
              {salon.district}
            </span>
            <span className="text-sm font-body font-medium block">
              {salon.city}
            </span>
          </button>
        ))}
      </div>

      {/* Active Salon Editor */}
      <div className="bg-surface p-6 sm:p-10 border border-hairline space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-body tracking-[0.1em] text-deep uppercase block mb-1 font-medium">
              City Name
            </label>
            <input
              type="text"
              value={activeSalon.city}
              onChange={(e) => handleFieldChange('city', e.target.value)}
              className="w-full p-3 border border-hairline bg-page text-deep text-sm font-body focus:outline-none focus:border-bronze"
            />
          </div>

          <div>
            <label className="text-xs font-body tracking-[0.1em] text-deep uppercase block mb-1 font-medium">
              District / Neighborhood
            </label>
            <input
              type="text"
              value={activeSalon.district}
              onChange={(e) => handleFieldChange('district', e.target.value)}
              className="w-full p-3 border border-hairline bg-page text-deep text-sm font-body focus:outline-none focus:border-bronze"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-body tracking-[0.1em] text-deep uppercase block mb-1 font-medium">
            Street Address
          </label>
          <input
            type="text"
            value={activeSalon.address}
            onChange={(e) => handleFieldChange('address', e.target.value)}
            className="w-full p-3 border border-hairline bg-page text-deep text-sm font-body focus:outline-none focus:border-bronze"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-body tracking-[0.1em] text-deep uppercase block mb-1 font-medium">
              Direct Concierge Telephone
            </label>
            <input
              type="text"
              value={activeSalon.phone}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              className="w-full p-3 border border-hairline bg-page text-deep text-sm font-body focus:outline-none focus:border-bronze"
            />
          </div>

          <div>
            <label className="text-xs font-body tracking-[0.1em] text-deep uppercase block mb-1 font-medium">
              Salon Principal Director
            </label>
            <input
              type="text"
              value={activeSalon.director}
              onChange={(e) => handleFieldChange('director', e.target.value)}
              className="w-full p-3 border border-hairline bg-page text-deep text-sm font-body focus:outline-none focus:border-bronze"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
