import React, { useState, useEffect } from 'react';
import { getAdminPasscode, setAdminPasscode, resetToDefaults } from '../../utils/storage';

export default function AdminSettings() {
  const [currentCode, setCurrentCode] = useState('');
  const [newCode, setNewCode] = useState('');
  const [confirmCode, setConfirmCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setCurrentCode(getAdminPasscode());
  }, []);

  const handlePasscodeUpdate = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!newCode || newCode.length < 4) {
      setError('Passcode must be at least 4 characters long.');
      return;
    }

    if (newCode !== confirmCode) {
      setError('New passcode and confirmation do not match.');
      return;
    }

    setAdminPasscode(newCode);
    setCurrentCode(newCode);
    setNewCode('');
    setConfirmCode('');
    setMessage('✓ Admin portal passcode updated successfully.');
  };

  const handleFactoryReset = () => {
    if (
      window.confirm(
        'WARNING: This will reset all Collections, Craft Stages, Salons, and Enquiries back to factory defaults! Proceed?'
      )
    ) {
      resetToDefaults();
      setMessage('✓ All website data has been reset to factory defaults. Refreshing...');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <div className="space-y-8 max-w-[680px] animate-fade">
      <div className="pb-6 border-b border-hairline">
        <h2 className="text-2xl font-editorial font-light text-deep">
          Portal Security & System Settings
        </h2>
        <p className="text-xs text-graphite font-body mt-1">
          Manage access passcodes and system backup defaults.
        </p>
      </div>

      {message && (
        <div className="p-4 bg-surface border border-bronze text-bronze text-xs font-body font-medium animate-fade">
          {message}
        </div>
      )}

      {error && (
        <div className="p-4 bg-surface border border-red-800 text-red-800 text-xs font-body font-medium animate-fade">
          {error}
        </div>
      )}

      {/* Security Status Badge */}
      <div className="bg-surface p-6 sm:p-8 border border-hairline space-y-4">
        <div className="flex items-center justify-between border-b border-hairline pb-3">
          <h3 className="text-lg font-editorial font-light text-deep">
            Active Security Controls
          </h3>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[11px] font-body font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Hardened & Active
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-body text-graphite">
          <div className="p-3 bg-page border border-hairline">
            <div className="font-medium text-deep mb-1">🔐 Password Hashing</div>
            <p className="text-[11px] text-taupe">SHA-256 cryptographic digest applied before storage.</p>
          </div>
          <div className="p-3 bg-page border border-hairline">
            <div className="font-medium text-deep mb-1">🛡️ Rate Limiter</div>
            <p className="text-[11px] text-taupe">Max 5 consultation submissions per 15 min window.</p>
          </div>
          <div className="p-3 bg-page border border-hairline">
            <div className="font-medium text-deep mb-1">🧹 Input Sanitization</div>
            <p className="text-[11px] text-taupe">HTML entity escaping prevents XSS & script injection.</p>
          </div>
          <div className="p-3 bg-page border border-hairline">
            <div className="font-medium text-deep mb-1">🌐 Security Headers</div>
            <p className="text-[11px] text-taupe">X-Content-Type-Options & Frame protection enabled.</p>
          </div>
        </div>
      </div>
      <form onSubmit={handlePasscodeUpdate} className="bg-surface p-6 sm:p-8 border border-hairline space-y-6">
        <h3 className="text-lg font-editorial font-light text-deep border-b border-hairline pb-3">
          Change Admin Portal Passcode
        </h3>

        <div>
          <label className="text-xs font-body tracking-[0.1em] text-taupe uppercase block mb-1">
            Current Passcode
          </label>
          <input
            type="text"
            disabled
            value={currentCode}
            className="w-full p-3 border border-hairline bg-page text-deep text-xs font-mono opacity-80"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-body tracking-[0.1em] text-deep uppercase block mb-1 font-medium">
              New Passcode
            </label>
            <input
              type="password"
              required
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 border border-hairline bg-page text-deep text-sm font-body focus:outline-none focus:border-bronze"
            />
          </div>

          <div>
            <label className="text-xs font-body tracking-[0.1em] text-deep uppercase block mb-1 font-medium">
              Confirm New Passcode
            </label>
            <input
              type="password"
              required
              value={confirmCode}
              onChange={(e) => setConfirmCode(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 border border-hairline bg-page text-deep text-sm font-body focus:outline-none focus:border-bronze"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-bronze text-page text-xs font-body uppercase tracking-[0.12em] font-medium rounded-full hover:bg-bronze-light transition-all cursor-pointer shadow-md"
        >
          Update Passcode
        </button>
      </form>

      {/* Factory Reset Card */}
      <div className="bg-surface p-6 sm:p-8 border border-red-200 space-y-4">
        <h3 className="text-lg font-editorial font-light text-red-900 border-b border-red-200 pb-3">
          Factory Data Reset
        </h3>
        <p className="text-xs font-body text-graphite leading-relaxed">
          Reset all custom collections, craft narratives, salon contacts, and client enquiry submissions stored in browser memory back to their original factory defaults.
        </p>
        <button
          onClick={handleFactoryReset}
          className="px-6 py-2.5 border border-red-800 text-red-800 text-xs font-body uppercase tracking-[0.12em] font-medium hover:bg-red-800 hover:text-page transition-all cursor-pointer"
        >
          Reset All Data to Factory Defaults
        </button>
      </div>
    </div>
  );
}
