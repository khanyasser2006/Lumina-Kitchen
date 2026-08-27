import React, { useState, useEffect } from 'react';
import { getCraftStages, saveCraftStages, DEFAULT_CRAFT_STAGES } from '../../utils/storage';

export default function AdminCraft() {
  const [stages, setStages] = useState([]);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    setStages(getCraftStages());
  }, []);

  const activeStage = stages[activePhaseIndex] || stages[0];

  const handleFieldChange = (field, value) => {
    setStages((prev) =>
      prev.map((s, idx) => (idx === activePhaseIndex ? { ...s, [field]: value } : s))
    );
  };

  const handleDetailChange = (detailIdx, value) => {
    if (!activeStage) return;
    const newDetails = [...activeStage.details];
    newDetails[detailIdx] = value;
    handleFieldChange('details', newDetails);
  };

  const handleSave = () => {
    saveCraftStages(stages);
    setSaveMessage('✓ Craft process stages saved successfully.');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleReset = () => {
    setStages(DEFAULT_CRAFT_STAGES);
    saveCraftStages(DEFAULT_CRAFT_STAGES);
    setSaveMessage('Reset craft process to defaults.');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  if (!activeStage) return null;

  return (
    <div className="space-y-8 animate-fade">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-hairline">
        <div>
          <h2 className="text-2xl font-editorial font-light text-deep">
            Craft Process Manager
          </h2>
          <p className="text-xs text-graphite font-body mt-1">
            Edit the 4 artisanal crafting phases, tolerances, natural aging cycles, and technical bullet points.
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

      {/* Phase selector tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stages.map((stage, idx) => (
          <button
            key={idx}
            onClick={() => setActivePhaseIndex(idx)}
            className={`p-4 text-left border transition-all cursor-pointer ${
              activePhaseIndex === idx
                ? 'border-bronze bg-surface text-deep font-medium'
                : 'border-hairline text-graphite hover:border-hairline-dark'
            }`}
          >
            <span className="text-[10px] font-body tracking-[0.15em] text-bronze uppercase block mb-1">
              {stage.phase}
            </span>
            <span className="text-xs font-body font-medium block truncate">
              {stage.title}
            </span>
          </button>
        ))}
      </div>

      {/* Stage Editor Form */}
      <div className="bg-surface p-6 sm:p-10 border border-hairline space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
          <div className="sm:col-span-3">
            <label className="text-xs font-body tracking-[0.1em] text-deep uppercase block mb-1 font-medium">
              Phase Tag
            </label>
            <input
              type="text"
              value={activeStage.phase}
              onChange={(e) => handleFieldChange('phase', e.target.value)}
              className="w-full p-3 border border-hairline bg-page text-deep text-sm font-body focus:outline-none focus:border-bronze"
            />
          </div>

          <div className="sm:col-span-9">
            <label className="text-xs font-body tracking-[0.1em] text-deep uppercase block mb-1 font-medium">
              Phase Title
            </label>
            <input
              type="text"
              value={activeStage.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="w-full p-3 border border-hairline bg-page text-deep text-sm font-body focus:outline-none focus:border-bronze"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-body tracking-[0.1em] text-deep uppercase block mb-1 font-medium">
            Subtitle / Highlighting Statement
          </label>
          <input
            type="text"
            value={activeStage.subtitle}
            onChange={(e) => handleFieldChange('subtitle', e.target.value)}
            className="w-full p-3 border border-hairline bg-page text-deep text-sm font-body focus:outline-none focus:border-bronze"
          />
        </div>

        <div>
          <label className="text-xs font-body tracking-[0.1em] text-deep uppercase block mb-1 font-medium">
            Full Craft Narrative
          </label>
          <textarea
            rows={3}
            value={activeStage.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            className="w-full p-3 border border-hairline bg-page text-deep text-sm font-body focus:outline-none focus:border-bronze"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-hairline">
          <div>
            <label className="text-xs font-body text-deep uppercase block mb-1 font-medium">
              Highlighted Metric Value (e.g. 12 Years, 0.1mm)
            </label>
            <input
              type="text"
              value={activeStage.metric}
              onChange={(e) => handleFieldChange('metric', e.target.value)}
              className="w-full p-3 border border-hairline bg-page text-deep text-sm font-body focus:outline-none focus:border-bronze"
            />
          </div>

          <div>
            <label className="text-xs font-body text-deep uppercase block mb-1 font-medium">
              Metric Label
            </label>
            <input
              type="text"
              value={activeStage.metricLabel}
              onChange={(e) => handleFieldChange('metricLabel', e.target.value)}
              className="w-full p-3 border border-hairline bg-page text-deep text-sm font-body focus:outline-none focus:border-bronze"
            />
          </div>
        </div>

        {/* Bullet details */}
        <div className="space-y-3 pt-4 border-t border-hairline">
          <label className="text-xs font-body tracking-[0.1em] text-deep uppercase block font-medium">
            Phase Detail Points
          </label>

          {activeStage.details.map((detail, dIdx) => (
            <div key={dIdx} className="flex items-center gap-3">
              <span className="text-bronze text-xs font-body font-medium">0{dIdx + 1}.</span>
              <input
                type="text"
                value={detail}
                onChange={(e) => handleDetailChange(dIdx, e.target.value)}
                className="w-full p-2.5 border border-hairline bg-page text-deep text-xs font-body focus:outline-none focus:border-bronze"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
