import React, { useState, useEffect } from 'react';
import { getCollections, saveCollections, DEFAULT_COLLECTIONS } from '../../utils/storage';

export default function AdminCollections() {
  const [collections, setCollections] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const data = getCollections();
    setCollections(data);
    if (data.length > 0) {
      setSelectedId(data[0].id);
    }
  }, []);

  const activeItem = collections.find((c) => c.id === selectedId) || collections[0];

  const handleFieldChange = (field, value) => {
    setCollections((prev) =>
      prev.map((c) => (c.id === selectedId ? { ...c, [field]: value } : c))
    );
  };

  const handleSpecChange = (index, field, value) => {
    if (!activeItem) return;
    const newSpecs = [...activeItem.specs];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    handleFieldChange('specs', newSpecs);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleFieldChange('image', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    saveCollections(collections);
    setSaveMessage('✓ Collection changes saved successfully to storage.');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleResetItem = () => {
    const defaultItem = DEFAULT_COLLECTIONS.find((c) => c.id === selectedId);
    if (defaultItem) {
      setCollections((prev) =>
        prev.map((c) => (c.id === selectedId ? { ...defaultItem } : c))
      );
      setSaveMessage('Reset selected series to default.');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  if (!activeItem) return null;

  return (
    <div className="space-y-8 animate-fade">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-hairline">
        <div>
          <h2 className="text-2xl font-editorial font-light text-deep">
            Kitchen Collections Manager
          </h2>
          <p className="text-xs text-graphite font-body mt-1">
            Edit titles, photography, material specifications, and architectural copy live on the website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetItem}
            className="px-4 py-2 border border-hairline-dark text-graphite text-xs font-body uppercase tracking-[0.1em] hover:text-deep transition-all cursor-pointer"
          >
            Reset Series
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

      {/* Series Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {collections.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedId(item.id)}
            className={`p-4 text-left border transition-all cursor-pointer ${
              selectedId === item.id
                ? 'border-bronze bg-surface text-deep font-medium'
                : 'border-hairline text-graphite hover:border-hairline-dark'
            }`}
          >
            <span className="text-[10px] font-body tracking-[0.15em] text-bronze uppercase block mb-1">
              {item.tag}
            </span>
            <span className="text-xs font-body font-medium block truncate">
              {item.name}
            </span>
          </button>
        ))}
      </div>

      {/* Form Fields for Active Series */}
      <div className="bg-surface p-6 sm:p-10 border border-hairline space-y-8">
        {/* Photo Upload & Preview */}
        <div className="space-y-4">
          <label className="text-xs font-body tracking-[0.15em] text-deep uppercase block font-medium">
            Series Hero Photography
          </label>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-5 h-[220px] overflow-hidden border border-hairline bg-page relative">
              <img
                src={activeItem.image}
                alt={activeItem.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-deep/80 text-page text-[10px] font-body">
                Live Preview
              </div>
            </div>

            <div className="md:col-span-7 space-y-4">
              <div>
                <label className="text-[11px] text-taupe font-body block mb-1">
                  Upload Image File (JPG/PNG/WebP)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-xs font-body text-graphite file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-body file:bg-bark file:text-page hover:file:bg-deep file:cursor-pointer"
                />
              </div>

              <div>
                <label className="text-[11px] text-taupe font-body block mb-1">
                  Or Direct Image URL
                </label>
                <input
                  type="text"
                  value={activeItem.image}
                  onChange={(e) => handleFieldChange('image', e.target.value)}
                  placeholder="/images/kitchen_mono.webp or https://..."
                  className="w-full p-3 border border-hairline bg-page text-deep text-xs font-body focus:outline-none focus:border-bronze"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-body tracking-[0.1em] text-deep uppercase block mb-1 font-medium">
              Series Name
            </label>
            <input
              type="text"
              value={activeItem.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              className="w-full p-3 border border-hairline bg-page text-deep text-sm font-body focus:outline-none focus:border-bronze"
            />
          </div>

          <div>
            <label className="text-xs font-body tracking-[0.1em] text-deep uppercase block mb-1 font-medium">
              Tag / Number
            </label>
            <input
              type="text"
              value={activeItem.tag}
              onChange={(e) => handleFieldChange('tag', e.target.value)}
              className="w-full p-3 border border-hairline bg-page text-deep text-sm font-body focus:outline-none focus:border-bronze"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-body tracking-[0.1em] text-deep uppercase block mb-1 font-medium">
            Editorial Tagline
          </label>
          <input
            type="text"
            value={activeItem.tagline}
            onChange={(e) => handleFieldChange('tagline', e.target.value)}
            className="w-full p-3 border border-hairline bg-page text-deep text-sm font-body focus:outline-none focus:border-bronze"
          />
        </div>

        <div>
          <label className="text-xs font-body tracking-[0.1em] text-deep uppercase block mb-1 font-medium">
            Architectural Description
          </label>
          <textarea
            rows={3}
            value={activeItem.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            className="w-full p-3 border border-hairline bg-page text-deep text-sm font-body focus:outline-none focus:border-bronze"
          />
        </div>

        {/* Materials Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-hairline">
          <div>
            <label className="text-xs font-body text-deep uppercase block mb-1 font-medium">
              Primary Wood / Core Material
            </label>
            <input
              type="text"
              value={activeItem.primaryMaterial}
              onChange={(e) => handleFieldChange('primaryMaterial', e.target.value)}
              className="w-full p-2.5 border border-hairline bg-page text-deep text-xs font-body focus:outline-none focus:border-bronze"
            />
          </div>

          <div>
            <label className="text-xs font-body text-deep uppercase block mb-1 font-medium">
              Secondary Stone / Metal
            </label>
            <input
              type="text"
              value={activeItem.secondaryMaterial}
              onChange={(e) => handleFieldChange('secondaryMaterial', e.target.value)}
              className="w-full p-2.5 border border-hairline bg-page text-deep text-xs font-body focus:outline-none focus:border-bronze"
            />
          </div>

          <div>
            <label className="text-xs font-body text-deep uppercase block mb-1 font-medium">
              Hardware / Mechanism
            </label>
            <input
              type="text"
              value={activeItem.hardware}
              onChange={(e) => handleFieldChange('hardware', e.target.value)}
              className="w-full p-2.5 border border-hairline bg-page text-deep text-xs font-body focus:outline-none focus:border-bronze"
            />
          </div>
        </div>

        {/* Technical Specs Key-Values */}
        <div className="space-y-4 pt-4 border-t border-hairline">
          <h3 className="text-sm font-editorial font-light text-deep">
            Technical Specifications Key-Values
          </h3>

          <div className="space-y-3">
            {activeItem.specs.map((spec, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                <input
                  type="text"
                  value={spec.label}
                  onChange={(e) => handleSpecChange(index, 'label', e.target.value)}
                  placeholder="Spec Label"
                  className="sm:col-span-4 p-2.5 border border-hairline bg-page text-deep text-xs font-body focus:outline-none focus:border-bronze"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                  placeholder="Spec Value"
                  className="sm:col-span-8 p-2.5 border border-hairline bg-page text-deep text-xs font-body focus:outline-none focus:border-bronze"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
