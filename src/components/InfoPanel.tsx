import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CalendarDay, CalendarMode } from '../types';
import {
  ETHIOPIAN_MONTHS,
  GREGORIAN_MONTHS,
  formatEthiopianDateFull,
  formatGregorianDateFull,
  convertGregorianToEthiopian,
  convertEthiopianToGregorian,
  getEvangelistInfo,
} from '../utils/calendar';
import { Calendar, Globe, Sparkles, RefreshCw, Info, CalendarCheck, BookOpen, Download } from 'lucide-react';

interface InfoPanelProps {
  selectedDay: CalendarDay | null;
  onJumpToDate: (date: Date) => void;
  onJumpToEthDate: (ey: number, em: number, ed: number) => void;
  onOpenExportModal?: () => void;
}

export default function InfoPanel({
  selectedDay,
  onJumpToDate,
  onJumpToEthDate,
  onOpenExportModal,
}: InfoPanelProps) {
  // Converter States
  const [convDirection, setConvDirection] = useState<'g2e' | 'e2g'>('g2e');
  
  // Gregorian Inputs
  const [gYear, setGYear] = useState<number>(new Date().getFullYear());
  const [gMonth, setGMonth] = useState<number>(new Date().getMonth() + 1); // 1-12
  const [gDay, setGDay] = useState<number>(new Date().getDate());
  
  // Ethiopian Inputs
  const [eYear, setEYear] = useState<number>(2019);
  const [eMonth, setEMonth] = useState<number>(8); // Miazia
  const [eDay, setEDay] = useState<number>(24);

  // Conversion Results
  const [g2eResult, setG2EResult] = useState<string>('');
  const [e2gResult, setE2GResult] = useState<string>('');

  // Update converter inputs if selected day changes
  useEffect(() => {
    if (selectedDay) {
      setGYear(selectedDay.gregorianYear);
      setGMonth(selectedDay.gregorianMonth + 1);
      setGDay(selectedDay.gregorianDay);

      setEYear(selectedDay.ethiopianYear);
      setEMonth(selectedDay.ethiopianMonth);
      setEDay(selectedDay.ethiopianDay);
    }
  }, [selectedDay]);

  // Handle conversion live
  useEffect(() => {
    if (convDirection === 'g2e') {
      try {
        const date = new Date(gYear, gMonth - 1, gDay);
        if (date.getFullYear() === gYear && date.getMonth() === gMonth - 1 && date.getDate() === gDay) {
          const { year, month, day } = convertGregorianToEthiopian(date);
          const monthInfo = ETHIOPIAN_MONTHS[month - 1];
          setG2EResult(`${monthInfo.name} (${monthInfo.amharicName}) ${day}, ${year} E.C.`);
        } else {
          setG2EResult('Invalid Gregorian Date');
        }
      } catch (e) {
        setG2EResult('Invalid Gregorian Date');
      }
    } else {
      try {
        const isLeap = eYear % 4 === 3;
        const maxDays = eMonth === 13 ? (isLeap ? 6 : 5) : 30;
        if (eDay > maxDays || eDay < 1) {
          setE2GResult(`Invalid Ethiopian Date (Pagume has ${maxDays} days in ${eYear})`);
          return;
        }

        const date = convertEthiopianToGregorian(eYear, eMonth, eDay);
        setE2GResult(formatGregorianDateFull(date));
      } catch (e) {
        setE2GResult('Invalid Ethiopian Date');
      }
    }
  }, [convDirection, gYear, gMonth, gDay, eYear, eMonth, eDay]);

  const getDaysInGregMonth = (y: number, m: number) => {
    return new Date(y, m, 0).getDate();
  };

  const currentMaxGDays = getDaysInGregMonth(gYear, gMonth);
  const currentMaxEDays = eMonth === 13 ? (eYear % 4 === 3 ? 6 : 5) : 30;

  const handleJumpFromConverter = () => {
    if (convDirection === 'g2e') {
      const d = new Date(gYear, gMonth - 1, gDay);
      onJumpToDate(d);
    } else {
      onJumpToEthDate(eYear, eMonth, eDay);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full" id="info-panel-container">
      {/* 1. Date Card Details */}
      <AnimatePresence mode="wait">
        {selectedDay && (
          <motion.div
            key={selectedDay.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            id="selected-day-details-card"
            className="bg-white text-brand-dark border border-brand-dark/15 p-4 sm:p-5 md:p-6 flex flex-col gap-4 sm:gap-5 relative overflow-hidden shadow-sm rounded-sm"
          >
            <div className="flex justify-between items-center z-10 flex-wrap gap-2" id="card-top-section">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#D1A110]/10 text-[#D1A110] text-[10px] uppercase tracking-widest font-sans font-black rounded-sm border border-[#D1A110]/20">
                <Sparkles className="w-3 h-3 text-[#D1A110]" /> Selected Day Insights
              </span>
              <div className="flex items-center gap-2">
                {onOpenExportModal && (
                  <button
                    type="button"
                    id="info-panel-export-ics-btn"
                    onClick={onOpenExportModal}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-bg hover:bg-[#006732] hover:text-white border border-brand-dark/15 hover:border-[#006732] text-brand-dark/80 text-[10px] uppercase font-sans font-black rounded-sm transition-all cursor-pointer shadow-2xs"
                    title="Export events to .ics"
                  >
                    <Download className="w-3 h-3 text-[#006732] group-hover:text-white" />
                    <span>Export .ICS</span>
                  </button>
                )}
                <span className="text-[10px] uppercase tracking-widest font-sans font-black text-brand-dark/60">
                  የቀን መረጃዎች
                </span>
              </div>
            </div>

            {/* Calendars comparison */}
            <div className="flex flex-col gap-4 z-10" id="calendars-dates-comparison">
              {/* Daily Saint/Angel Commemoration - highly prominent */}
              {selectedDay.monthlyCommemoration && (
                <div className="flex items-start gap-3 border-b border-brand-dark/10 pb-4" id="commemoration-selection-row">
                  <div className="p-2.5 bg-[#D1A110]/5 text-[#D1A110] rounded-sm border border-[#D1A110]/15 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest font-sans font-black text-brand-dark/40 mb-0.5">
                      Monthly Commemoration (የዕለቱ ቅዱስ መታሰቢያ)
                    </span>
                    <span className="text-lg sm:text-xl font-serif font-black leading-tight text-brand-dark">
                      {selectedDay.monthlyCommemoration.amharicName}
                    </span>
                    <span className="text-xs font-semibold text-brand-dark/60 font-sans mt-0.5">
                      {selectedDay.monthlyCommemoration.name}
                    </span>
                  </div>
                </div>
              )}

              {/* Gregorian Details */}
              <div className="flex items-start gap-3 border-b border-brand-dark/10 pb-4" id="gregorian-selection-row">
                <div className="p-2.5 bg-sky-50 text-sky-600 rounded-sm border border-sky-100 mt-0.5">
                  <Globe className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest font-sans font-black text-brand-dark/40 mb-0.5">
                    Gregorian Calendar (የፈረንጆች አቆጣጠር)
                  </span>
                  <span className="text-lg font-serif font-black leading-tight text-brand-dark">
                    {formatGregorianDateFull(selectedDay.gregorianDate)}
                  </span>
                </div>
              </div>

              {/* Ethiopian Details */}
              <div className="flex items-start gap-3" id="ethiopian-selection-row">
                <div className="p-2.5 bg-[#006732]/5 text-[#006732] rounded-sm border border-[#006732]/10 mt-0.5">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest font-sans font-black text-brand-dark/40 mb-0.5 flex items-center gap-1.5">
                    Ethiopian Calendar <span className="text-[8px] bg-[#006732]/10 text-[#006732] px-1.5 py-0.2 rounded-sm font-sans font-bold uppercase">Ge'ez</span>
                  </span>
                  <span className="text-lg font-serif font-black leading-tight text-[#006732]">
                    {formatEthiopianDateFull(
                      selectedDay.ethiopianYear,
                      selectedDay.ethiopianMonth,
                      selectedDay.ethiopianDay
                    )}
                  </span>
                </div>
              </div>

              {/* Year Cycle & Chronology Insights */}
              {(() => {
                const evInfo = getEvangelistInfo(selectedDay.ethiopianYear);
                return (
                  <div className="mt-2 pt-4 border-t border-brand-dark/10 flex flex-col gap-3" id="evangelist-chronology-section">
                    <div className="flex items-center gap-1.5" id="evangelist-header-badge">
                      <BookOpen className="w-3.5 h-3.5 text-[#006732]" />
                      <span className="text-[10px] font-sans font-black text-[#006732] uppercase tracking-wider">
                        Year Cycle & Era (የዘመናት ዑደትና ዓመተ ዓለም)
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3" id="evangelist-details-grid">
                      <div className="p-2.5 bg-brand-bg/60 border border-brand-dark/10 rounded-sm flex flex-col gap-0.5" id="evangelist-name-card">
                        <span className="text-[9px] font-sans font-black text-brand-dark/40 uppercase tracking-wider leading-none">
                          Year Evangelist (ወንጌላዊ)
                        </span>
                        <span className="font-serif font-black text-xs sm:text-sm text-brand-dark mt-1">
                          {evInfo.nameAm}
                        </span>
                        <span className="text-[9px] font-bold text-brand-dark/60 leading-none">
                          {evInfo.nameEn}
                        </span>
                      </div>

                      <div className="p-2.5 bg-brand-bg/60 border border-brand-dark/10 rounded-sm flex flex-col gap-0.5" id="amete-alem-card">
                        <span className="text-[9px] font-sans font-black text-brand-dark/40 uppercase tracking-wider leading-none">
                          World Era (ዓመተ ዓለም)
                        </span>
                        <span className="font-serif font-black text-xs sm:text-sm text-[#006732] mt-1">
                          {evInfo.ameteAlem} ዓ.ዓ
                        </span>
                        <span className="text-[9px] font-bold text-brand-dark/60 leading-none">
                          {evInfo.ameteAlem} World Era
                        </span>
                      </div>
                    </div>

                    {/* Calculation and Significance */}
                    <div className="p-3 bg-amber-500/[0.02] border border-amber-500/15 rounded-sm flex flex-col gap-2" id="evangelist-math-significance">
                      <div className="flex flex-col gap-0.5" id="evangelist-computus-formula">
                        <span className="text-[8px] font-sans font-black text-amber-700 uppercase tracking-widest leading-none">
                          Computus Formula (የስሌት ቀመር)
                        </span>
                        <div className="flex flex-wrap items-baseline gap-1 mt-1 text-[11px]">
                          <span className="font-bold text-brand-dark">Evangelist:</span>
                          <code className="bg-white border border-brand-dark/10 px-1.5 py-0.5 rounded-sm font-mono text-[9px] text-brand-dark/90">
                            {evInfo.formula}
                          </code>
                        </div>
                        <div className="flex flex-wrap items-baseline gap-1 mt-1 text-[11px]">
                          <span className="font-black text-brand-dark">World Era:</span>
                          <code className="bg-white border border-brand-dark/10 px-1.5 py-0.5 rounded-sm font-mono text-[9px] text-brand-dark/90">
                            {evInfo.ameteAlemFormula}
                          </code>
                        </div>
                      </div>

                      <div className="border-t border-brand-dark/5 pt-2 flex flex-col gap-1" id="evangelist-description-group">
                        <span className="text-[8px] font-sans font-black text-[#006732] uppercase tracking-widest leading-none">
                          Significance & Characteristics (ትርጉምና ባህሪ)
                        </span>
                        <p className="text-justify text-[11px] font-serif font-black text-brand-dark/90 leading-snug mt-0.5">
                          {evInfo.descriptionAm}
                        </p>
                        <p className="text-justify text-[10px] font-sans font-medium text-brand-dark/70 leading-normal">
                          {evInfo.descriptionEn}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Today's Holidays & Fasting Days on Selection */}
      <div className="bg-white border border-brand-dark/15 p-4 sm:p-5 md:p-6 flex flex-col gap-4 shadow-sm rounded-sm" id="holidays-detail-section">
        <h3 className="text-xs uppercase tracking-[0.25em] font-sans font-black text-brand-dark flex items-center gap-1.5 border-b border-brand-dark/5 pb-2">
          <CalendarCheck className="w-4 h-4 text-brand-dark/40" /> Active Feast & Fasting Details
        </h3>

        {selectedDay && (selectedDay.holidays.length > 0 || selectedDay.fasting) ? (
          <div className="flex flex-col gap-4" id="holidays-list-container">
            {/* Fasting Info */}
            {selectedDay.fasting && (
              <div
                id={`fasting-detail-item-${selectedDay.id}`}
                className="p-4 rounded-sm border border-amber-500/15 bg-amber-500/[0.03] text-brand-dark flex flex-col gap-2 transition-all duration-200"
              >
                <div className="flex justify-between items-start gap-2" id="fasting-detail-header">
                  <div className="flex flex-col">
                    <span className="font-serif font-black text-base sm:text-lg text-brand-dark leading-tight flex items-center gap-1.5">
                      ✝ {selectedDay.fasting.name}
                    </span>
                    <span className="text-xs font-semibold text-amber-700 font-sans mt-1">
                      {selectedDay.fasting.amharicName}
                    </span>
                  </div>
                  <span className={`text-[9px] uppercase font-sans font-bold px-2 py-0.5 rounded-full border shrink-0
                    ${selectedDay.fasting.isOptional
                      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-800'
                      : 'border-amber-500/20 bg-amber-500/10 text-amber-800'
                    }`}
                  >
                    {selectedDay.fasting.isOptional ? 'Optional Fast' : 'Orthodox Fast'}
                  </span>
                </div>

                <p className="text-xs text-brand-dark/80 leading-relaxed font-sans mt-1">
                  {selectedDay.fasting.description}
                </p>

                {(selectedDay.fasting.isStartDay || selectedDay.fasting.isEndDay) && (
                  <div className="flex flex-col gap-1.5 mt-1 border-t border-amber-500/10 pt-2">
                    {selectedDay.fasting.isStartDay && (
                      <span className="text-[10px] font-sans font-black bg-emerald-500/10 text-emerald-700 border border-emerald-500/15 px-2 py-1 rounded-sm flex items-center gap-1 leading-none">
                        🟢 FAST SEASON STARTS TODAY (የጾም መጀመሪያ)
                      </span>
                    )}
                    {selectedDay.fasting.isEndDay && (
                      <span className="text-[10px] font-sans font-black bg-[#EF3340]/10 text-[#EF3340] border border-[#EF3340]/15 px-2 py-1 rounded-sm flex items-center gap-1 leading-none">
                        🔴 FAST SEASON FINISHES TODAY (የጾም መጨረሻ)
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Holidays */}
            {selectedDay.holidays.map((h) => (
              <div
                key={h.id}
                id={`holiday-detail-item-${h.id}`}
                className={`p-4 rounded-sm border flex flex-col gap-2 transition-all duration-200
                  ${h.category === 'major_feast' || h.category === 'national'
                    ? 'bg-[#EF3340]/5 border-[#EF3340]/15 text-brand-dark'
                    : 'bg-[#D1A110]/5 border-[#D1A110]/15 text-brand-dark'}
                `}
              >
                <div className="flex justify-between items-start gap-2" id={`holiday-item-header-${h.id}`}>
                  <div className="flex flex-col">
                    <span className="font-serif font-black text-base sm:text-lg text-brand-dark leading-tight">{h.name}</span>
                    {h.localName && (
                      <span className="text-xs font-semibold text-[#006732] font-sans mt-1">
                        {h.localName}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[9px] uppercase font-sans font-black px-2 py-0.5 rounded-full border shrink-0
                      ${h.category === 'major_feast'
                        ? 'bg-[#EF3340] border-[#EF3340] text-white'
                        : h.category === 'minor_feast'
                          ? 'bg-[#D1A110] border-[#D1A110] text-white'
                          : 'bg-brand-dark border-brand-dark text-white'}
                    `}
                  >
                    {h.category === 'major_feast'
                      ? 'Major Feast'
                      : h.category === 'minor_feast'
                        ? 'Minor Feast'
                        : h.category === 'commemoration'
                          ? 'Commemoration'
                          : 'National'}
                  </span>
                </div>

                <p className="text-xs text-brand-dark/80 leading-relaxed font-sans mt-1">
                  {h.description || "An official holiday celebrated nationally."}
                </p>

                {h.localDescription && (
                  <p className="text-xs text-[#006732]/90 leading-relaxed font-sans border-t border-[#006732]/10 pt-2 mt-1 italic">
                    {h.localDescription}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center text-brand-dark/40" id="no-holidays-state">
            <Info className="w-8 h-8 text-brand-dark/30 mb-2" />
            <span className="text-xs font-sans font-black uppercase tracking-wider">No active feasts or fasts today</span>
          </div>
        )}
      </div>

      {/* 3. Interactive Date Converter */}
      <div className="bg-white border border-brand-dark/15 p-4 sm:p-5 md:p-6 flex flex-col gap-4 shadow-sm rounded-sm" id="date-converter-section">
        <div className="flex justify-between items-baseline" id="converter-title-header">
          <h3 className="text-xs uppercase tracking-[0.25em] font-sans font-black text-brand-dark flex items-center gap-1.5">
            <RefreshCw className="w-4 h-4 text-brand-dark/40" /> Date Converter
          </h3>
          <button
            id="toggle-conv-direction-btn"
            onClick={() => setConvDirection(convDirection === 'g2e' ? 'e2g' : 'g2e')}
            className="text-[9px] uppercase tracking-wider font-sans font-black text-[#D1A110] bg-[#D1A110]/10 hover:bg-[#D1A110]/15 px-3 py-1.5 border border-[#D1A110]/20 transition-colors cursor-pointer rounded-sm"
          >
            To {convDirection === 'g2e' ? 'Ethiopian' : 'Gregorian'}
          </button>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-3 gap-2" id="converter-inputs-grid">
          {convDirection === 'g2e' ? (
            <>
              {/* Day */}
              <div className="flex flex-col gap-1" id="gday-input-group">
                <label className="text-[9px] font-sans font-black text-brand-dark/40 uppercase tracking-wider">Day</label>
                <select
                  id="gday-select"
                  value={gDay}
                  onChange={(e) => setGDay(Number(e.target.value))}
                  className="w-full bg-brand-bg/50 border border-brand-dark/15 rounded-sm px-2 py-2 text-xs font-bold text-brand-dark focus:outline-none focus:border-[#D1A110]"
                >
                  {Array.from({ length: currentMaxGDays }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Month */}
              <div className="flex flex-col gap-1" id="gmonth-input-group">
                <label className="text-[9px] font-sans font-black text-brand-dark/40 uppercase tracking-wider">Month</label>
                <select
                  id="gmonth-select"
                  value={gMonth}
                  onChange={(e) => {
                    const m = Number(e.target.value);
                    setGMonth(m);
                    const max = getDaysInGregMonth(gYear, m);
                    if (gDay > max) setGDay(max);
                  }}
                  className="w-full bg-brand-bg/50 border border-brand-dark/15 rounded-sm px-2 py-2 text-xs font-bold text-brand-dark focus:outline-none focus:border-[#D1A110]"
                >
                  {GREGORIAN_MONTHS.map((name, idx) => (
                    <option key={idx + 1} value={idx + 1}>{name}</option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div className="flex flex-col gap-1" id="gyear-input-group">
                <label className="text-[9px] font-sans font-black text-brand-dark/40 uppercase tracking-wider">Year</label>
                <select
                  id="gyear-select"
                  value={gYear}
                  onChange={(e) => {
                    const y = Number(e.target.value);
                    setGYear(y);
                    const max = getDaysInGregMonth(y, gMonth);
                    if (gDay > max) setGDay(max);
                  }}
                  className="w-full bg-brand-bg/50 border border-brand-dark/15 rounded-sm px-2 py-2 text-xs font-bold text-brand-dark focus:outline-none focus:border-[#D1A110]"
                >
                  {Array.from({ length: 15 }, (_, i) => 2020 + i).map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <>
              {/* Day */}
              <div className="flex flex-col gap-1" id="eday-input-group">
                <label className="text-[9px] font-sans font-black text-brand-dark/40 uppercase tracking-wider">Day (ቀን)</label>
                <select
                  id="eday-select"
                  value={eDay}
                  onChange={(e) => setEDay(Number(e.target.value))}
                  className="w-full bg-brand-bg/50 border border-brand-dark/15 rounded-sm px-2 py-2 text-xs font-bold text-brand-dark focus:outline-none focus:border-[#D1A110] font-sans"
                >
                  {Array.from({ length: currentMaxEDays }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Month */}
              <div className="flex flex-col gap-1" id="emonth-input-group">
                <label className="text-[9px] font-sans font-black text-brand-dark/40 uppercase tracking-wider">Month (ወር)</label>
                <select
                  id="emonth-select"
                  value={eMonth}
                  onChange={(e) => {
                    const m = Number(e.target.value);
                    setEMonth(m);
                    const isLeap = eYear % 4 === 3;
                    const max = m === 13 ? (isLeap ? 6 : 5) : 30;
                    if (eDay > max) setEDay(max);
                  }}
                  className="w-full bg-brand-bg/50 border border-brand-dark/15 rounded-sm px-2 py-2 text-xs font-bold text-brand-dark focus:outline-none focus:border-[#D1A110] font-sans"
                >
                  {ETHIOPIAN_MONTHS.map((info) => (
                    <option key={info.number} value={info.number}>
                      {info.name} ({info.amharicName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div className="flex flex-col gap-1" id="eyear-input-group">
                <label className="text-[9px] font-sans font-black text-brand-dark/40 uppercase tracking-wider">Year (ዓ.ም)</label>
                <select
                  id="eyear-select"
                  value={eYear}
                  onChange={(e) => {
                    const y = Number(e.target.value);
                    setEYear(y);
                    const isLeap = y % 4 === 3;
                    const max = eMonth === 13 ? (isLeap ? 6 : 5) : 30;
                    if (eDay > max) setEDay(max);
                  }}
                  className="w-full bg-brand-bg/50 border border-brand-dark/15 rounded-sm px-2 py-2 text-xs font-bold text-brand-dark focus:outline-none focus:border-[#D1A110] font-sans"
                >
                  {Array.from({ length: 15 }, (_, i) => 2010 + i).map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>

        {/* Result */}
        <div className="p-4 rounded-sm bg-[#D1A110]/5 border border-[#D1A110]/15 flex flex-col gap-1" id="conversion-result-block">
          <span className="text-[10px] font-sans font-black text-[#D1A110] uppercase tracking-widest">
            Equivalent {convDirection === 'g2e' ? 'Ethiopian (E.C.)' : 'Gregorian (G.C.)'} Date
          </span>
          <span className="text-sm font-serif font-black text-brand-dark" id="converter-result-text">
            {convDirection === 'g2e' ? g2eResult : e2gResult}
          </span>
        </div>

        {/* Action Button */}
        <button
          id="jump-to-converted-date-btn"
          onClick={handleJumpFromConverter}
          disabled={convDirection === 'g2e' ? g2eResult.includes('Invalid') : e2gResult.includes('Invalid')}
          className="w-full bg-brand-dark hover:bg-brand-dark/90 disabled:opacity-55 disabled:pointer-events-none text-brand-bg font-sans font-black text-xs uppercase tracking-widest py-3 px-4 shadow-none transition-all cursor-pointer text-center rounded-sm"
        >
          View in Calendar Grid
        </button>
      </div>
    </div>
  );
}
