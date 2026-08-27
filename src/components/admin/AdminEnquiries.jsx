import React, { useState, useEffect } from 'react';
import { getEnquiries, updateEnquiryStatus, deleteEnquiry } from '../../utils/storage';

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    setEnquiries(getEnquiries());
  }, []);

  const handleStatusChange = (id, newStatus) => {
    const updated = updateEnquiryStatus(id, newStatus);
    setEnquiries(updated);
    if (selectedEnquiry && (selectedEnquiry.id === id || selectedEnquiry.referenceCode === id)) {
      setSelectedEnquiry((prev) => ({ ...prev, status: newStatus }));
    }
    setActionMessage(`Status updated to "${newStatus}".`);
    setTimeout(() => setActionMessage(''), 2500);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this client enquiry?')) {
      const updated = deleteEnquiry(id);
      setEnquiries(updated);
      setSelectedEnquiry(null);
      setActionMessage('Enquiry deleted.');
      setTimeout(() => setActionMessage(''), 2500);
    }
  };

  const filteredEnquiries = enquiries.filter((item) => {
    const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
    const matchesSearch =
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.referenceCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-hairline">
        <div>
          <h2 className="text-2xl font-editorial font-light text-deep">
            Private Client Dossiers & Enquiries (CRM)
          </h2>
          <p className="text-xs text-graphite font-body mt-1">
            Review architectural project briefs, set consultation status, and view uploaded floorplans.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-surface border border-hairline text-deep text-xs font-body font-medium">
            Total Dossiers: {enquiries.length}
          </span>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 bg-surface border border-bronze text-bronze text-xs font-body font-medium animate-fade">
          {actionMessage}
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {['All', 'New', 'In Review', 'Salon Scheduled', 'Completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 text-xs font-body uppercase tracking-[0.08em] border transition-all cursor-pointer whitespace-nowrap ${
                filterStatus === status
                  ? 'bg-bark text-page border-bark font-medium'
                  : 'border-hairline text-graphite hover:border-hairline-dark'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by client name, email, or code..."
          className="p-2.5 border border-hairline bg-page text-deep text-xs font-body focus:outline-none focus:border-bronze w-full sm:w-[280px]"
        />
      </div>

      {/* Main Table + Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Table View */}
        <div className={`${selectedEnquiry ? 'lg:col-span-7' : 'lg:col-span-12'} bg-surface border border-hairline overflow-x-auto`}>
          <table className="w-full text-left text-xs font-body">
            <thead>
              <tr className="border-b border-hairline text-taupe uppercase text-[10px] tracking-[0.15em] bg-page">
                <th className="p-4">Ref Code</th>
                <th className="p-4">Client</th>
                <th className="p-4">Typology & Series</th>
                <th className="p-4">Budget</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-taupe">
                    No client dossiers found.
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedEnquiry(item)}
                    className={`hover:bg-page transition-colors cursor-pointer ${
                      selectedEnquiry?.id === item.id ? 'bg-page font-medium' : ''
                    }`}
                  >
                    <td className="p-4 font-mono text-[11px] text-bronze font-medium">
                      {item.referenceCode}
                    </td>
                    <td className="p-4">
                      <div className="text-deep font-medium">{item.name}</div>
                      <div className="text-[11px] text-taupe">{item.email}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-deep">{item.scope}</div>
                      <div className="text-[11px] text-taupe">{item.series}</div>
                    </td>
                    <td className="p-4 text-deep whitespace-nowrap">
                      {item.budget}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-1 text-[10px] uppercase font-body font-medium rounded-full ${
                          item.status === 'New'
                            ? 'bg-bronze text-page'
                            : item.status === 'In Review'
                            ? 'bg-bark text-page'
                            : item.status === 'Salon Scheduled'
                            ? 'bg-deep text-page'
                            : 'bg-hairline text-graphite'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEnquiry(item);
                        }}
                        className="text-bronze text-[11px] hover:underline cursor-pointer mr-3"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Selected Dossier Detail Card */}
        {selectedEnquiry && (
          <div className="lg:col-span-5 bg-page border border-hairline p-6 space-y-6 animate-fade">
            <div className="flex items-center justify-between pb-4 border-b border-hairline">
              <div>
                <span className="text-bronze font-mono text-xs block font-medium">
                  {selectedEnquiry.referenceCode}
                </span>
                <h3 className="text-xl font-editorial font-light text-deep mt-1">
                  {selectedEnquiry.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-graphite hover:text-deep text-sm font-body cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Change Status */}
            <div>
              <label className="text-[11px] font-body tracking-[0.1em] text-deep uppercase block mb-2 font-medium">
                Update Pipeline Status
              </label>
              <div className="flex flex-wrap gap-2">
                {['New', 'In Review', 'Salon Scheduled', 'Completed'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(selectedEnquiry.id, st)}
                    className={`px-3 py-1 text-[11px] font-body uppercase border transition-all cursor-pointer ${
                      selectedEnquiry.status === st
                        ? 'bg-bark text-page border-bark font-medium'
                        : 'border-hairline text-graphite hover:border-hairline-dark'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Client Details Grid */}
            <div className="bg-surface p-4 border border-hairline space-y-3 text-xs font-body">
              <div className="flex justify-between border-b border-hairline pb-2">
                <span className="text-taupe">Private Email:</span>
                <a href={`mailto:${selectedEnquiry.email}`} className="text-bronze hover:underline">
                  {selectedEnquiry.email}
                </a>
              </div>
              <div className="flex justify-between border-b border-hairline pb-2">
                <span className="text-taupe">Telephone:</span>
                <span className="text-deep font-medium">{selectedEnquiry.phone || 'Not provided'}</span>
              </div>
              <div className="flex justify-between border-b border-hairline pb-2">
                <span className="text-taupe">Location:</span>
                <span className="text-deep font-medium">{selectedEnquiry.location || 'Not provided'}</span>
              </div>
              <div className="flex justify-between border-b border-hairline pb-2">
                <span className="text-taupe">Project Scope:</span>
                <span className="text-deep font-medium">{selectedEnquiry.scope}</span>
              </div>
              <div className="flex justify-between border-b border-hairline pb-2">
                <span className="text-taupe">Preferred Series:</span>
                <span className="text-deep font-medium">{selectedEnquiry.series}</span>
              </div>
              <div className="flex justify-between border-b border-hairline pb-2">
                <span className="text-taupe">Investment Tier:</span>
                <span className="text-deep font-medium">{selectedEnquiry.budget}</span>
              </div>
              <div className="flex justify-between border-b border-hairline pb-2">
                <span className="text-taupe">Salon Location:</span>
                <span className="text-deep font-medium">{selectedEnquiry.salon}</span>
              </div>
              {selectedEnquiry.fileName && (
                <div className="flex justify-between pt-1">
                  <span className="text-taupe">Attached Floorplan:</span>
                  <span className="text-bronze font-medium">📎 {selectedEnquiry.fileName}</span>
                </div>
              )}
            </div>

            {/* Notes */}
            {selectedEnquiry.notes && (
              <div>
                <label className="text-[11px] font-body uppercase tracking-[0.1em] text-taupe block mb-1">
                  Architectural Notes
                </label>
                <p className="p-3 bg-surface border border-hairline text-xs font-body text-deep leading-relaxed">
                  "{selectedEnquiry.notes}"
                </p>
              </div>
            )}

            {/* Delete button */}
            <div className="pt-4 border-t border-hairline flex justify-end">
              <button
                onClick={() => handleDelete(selectedEnquiry.id)}
                className="text-xs text-red-700 hover:text-red-900 font-body cursor-pointer"
              >
                Delete Dossier
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
