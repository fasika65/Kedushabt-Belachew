import { useState, useMemo, useEffect } from 'react';
import { CalendarMode, CalendarDay } from './types';
import {
  generateGregorianCalendar,
  generateEthiopianCalendar,
  convertGregorianToEthiopian,
  convertEthiopianToGregorian,
  ETHIOPIAN_MONTHS,
  GREGORIAN_MONTHS,
} from './utils/calendar';
import CalendarGrid from './components/CalendarGrid';
import InfoPanel from './components/InfoPanel';
import HolidayList from './components/HolidayList';
import FastingGuide from './components/FastingGuide';
import ChurchDirectory from './components/ChurchDirectory';
import ExportIcsModal from './components/ExportIcsModal';
import HeaderSearchBar from './components/HeaderSearchBar';
import DailyDevotional from './components/DailyDevotional';
import {
  Calendar as CalendarIcon,
  Globe,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Heart,
  Grid3X3,
  CalendarDays,
  Download,
} from 'lucide-react';
import CalendarYearView from './components/CalendarYearView';

export default function App() {
  // Calendar View Configuration States (Gregorian vs Ethiopian mode)
  const [mode, setMode] = useState<CalendarMode>('ethiopian');
  const [viewType, setViewType] = useState<'month' | 'year'>('month');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Currently viewed month/year in the grid
  const [currentYear, setCurrentYear] = useState<number>(2019); // Default to current Ethiopian year
  const [currentMonth, setCurrentMonth] = useState<number>(8); // Miazia (0-indexed or 1-indexed depending on calendar.ts - calendar.ts uses 1-indexed for Ethiopian months)

  // Selected calendar day for full detail display
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);

  // Target date to select upon jump or search navigation
  const [targetSelectedDate, setTargetSelectedDate] = useState<{
    ethYear?: number;
    ethMonth?: number;
    ethDay?: number;
    gregDate?: Date;
  } | null>(null);

  // Selected Australian State for public holidays
  const [ausState, setAusState] = useState<string>(() => {
    return localStorage.getItem('aus_selected_state') || 'NONE';
  });

  // Persist Australian State selection
  useEffect(() => {
    localStorage.setItem('aus_selected_state', ausState);
  }, [ausState]);

  // Set default viewed year and month on mount to match current date
  useEffect(() => {
    const today = new Date();
    const { year, month } = convertGregorianToEthiopian(today);
    setCurrentYear(year);
    setCurrentMonth(month);
  }, []);

  // 1. Calculate and generate the calendar days grid
  const days = useMemo(() => {
    if (mode === 'gregorian') {
      return generateGregorianCalendar(currentYear, currentMonth, ausState);
    } else {
      return generateEthiopianCalendar(currentYear, currentMonth, ausState);
    }
  }, [mode, currentYear, currentMonth, ausState]);

  // 2. Keep selectedDay in sync with days or fallback
  useEffect(() => {
    if (days.length > 0) {
      if (targetSelectedDate) {
        if (targetSelectedDate.ethDay !== undefined && targetSelectedDate.ethMonth !== undefined) {
          const match = days.find(
            (d) =>
              d.ethiopianDay === targetSelectedDate.ethDay &&
              d.ethiopianMonth === targetSelectedDate.ethMonth &&
              (targetSelectedDate.ethYear ? d.ethiopianYear === targetSelectedDate.ethYear : true)
          );
          if (match) {
            setSelectedDay(match);
            return;
          }
        }
        if (targetSelectedDate.gregDate) {
          const targetG = targetSelectedDate.gregDate;
          const match = days.find(
            (d) =>
              d.gregorianDay === targetG.getDate() &&
              d.gregorianMonth === targetG.getMonth() &&
              d.gregorianYear === targetG.getFullYear()
          );
          if (match) {
            setSelectedDay(match);
            return;
          }
        }
      }

      const todayGDate = new Date();
      const match = days.find(
        (d) =>
          d.gregorianDay === todayGDate.getDate() &&
          d.gregorianMonth === todayGDate.getMonth() &&
          d.gregorianYear === todayGDate.getFullYear()
      );
      if (match) {
        setSelectedDay(match);
      } else {
        // Select the first day of the viewed month as default
        const currentMonthDays = days.filter(d => d.isCurrentMonth);
        if (currentMonthDays.length > 0) {
          setSelectedDay(currentMonthDays[0]);
        } else {
          setSelectedDay(days[0]);
        }
      }
    }
  }, [days, targetSelectedDate]);

  // Handle month decrement navigation
  const handlePrevMonth = () => {
    setTargetSelectedDate(null);
    if (mode === 'gregorian') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear((prev) => prev - 1);
      } else {
        setCurrentMonth((prev) => prev - 1);
      }
    } else {
      if (currentMonth === 1) {
        setCurrentMonth(13);
        setCurrentYear((prev) => prev - 1);
      } else {
        setCurrentMonth((prev) => prev - 1);
      }
    }
  };

  // Handle month increment navigation
  const handleNextMonth = () => {
    setTargetSelectedDate(null);
    if (mode === 'gregorian') {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear((prev) => prev + 1);
      } else {
        setCurrentMonth((prev) => prev + 1);
      }
    } else {
      if (currentMonth === 13) {
        setCurrentMonth(1);
        setCurrentYear((prev) => prev + 1);
      } else {
        setCurrentMonth((prev) => prev + 1);
      }
    }
  };

  // Jump to Today
  const handleToday = () => {
    setTargetSelectedDate(null);
    if (viewType === 'year') {
      setViewType('month');
    }
    const today = new Date();
    if (mode === 'gregorian') {
      setCurrentYear(today.getFullYear());
      setCurrentMonth(today.getMonth());
    } else {
      const { year, month } = convertGregorianToEthiopian(today);
      setCurrentYear(year);
      setCurrentMonth(month);
    }
  };

  // Handle mode switches gracefully by aligning centered dates
  const handleModeToggle = (newMode: CalendarMode) => {
    if (newMode === mode) return;

    if (mode === 'gregorian') {
      const gDate = new Date(currentYear, currentMonth, 15);
      const { year, month } = convertGregorianToEthiopian(gDate);
      setCurrentYear(year);
      setCurrentMonth(month);
    } else {
      const gDate = convertEthiopianToGregorian(currentYear, currentMonth, 15);
      setCurrentYear(gDate.getFullYear());
      setCurrentMonth(gDate.getMonth());
    }
    setMode(newMode);
  };

  // Jump handlers for external triggers (like info panel / date converter / search bar)
  const handleJumpToDate = (date: Date) => {
    if (viewType === 'year') {
      setViewType('month');
    }
    setTargetSelectedDate({ gregDate: date });
    if (mode === 'gregorian') {
      setCurrentYear(date.getFullYear());
      setCurrentMonth(date.getMonth());
    } else {
      const { year, month } = convertGregorianToEthiopian(date);
      setCurrentYear(year);
      setCurrentMonth(month);
    }
  };

  const handleJumpToEthDate = (ey: number, em: number, ed: number) => {
    if (viewType === 'year') {
      setViewType('month');
    }
    setTargetSelectedDate({ ethYear: ey, ethMonth: em, ethDay: ed });
    if (mode === 'ethiopian') {
      setCurrentYear(ey);
      setCurrentMonth(em);
    } else {
      const gDate = convertEthiopianToGregorian(ey, em, ed);
      setCurrentYear(gDate.getFullYear());
      setCurrentMonth(gDate.getMonth());
    }
  };

  const handlePrev = () => {
    if (viewType === 'year') {
      setCurrentYear((prev) => prev - 1);
    } else {
      handlePrevMonth();
    }
  };

  const handleNext = () => {
    if (viewType === 'year') {
      setCurrentYear((prev) => prev + 1);
    } else {
      handleNextMonth();
    }
  };

  // Get active month title
  const currentMonthTitle = useMemo(() => {
    if (viewType === 'year') {
      if (mode === 'gregorian') {
        return `${currentYear} G.C.`;
      } else {
        return `${currentYear} ዓ.ም (E.C.)`;
      }
    }
    if (mode === 'gregorian') {
      return `${GREGORIAN_MONTHS[currentMonth]} ${currentYear}`;
    } else {
      const mInfo = ETHIOPIAN_MONTHS[currentMonth - 1];
      return mInfo ? `${mInfo.name} ${currentYear} E.C. (${mInfo.amharicName})` : '';
    }
  }, [mode, currentMonth, currentYear, viewType]);

  // Secondary descriptive subtitle under month title
  const currentMonthSubtitle = useMemo(() => {
    if (viewType === 'year') {
      if (mode === 'gregorian') {
        return `Gregorian Full Year View • 12 Months Overview`;
      } else {
        return `Ethiopian Orthodox Full Year View • የ13ቱ ወራት ማውጫ`;
      }
    }
    const currentMonthDays = days.filter((d) => d.isCurrentMonth);
    if (currentMonthDays.length === 0) return '';
    
    if (mode === 'gregorian') {
      const start = currentMonthDays[0];
      const end = currentMonthDays[currentMonthDays.length - 1];
      const startEth = `${ETHIOPIAN_MONTHS[start.ethiopianMonth - 1].name} ${start.ethiopianDay}`;
      const endEth = `${ETHIOPIAN_MONTHS[end.ethiopianMonth - 1].name} ${end.ethiopianDay}`;
      return `Ethiopian Equivalent: ${startEth} – ${endEth} (${start.ethiopianYear} E.C.)`;
    } else {
      const start = currentMonthDays[0].gregorianDate;
      const end = currentMonthDays[currentMonthDays.length - 1].gregorianDate;
      const startStr = `${GREGORIAN_MONTHS[start.getMonth()]} ${start.getDate()}`;
      const endStr = `${GREGORIAN_MONTHS[end.getMonth()]} ${end.getDate()}`;
      return `Gregorian Equivalent: ${startStr}, ${start.getFullYear()} – ${endStr}, ${end.getFullYear()}`;
    }
  }, [days, mode, viewType]);

  // Year to pass to HolidayList (it expects Gregorian Year for calculations)
  const holidayListYear = useMemo(() => {
    if (mode === 'gregorian') {
      return currentYear;
    } else {
      // In Ethiopian mode, return estimated Gregorian year corresponding to this month
      const currentMonthDays = days.filter((d) => d.isCurrentMonth);
      if (currentMonthDays.length > 0) {
        return currentMonthDays[0].gregorianYear;
      }
      return currentYear + 8;
    }
  }, [mode, currentYear, days]);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-dark pb-12 select-none" id="app-root-container">
      {/* Dynamic Ethiopian flag-inspired top accent banner (Green, Yellow, Red) */}
      <div className="w-full flex h-1.5 overflow-hidden sticky top-0 z-50 shadow-sm" id="ethiopian-top-banner-accent">
        <div className="flex-1 bg-[#006732]" />
        <div className="flex-1 bg-[#D1A110]" />
        <div className="flex-1 bg-[#EF3340]" />
      </div>

      {/* Header Panel */}
      <header className="bg-white border-b border-brand-dark/10 sticky top-1.5 z-40 py-2.5 px-2.5 sm:py-3.5 sm:px-6 md:px-12 shadow-sm" id="app-header">
        <div className="max-w-7xl mx-auto flex flex-col gap-3" id="header-inner-flex">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4" id="header-top-row">
            {/* Brand/Logo Section */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0" id="brand-logo-section">
              <div className="relative flex items-center justify-center w-8.5 h-8.5 sm:w-10 sm:h-10 border border-[#D1A110]/40 bg-brand-bg text-brand-dark shrink-0 rounded-sm" id="logo-icon-wrapper">
                <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 drop-shadow-sm text-[#006732]" />
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 bg-[#EF3340] border border-white rounded-full flex items-center justify-center text-[6px] sm:text-[7px] font-black text-white">
                  ✝
                </div>
              </div>
              <div className="flex flex-col min-w-0" id="brand-title-group">
                <h1 className="text-[13px] xs:text-sm sm:text-lg md:text-xl font-serif font-black text-brand-dark leading-tight sm:leading-none tracking-tight flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን የቀን አቆጣጠር
                </h1>
                <span className="text-[8px] xs:text-[9px] font-sans font-extrabold text-brand-dark/50 mt-0.5 sm:mt-1 uppercase tracking-[0.1em] xs:tracking-[0.15em] truncate">
                  Ethiopian Orthodox Tewahedo Church Liturgical Calendar
                </span>
                <div className="text-[8.5px] xs:text-[10px] font-sans font-semibold text-brand-dark/75 mt-1 flex flex-wrap items-center gap-1" id="app-prepared-by-credit">
                  <span className="opacity-75">ያዘጋጀው / Prepared by:</span>
                  <span className="font-black text-[#006732] bg-[#006732]/5 border border-[#006732]/10 px-1.5 py-0.2 rounded-sm">
                    Kedus habt Belachew (ቅዱስ ሃብት በላቸው)
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Header Saint & Feast Search Bar */}
            <div className="flex-1 max-w-full lg:max-w-md xl:max-w-lg w-full" id="header-search-container">
              <HeaderSearchBar
                currentEthYear={mode === 'ethiopian' ? currentYear : convertGregorianToEthiopian(new Date(currentYear, currentMonth, 15)).year}
                currentEthMonth={mode === 'ethiopian' ? currentMonth : convertGregorianToEthiopian(new Date(currentYear, currentMonth, 15)).month}
                ausState={ausState}
                onJumpToEthDate={handleJumpToEthDate}
                onJumpToGregDate={handleJumpToDate}
              />
            </div>

            {/* Quick Settings Bar */}
            <div className="flex flex-wrap items-center gap-1.5 xs:gap-2 shrink-0 justify-end" id="quick-settings-bar">
              {/* Calendar Mode Selector */}
              <div className="flex bg-brand-bg/50 p-0.5 xs:p-1 border border-brand-dark/10 rounded-sm" id="mode-selector-pill">
                <button
                  id="mode-ethiopian-toggle"
                  onClick={() => handleModeToggle('ethiopian')}
                  className={`px-2.5 py-1 xs:px-3.5 xs:py-1.5 text-[8.5px] xs:text-[10px] uppercase tracking-wider font-sans font-black rounded-sm transition-all cursor-pointer inline-flex items-center gap-1 xs:gap-1.5
                    ${mode === 'ethiopian'
                      ? 'bg-[#006732] text-white shadow-sm'
                      : 'text-brand-dark/50 hover:text-brand-dark'}
                  `}
                >
                  <CalendarIcon className={`w-3 h-3 xs:w-3.5 xs:h-3.5 ${mode === 'ethiopian' ? 'text-[#D1A110]' : 'text-[#006732]'}`} /> Ethiopian (E.C.)
                </button>
                <button
                  id="mode-gregorian-toggle"
                  onClick={() => handleModeToggle('gregorian')}
                  className={`px-2.5 py-1 xs:px-3.5 xs:py-1.5 text-[8.5px] xs:text-[10px] uppercase tracking-wider font-sans font-black rounded-sm transition-all cursor-pointer inline-flex items-center gap-1 xs:gap-1.5
                    ${mode === 'gregorian'
                      ? 'bg-[#006732] text-white shadow-sm'
                      : 'text-brand-dark/50 hover:text-brand-dark'}
                  `}
                >
                  <Globe className={`w-3 h-3 xs:w-3.5 xs:h-3.5 ${mode === 'gregorian' ? 'text-[#D1A110]' : 'text-brand-blue'}`} /> Gregorian (G.C.)
                </button>
              </div>

              {/* Australian Public Holiday State Selector */}
              <div className="flex items-center gap-1 bg-brand-bg/50 px-1.5 py-1 sm:px-2 sm:py-1.5 border border-brand-dark/10 rounded-sm" id="australian-holiday-selector-container">
                <label htmlFor="australian-state-select" className="text-[8px] xs:text-[9px] font-sans font-extrabold uppercase text-brand-dark/60 tracking-wider whitespace-nowrap">
                  AUS:
                </label>
                <select
                  id="australian-state-select"
                  value={ausState}
                  onChange={(e) => setAusState(e.target.value)}
                  className="bg-white border border-brand-dark/10 text-brand-dark text-[9px] xs:text-[10px] font-sans font-extrabold uppercase px-1 py-0.5 sm:px-2 sm:py-1 rounded-sm focus:outline-none focus:border-[#006732]/40 cursor-pointer"
                >
                  <option value="NONE">None</option>
                  <option value="ACT">ACT</option>
                  <option value="NSW">NSW</option>
                  <option value="NT">NT</option>
                  <option value="QLD">QLD</option>
                  <option value="SA">SA</option>
                  <option value="TAS">TAS</option>
                  <option value="VIC">VIC</option>
                  <option value="WA">WA</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-2.5 sm:px-4 md:px-8 mt-4 sm:mt-6 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6" id="app-main-grid-layout">
        
        {/* Left Column: Calendar Grid & Info Panel */}
        <div className="lg:col-span-8 flex flex-col gap-4 sm:gap-6" id="calendar-main-column">
          
          <div className="flex flex-col gap-4" id="calendar-block">
            {/* Calendar Toolbar Panel */}
            <div className="bg-white border border-brand-dark/15 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 shadow-sm rounded-sm" id="calendar-toolbar">
              <div className="flex flex-wrap items-center gap-1 xs:gap-1.5" id="nav-arrows-group">
                <button
                  id="prev-month-btn"
                  onClick={handlePrev}
                  className="p-1.5 xs:p-2 sm:p-2.5 rounded-sm bg-brand-bg hover:bg-[#006732]/5 hover:text-[#006732] border border-brand-dark/10 hover:border-[#006732]/30 text-brand-dark/60 transition-colors cursor-pointer"
                  title={viewType === 'year' ? "Previous Year" : "Previous Month"}
                >
                  <ChevronLeft className="w-4.5 h-4.5 xs:w-5 xs:h-5" />
                </button>
                <button
                  id="next-month-btn"
                  onClick={handleNext}
                  className="p-1.5 xs:p-2 sm:p-2.5 rounded-sm bg-brand-bg hover:bg-[#006732]/5 hover:text-[#006732] border border-brand-dark/10 hover:border-[#006732]/30 text-brand-dark/60 transition-colors cursor-pointer"
                  title={viewType === 'year' ? "Next Year" : "Next Month"}
                >
                  <ChevronRight className="w-4.5 h-4.5 xs:w-5 xs:h-5" />
                </button>
                <button
                  id="today-jump-btn"
                  onClick={handleToday}
                  className="px-2.5 py-1.5 xs:px-4 xs:py-2.5 rounded-sm bg-brand-bg hover:bg-[#006732] hover:text-white border border-brand-dark/10 hover:border-[#006732] text-[#006732] font-sans font-black text-[10px] xs:text-xs uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-1 xs:gap-1.5"
                  title="Go to Today"
                >
                  <RotateCcw className="w-3 h-3 xs:w-3.5 xs:h-3.5" /> Today
                </button>

                {/* View Type Toggle (Month vs Year) */}
                <div className="flex bg-brand-bg p-0.5 xs:p-1 border border-brand-dark/10 rounded-sm sm:ml-2" id="view-type-toggle">
                  <button
                    onClick={() => setViewType('month')}
                    className={`px-2.5 py-1 xs:px-3 xs:py-1.5 text-[8.5px] xs:text-[9px] uppercase tracking-wider font-sans font-black rounded-sm transition-all cursor-pointer inline-flex items-center gap-1
                      ${viewType === 'month'
                        ? 'bg-[#006732] text-white shadow-sm'
                        : 'text-brand-dark/50 hover:text-brand-dark'}
                    `}
                    title="Month View"
                  >
                    <CalendarDays className="w-3 h-3 xs:w-3.5 xs:h-3.5" /> Month
                  </button>
                  <button
                    onClick={() => setViewType('year')}
                    className={`px-2.5 py-1 xs:px-3 xs:py-1.5 text-[8.5px] xs:text-[9px] uppercase tracking-wider font-sans font-black rounded-sm transition-all cursor-pointer inline-flex items-center gap-1
                      ${viewType === 'year'
                        ? 'bg-[#006732] text-white shadow-sm'
                        : 'text-brand-dark/50 hover:text-brand-dark'}
                    `}
                    title="Year View"
                  >
                    <Grid3X3 className="w-3 h-3 xs:w-3.5 xs:h-3.5" /> Year
                  </button>
                </div>

                {/* Export .ICS Button */}
                <button
                  id="toolbar-export-ics-btn"
                  onClick={() => setIsExportModalOpen(true)}
                  className="px-2.5 py-1.5 xs:px-3 xs:py-1.5 rounded-sm bg-brand-bg hover:bg-[#006732] hover:text-white border border-brand-dark/10 hover:border-[#006732] text-brand-dark/80 font-sans font-black text-[8.5px] xs:text-[9px] uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-1 sm:ml-1"
                  title="Export events to .ics calendar file"
                >
                  <Download className="w-3 h-3 text-[#006732]" />
                  <span>Export .ICS</span>
                </button>
              </div>

              {/* Month Title */}
              <div className="flex flex-col sm:text-right" id="month-title-panel">
                <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-serif font-black tracking-tight text-brand-dark" id="month-header-title">
                  {currentMonthTitle}
                </h2>
                <span className="text-[8.5px] xs:text-[10px] font-sans font-extrabold text-brand-dark/40 mt-0.5 sm:mt-1 tracking-wider uppercase" id="month-header-subtitle">
                  {currentMonthSubtitle}
                </span>
              </div>
            </div>

            {/* Grid of Days or Year View */}
            {viewType === 'month' ? (
              <CalendarGrid
                days={days}
                mode={mode}
                selectedDay={selectedDay}
                onSelectDay={setSelectedDay}
                currentYear={currentYear}
                currentMonth={currentMonth}
              />
            ) : (
              <CalendarYearView
                mode={mode}
                currentYear={currentYear}
                selectedDay={selectedDay}
                onSelectDay={setSelectedDay}
                onMonthClick={(mVal) => {
                  setCurrentMonth(mVal);
                  setViewType('month');
                }}
                ausState={ausState}
              />
            )}
          </div>

          {/* Daily Devotional (Bible Readings, Tselot & Spiritual Reflection) */}
          <DailyDevotional selectedDay={selectedDay} />

          {/* Details / Converter */}
          <InfoPanel
            selectedDay={selectedDay}
            onJumpToDate={handleJumpToDate}
            onJumpToEthDate={handleJumpToEthDate}
            onOpenExportModal={() => setIsExportModalOpen(true)}
          />
        </div>

        {/* Right Column: Holiday list, Fasting guide & notices */}
        <div className="lg:col-span-4 flex flex-col gap-6" id="calendar-sidebar-column">
          
          <HolidayList
            currentYear={holidayListYear}
            onSelectHolidayDate={handleJumpToDate}
            ausState={ausState}
          />

          <FastingGuide />

          <ChurchDirectory />

          {/* Liturgical calculation summary */}
          <div className="p-5 bg-white border border-brand-dark/15 rounded-sm flex items-start gap-3 text-xs font-sans text-brand-dark/70 shadow-sm" id="leap-year-notices">
            <Sparkles className="w-4 h-4 text-[#D1A110] shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="font-black text-brand-dark uppercase tracking-wider text-[10px]">EOTC Bahre Hasab (የባሕረ ሐሳብ ቀመር)</span>
              <span className="leading-relaxed text-brand-dark/80">
                This applet dynamically calculates the movable fasts and feasts of the Ethiopian Orthodox Tewahedo Church. Using Medeb, Wenber, Abeqte, and Metqie coefficients, the engine determines Nenewe (Nineveh), Hudadi (Great Lent), Fasika (Easter), and Sene Tsom (Apostles' Fast) in complete conformity with church traditions.
              </span>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="mt-16 pb-12 text-center text-[10px] font-sans font-bold uppercase tracking-widest text-brand-dark/40 flex flex-col items-center gap-2.5" id="app-footer">
        <div className="flex items-center gap-1 font-sans">
          <span>Made with reverence for Orthodox Liturgical Tradition</span>
          <Heart className="w-3.5 h-3.5 text-[#EF3340] animate-pulse fill-[#EF3340]" />
        </div>
        <div className="flex flex-col items-center gap-1 mt-1 text-xs border-t border-brand-dark/5 pt-3 w-48 mx-auto" id="creator-credit">
          <span className="text-[9px] tracking-[0.2em] text-brand-dark/30 uppercase font-black font-sans">Traditional Computus</span>
          <span className="font-serif font-black text-brand-dark/70 tracking-wide text-xs">Bahre Hasab Engine</span>
          <span className="font-sans font-black text-[#006732] text-[11px] tracking-normal mt-0.5">ባሕረ ሐሳብ ስሌት</span>
        </div>
        <span className="text-[9px] text-brand-dark/30 mt-2">© 2026 Ethiopian Orthodox Liturgical Calendar. All rights reserved.</span>
      </footer>

      {/* Export .ICS Modal */}
      <ExportIcsModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        days={days}
        currentTitle={currentMonthTitle}
        mode={mode}
        currentYear={currentYear}
        currentMonth={currentMonth}
        ausState={ausState}
      />
    </div>
  );
}
