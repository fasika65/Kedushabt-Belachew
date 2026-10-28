import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  X, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  FileSpreadsheet, 
  HelpCircle, 
  ChevronRight, 
  Info,
  CalendarCheck,
  Check
} from 'lucide-react';
import { CalendarDay } from '../types';
import { 
  ICSExportOptions, 
  DEFAULT_EXPORT_OPTIONS, 
  collectICSEvents, 
  exportCalendarToICS 
} from '../utils/icsExport';
import { ETHIOPIAN_MONTHS, GREGORIAN_MONTHS, generateEthiopianCalendar, generateGregorianCalendar } from '../utils/calendar';

interface ExportIcsModalProps {
  isOpen: boolean;
  onClose: () => void;
  days: CalendarDay[];
  currentTitle: string;
  mode: 'ethiopian' | 'gregorian';
  currentYear: number;
  currentMonth: number;
  ausState: string;
}

export default function ExportIcsModal({
  isOpen,
  onClose,
  days,
  currentTitle,
  mode,
  currentYear,
  currentMonth,
  ausState,
}: ExportIcsModalProps) {
  const [options, setOptions] = useState<ICSExportOptions>({
    ...DEFAULT_EXPORT_OPTIONS,
    mode,
    year: currentYear,
    month: currentMonth,
    ausState,
  });

  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  // Keep options in sync with props when opened
  React.useEffect(() => {
    if (isOpen) {
      setOptions(prev => ({
        ...prev,
        mode,
        year: currentYear,
        month: currentMonth,
        ausState,
      }));
      setDownloadSuccess(null);
    }
  }, [isOpen, mode, currentYear, currentMonth, ausState]);

  // Calculate live preview count of events to be exported
  const previewEvents = useMemo(() => {
    let targetDays = days;
    if (options.timeframe === 'full_year') {
      const allYearDays: CalendarDay[] = [];
      if (mode === 'ethiopian') {
        for (let m = 1; m <= 13; m++) {
          const mDays = generateEthiopianCalendar(currentYear, m, ausState);
          allYearDays.push(...mDays.filter(d => d.isCurrentMonth));
        }
      } else {
        for (let m = 0; m < 12; m++) {
          const mDays = generateGregorianCalendar(currentYear, m, ausState);
          allYearDays.push(...mDays.filter(d => d.isCurrentMonth));
        }
      }
      targetDays = allYearDays;
    }
    return collectICSEvents(targetDays, options);
  }, [days, options, mode, currentYear, ausState]);

  const handleExport = () => {
    const result = exportCalendarToICS(days, currentTitle, options);
    setDownloadSuccess(`Successfully exported ${result.eventCount} events to "${result.filename}"!`);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-brand-dark/60 backdrop-blur-xs overflow-y-auto"
        id="export-ics-modal-overlay"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.18 }}
          className="relative w-full max-w-xl bg-white border border-brand-dark/20 rounded-sm shadow-xl overflow-hidden flex flex-col my-auto"
          id="export-ics-modal-content"
        >
          {/* Header */}
          <div className="px-5 py-4 bg-brand-bg border-b border-brand-dark/15 flex items-center justify-between shrink-0" id="export-modal-header">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-sm bg-[#006732]/10 border border-[#006732]/20 flex items-center justify-center text-[#006732]">
                <Download className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-serif font-black text-base sm:text-lg text-brand-dark leading-snug">
                  Export Calendar to .ICS (ኤክስፖርት)
                </h3>
                <span className="text-[10px] font-sans font-bold text-brand-dark/50 uppercase tracking-wider">
                  Sync Liturgical Feasts & Holidays with iCal, Google & Outlook
                </span>
              </div>
            </div>
            <button
              id="export-modal-close-btn"
              onClick={onClose}
              className="p-1.5 rounded-sm hover:bg-brand-dark/5 text-brand-dark/50 hover:text-brand-dark transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 overflow-y-auto max-h-[75vh] flex flex-col gap-5 text-brand-dark" id="export-modal-body">
            
            {/* Timeframe Selector */}
            <div className="flex flex-col gap-2" id="timeframe-selection-group">
              <label className="text-[10px] font-sans font-black uppercase tracking-wider text-brand-dark/60 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#006732]" /> Select Timeframe (የጊዜ ገደብ)
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  id="timeframe-current-month-btn"
                  onClick={() => setOptions(prev => ({ ...prev, timeframe: 'current_month' }))}
                  className={`p-3 rounded-sm border text-left flex flex-col gap-1 transition-all cursor-pointer relative
                    ${options.timeframe === 'current_month'
                      ? 'bg-[#006732]/5 border-[#006732] ring-1 ring-[#006732]/30 shadow-xs'
                      : 'bg-white border-brand-dark/15 hover:border-brand-dark/30 hover:bg-brand-bg/50'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-black text-xs text-brand-dark">
                      Current Month
                    </span>
                    {options.timeframe === 'current_month' && (
                      <CheckCircle2 className="w-4 h-4 text-[#006732]" />
                    )}
                  </div>
                  <span className="text-[10px] font-sans font-bold text-[#006732] truncate">
                    {currentTitle}
                  </span>
                  <span className="text-[9px] font-sans text-brand-dark/50 leading-tight">
                    Export feasts & fasts for this specific month only.
                  </span>
                </button>

                <button
                  type="button"
                  id="timeframe-full-year-btn"
                  onClick={() => setOptions(prev => ({ ...prev, timeframe: 'full_year' }))}
                  className={`p-3 rounded-sm border text-left flex flex-col gap-1 transition-all cursor-pointer relative
                    ${options.timeframe === 'full_year'
                      ? 'bg-[#006732]/5 border-[#006732] ring-1 ring-[#006732]/30 shadow-xs'
                      : 'bg-white border-brand-dark/15 hover:border-brand-dark/30 hover:bg-brand-bg/50'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-black text-xs text-brand-dark">
                      Full Year
                    </span>
                    {options.timeframe === 'full_year' && (
                      <CheckCircle2 className="w-4 h-4 text-[#006732]" />
                    )}
                  </div>
                  <span className="text-[10px] font-sans font-bold text-[#006732] truncate">
                    {currentYear} {mode === 'ethiopian' ? 'ዓ.ም. (E.C.)' : 'G.C.'}
                  </span>
                  <span className="text-[9px] font-sans text-brand-dark/50 leading-tight">
                    Export all events for the entire year across 13 months.
                  </span>
                </button>
              </div>
            </div>

            {/* Included Event Types */}
            <div className="flex flex-col gap-2.5" id="event-categories-group">
              <label className="text-[10px] font-sans font-black uppercase tracking-wider text-brand-dark/60 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D1A110]" /> Select Categories to Export (የሚካተቱ ክስተቶች)
                </span>
                <span className="text-[10px] font-mono font-bold text-[#006732] bg-[#006732]/10 px-2 py-0.5 rounded-sm">
                  {previewEvents.length} Events Selected
                </span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
                {/* Liturgical Feasts */}
                <label 
                  className="flex items-start gap-2.5 p-2.5 bg-brand-bg/40 border border-brand-dark/10 rounded-sm hover:border-[#006732]/30 transition-colors cursor-pointer select-none"
                  id="toggle-feasts-label"
                >
                  <input
                    type="checkbox"
                    id="checkbox-include-feasts"
                    checked={options.includeFeasts}
                    onChange={(e) => setOptions(prev => ({ ...prev, includeFeasts: e.target.checked }))}
                    className="mt-0.5 accent-[#006732] w-4 h-4 rounded-xs cursor-pointer"
                  />
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-brand-dark text-xs flex items-center gap-1">
                      ✝ Major & Minor Feasts
                    </span>
                    <span className="text-[10px] text-brand-dark/60 leading-tight">
                      Fasika, Epiphany, Christmas, Meskel, Tsinsat, etc.
                    </span>
                  </div>
                </label>

                {/* Fasting Seasons */}
                <label 
                  className="flex items-start gap-2.5 p-2.5 bg-brand-bg/40 border border-brand-dark/10 rounded-sm hover:border-[#006732]/30 transition-colors cursor-pointer select-none"
                  id="toggle-fasting-label"
                >
                  <input
                    type="checkbox"
                    id="checkbox-include-fasting"
                    checked={options.includeFasting}
                    onChange={(e) => setOptions(prev => ({ ...prev, includeFasting: e.target.checked }))}
                    className="mt-0.5 accent-[#006732] w-4 h-4 rounded-xs cursor-pointer"
                  />
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-brand-dark text-xs flex items-center gap-1">
                      🐟 Fasting Seasons & Holy Fasts
                    </span>
                    <span className="text-[10px] text-brand-dark/60 leading-tight">
                      Great Lent (Hudadi), Filseta, Nineveh, Advent, Apostles.
                    </span>
                  </div>
                </label>

                {/* Monthly Saints Commemorations */}
                <label 
                  className="flex items-start gap-2.5 p-2.5 bg-brand-bg/40 border border-brand-dark/10 rounded-sm hover:border-[#006732]/30 transition-colors cursor-pointer select-none"
                  id="toggle-commemorations-label"
                >
                  <input
                    type="checkbox"
                    id="checkbox-include-commemorations"
                    checked={options.includeMonthlyCommemorations}
                    onChange={(e) => setOptions(prev => ({ ...prev, includeMonthlyCommemorations: e.target.checked }))}
                    className="mt-0.5 accent-[#006732] w-4 h-4 rounded-xs cursor-pointer"
                  />
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-brand-dark text-xs flex items-center gap-1">
                      ✨ Saints Commemorations
                    </span>
                    <span className="text-[10px] text-brand-dark/60 leading-tight">
                      21 St. Mary, 12 St. Michael, 7 Sillase, 27 Medhane Alem.
                    </span>
                  </div>
                </label>

                {/* Public & National Holidays */}
                <label 
                  className="flex items-start gap-2.5 p-2.5 bg-brand-bg/40 border border-brand-dark/10 rounded-sm hover:border-[#006732]/30 transition-colors cursor-pointer select-none"
                  id="toggle-public-holidays-label"
                >
                  <input
                    type="checkbox"
                    id="checkbox-include-public-holidays"
                    checked={options.includePublicHolidays}
                    onChange={(e) => setOptions(prev => ({ ...prev, includePublicHolidays: e.target.checked }))}
                    className="mt-0.5 accent-[#006732] w-4 h-4 rounded-xs cursor-pointer"
                  />
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-brand-dark text-xs flex items-center gap-1">
                      🇦🇺🇪🇹 Public Holidays
                    </span>
                    <span className="text-[10px] text-brand-dark/60 leading-tight">
                      Ethiopian National Holidays & Australian State Holidays.
                    </span>
                  </div>
                </label>
              </div>

              {/* Secondary Option: Weekly Fasts */}
              {options.includeFasting && (
                <div className="mt-1 p-2.5 bg-amber-500/[0.04] border border-amber-500/20 rounded-sm" id="weekly-fasts-option-box">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none" id="toggle-weekly-fasts-label">
                    <input
                      type="checkbox"
                      id="checkbox-include-weekly-fasts"
                      checked={options.includeWeeklyFasts}
                      onChange={(e) => setOptions(prev => ({ ...prev, includeWeeklyFasts: e.target.checked }))}
                      className="accent-amber-600 w-4 h-4 rounded-xs cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="font-bold text-brand-dark text-xs">
                        Include Regular Wednesday & Friday Fasts (የረቡዕና አርብ ጾም)
                      </span>
                      <span className="text-[10px] text-brand-dark/60">
                        Adds weekly fasting entries to your calendar for every Wednesday and Friday.
                      </span>
                    </div>
                  </label>
                </div>
              )}
            </div>

            {/* Success Banner */}
            {downloadSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 bg-emerald-50 border border-emerald-600/30 text-emerald-900 rounded-sm flex items-start gap-2.5 text-xs font-sans shadow-xs"
                id="export-success-message-banner"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="font-bold leading-tight">{downloadSuccess}</span>
                  <span className="text-[10px] opacity-80">
                    You can now open your downloaded file in Google Calendar, Apple Calendar, or Microsoft Outlook!
                  </span>
                </div>
              </motion.div>
            )}

            {/* Import Instructions Collapsible */}
            <div className="border-t border-brand-dark/10 pt-3" id="import-instructions-accordion">
              <button
                type="button"
                id="toggle-instructions-btn"
                onClick={() => setShowInstructions(!showInstructions)}
                className="flex items-center justify-between w-full text-left text-xs font-sans font-bold text-brand-dark/70 hover:text-[#006732] cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-[#006732]" />
                  How to import .ics file into your calendar app?
                </span>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showInstructions ? 'rotate-90' : ''}`} />
              </button>

              {showInstructions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2.5 p-3 bg-brand-bg/60 border border-brand-dark/10 rounded-sm text-[11px] font-sans flex flex-col gap-2.5 text-brand-dark/80"
                  id="import-instructions-content"
                >
                  <div>
                    <span className="font-extrabold text-[#006732] block">Google Calendar:</span>
                    <span>1. Open calendar.google.com on desktop ➔ Click Settings icon ➔ <strong>Settings</strong>.<br />2. On the left menu, select <strong>Import & export</strong>.<br />3. Click <strong>Select file from your computer</strong>, choose the downloaded .ics file, and click <strong>Import</strong>.</span>
                  </div>
                  <div>
                    <span className="font-extrabold text-[#006732] block">Apple Calendar (Mac / iPhone / iPad):</span>
                    <span>Double-click or tap the downloaded `.ics` file. Apple Calendar will automatically ask which calendar you wish to add the events to.</span>
                  </div>
                  <div>
                    <span className="font-extrabold text-[#006732] block">Microsoft Outlook:</span>
                    <span>In Outlook, go to <strong>File</strong> ➔ <strong>Open & Export</strong> ➔ <strong>Import/Export</strong> ➔ Choose <strong>Import an iCalendar (.ics) file</strong>.</span>
                  </div>
                </motion.div>
              )}
            </div>

          </div>

          {/* Modal Footer */}
          <div className="px-5 py-3.5 bg-brand-bg/80 border-t border-brand-dark/15 flex items-center justify-between gap-3 shrink-0" id="export-modal-footer">
            <button
              type="button"
              id="export-cancel-btn"
              onClick={onClose}
              className="px-4 py-2 rounded-sm bg-white hover:bg-brand-dark/5 border border-brand-dark/15 text-brand-dark/70 font-sans font-bold text-xs transition-colors cursor-pointer"
            >
              Close
            </button>

            <button
              type="button"
              id="export-download-action-btn"
              disabled={previewEvents.length === 0}
              onClick={handleExport}
              className="px-5 py-2.5 rounded-sm bg-[#006732] hover:bg-[#005228] text-white font-sans font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Download .ICS File ({previewEvents.length} Events)
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
