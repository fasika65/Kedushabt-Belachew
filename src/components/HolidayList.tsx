import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Holiday } from '../types';
import { 
  getHolidays, 
  ETHIOPIAN_MONTHS, 
  GREGORIAN_MONTHS, 
  convertEthiopianToGregorian,
  convertGregorianToEthiopian,
  formatEthiopianDateFull,
  formatGregorianDateFull
} from '../utils/calendar';
import { Search, Sparkles, Globe, Compass, X, BookOpen, ExternalLink } from 'lucide-react';

interface HolidayDetailContent {
  origin: string;
  significance: string;
}

const HOLIDAY_DETAILS_DB: Record<string, HolidayDetailContent> = {
  "Enkutatash": {
    origin: "Observed on Meskerem 1 (Sept 11 or 12). Represents the Ethiopian New Year ('gift of jewels,' commemorating the Queen of Sheba's return from King Solomon) and Kidus Yohannes (St. John the Baptist) as the herald of a new era of grace.",
    significance: "Celebrates the end of the rainy season, harvesting, blooming of golden yellow Adey Abeba flowers, and commemorates St. John's role in baptizing and announcing Christ."
  },
  "Meskel": {
    origin: "Celebrated on Meskerem 17 (Sept 27 or 28), commemorating the Finding of the True Cross by Roman Empress Helena in the 4th century.",
    significance: "Features the burning of a massive Demera bonfire in public squares, accompanied by special liturgical songs and dances by priests in colorful vestments. Inscribed in UNESCO's Intangible Cultural Heritage list."
  },
  "Be'ata": {
    origin: "Observed on Tahsas 3 (Dec 12), commemorating the entry of the Blessed Virgin Mary into the Holy Temple in Jerusalem at the age of three.",
    significance: "An important feast of St. Mary, marking her dedication to prayer and divine service in the Holy of Holies."
  },
  "Lidet": {
    origin: "Celebrated on Tahsas 29 (Jan 7) or Tahsas 28 in leap years, commemorating the Nativity of Jesus Christ.",
    significance: "Preceded by the 43-day Advent fast (Tsome Nebiyat). Celebrated with overnight liturgies starting at midnight, traditional white attire, family feasting on Doro Wat, and Gena hockey game."
  },
  "Gezret": {
    origin: "Observed on Ter 6 (Jan 14), commemorating the Circumcision of Jesus Christ on the eighth day according to Mosaic law.",
    significance: "Affirms Christ's fulfillment of the Old Covenant law and His true human embodiment."
  },
  "Timkat": {
    origin: "Celebrated on Ter 11 (Jan 19), commemorating the Baptism of Jesus Christ in the Jordan River by John the Baptist.",
    significance: "The most spectacular festival where holy Tabots are carried in grand processions to water sources, overnight vigils are held, and the waters are blessed for sprinkling. UNESCO inscribed."
  },
  "Kana Ze-Galila": {
    origin: "Observed on Ter 12 (Jan 20), celebrating Christ's first miracle of turning water into wine at the wedding in Cana of Galilee.",
    significance: "Highlights Christ's blessing of holy marriage and the intercession of His mother, the Holy Virgin Mary."
  },
  "Adwa Victory Day": {
    origin: "Commemorates the historic Battle of Adwa on March 2, 1896 (Yekatit 23), where Ethiopian forces decisively defeated invading Italian colonial troops.",
    significance: "A landmark moment of pan-African pride and sovereignty, signifying Ethiopia's success in remaining the only African nation to defend its independence against European colonization."
  },
  "Patriots' Victory Day": {
    origin: "Commemorates May 5, 1941 (Miazia 27), marking the end of the five-year Italian fascist occupation and the return of Emperor Haile Selassie to Addis Ababa.",
    significance: "Honors the bravery of Ethiopian patriots (Arbegnoch) who fought a heroic guerrilla campaign to liberate the country."
  },
  "Downfall of the Derg": {
    origin: "Commemorates May 28, 1991 (Ginbot 20), when the coalition forces of the EPRDF captured Addis Ababa, ending the brutal 17-year Communist military dictatorship.",
    significance: "Observed as Ethiopia's National Day, marking the restoration of democratic rights and federal governance."
  },
  "Debre Tabor": {
    origin: "Observed on Nehase 13 (Aug 19), commemorating the Transfiguration of Jesus Christ on Mount Tabor before Peter, James, and John.",
    significance: "Popularly known as Buhe. Children gather in neighborhoods cracking whips to symbolize shepherd watchmen, and receive traditional Mulmul bread."
  },
  "Filseta": {
    origin: "Observed from Nehase 1 to 15, celebrating the Assumption and Resurrection of the Virgin Mary into heaven.",
    significance: "Preceded by a beloved 15-day strict vegan fast. Liturgies are sung continuously, and families celebrate the feast with high joy on Nehase 16."
  },
  "Hosanna": {
    origin: "A movable Sunday feast, celebrating Christ's triumphal entry into Jerusalem on Palm Sunday.",
    significance: "Priests distribute blessed palm leaves that are woven into rings and worn on the foreheads of worshippers, chanting 'Hosanna in the highest!'"
  },
  "Siklet": {
    origin: "A movable Friday feast, commemorating the crucifixion, passion, and death of Jesus Christ on the cross.",
    significance: "A day of total fasting and profound quietude. Faithful perform hundreds of prostrations (Sigdet) in churches in repentance."
  },
  "Tinsae": {
    origin: "The movable Easter Sunday feast, celebrating the glorious Resurrection of Jesus Christ from the dead.",
    significance: "The absolute pinnacle of the EOTC calendar. Concludes the 55-day Great Lent. Celebrated after midnight Vigil with family gatherings, traditional bread, and slaughter of livestock."
  },
  "Debre Zeyt": {
    origin: "Observed on the fifth Sunday of the Great Lent, commemorating Christ's prophecies regarding His Second Coming on the Mount of Olives.",
    significance: "Serves as a solemn reminder of spiritual vigilance and the ultimate return of Christ."
  },
  "Erget": {
    origin: "Observed on a Thursday 40 days after Easter, commemorating Christ's physical Ascension into heaven.",
    significance: "Celebrates Christ's triumph and the promise of His return in glory."
  },
  "Paraklitos": {
    origin: "Observed on a Sunday 50 days after Easter, commemorating the descent of the Holy Spirit upon the Apostles.",
    significance: "Marks the birth of the Christian Church and the gift of the Holy Spirit."
  },
  "Eid al-Fitr": {
    origin: "The Islamic festival marking the end of the month-long Ramadan fasting.",
    significance: "In Ethiopia, celebrated with grand stadium prayers, traditional sweets, and generous charitable acts to support the community."
  },
  "Eid al-Adha": {
    origin: "The Feast of Sacrifice, honoring the obedience of Prophet Ibrahim to sacrifice his son.",
    significance: "Celebrated with family gatherings and sharing of slaughtered meat with neighbors and those in need."
  },
  "Mawlid": {
    origin: "Commemorates the birth of the Prophet Muhammad.",
    significance: "Marked by spiritual recitations, charity, and gatherings in historic Islamic hubs like Harar."
  },
  "Workers' Day": {
    origin: "An international celebration of labor achievements observed on May 1.",
    significance: "Ethiopia observes it nationally to honor workers' contributions to society."
  },
  "Saint George": {
    origin: "Observed on Miyazia 23 (May 1), celebrating the life, trials, and martyrdom of Saint George. Preceded by his seven-year trial where King Dudianos and seventy pagan kings subjected him to extreme tortures, through which Christ raised him from the dead three times.",
    significance: "Commemorates the power of the Holy Cross through which he slew the dragon in Beirut, and celebrates the divine Covenant (Kidane) given to him by Jesus Christ, promising salvation and relief to all who call upon his name in distress."
  }
};

