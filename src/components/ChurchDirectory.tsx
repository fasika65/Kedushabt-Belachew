import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Phone, 
  Copy, 
  Check, 
  Map, 
  Building, 
  Navigation,
  ExternalLink,
  Compass,
  Filter
} from 'lucide-react';

interface ChurchItem {
  id: string;
  nameAm: string;
  nameEn: string;
  jurisdiction: 'Ethiopian' | 'Eritrean';
  city: string;
  state: string;
  address: string;
  phone?: string;
}

const CHURCHES_DATA: ChurchItem[] = [
  // Adelaide
  {
    id: 'adel-st-urael',
    nameAm: 'የደብረ ምሕረት ቅዱስ ዑራኤል የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን',
    nameEn: 'Debre Mihret St. Uriel Ethiopian Orthodox Tewahedo Church',
    jurisdiction: 'Ethiopian',
    city: 'Adelaide',
    state: 'South Australia',
    address: '12 Oban St, Ferryden Park SA 5010'
  },
  {
    id: 'adel-medhane-alem',
    nameAm: 'የደብረ መድኃኒት መድኃኒዓለም የኤርትራ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን',
    nameEn: 'Debre Medhanit Medhane Alem Eritrean OTC',
    jurisdiction: 'Eritrean',
    city: 'Adelaide',
    state: 'South Australia',
    address: '19 Kilkenny Rd, Woodville Park SA 5011'
  },
  // Melbourne
  {
    id: 'melb-medhane-alem',
    nameAm: 'ደብረ ሰላም መድኃኔዓለም የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን',
    nameEn: 'Debre Selam Medhanealem Ethiopian Orthodox Tewahedo Church',
    jurisdiction: 'Ethiopian',
    city: 'Melbourne',
    state: 'Victoria',
    address: '7-9 Navigator St, Maribyrnong VIC 3032'
  },
  {
    id: 'melb-tekle-haymanot',
    nameAm: 'ምዕራፈ ቅዱሳን አቡነ ተክለሃይማኖት የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን',
    nameEn: 'Mi\'erafe Kidusan Abune Teklehaymanot Ethiopian Orthodox Tewahdo Church',
    jurisdiction: 'Ethiopian',
    city: 'Melbourne',
    state: 'Victoria',
    address: '100 Olympia St, Tottenham VIC 3012',
    phone: '+61 455 503 898'
  },
  {
    id: 'melb-st-michael',
    nameAm: 'ደብረ ገነት ቅዱስ ሚካኤል የኢትዮጵያ ኦርቶዶክስ ቤተ ክርስቲያን',
    nameEn: 'Debre Genet St. Michael Ethiopian Orthodox Church',
    jurisdiction: 'Ethiopian',
    city: 'Melbourne',
    state: 'Victoria',
    address: '5 Grace Way, Ravenhall VIC 3023'
  },
  {
    id: 'melb-lemariam',
    nameAm: 'ልደታ ለማርያም የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን',
    nameEn: 'Lideta Lemariam Ethiopian Orthodox Church',
    jurisdiction: 'Ethiopian',
    city: 'Melbourne',
    state: 'Victoria',
    address: '4B Everaise Ct, Laverton North VIC 3026'
  },
  {
    id: 'melb-kidanemhret',
    nameAm: 'ገሊላዊት ኪዳነምሕረት የኤርትራ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን',
    nameEn: 'Gelilawit Kidanemhret Eritrean Orthodox Church',
    jurisdiction: 'Eritrean',
    city: 'Melbourne',
    state: 'Victoria',
    address: '5/17 Marshall St, Sunshine North VIC 3020'
  },
  // Perth
  {
    id: 'perth-gabriel-kidanemhret',
    nameAm: 'ደብረ ኃይል ቅዱስ ገብርኤል እና ኪዳነምሕረት ቤተ ክርስቲያን',
    nameEn: 'Debire Hayl Kidus Gabriel and Kidane Mhret',
    jurisdiction: 'Ethiopian',
    city: 'Perth',
    state: 'Western Australia',
    address: '6/23 Action Rd, Malaga WA 6090'
  },
  // Sydney
  {
    id: 'syd-st-mary',
    nameAm: 'ደብረ ጽዮን ቅድስት ማርያም የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን',
    nameEn: 'Debre Tsion St Mary Ethiopian Orthodox Church',
    jurisdiction: 'Ethiopian',
    city: 'Sydney',
    state: 'New South Wales',
    address: '37/15 Valediction Rd, Kings Park NSW 2148'
  },
  {
    id: 'syd-st-gabriel',
    nameAm: 'ቅዱስ ገብርኤል የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን',
    nameEn: 'St Gabriel Ethiopian Orthodox Tewehedo Church',
    jurisdiction: 'Ethiopian',
    city: 'Sydney',
    state: 'New South Wales',
    address: '55 Stoney Creek Road, Bexley NSW'
  },
  // Canberra
  {
    id: 'canb-trinity',
    nameAm: 'ደብረ ብርሃን ቅድስት ሥላሴ የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን',
    nameEn: 'Debre Berhan Holy Trinity Ethiopian Orthodox Church',
    jurisdiction: 'Ethiopian',
    city: 'Canberra',
    state: 'Australian Capital Territory',
    address: '21 Ningaloo Street, Harrison, ACT 2914',
    phone: '+61 414 637 321'
  },
  // Brisbane
  {
    id: 'brisb-st-george',
    nameAm: 'ቅዱስ ጊዮርጊስ የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን',
    nameEn: 'St. George Ethiopian Orthodox Tewahedo Church',
    jurisdiction: 'Ethiopian',
    city: 'Brisbane',
    state: 'Queensland',
    address: '15 Eric Cres, Annerley QLD 4105'
  },
  {
    id: 'brisb-st-gabriel',
    nameAm: 'ቅዱስ ገብርኤል የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን',
    nameEn: 'The Ethiopian Orthodox Tewahedo Archangel Gabriel Church',
    jurisdiction: 'Ethiopian',
    city: 'Brisbane',
    state: 'Queensland',
    address: 'Dinmore, Ipswich QLD 4303'
  },
  {
    id: 'brisb-eritrean-mary-michael',
    nameAm: 'ቅድስት ማርያም እና ቅዱስ ሚካኤል የኤርትራ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን',
    nameEn: 'St Mary & Archangel Michael Eritrean Orthodox Tewahedo Church',
    jurisdiction: 'Eritrean',
    city: 'Brisbane',
    state: 'Queensland',
    address: '3772–3774 Mount Lindesay Hwy, Park Ridge QLD 4125'
  }
];

