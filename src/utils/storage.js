// ═══════════════════════════════════════════════════════
// LUMINA — LocalStorage Persistence Layer
// Handles Collections, Craft Stages, Salons, Enquiries, and Passcode
// ═══════════════════════════════════════════════════════

// Default Data Definitions
export const DEFAULT_COLLECTIONS = [
  {
    id: 'mono',
    tag: 'Series 01',
    name: 'Minimalist Mono',
    tagline: 'Monolithic forms sculpted from continuous stone & smoked timber.',
    description: 'Designed for architectural spaces where visual noise is eliminated. Every cabinet face is hand-matched from a single log, seamlessly aligning wood grain across 4-meter runs.',
    primaryMaterial: 'Smoked Austrian Oak',
    secondaryMaterial: 'Honed Calacatta Marble',
    hardware: 'Custom Brushed Bronze Pulls',
    joinery: '0.1mm Precision Mitered Edges',
    lighting: 'Concealed 2700K Warm Linear LED',
    image: '/images/kitchen_mono.webp',
    location: 'Mayfair Residence, London',
    year: '2025 Commission',
    architect: 'Lumina Atelier — London Studio',
    specs: [
      { label: 'Wood Species', value: 'Quarter-sawn Smoked Austrian Oak' },
      { label: 'Countertop Stone', value: 'Honed Calacatta Oro (Carrara, Italy)' },
      { label: 'Drawer Hardware', value: 'Silent Blumotion Soft-Close Dampers' },
      { label: 'Structural Framework', value: 'Laser-Cut Anodized Aluminum Chassis' },
      { label: 'Finish', value: 'Hand-Rubbed Organic Beeswax & Matte Lacquer' }
    ]
  },
  {
    id: 'floating',
    tag: 'Series 02',
    name: 'Architectural Floating',
    tagline: 'Gravity-defying cabinetry elevated above continuous floor planes.',
    description: 'Cantilevered steel subframes lift the entire kitchen island 18 centimeters above the floor. Floor-reflected ambient light creates an illusion of weightlessness.',
    primaryMaterial: 'American Black Walnut',
    secondaryMaterial: 'Matte Anodized Titanium',
    hardware: 'Push-to-Open Motorized Drive',
    joinery: 'Concealed Cantilever Steel Truss',
    lighting: 'Under-Cabinet Diffused Shadow Strip',
    image: '/images/kitchen_floating.webp',
    location: 'Alpine Villa, Zurich',
    year: '2026 Commission',
    architect: 'Lumina Atelier — Zurich Studio',
    specs: [
      { label: 'Wood Species', value: 'Select American Black Walnut' },
      { label: 'Subframe Engineering', value: 'High-Tensile Structural Steel Truss' },
      { label: 'Control Systems', value: 'Servo-Drive Motorized Opening' },
      { label: 'Cabinet Interiors', value: 'Matte Charcoal Birch Plywood' },
      { label: 'Load Capacity', value: '650kg Cantilevered Weight Rating' }
    ]
  },
  {
    id: 'heritage',
    tag: 'Series 03',
    name: 'Heritage Craft',
    tagline: 'Fluted timber millwork paired with patinated brass details.',
    description: 'A tribute to artisanal joinery. Individually carved vertical flutes run across cabinet doors, catching shadow and light throughout the day.',
    primaryMaterial: 'Fluted White Ash',
    secondaryMaterial: 'Patinated Aged Brass',
    hardware: 'Solid Machined Brass Knurled Handles',
    joinery: 'Traditional Mortise & Tenon',
    lighting: 'Integrated Glass Cabinet Spotlights',
    image: '/images/kitchen_heritage.webp',
    location: 'Brera Penthouse, Milan',
    year: '2025 Commission',
    architect: 'Lumina Atelier — Milan Studio',
    specs: [
      { label: 'Wood Species', value: 'European White Ash (Hand-Fluted)' },
      { label: 'Metal Work', value: 'Hand-Patinated Architectural Brass' },
      { label: 'Drawer Lining', value: 'Hand-Stitched Saddle Leather Insert' },
      { label: 'Hinge Mechanisms', value: 'Concealed 3D Adjustable Brass Hinges' },
      { label: 'Craftsmanship Time', value: '340 Hours Hand-Artisanship Per Unit' }
    ]
  },
  {
    id: 'industrial',
    tag: 'Series 04',
    name: 'Industrial Raw',
    tagline: 'Cast ultra-thin concrete & hand-beaten patinated copper.',
    description: 'Raw architectural elements refined for private culinary spaces. Ultra-lightweight engineered concrete surfaces paired with warm copper accents.',
    primaryMaterial: 'Ultra-High-Performance Concrete',
    secondaryMaterial: 'Beaten Antique Copper',
    hardware: 'Recessed Integrated Channel Grips',
    joinery: 'Monolithic Cast Joints',
    lighting: 'Task Light Channels with Dimmer Control',
    image: '/images/kitchen_industrial.webp',
    location: 'Ginza Loft, Tokyo',
    year: '2026 Commission',
    architect: 'Lumina Atelier — Tokyo Studio',
    specs: [
      { label: 'Island Material', value: '12mm UHPC Architectural Concrete' },
      { label: 'Accent Metals', value: 'Natural Flame-Patinated Copper' },
      { label: 'Storage Systems', value: 'Full-Extension Heavy Duty Trays' },
      { label: 'Pantry Dooring', value: 'Motorized Vertical Pocket Doors' },
      { label: 'Heat & Stain Rating', value: 'Sealant Protected to 300°C' }
    ]
  }
];

