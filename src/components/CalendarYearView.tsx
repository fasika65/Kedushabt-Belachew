import { motion } from 'motion/react';
import { CalendarDay, CalendarMode } from '../types';
import {
  ETHIOPIAN_MONTHS,
  GREGORIAN_MONTHS,
  generateGregorianCalendar,
  generateEthiopianCalendar,
} from '../utils/calendar';
import { Calendar as CalendarIcon, ArrowRight } from 'lucide-react';

interface CalendarYearViewProps {
  mode: CalendarMode;
  currentYear: number;
  selectedDay: CalendarDay | null;
  onSelectDay: (day: CalendarDay) => void;
  onMonthClick: (monthIndex: number) => void;
  ausState: string;
}

export default function CalendarYearView({
  mode,
  currentYear,
  selectedDay,
  onSelectDay,
  onMonthClick,
  ausState,
}: CalendarYearViewProps) {
  const isEthiopian = mode === 'ethiopian';
  const totalMonths = isEthiopian ? 13 : 12;

  // Let's cache/memoize each month's day array for performance
  const monthsData = Array.from({ length: totalMonths }, (_, idx) => {
    const monthVal = isEthiopian ? idx + 1 : idx;
    const days = isEthiopian
      ? generateEthiopianCalendar(currentYear, monthVal, ausState)
      : generateGregorianCalendar(currentYear, monthVal, ausState);
    
    // Get month title info
    let title = '';
    let subTitle = '';
    if (isEthiopian) {
      const mInfo = ETHIOPIAN_MONTHS[idx];
      title = mInfo ? mInfo.name : '';
      subTitle = mInfo ? mInfo.amharicName : '';
    } else {
      title = GREGORIAN_MONTHS[idx];
      subTitle = `${title.substring(0, 3)}`;
    }

    return {
      monthIndex: monthVal,
      title,
      subTitle,
      days,
    };
  });

  const weekdays = isEthiopian
    ? ['እ', 'ሰ', 'ማ', 'ረ', 'ሐ', 'አ', 'ቅ']
    : ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Animation variants for container and items
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
  };

  return (
    <div className="flex flex-col w-full gap-6" id="calendar-year-view-container">
      {/* Year View Header Banner */}
      <div className="bg-white border border-brand-dark/15 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm rounded-sm" id="year-view-banner">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#006732]/10 text-[#006732] rounded-sm" id="year-banner-icon-bg">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-serif font-black text-brand-dark leading-tight">
              {isEthiopian ? `${currentYear} ዓመታዊ ዕቅድ (E.C.)` : `${currentYear} Annual Planner (G.C.)`}
            </h2>
            <p className="text-[10px] sm:text-xs font-sans font-bold text-brand-dark/50 uppercase tracking-wider mt-0.5">
              {isEthiopian
                ? "የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን የ13ቱ ወራት በዓላትና አጽዋማት"
                : "Full 12-Month Calendar Overview with Australian and Church Holidays"}
            </p>
          </div>
        </div>
        <div className="text-[10px] font-sans font-extrabold uppercase tracking-widest text-brand-dark/40 bg-brand-bg px-2.5 py-1.5 border border-brand-dark/5 rounded-sm">
          Select any day to inspect details or click month header to zoom in
        </div>
      </div>

      {/* Grid of months */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4"
        id="year-view-months-grid"
      >
        {monthsData.map((m, mIdx) => {
          return (
            <motion.div
              key={`${mode}-${currentYear}-${m.monthIndex}`}
              variants={itemVariants}
              className="bg-white border border-brand-dark/12 hover:border-[#D1A110]/40 rounded-sm shadow-sm flex flex-col overflow-hidden transition-all duration-300 hover:shadow-md group relative"
              id={`year-month-card-${m.monthIndex}`}
            >
              {/* Green, Yellow, Red top border indicator in Ethiopian mode */}
              {isEthiopian && (
                <div className="absolute top-0 left-0 right-0 h-[3px] flex overflow-hidden">
                  <div className="flex-1 bg-[#006732]" />
                  <div className="flex-1 bg-[#D1A110]" />
                  <div className="flex-1 bg-[#EF3340]" />
                </div>
              )}

              {/* Month Card Header */}
              <div 
                className="flex items-center justify-between border-b border-brand-dark/8 bg-brand-bg/40 px-3 py-2.5 cursor-pointer hover:bg-[#006732]/5 transition-colors group/header"
                onClick={() => onMonthClick(m.monthIndex)}
                title={isEthiopian ? "ወደዚህ ወር ለመግባት ጠቅ ያድርጉ / Jump to Month View" : "Jump to Month View"}
              >
                <div className="flex flex-col">
                  <span className="font-serif font-black text-xs sm:text-sm text-brand-dark leading-none flex items-center gap-1">
                    {m.title}
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover/header:opacity-100 group-hover/header:translate-x-0.5 text-[#006732] transition-all shrink-0" />
                  </span>
                  <span className="text-[9px] font-serif font-black text-[#006732] mt-0.5 opacity-80">
                    {m.subTitle}
                  </span>
                </div>
                <div className="text-[9px] font-sans font-bold text-brand-dark/40 px-1.5 py-0.5 rounded-sm border border-brand-dark/5 group-hover/header:border-[#006732]/25 group-hover/header:text-[#006732] transition-colors uppercase tracking-wider shrink-0">
                  {isEthiopian ? `ወር ${m.monthIndex}` : `M-${m.monthIndex + 1}`}
                </div>
              </div>

              {/* Mini Month Grid */}
              <div className="p-3 flex flex-col flex-1" id={`mini-month-grid-wrapper-${m.monthIndex}`}>
                {/* Mini Weekday Headers */}
                <div className="grid grid-cols-7 mb-1 text-center border-b border-brand-dark/5 pb-1">
                  {weekdays.map((wd, wdIdx) => (
                    <span
                      key={wdIdx}
                      className="text-[8px] font-sans font-black text-brand-dark/45 uppercase tracking-wider"
                    >
                      {wd}
                    </span>
                  ))}
                </div>

                {/* Days Cells */}
                <div className="grid grid-cols-7 gap-y-1 gap-x-0.5 flex-1 items-center">
                  {m.days.map((day) => {
                    const isSelected = selectedDay && selectedDay.id === day.id;
                    const isHoliday = day.holidays.length > 0;
                    const isToday = day.isToday;

                    const hasMajorFeastOrNational = day.holidays.some(
                      h => h.category === 'major_feast' || h.category === 'national'
                    );
                    const hasMinorFeast = day.holidays.some(h => h.category === 'minor_feast');

                    // Style for day number button
                    let cellBg = 'hover:bg-brand-bg/50';
                    let cellText = isEthiopian ? 'text-brand-dark' : 'text-black font-bold';
                    let cellBorder = 'border border-transparent';

                    if (!day.isCurrentMonth) {
                      // Padding days - completely hide or show extremely faintly
                      return <div key={day.id} className="aspect-square w-full" />;
                    }

                    if (isToday) {
                      cellBg = 'bg-[#006732] text-white font-black shadow-sm';
                    } else if (hasMajorFeastOrNational) {
                      cellText = 'text-[#EF3340] font-extrabold';
                      cellBg = 'bg-[#EF3340]/5 hover:bg-[#EF3340]/12';
                      cellBorder = 'border border-[#EF3340]/15';
                    } else if (hasMinorFeast) {
                      cellText = 'text-[#D1A110] font-extrabold';
                      cellBg = 'bg-[#D1A110]/5 hover:bg-[#D1A110]/12';
                      cellBorder = 'border border-[#D1A110]/15';
                    } else if (day.fasting) {
                      cellText = 'text-amber-800 font-bold';
                      cellBg = 'bg-amber-500/8 hover:bg-amber-500/15';
                      cellBorder = 'border border-amber-500/12';
                    }

                    if (isSelected) {
                      cellBorder = isToday
                        ? 'border border-[#D1A110] ring-1 ring-[#D1A110]'
                        : 'border-2 border-[#D1A110] ring-1 ring-[#D1A110]/30';
                    }

                    return (
                      <button
                        key={day.id}
                        onClick={() => onSelectDay(day)}
                        className={`
                          aspect-square w-full rounded-sm flex items-center justify-center transition-all duration-150 outline-none select-none cursor-pointer
                          ${isEthiopian ? 'text-[9.5px] font-serif font-medium' : 'text-[11.5px] sm:text-xs font-sans font-black'}
                          ${cellBg} ${cellText} ${cellBorder}
                        `}
                        title={
                          isEthiopian
                            ? `${day.ethiopianDay}/${day.ethiopianMonth}/${day.ethiopianYear} (Gregorian: ${day.gregorianDay}/${day.gregorianMonth + 1}/${day.gregorianYear})`
                            : `${day.gregorianDay}/${day.gregorianMonth + 1}/${day.gregorianYear} (Ethiopian: ${day.ethiopianDay}/${day.ethiopianMonth}/${day.ethiopianYear})`
                        }
                      >
                        {isEthiopian ? day.ethiopianDay : day.gregorianDay}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
