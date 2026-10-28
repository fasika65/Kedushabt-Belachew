import { motion } from 'motion/react';
import { CalendarDay, CalendarMode } from '../types';
import { WEEKDAYS, getGeezNumeral } from '../utils/calendar';

interface CalendarGridProps {
  days: CalendarDay[];
  mode: CalendarMode;
  selectedDay: CalendarDay | null;
  onSelectDay: (day: CalendarDay) => void;
  currentYear: number;
  currentMonth: number; // 0-11 for Greg, 1-13 for Eth
}

export default function CalendarGrid({
  days,
  mode,
  selectedDay,
  onSelectDay,
  currentYear,
  currentMonth,
}: CalendarGridProps) {
  return (
    <div className="flex flex-col w-full bg-white border border-brand-dark/15 overflow-hidden shadow-sm rounded-sm" id="calendar-grid-container">
      {/* Red, Yellow, Green horizontal color stripe at top of the grid */}
      <div className="w-full flex h-1.5 overflow-hidden animate-fade-in" id="ethiopian-calendar-top-stripe">
        <div className="flex-1 bg-[#006732]" />
        <div className="flex-1 bg-[#D1A110]" />
        <div className="flex-1 bg-[#EF3340]" />
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 border-b border-brand-dark/10 bg-brand-bg/50" id="weekday-headers-grid">
        {WEEKDAYS.map((day, idx) => (
          <div
            key={day.name}
            id={`weekday-header-${idx}`}
            className="py-2.5 text-center text-[8.5px] xs:text-[10px] uppercase tracking-wider xs:tracking-[0.15em] font-sans font-bold text-brand-dark/60 flex flex-col items-center justify-center gap-0.5"
          >
            <span>{day.shortName}</span>
            <span className="text-[7.5px] xs:text-[9px] font-medium opacity-70 font-sans text-brand-dark">{day.shortAmharicName}</span>
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <motion.div
        key={`${mode}-${currentYear}-${currentMonth}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        id="days-grid-layout"
        className="grid grid-cols-7 grid-rows-6 auto-rows-fr bg-brand-dark/10 gap-[1px]"
      >
        {days.map((day) => {
          const isSelected = selectedDay && selectedDay.id === day.id;
          const isHoliday = day.holidays.length > 0;
          const isEthiopianPrimary = mode === 'ethiopian';

          const hasMajorFeastOrNational = day.holidays.some(h => h.category === 'major_feast' || h.category === 'national');
          const hasMinorFeast = day.holidays.some(h => h.category === 'minor_feast');

          // Holiday Top Line indicators
          const borderTopClass = hasMajorFeastOrNational
            ? 'border-t-2 border-[#EF3340]'
            : hasMinorFeast
              ? 'border-t-2 border-[#D1A110]'
              : 'border-t border-transparent';

          // Determine day color depending on Holiday state
          let primaryDayColor = 'text-brand-dark';
          if (day.isToday) {
            primaryDayColor = 'text-white font-black';
          } else if (hasMajorFeastOrNational) {
            primaryDayColor = 'text-[#EF3340] font-black';
          } else if (hasMinorFeast) {
            primaryDayColor = 'text-[#D1A110] font-bold';
          } else if (isEthiopianPrimary) {
            primaryDayColor = 'text-[#006732] font-semibold';
          } else {
            primaryDayColor = 'text-black font-black';
          }

          const primaryDaySize = isEthiopianPrimary ? 'text-xs xs:text-base sm:text-xl md:text-2xl' : 'text-base xs:text-xl sm:text-3xl md:text-4xl';

          // Get primary monthly commemoration short Amharic name if space allows
          const commName = day.monthlyCommemoration?.amharicName.split(' ')[0] || '';

          return (
            <button
              key={day.id}
              id={`calendar-day-btn-${day.id}`}
              onClick={() => onSelectDay(day)}
              className={`
                relative flex flex-col justify-between p-1 xs:p-1.5 sm:p-2 min-h-[46px] xs:min-h-[52px] sm:min-h-[76px] md:min-h-[86px] lg:min-h-[96px]
                text-left transition-all duration-200 outline-none select-none group focus-visible:ring-2 focus-visible:ring-[#D1A110]/30
                ${day.isToday
                  ? 'bg-[#006732] text-white shadow-md'
                  : day.isCurrentMonth 
                    ? 'bg-white text-brand-dark' 
                    : 'bg-brand-bg/45 text-brand-dark/30 opacity-45'}
                ${borderTopClass}
                ${isSelected 
                  ? day.isToday
                    ? 'bg-[#006732] ring-4 ring-[#D1A110] z-20'
                    : 'bg-[#D1A110]/10 ring-2 ring-[#D1A110] z-20' 
                  : day.isToday
                    ? 'ring-2 ring-[#006732] hover:bg-[#006732]/95 z-10'
                    : 'hover:bg-brand-bg/30'}
                ${day.fasting && !day.isToday ? 'bg-amber-500/[0.02]' : ''}
              `}
            >
              {/* Green, Yellow, Red horizontal stripe at cell top in Ethiopian mode */}
              {mode === 'ethiopian' && (
                <div className="absolute top-0 left-0 right-0 h-[3px] flex overflow-hidden">
                  <div className="flex-1 bg-[#006732]" />
                  <div className="flex-1 bg-[#D1A110]" />
                  <div className="flex-1 bg-[#EF3340]" />
                </div>
              )}

              {/* Day numbers */}
              <div className="flex justify-between items-start w-full" id={`day-numbers-header-${day.id}`}>
                {/* Primary Calendar Day */}
                <div className="flex flex-col items-start leading-none">
                  <span
                    id={`primary-day-${day.id}`}
                    className={`
                      ${primaryDaySize} font-serif tracking-tighter transition-colors
                      ${primaryDayColor}
                    `}
                  >
                    {mode === 'gregorian' ? day.gregorianDay : day.ethiopianDay}
                  </span>
                  {mode === 'ethiopian' && (
                    <span className={`text-[9px] sm:text-[10px] font-serif font-bold mt-0.5 ${day.isToday ? 'text-[#D1A110]' : 'text-brand-dark/50'}`} title="Ge'ez Numeral">
                      {getGeezNumeral(day.ethiopianDay)}
                    </span>
                  )}
                  {day.isToday && (
                    <span className="text-[7.5px] uppercase tracking-tighter font-sans font-black text-[#D1A110] mt-0.5">
                      Today • ዛሬ
                    </span>
                  )}
                </div>

                {/* Secondary Calendar Day (Gregorian in Ethiopian mode, or Ethiopian in Gregorian mode) */}
                {mode === 'gregorian' ? (
                  <span className="flex flex-col items-end leading-none scale-[0.85] origin-top-right xs:scale-100" id={`secondary-day-${day.id}`}>
                    <span className={`text-[9px] sm:text-[13px] font-sans font-black ${day.isToday ? 'text-[#D1A110]' : 'text-[#D1A110]/90'}`} title="Ethiopian Date Number">
                      {day.ethiopianDay}
                    </span>
                    <span className={`text-[7px] sm:text-[9px] font-serif font-bold mt-0.5 ${day.isToday ? 'text-white/70' : 'text-brand-dark/40'}`} title="Ge'ez Numeral">
                      {getGeezNumeral(day.ethiopianDay)}
                    </span>
                    <span className={`text-[6px] sm:text-[7px] font-bold uppercase mt-0.5 ${day.isToday ? 'text-white/60' : 'text-brand-dark/40'}`}>
                      M:{day.ethiopianMonth}
                    </span>
                  </span>
                ) : (
                  <span
                    id={`secondary-day-${day.id}`}
                    className={`
                      text-[10px] sm:text-sm font-sans font-black transition-colors
                      ${day.isToday 
                        ? 'text-white/90' 
                        : hasMajorFeastOrNational 
                          ? 'text-[#EF3340]' 
                          : hasMinorFeast 
                            ? 'text-[#D1A110]' 
                            : 'text-black'}
                    `}
                  >
                    {day.gregorianDay}
                  </span>
                )}
              </div>

              {/* Commemoration & Fasting Label footer */}
              <div className="flex flex-col gap-1 w-full mt-1.5" id={`day-labels-footer-${day.id}`}>
                {/* Desktop view detail lines */}
                <div className="hidden sm:flex flex-col gap-0.5 max-w-full overflow-hidden" id={`desktop-holiday-names-${day.id}`}>
                  
                  {/* Daily Saint Commemoration - extremely traditional */}
                  {day.isCurrentMonth && commName && (
                    <span className={`text-[8px] truncate font-serif ${day.isToday ? 'text-white/75' : 'text-brand-dark/50 font-semibold'}`} title={day.monthlyCommemoration?.name}>
                      {commName}
                    </span>
                  )}

                  {/* Fasting tag */}
                  {day.fasting && (
                    <span
                      id={`fasting-tag-${day.id}`}
                      className={`
                        text-[7.5px] font-sans font-black px-1 py-0.5 rounded-sm truncate leading-none mt-0.5
                        bg-amber-500/10 text-amber-700 border border-amber-500/15
                        ${day.fasting.isStartDay || day.fasting.isEndDay ? 'ring-1 ring-amber-500/40 bg-amber-500/20' : ''}
                      `}
                      title={`${day.fasting.name}${day.fasting.isStartDay ? ' (Starts)' : ''}${day.fasting.isEndDay ? ' (Ends)' : ''}`}
                    >
                      ✝ {day.fasting.amharicName}
                    </span>
                  )}

                  {/* Holiday badges */}
                  {day.holidays.slice(0, 1).map((h) => (
                    <span
                      key={h.id}
                      id={`holiday-tag-${h.id}-${day.id}`}
                      className={`
                        text-[7.5px] font-sans font-bold px-1 py-0.5 rounded-sm truncate leading-none mt-0.5
                        ${h.category === 'major_feast' || h.category === 'national'
                          ? 'bg-[#EF3340]/5 text-[#EF3340] border border-[#EF3340]/15 font-black'
                          : 'bg-[#006732]/5 text-[#006732] border border-[#006732]/15'}
                      `}
                    >
                      {h.localName || h.name}
                    </span>
                  ))}
                </div>

                {/* Mobile indicators (dots/icons) */}
                <div className="flex sm:hidden gap-1 justify-end w-full mt-auto" id={`mobile-holiday-dots-${day.id}`}>
                  {day.fasting && (
                    <span
                      id={`fast-dot-${day.id}`}
                      className="w-1.5 h-1.5 rounded-full bg-amber-500"
                      title={`Fasting: ${day.fasting.name}`}
                    />
                  )}
                  {day.holidays.length > 0 && (
                    <span
                      id={`holiday-dot-${day.id}`}
                      className={`w-1.5 h-1.5 rounded-full ${hasMajorFeastOrNational ? 'bg-[#EF3340]' : 'bg-[#D1A110]'}`}
                      title="Holiday"
                    />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}
