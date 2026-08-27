import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { EMAIL_CONFIG } from '../config/email';
import { addEnquiry } from '../utils/storage';

export default function EnquirePage({ onNavigate }) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [sendStatus, setSendStatus] = useState('idle');
  const [formData, setFormData] = useState({
    scope: 'Full Residence Kitchen',
    series: 'Minimalist Mono',
    budget: '€100,000 – €250,000',
    timeline: 'Within 6 Months',
    salon: 'London (Mayfair)',
    name: '',
    email: '',
    phone: '',
    location: '',
    notes: '',
    fileName: '',
    referenceCode: ''
  });

  const pageRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const elements = pageRef.current?.querySelectorAll('.animate-fade');
    if (elements) {
      gsap.fromTo(
        elements,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, [step, submitted]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, fileName: file.name }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const referenceCode = `LUM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setFormData((prev) => ({ ...prev, referenceCode }));

    // Save to LocalStorage for CRM Admin Panel
    addEnquiry({
      ...formData,
      referenceCode,
    });

    if (EMAIL_CONFIG.API_ENDPOINT) {
      setSendStatus('sending');
      try {
        const response = await fetch(EMAIL_CONFIG.API_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from_name: formData.name,
            from_email: formData.email,
            phone: formData.phone,
            location: formData.location,
            scope: formData.scope,
            series: formData.series,
            budget: formData.budget,
            salon: formData.salon,
            notes: formData.notes,
            reference_code: referenceCode,
          }),
        });

        const data = await response.json();
        if (response.ok && data.success) {
          setSendStatus('sent');
        } else {
          console.warn('Resend API response issue:', data);
          setSendStatus('error');
        }
      } catch (error) {
        console.error('Resend API Error:', error);
        setSendStatus('error');
      }
    }

    setSubmitted(true);
  };

  return (
    <main ref={pageRef} className="pt-32 pb-32 bg-page min-h-screen">
      {/* ── Header ── */}
      <section className="px-8 md:px-16 max-w-[1400px] mx-auto mb-16 animate-fade">
        <div className="flex items-center gap-3 text-xs tracking-[0.25em] uppercase text-bronze font-body mb-6">
          <span className="w-8 h-[1px] bg-bronze inline-block" />
          Private Correspondence
        </div>
        <h1 className="text-[clamp(2.5rem,5.5vw,5rem)] font-editorial font-light leading-[1.02] text-deep mb-6 max-w-[960px]">
          Initiate your architectural <br />
          <em className="italic text-bark font-light">consultation</em>
        </h1>
        <p className="text-graphite text-[16px] max-w-[580px] leading-relaxed font-body">
          We invite private clients, interior architects, and estate directors to submit initial project specifications. 
          Our principal design team responds within 24 business hours.
        </p>
      </section>

      {/* ── Multi-Step Form Container ── */}
      <section className="px-8 md:px-16 max-w-[1400px] mx-auto animate-fade">
        {!submitted ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Form Progress Stepper Column */}
            <div className="lg:col-span-4 space-y-6 bg-surface p-8 border border-hairline">
              <span className="text-taupe text-xs tracking-[0.2em] uppercase font-body block mb-4">
                Consultation Stages
              </span>

              {[
                { id: 1, label: '01. Project Scope & Typology' },
                { id: 2, label: '02. Material Series & Budget' },
                { id: 3, label: '03. Architectural Floorplan' },
                { id: 4, label: '04. Client Contact Details' }
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStep(s.id)}
                  className={`w-full text-left py-3 px-4 text-xs tracking-[0.1em] font-body uppercase transition-all duration-200 cursor-pointer flex items-center justify-between ${
                    step === s.id
                      ? 'bg-bark text-page font-medium'
                      : 'text-graphite hover:text-deep hover:bg-page'
                  }`}
                >
                  <span>{s.label}</span>
                  {step > s.id && <span className="text-bronze-light">✓</span>}
                </button>
              ))}

              <div className="pt-6 border-t border-hairline text-xs text-taupe font-body space-y-2">
                <p>Direct Concierge Line:</p>
                <p className="text-deep font-medium">+44 (0)20 7946 0188</p>
                <p className="text-[11px] text-taupe mt-4">Strict Client Confidentiality Guaranteed</p>
              </div>
            </div>

            {/* Active Step Form Body */}
            <div className="lg:col-span-8 bg-page p-8 md:p-12 border border-hairline min-h-[520px] flex flex-col justify-between">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* ── STEP 1: SCOPE ── */}
                {step === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-editorial font-light text-deep border-b border-hairline pb-4">
                      Select Project Typology
                    </h2>
                    <p className="text-graphite text-sm font-body">
                      Select the primary architectural scope for your residence:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        'Full Residence Kitchen',
                        'Architectural Island Refinement',
                        'Butler\'s Pantry & Preparation',
                        'Integrated Living Bar & Cellar'
                      ].map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => handleInputChange('scope', item)}
                          className={`p-6 text-left border transition-all cursor-pointer ${
                            formData.scope === item
                              ? 'border-bronze bg-surface text-deep'
                              : 'border-hairline text-graphite hover:border-hairline-dark'
                          }`}
                        >
                          <span className="text-xs font-body tracking-[0.1em] text-bronze uppercase block mb-1">
                            Typology
                          </span>
                          <span className="text-sm font-body font-medium block">
                            {item}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── STEP 2: SERIES & BUDGET ── */}
                {step === 2 && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-editorial font-light text-deep border-b border-hairline pb-4 mb-4">
                        Preferred Kitchen Series
                      </h2>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {['Minimalist Mono', 'Architectural Floating', 'Heritage Craft', 'Industrial Raw'].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => handleInputChange('series', s)}
                            className={`p-4 text-center border text-xs font-body uppercase tracking-[0.08em] transition-all cursor-pointer ${
                              formData.series === s
                                ? 'border-bronze bg-surface text-deep font-medium'
                                : 'border-hairline text-graphite hover:border-hairline-dark'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-body uppercase tracking-[0.1em] text-deep mb-3 font-medium">
                        Investment Range Tier
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {['€50,000 – €100,000', '€100,000 – €250,000', '€250,000+'].map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => handleInputChange('budget', b)}
                            className={`p-4 text-center border text-xs font-body font-medium transition-all cursor-pointer ${
                              formData.budget === b
                                ? 'border-bronze bg-surface text-deep'
                                : 'border-hairline text-graphite hover:border-hairline-dark'
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 3: BLUEPRINT & SALON ── */}
                {step === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-editorial font-light text-deep border-b border-hairline pb-4">
                      Architectural Floorplan & Meeting Preference
                    </h2>

                    <div>
                      <label className="text-xs font-body tracking-[0.1em] text-deep uppercase block mb-2 font-medium">
                        Upload Floorplan or Architectural Sketch (Optional)
                      </label>
                      <div className="border border-dashed border-hairline-dark p-8 text-center bg-surface hover:bg-page transition-colors">
                        <input
                          type="file"
                          id="file-upload"
                          className="hidden"
                          onChange={handleFileUpload}
                          accept=".pdf,.dwg,.jpg,.png"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer space-y-2 block">
                          <span className="text-bronze text-sm font-body font-medium block">
                            {formData.fileName ? `Attached: ${formData.fileName}` : 'Click to select PDF, DWG, or image file'}
                          </span>
                          <span className="text-taupe text-xs font-body block">
                            Maximum file size 25MB. Confidentiality protected.
                          </span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-body tracking-[0.1em] text-deep uppercase block mb-2 font-medium">
                        Preferred Consultation Location
                      </label>
                      <select
                        value={formData.salon}
                        onChange={(e) => handleInputChange('salon', e.target.value)}
                        className="w-full p-4 border border-hairline bg-page text-deep text-sm font-body focus:outline-none focus:border-bronze"
                      >
                        <option value="London (Mayfair)">London Salon (Mayfair, Berkeley Square)</option>
                        <option value="Milan (Brera)">Milan Salon (Via Solferino, Brera)</option>
                        <option value="Zurich (Bahnhofstrasse)">Zurich Salon (Talstrasse)</option>
                        <option value="Tokyo (Ginza)">Tokyo Salon (Ginza, Chuo-ku)</option>
                        <option value="Virtual Atelier (1:1 Video Consultation)">Virtual Atelier (1:1 Video Consultation)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* ── STEP 4: CLIENT CONTACT DETAILS ── */}
                {step === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-editorial font-light text-deep border-b border-hairline pb-4">
                      Client Contact Information
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs font-body tracking-[0.1em] text-deep uppercase block mb-1 font-medium">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="e.g. Lord Alistair Sterling"
                          className="w-full p-3 border border-hairline bg-page text-deep text-sm font-body focus:outline-none focus:border-bronze"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-body tracking-[0.1em] text-deep uppercase block mb-1 font-medium">
                          Private Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="client@residence.com"
                          className="w-full p-3 border border-hairline bg-page text-deep text-sm font-body focus:outline-none focus:border-bronze"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-body tracking-[0.1em] text-deep uppercase block mb-1 font-medium">
                          Telephone Number
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="+44 7911 123456"
                          className="w-full p-3 border border-hairline bg-page text-deep text-sm font-body focus:outline-none focus:border-bronze"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-body tracking-[0.1em] text-deep uppercase block mb-1 font-medium">
                          Property Location / Country
                        </label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          placeholder="e.g. London, UK / Zurich, Switzerland"
                          className="w-full p-3 border border-hairline bg-page text-deep text-sm font-body focus:outline-none focus:border-bronze"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-body tracking-[0.1em] text-deep uppercase block mb-1 font-medium">
                        Additional Architectural Notes or Requests
                      </label>
                      <textarea
                        rows={3}
                        value={formData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        placeholder="Mention any specific ceiling heights, appliance preferences, or estate architectural requirements..."
                        className="w-full p-3 border border-hairline bg-page text-deep text-sm font-body focus:outline-none focus:border-bronze"
                      />
                    </div>
                  </div>
                )}

                {/* Stepper Buttons */}
                <div className="pt-8 border-t border-hairline flex items-center justify-between">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="text-xs tracking-[0.15em] uppercase text-graphite font-body hover:text-deep transition-colors cursor-pointer"
                    >
                      ← Previous Stage
                    </button>
                  ) : <div />}

                  {step < 4 ? (
                    <button
                      type="button"
                      onClick={() => setStep(step + 1)}
                      className="px-8 py-3 bg-bark text-page text-[13px] tracking-[0.15em] uppercase font-body font-medium rounded-full hover:bg-deep transition-all cursor-pointer"
                    >
                      Continue to Stage 0{step + 1} →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={sendStatus === 'sending'}
                      className={`px-10 py-3.5 bg-bronze text-page text-[13px] tracking-[0.15em] uppercase font-body font-medium rounded-full hover:bg-bronze-light transition-all shadow-md cursor-pointer ${sendStatus === 'sending' ? 'opacity-60 cursor-wait' : ''}`}
                    >
                      {sendStatus === 'sending' ? 'Submitting Dossier...' : 'Submit Architectural Dossier'}
                    </button>
                  )}
                </div>

              </form>
            </div>
          </div>
        ) : (
          /* ── SUBMISSION CONFIRMATION RECEIPT ── */
          <div className="max-w-[760px] mx-auto bg-surface p-12 md:p-16 border border-hairline text-center animate-fade">
            <span className="w-12 h-[1px] bg-bronze inline-block mb-6" />
            <span className="text-bronze text-xs font-body tracking-[0.25em] uppercase block mb-3 font-medium">
              Correspondence Registered
            </span>
            <h2 className="text-3xl md:text-4xl font-editorial font-light text-deep mb-4">
              Thank you, {formData.name || 'valued client'}.
            </h2>
            <p className="text-graphite text-[15px] leading-relaxed font-body mb-8 max-w-[540px] mx-auto">
              Your architectural dossier has been assigned reference code{' '}
              <strong className="text-deep font-medium">{formData.referenceCode}</strong>. 
              Our Principal Design Director will review your specifications and reach out via email ({formData.email || 'your address'}) within 24 hours.
            </p>

            <div className="bg-page p-6 border border-hairline mb-8 text-left space-y-2 text-xs font-body text-graphite max-w-[480px] mx-auto">
              <div className="flex justify-between">
                <span>Selected Typology:</span>
                <strong className="text-deep">{formData.scope}</strong>
              </div>
              <div className="flex justify-between">
                <span>Preferred Series:</span>
                <strong className="text-deep">{formData.series}</strong>
              </div>
              <div className="flex justify-between">
                <span>Investment Tier:</span>
                <strong className="text-deep">{formData.budget}</strong>
              </div>
              <div className="flex justify-between">
                <span>Salon Preference:</span>
                <strong className="text-deep">{formData.salon}</strong>
              </div>
            </div>

            {sendStatus === 'sent' && (
              <p className="text-bronze text-xs font-body mb-4">✓ Confirmation email dispatched to your inbox.</p>
            )}
            {sendStatus === 'error' && (
              <p className="text-bronze text-xs font-body mb-4">Email notification could not be sent. Our team will contact you directly.</p>
            )}
            {sendStatus === 'idle' && (
              <p className="text-taupe text-xs font-body mb-4">Our concierge team will review your submission and respond within 24 hours.</p>
            )}

            <button
              onClick={() => onNavigate('home')}
              className="px-8 py-3 bg-bark text-page text-[13px] tracking-[0.15em] uppercase font-body font-medium rounded-full hover:bg-deep transition-all cursor-pointer"
            >
              Return to Main Atelier
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