export const DEFAULT_CRAFT_STAGES = [
  {
    phase: 'Phase 01',
    title: 'Timber Selection & Natural Seasoning',
    subtitle: 'Aged for 12 years to achieve zero internal tension.',
    description: 'We do not kiln-dry timber rapidly. Hardwoods are aged in temperature-stabilized open-air timber yards in the Austrian Alps for up to 12 years. This ensures the wood grain stabilizes completely, preventing warping across decades of domestic use.',
    metric: '12 Years',
    metricLabel: 'Natural Aging Cycle',
    details: [
      'Hand-inspected grain density mapping',
      'Moisture content certified below 6.8%',
      'Sustainably harvested from certified alpine forests',
      'Zero synthetic chemical pre-treatments'
    ]
  },
  {
    phase: 'Phase 02',
    title: '0.1mm CNC Micro-Joinery',
    subtitle: 'Tolerances measured in microns, not millimeters.',
    description: 'Every panel, cabinet frame, and concealed drawer runner is milled using 5-axis German CNC robotics operating at a 0.1mm tolerance. Mitered joints lock together with micro-precision so door gaps remain an invisible 1.5mm hairline.',
    metric: '0.1mm',
    metricLabel: 'Machining Tolerance',
    details: [
      '5-Axis German CNC milling precision',
      'Concealed blind mortise and tenon joints',
      'Stress-relieved aluminum structural ribbing',
      'Continuous wood grain matching across door fronts'
    ]
  },
  {
    phase: 'Phase 03',
    title: 'Hand-Applied Organic Finishes',
    subtitle: 'Seven coats of natural oils & organic beeswax.',
    description: 'No plastic lacquers. Our master artisans hand-rub timber surfaces with seven successive coats of cold-pressed linseed oil and organic Bavarian beeswax. The wood breathes, ages gracefully, and develops a warm tactile patina over generations.',
    metric: '7 Coats',
    metricLabel: 'Hand-Rubbed Finish',
    details: [
      '100% VOC-free organic oil formulation',
      '24-hour cure time between successive hand coats',
      'Self-healing surface properties for micro-scratches',
      'Food-safe certified natural wax seal'
    ]
  },
  {
    phase: 'Phase 04',
    title: 'Concealed Systems & Hardware',
    subtitle: 'Silent, motorized mechanisms that serve in whisper quietness.',
    description: 'Integrated push-to-open motorized drives, heavy-duty 80kg drawer slides, and magnetic dampening channels are embedded seamlessly into cabinet carcasses. Technology exists to serve without ever disrupting visual harmony.',
    metric: '80kg',
    metricLabel: 'Per-Drawer Load Rating',
    details: [
      'Concealed electric Servo-Drive motorized opening',
      'Air-cushioned hydraulic soft-close dampeners',
      'Integrated 2700K warm diffused LED channels',
      'Magnetic flush-closing pocket door systems'
    ]
  }
];