export default function ChurchDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyAddress = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Get unique list of cities
  const cities = ['All', ...Array.from(new Set(CHURCHES_DATA.map(c => c.city)))];

  // Filter churches based on selected parameters
  const filteredChurches = CHURCHES_DATA.filter(church => {
    const matchesSearch = 
      church.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      church.nameAm.includes(searchQuery) ||
      church.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      church.city.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCity = selectedCity === 'All' || church.city === selectedCity;
    const matchesJurisdiction = selectedJurisdiction === 'All' || church.jurisdiction === selectedJurisdiction;

    return matchesSearch && matchesCity && matchesJurisdiction;
  });

  return (
    <div className="bg-white border border-brand-dark/15 p-4 sm:p-5 shadow-sm rounded-sm flex flex-col gap-4" id="church-directory-root">
      
      {/* Title Header */}
      <div className="flex flex-col gap-1 border-b border-brand-dark/10 pb-3" id="church-directory-header">
        <div className="flex items-center gap-2">
          <Building className="w-4.5 h-4.5 text-[#006732]" />
          <h3 className="font-serif font-black text-brand-dark text-base tracking-wide uppercase">
            የአብያተ ክርስቲያናት አድራሻ (አውስትራሊያ)
          </h3>
        </div>
        <span className="text-[10px] font-sans font-extrabold uppercase tracking-widest text-brand-dark/50 leading-none">
          EOTC & Eritrean Orthodox Church Directory (Australia)
        </span>
      </div>

      {/* Control Filters Bar */}
      <div className="flex flex-col gap-2.5" id="church-directory-filters">
        {/* Search */}
        <div className="relative flex items-center" id="church-search-wrapper">
          <Search className="absolute left-3 w-3.5 h-3.5 text-brand-dark/40" />
          <input
            type="text"
            placeholder="ፈልግ / Search Church, Address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-brand-bg/50 border border-brand-dark/10 focus:border-[#006732]/40 rounded-sm pl-9 pr-3 py-2 text-xs font-sans placeholder-brand-dark/40 text-brand-dark focus:outline-none transition-colors"
          />
        </div>

        {/* Category Pill Filters */}
        <div className="grid grid-cols-2 gap-2" id="church-filter-selectors">
          {/* City Selector */}
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-sans font-black uppercase text-brand-dark/50 tracking-wider">ከተማ / City</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-brand-bg/50 border border-brand-dark/10 text-brand-dark text-[10px] font-sans font-extrabold uppercase px-2 py-1.5 rounded-sm focus:outline-none focus:border-[#006732]/30 cursor-pointer w-full"
            >
              {cities.map(c => (
                <option key={c} value={c}>{c === 'All' ? 'ሁሉም / ALL CITIES' : c.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* Jurisdiction Selector */}
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-sans font-black uppercase text-brand-dark/50 tracking-wider">ቤተ ክርስቲያን / Jurisdiction</span>
            <select
              value={selectedJurisdiction}
              onChange={(e) => setSelectedJurisdiction(e.target.value)}
              className="bg-brand-bg/50 border border-brand-dark/10 text-brand-dark text-[10px] font-sans font-extrabold uppercase px-2 py-1.5 rounded-sm focus:outline-none focus:border-[#006732]/30 cursor-pointer w-full"
            >
              <option value="All">ሁሉም / ALL</option>
              <option value="Ethiopian">ኢትዮጵያ / ETHIOPIAN</option>
              <option value="Eritrean">ኤርትራ / ERITREAN</option>
            </select>
          </div>
        </div>
      </div>

      {/* Directory Cards list */}
      <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar" id="church-cards-list">
        <AnimatePresence initial={false}>
          {filteredChurches.length > 0 ? (
            filteredChurches.map((church) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                key={church.id}
                className="p-3.5 rounded-sm border border-brand-dark/10 bg-brand-bg/25 hover:bg-brand-bg/50 transition-colors flex flex-col gap-2"
                id={`church-card-${church.id}`}
              >
                {/* Header info */}
                <div className="flex flex-col gap-1">
                  {/* Jurisdiction tag */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[8px] font-sans font-extrabold tracking-wider uppercase px-1.5 py-0.5 rounded-sm bg-brand-dark/5 text-brand-dark/60">
                      {church.city} ({church.state.split(' ').map(w => w[0]).join('')})
                    </span>

                    {church.jurisdiction === 'Ethiopian' ? (
                      <span className="text-[8px] font-sans font-black uppercase text-[#006732] bg-[#006732]/5 border border-[#006732]/20 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                        የኢትዮጵያ / EOTC
                      </span>
                    ) : (
                      <span className="text-[8px] font-sans font-black uppercase text-amber-700 bg-amber-700/5 border border-amber-700/20 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                        የኤርትራ / Eritrean
                      </span>
                    )}
                  </div>

                  {/* Church Names */}
                  <h4 className="font-serif font-black text-brand-dark text-xs sm:text-[13px] tracking-wide mt-1 leading-snug">
                    {church.nameAm}
                  </h4>
                  <p className="font-sans font-semibold text-[10px] text-brand-dark/65 leading-tight">
                    {church.nameEn}
                  </p>
                </div>

                {/* Details (Address & Phone) */}
                <div className="flex flex-col gap-1.5 mt-1 pt-1.5 border-t border-brand-dark/5 text-[11px] font-sans text-brand-dark/80">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-dark/45 shrink-0 mt-0.5" />
                    <span className="leading-tight text-brand-dark/90 font-medium">{church.address}</span>
                  </div>

                  {church.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#006732]/70 shrink-0" />
                      <a 
                        href={`tel:${church.phone.replace(/\s+/g, '')}`} 
                        className="font-mono text-[10px] font-bold text-[#006732] hover:underline"
                        title="Click to Call"
                      >
                        {church.phone}
                      </a>
                    </div>
                  )}
                </div>

                {/* Interactive Action buttons */}
                <div className="flex gap-2 mt-1.5 pt-1.5 border-t border-brand-dark/5" id={`church-actions-${church.id}`}>
                  {/* Copy Address */}
                  <button
                    onClick={() => handleCopyAddress(church.id, church.address)}
                    className="flex-1 py-1 px-2 border border-brand-dark/10 hover:border-brand-dark/20 rounded-sm bg-white hover:bg-brand-bg/50 text-[9px] font-sans font-extrabold uppercase tracking-wider text-brand-dark/70 hover:text-brand-dark inline-flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedId === church.id ? (
                      <>
                        <Check className="w-3 h-3 text-[#006732]" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Address</span>
                      </>
                    )}
                  </button>

                  {/* Open in Google Maps */}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${church.nameEn}, ${church.address}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-1 px-2 border border-[#006732]/10 hover:border-[#006732]/30 rounded-sm bg-white hover:bg-[#006732]/5 text-[9px] font-sans font-extrabold uppercase tracking-wider text-[#006732] inline-flex items-center justify-center gap-1 transition-colors"
                    title="Open in Google Maps"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>View Map</span>
                  </a>
                </div>

              </motion.div>
            ))
          ) : (
            <div className="py-8 text-center flex flex-col items-center justify-center gap-2 text-brand-dark/40" id="no-churches-found">
              <Compass className="w-7 h-7 stroke-[1.5]" />
              <div className="flex flex-col">
                <span className="text-xs font-serif font-black">አድራሻ አልተገኘም</span>
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider mt-0.5">No Churches Match Filters</span>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