function getDetailsForHoliday(hName: string): HolidayDetailContent {
  const matched = HOLIDAY_DETAILS_DB[hName];
  if (matched) return matched;

  for (const key of Object.keys(HOLIDAY_DETAILS_DB)) {
    if (hName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(hName.toLowerCase())) {
      return HOLIDAY_DETAILS_DB[key];
    }
  }

  return {
    origin: `Observed annually in the Ethiopian liturgical or national calendar to celebrate important spiritual, cultural, or historical events.`,
    significance: `An official day of rest, spiritual reflection, or national pride, celebrating traditional heritage.`
  };
}

interface HolidayListProps {
  currentYear: number;
  onSelectHolidayDate: (date: Date) => void;
  ausState?: string;
}

function getHolidayGregorianDate(h: Holiday, gy: number): Date {
  if (h.date.gregorian) {
    return new Date(gy, h.date.gregorian.month - 1, h.date.gregorian.day);
  }
  if (h.date.ethiopian) {
    const ey = h.date.ethiopian.month <= 4 ? gy - 7 : gy - 8;
    return convertEthiopianToGregorian(ey, h.date.ethiopian.month, h.date.ethiopian.day);
  }
  return new Date();
}

export default function HolidayList({
  currentYear,
  onSelectHolidayDate,
  ausState,
}: HolidayListProps) {
  const [filterType, setFilterType] = useState<'all' | 'major_feast' | 'minor_feast' | 'national'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDetailHoliday, setSelectedDetailHoliday] = useState<any | null>(null);

  const resolvedHolidays = useMemo(() => {
    const list = getHolidays(currentYear, ausState);
    return list.map((h) => {
      const gDate = getHolidayGregorianDate(h, currentYear);
      return {
        ...h,
        gregorianDate: gDate,
      };
    }).sort((a, b) => a.gregorianDate.getTime() - b.gregorianDate.getTime());
  }, [currentYear]);

  const filteredHolidays = useMemo(() => {
    return resolvedHolidays.filter((h) => {
      if (filterType !== 'all' && h.category !== filterType) return false;

      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = h.name.toLowerCase().includes(query);
        const matchesLocal = h.localName?.toLowerCase().includes(query) || false;
        const matchesDesc = h.description?.toLowerCase().includes(query) || false;
        return matchesName || matchesLocal || matchesDesc;
      }

      return true;
    });
  }, [resolvedHolidays, filterType, searchQuery]);

  const formatHolidayDate = (date: Date) => {
    const day = date.getDate();
    const month = GREGORIAN_MONTHS[date.getMonth()].slice(0, 3);
    return { day, month };
  };

  return (
    <div className="flex flex-col gap-4 w-full bg-white border border-brand-dark/15 p-4 sm:p-5 md:p-6 shadow-sm rounded-sm" id="holiday-list-component">
      {/* Header */}
      <div className="flex flex-col gap-1.5" id="holiday-list-header">
        <h3 className="text-xs uppercase tracking-[0.25em] font-sans font-black text-brand-dark flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#D1A110]" /> Feast & National Holiday Explorer ({currentYear})
        </h3>
        <p className="text-xs text-brand-dark/60 font-sans">
          Browse and jump to major movable feasts, minor liturgical days, and national holidays.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1 bg-brand-bg/50 p-1 border border-brand-dark/10 rounded-sm" id="holiday-filter-tabs">
        <button
          id="filter-all-btn"
          onClick={() => setFilterType('all')}
          className={`flex-1 text-center py-2 px-1 text-[9px] uppercase tracking-wider font-sans font-black rounded-sm transition-all cursor-pointer
            ${filterType === 'all'
              ? 'bg-[#006732] text-white shadow-sm'
              : 'text-brand-dark/50 hover:text-brand-dark'}
          `}
        >
          All
        </button>
        <button
          id="filter-major-btn"
          onClick={() => setFilterType('major_feast')}
          className={`flex-1 text-center py-2 px-1 text-[9px] uppercase tracking-wider font-sans font-black rounded-sm transition-all cursor-pointer
            ${filterType === 'major_feast'
              ? 'bg-[#EF3340] text-white shadow-sm'
              : 'text-brand-dark/50 hover:text-brand-dark'}
          `}
        >
          Major Feasts
        </button>
        <button
          id="filter-minor-btn"
          onClick={() => setFilterType('minor_feast')}
          className={`flex-1 text-center py-2 px-1 text-[9px] uppercase tracking-wider font-sans font-black rounded-sm transition-all cursor-pointer
            ${filterType === 'minor_feast'
              ? 'bg-[#D1A110] text-brand-dark shadow-sm'
              : 'text-brand-dark/50 hover:text-brand-dark'}
          `}
        >
          Minor Feasts
        </button>
        <button
          id="filter-national-btn"
          onClick={() => setFilterType('national')}
          className={`flex-1 text-center py-2 px-1 text-[9px] uppercase tracking-wider font-sans font-black rounded-sm transition-all cursor-pointer
            ${filterType === 'national'
              ? 'bg-brand-dark text-white shadow-sm'
              : 'text-brand-dark/50 hover:text-brand-dark'}
          `}
        >
          National
        </button>
      </div>

      {/* Search */}
      <div className="relative" id="holiday-search-container">
        <input
          id="holiday-search-input"
          type="text"
          placeholder="Search feasts, historical milestones..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-brand-bg/50 border border-brand-dark/15 focus:border-[#D1A110] rounded-sm px-3.5 py-2.5 text-xs font-bold text-brand-dark placeholder-brand-dark/40 transition-colors focus:outline-none"
        />
      </div>

      {/* List */}
      <div className="flex flex-col gap-2 max-h-[380px] overflow-y-auto pr-1 select-none" id="holiday-items-list">
        {filteredHolidays.length > 0 ? (
          filteredHolidays.map((h, idx) => {
            const { day, month } = formatHolidayDate(h.gregorianDate);
            const isMajorOrNational = h.category === 'major_feast' || h.category === 'national';
            return (
              <button
                key={`${h.id}-${idx}`}
                id={`holiday-list-item-${h.id}`}
                onClick={() => setSelectedDetailHoliday(h)}
                className={`w-full flex items-center gap-3.5 p-3 rounded-sm border text-left transition-all duration-200 cursor-pointer active:scale-[0.99] group
                  ${isMajorOrNational
                    ? 'border-[#EF3340]/10 bg-white hover:border-[#EF3340]/35'
                    : 'border-[#D1A110]/10 bg-white hover:border-[#D1A110]/35'}
                `}
              >
                {/* Date Badge */}
                <div
                  className={`flex flex-col items-center justify-center w-11 h-11 rounded-sm shrink-0 font-sans border
                    ${isMajorOrNational
                      ? 'bg-[#EF3340]/5 text-[#EF3340] border-[#EF3340]/15 group-hover:bg-[#EF3340] group-hover:text-white group-hover:border-[#EF3340]'
                      : 'bg-[#D1A110]/5 text-[#D1A110] border-[#D1A110]/15 group-hover:bg-[#D1A110] group-hover:text-white group-hover:border-[#D1A110]'}
                    transition-all duration-200
                  `}
                >
                  <span className="text-[10px] font-black uppercase tracking-tight leading-none">{month}</span>
                  <span className="text-sm font-bold leading-none mt-0.5">{day}</span>
                </div>

                {/* Info */}
                <div className="flex flex-col gap-0.5 overflow-hidden flex-1" id={`holiday-list-item-info-${h.id}`}>
                  <div className="flex items-center gap-1.5" id={`holiday-list-item-title-row-${h.id}`}>
                    <span className="font-serif font-black text-sm text-brand-dark leading-tight group-hover:text-black truncate">
                      {h.name}
                    </span>
                  </div>
                  {h.localName && (
                    <span className="text-[10px] font-semibold text-[#006732] truncate font-sans">
                      {h.localName}
                    </span>
                  )}
                  {h.date.ethiopian && (
                    <span className="text-[9px] font-bold text-brand-dark/40 font-sans">
                      Falls on {ETHIOPIAN_MONTHS[h.date.ethiopian.month - 1].name} {h.date.ethiopian.day}
                    </span>
                  )}
                </div>
              </button>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center text-brand-dark/40" id="no-filtered-holidays">
            <Search className="w-8 h-8 text-brand-dark/30 mb-2" />
            <span className="text-xs font-semibold">No holidays found matching query.</span>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedDetailHoliday && (() => {
          const h = selectedDetailHoliday;
          const details = getDetailsForHoliday(h.name);
          const ethDate = convertGregorianToEthiopian(h.gregorianDate);
          const formattedGregorian = formatGregorianDateFull(h.gregorianDate);
          const formattedEthiopian = formatEthiopianDateFull(ethDate.year, ethDate.month, ethDate.day);
          const isMajorOrNational = h.category === 'major_feast' || h.category === 'national';

          return (
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/60 backdrop-blur-sm"
              id="holiday-detail-modal-backdrop"
              onClick={() => setSelectedDetailHoliday(null)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 15, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 15, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-lg bg-white border border-brand-dark/15 shadow-2xl rounded-sm overflow-hidden flex flex-col"
                id="holiday-detail-modal-card"
              >
                {/* Visual Top Ribbon */}
                <div className="w-full flex h-1.5 overflow-hidden" id="modal-ethiopia-strip">
                  <div className="flex-1 bg-[#006732]" />
                  <div className="flex-1 bg-[#D1A110]" />
                  <div className="flex-1 bg-[#EF3340]" />
                </div>

                {/* Close */}
                <button
                  id="modal-close-btn"
                  onClick={() => setSelectedDetailHoliday(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-brand-bg/60 border border-transparent hover:border-brand-dark/10 text-brand-dark/50 hover:text-brand-dark transition-all duration-200 cursor-pointer z-10"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Content */}
                <div className="p-6 sm:p-7 flex flex-col gap-5 max-h-[85vh] overflow-y-auto">
                  <div className="flex items-center gap-2" id="modal-meta-row">
                    <span 
                      className={`text-[8px] sm:text-[9px] uppercase tracking-wider font-sans font-black px-2 py-0.5 rounded-full border
                        ${isMajorOrNational 
                          ? 'bg-[#EF3340]/10 text-[#EF3340] border-[#EF3340]/15' 
                          : 'bg-[#D1A110]/10 text-[#D1A110] border-[#D1A110]/15'}
                      `}
                    >
                      {h.category.replace('_', ' ')}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider font-sans font-bold text-brand-dark/40 flex items-center gap-1">
                      Ethiopian Liturgical Calendar
                    </span>
                  </div>

                  <div className="flex flex-col gap-1" id="modal-title-block">
                    <h2 className="font-serif font-black text-2xl sm:text-3xl text-brand-dark leading-tight tracking-tight">
                      {h.name}
                    </h2>
                    {h.localName && (
                      <span className="text-xs sm:text-sm font-sans font-bold text-[#006732] tracking-wide">
                        {h.localName}
                      </span>
                    )}
                  </div>

                  {/* Dual Calendar Date Display */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-brand-bg/40 border border-brand-dark/10 rounded-sm" id="modal-dual-dates">
                    <div className="flex flex-col gap-1" id="modal-gregorian-date-col">
                      <span className="text-[9px] uppercase font-sans font-black tracking-widest text-brand-dark/40 flex items-center gap-1">
                        <Globe className="w-3 h-3 text-brand-dark/30" /> Gregorian Date
                      </span>
                      <span className="text-xs font-sans font-bold text-brand-dark">
                        {formattedGregorian}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1 border-t sm:border-t-0 sm:border-l border-brand-dark/10 pt-3 sm:pt-0 sm:pl-4" id="modal-ethiopian-date-col">
                      <span className="text-[9px] uppercase font-sans font-black tracking-widest text-brand-dark/40 flex items-center gap-1">
                        <Compass className="w-3 h-3 text-brand-dark/30" /> Ethiopian Date
                      </span>
                      <span className="text-xs font-sans font-bold text-[#006732]">
                        {formattedEthiopian}
                      </span>
                    </div>
                  </div>

                  {/* Descriptions */}
                  <div className="flex flex-col gap-4 text-xs" id="modal-content-details">
                    {h.description && (
                      <div className="p-4 rounded-sm bg-[#D1A110]/5 border border-[#D1A110]/20 text-brand-dark/90 italic font-serif">
                        "{h.description}"
                      </div>
                    )}

                    {/* Origin */}
                    <div className="flex flex-col gap-1" id="modal-origin-section">
                      <h4 className="text-[10px] uppercase tracking-widest font-sans font-black text-brand-dark flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-brand-dark/40" /> Historical Origin & Liturgy
                      </h4>
                      <p className="text-brand-dark/80 leading-relaxed font-sans pl-5 text-[11px] sm:text-xs">
                        {details.origin}
                      </p>
                    </div>

                    {/* Traditions */}
                    <div className="flex flex-col gap-1" id="modal-significance-section">
                      <h4 className="text-[10px] uppercase tracking-widest font-sans font-black text-brand-dark flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-brand-dark/40" /> Traditions & Celebration
                      </h4>
                      <p className="text-brand-dark/80 leading-relaxed font-sans pl-5 text-[11px] sm:text-xs">
                        {details.significance}
                      </p>
                    </div>
                  </div>

                  {/* Dismiss / Jump Actions */}
                  <div className="flex items-center justify-end gap-3 border-t border-brand-dark/10 pt-4 mt-2" id="modal-actions-bar">
                    <button
                      id="modal-cancel-btn"
                      onClick={() => setSelectedDetailHoliday(null)}
                      className="px-4 py-2.5 text-[10px] uppercase tracking-wider font-sans font-bold text-brand-dark/60 hover:text-brand-dark hover:bg-brand-bg/60 border border-brand-dark/10 rounded-sm cursor-pointer transition-all duration-200"
                    >
                      Dismiss
                    </button>
                    <button
                      id="modal-navigate-btn"
                      onClick={() => {
                        onSelectHolidayDate(h.gregorianDate);
                        setSelectedDetailHoliday(null);
                      }}
                      className="px-5 py-2.5 text-[10px] uppercase tracking-wider font-sans font-black rounded-sm text-white shadow-md bg-[#006732] hover:bg-[#006732]/95 flex items-center gap-1.5 transition-all duration-200 cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Jump to Date
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