export const DEFAULT_SALONS = [
  {
    id: 'london',
    city: 'London',
    district: 'Mayfair',
    address: '42 Berkeley Square, London W1J 5AW',
    phone: '+44 (0)20 7946 0188',
    director: 'Lord Alistair Sterling'
  },
  {
    id: 'milan',
    city: 'Milan',
    district: 'Brera',
    address: 'Via Solferino 18, 20121 Milano',
    phone: '+39 02 8901 4210',
    director: 'Elena Bellini'
  },
  {
    id: 'zurich',
    city: 'Zurich',
    district: 'Bahnhofstrasse',
    address: 'Talstrasse 62, 8001 Zürich',
    phone: '+41 44 211 8890',
    director: 'Markus von Berg'
  },
  {
    id: 'tokyo',
    city: 'Tokyo',
    district: 'Ginza',
    address: '6-10-1 Ginza, Chuo-ku, Tokyo 104-0061',
    phone: '+81 3 5537 9100',
    director: 'Kenzo Takahashi'
  }
];

export const DEFAULT_ENQUIRIES = [
  {
    id: 'LUM-2026-8941',
    referenceCode: 'LUM-2026-8941',
    name: 'Lord Alistair Sterling',
    email: 'a.sterling@mayfair-estates.co.uk',
    phone: '+44 7911 123456',
    location: 'Mayfair, London',
    scope: 'Full Residence Kitchen',
    series: 'Minimalist Mono',
    budget: '€250,000+',
    salon: 'London (Mayfair)',
    notes: 'Requiring 4-meter island in single-slab Italian marble with integrated wine climate vault.',
    fileName: 'Mayfair_Penthouse_Floorplan.pdf',
    date: '2026-08-08T14:32:00Z',
    status: 'In Review'
  },
  {
    id: 'LUM-2026-3104',
    referenceCode: 'LUM-2026-3104',
    name: 'Elena Rostova',
    email: 'elena.rostova@design-atelier.ch',
    phone: '+41 79 890 1122',
    location: 'Zurich Lake Estate',
    scope: 'Architectural Island Refinement',
    series: 'Architectural Floating',
    budget: '€100,000 – €250,000',
    salon: 'Zurich (Bahnhofstrasse)',
    notes: 'Cantilever island for lakeside villa. Architect requests CAD models.',
    fileName: 'Villa_Zurich_Section.dwg',
    date: '2026-08-09T09:15:00Z',
    status: 'New'
  }
];

// LocalStorage Keys
const KEYS = {
  COLLECTIONS: 'lumina_collections',
  CRAFT_STAGES: 'lumina_craft_stages',
  SALONS: 'lumina_salons',
  ENQUIRIES: 'lumina_enquiries',
  PASSCODE: 'lumina_admin_passcode',
};

// Helper Functions

export function getCollections() {
  try {
    const stored = localStorage.getItem(KEYS.COLLECTIONS);
    return stored ? JSON.parse(stored) : DEFAULT_COLLECTIONS;
  } catch (e) {
    console.error('Storage error getting collections:', e);
    return DEFAULT_COLLECTIONS;
  }
}

export function saveCollections(collections) {
  try {
    localStorage.setItem(KEYS.COLLECTIONS, JSON.stringify(collections));
  } catch (e) {
    console.error('Storage error saving collections:', e);
  }
}

export function getCraftStages() {
  try {
    const stored = localStorage.getItem(KEYS.CRAFT_STAGES);
    return stored ? JSON.parse(stored) : DEFAULT_CRAFT_STAGES;
  } catch (e) {
    console.error('Storage error getting craft stages:', e);
    return DEFAULT_CRAFT_STAGES;
  }
}

export function saveCraftStages(stages) {
  try {
    localStorage.setItem(KEYS.CRAFT_STAGES, JSON.stringify(stages));
  } catch (e) {
    console.error('Storage error saving craft stages:', e);
  }
}

export function getSalons() {
  try {
    const stored = localStorage.getItem(KEYS.SALONS);
    return stored ? JSON.parse(stored) : DEFAULT_SALONS;
  } catch (e) {
    console.error('Storage error getting salons:', e);
    return DEFAULT_SALONS;
  }
}

export function saveSalons(salons) {
  try {
    localStorage.setItem(KEYS.SALONS, JSON.stringify(salons));
  } catch (e) {
    console.error('Storage error saving salons:', e);
  }
}

export function getEnquiries() {
  try {
    const stored = localStorage.getItem(KEYS.ENQUIRIES);
    return stored ? JSON.parse(stored) : DEFAULT_ENQUIRIES;
  } catch (e) {
    console.error('Storage error getting enquiries:', e);
    return DEFAULT_ENQUIRIES;
  }
}

export function saveEnquiries(enquiries) {
  try {
    localStorage.setItem(KEYS.ENQUIRIES, JSON.stringify(enquiries));
  } catch (e) {
    console.error('Storage error saving enquiries:', e);
  }
}

export function addEnquiry(enquiryData) {
  try {
    const current = getEnquiries();
    const newEnquiry = {
      id: enquiryData.referenceCode || `LUM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      referenceCode: enquiryData.referenceCode || `LUM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      name: enquiryData.name || 'Valued Client',
      email: enquiryData.email || '',
      phone: enquiryData.phone || '',
      location: enquiryData.location || '',
      scope: enquiryData.scope || 'Full Residence Kitchen',
      series: enquiryData.series || 'Minimalist Mono',
      budget: enquiryData.budget || '€100,000 – €250,000',
      salon: enquiryData.salon || 'London (Mayfair)',
      notes: enquiryData.notes || '',
      fileName: enquiryData.fileName || '',
      date: new Date().toISOString(),
      status: 'New'
    };
    const updated = [newEnquiry, ...current];
    saveEnquiries(updated);
    return newEnquiry;
  } catch (e) {
    console.error('Storage error adding enquiry:', e);
  }
}

export function updateEnquiryStatus(id, newStatus) {
  try {
    const enquiries = getEnquiries();
    const updated = enquiries.map((item) =>
      item.id === id || item.referenceCode === id ? { ...item, status: newStatus } : item
    );
    saveEnquiries(updated);
    return updated;
  } catch (e) {
    console.error('Storage error updating enquiry status:', e);
  }
}

export function deleteEnquiry(id) {
  try {
    const enquiries = getEnquiries();
    const updated = enquiries.filter((item) => item.id !== id && item.referenceCode !== id);
    saveEnquiries(updated);
    return updated;
  } catch (e) {
    console.error('Storage error deleting enquiry:', e);
  }
}

export async function hashPassword(plainTextPassword) {
  if (!plainTextPassword) return '';
  try {
    const msgUint8 = new TextEncoder().encode(plainTextPassword);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    // Fallback hashing for legacy browser environments
    let hash = 0;
    for (let i = 0; i < plainTextPassword.length; i++) {
      const char = plainTextPassword.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return 'h_' + Math.abs(hash).toString(16);
  }
}

export function getAdminPasscode() {
  try {
    return localStorage.getItem(KEYS.PASSCODE) || 'lumina2026';
  } catch (e) {
    return 'lumina2026';
  }
}

export function setAdminPasscode(newPasscode) {
  try {
    localStorage.setItem(KEYS.PASSCODE, newPasscode);
  } catch (e) {
    console.error('Storage error setting admin passcode:', e);
  }
}

export function resetToDefaults() {
  try {
    localStorage.removeItem(KEYS.COLLECTIONS);
    localStorage.removeItem(KEYS.CRAFT_STAGES);
    localStorage.removeItem(KEYS.SALONS);
    localStorage.removeItem(KEYS.ENQUIRIES);
    localStorage.removeItem(KEYS.PASSCODE);
    localStorage.removeItem('lumina_users');
    sessionStorage.removeItem('lumina_admin_authenticated');
    sessionStorage.removeItem('lumina_logged_in');
  } catch (e) {
    console.error('Storage error resetting defaults:', e);
  }
}
