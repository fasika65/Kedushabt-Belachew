import { CalendarDay, Holiday } from '../types';
import { ETHIOPIAN_MONTHS, GREGORIAN_MONTHS, generateEthiopianCalendar, generateGregorianCalendar } from './calendar';

export interface ICSExportOptions {
  includeFeasts: boolean;
  includeFasting: boolean;
  includeWeeklyFasts: boolean;
  includeMonthlyCommemorations: boolean;
  includePublicHolidays: boolean;
  timeframe: 'current_month' | 'full_year';
  mode: 'ethiopian' | 'gregorian';
  year: number;
  month: number; // 0-11 for Gregorian, 1-13 for Ethiopian
  ausState: string;
}

export const DEFAULT_EXPORT_OPTIONS: ICSExportOptions = {
  includeFeasts: true,
  includeFasting: true,
  includeWeeklyFasts: false,
  includeMonthlyCommemorations: true,
  includePublicHolidays: true,
  timeframe: 'current_month',
  mode: 'ethiopian',
  year: 2018,
  month: 8,
  ausState: 'NONE',
};

// Utility to escape text per RFC 5545 iCalendar specification
function escapeICSText(str: string): string {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

// Format a Date object to YYYYMMDD string for all-day events
function formatDateToICSDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

// Get day after for non-inclusive DTEND in all-day events
function getNextDayICSDate(date: Date): string {
  const next = new Date(date);
  next.setDate(next.getDate() + 1);
  return formatDateToICSDate(next);
}

export interface ICSEvent {
  uid: string;
  startDate: Date;
  summary: string;
  description: string;
  categories: string;
  location?: string;
}

// Collect all relevant events for a set of calendar days according to options
export function collectICSEvents(days: CalendarDay[], options: ICSExportOptions): ICSEvent[] {
  const events: ICSEvent[] = [];
  const processedKeys = new Set<string>();

  // Filter days: if timeframe is current_month, take only current month days
  const targetDays = options.timeframe === 'current_month' 
    ? days.filter(d => d.isCurrentMonth)
    : days;

  for (const day of targetDays) {
    const startDate = day.gregorianDate;
    const dateStr = formatDateToICSDate(startDate);

    const ethMonthInfo = ETHIOPIAN_MONTHS[day.ethiopianMonth - 1];
    const ethDateText = `${ethMonthInfo ? ethMonthInfo.amharicName : ''} ${day.ethiopianDay}, ${day.ethiopianYear} ዓ.ም. (${ethMonthInfo ? ethMonthInfo.name : ''} ${day.ethiopianDay}, ${day.ethiopianYear} E.C.)`;
    const gregDateText = `${GREGORIAN_MONTHS[day.gregorianMonth]} ${day.gregorianDay}, ${day.gregorianYear}`;

    // 1. Process Holidays & Liturgical Feasts
    if (day.holidays && day.holidays.length > 0) {
      for (const hol of day.holidays) {
        const isPublic = hol.category === 'national';
        const isFeast = hol.category === 'major_feast' || hol.category === 'minor_feast' || hol.category === 'commemoration';

        if ((isPublic && options.includePublicHolidays) || (isFeast && options.includeFeasts)) {
          const key = `${dateStr}-hol-${hol.id}`;
          if (!processedKeys.has(key)) {
            processedKeys.add(key);

            let prefix = '[Feast]';
            if (hol.category === 'major_feast') prefix = '✝ [Major Feast]';
            else if (hol.category === 'minor_feast') prefix = '✦ [Minor Feast]';
            else if (hol.category === 'national') prefix = '🇦🇺🇪🇹 [Public Holiday]';
            else prefix = '🕯 [Commemoration]';

            const localTitle = hol.localName ? ` (${hol.localName})` : '';
            const summary = `${prefix} ${hol.name}${localTitle}`;

            const descLines: string[] = [
              `Title: ${hol.name} ${hol.localName ? `/ ${hol.localName}` : ''}`,
              `Category: ${hol.category.replace('_', ' ').toUpperCase()}`,
              `Ethiopian Date: ${ethDateText}`,
              `Gregorian Date: ${gregDateText}`,
            ];

            if (hol.description) descLines.push(`Description: ${hol.description}`);
            if (hol.localDescription) descLines.push(`የዕለቱ መግለጫ: ${hol.localDescription}`);

            events.push({
              uid: `${key}@eotc-liturgical-calendar`,
              startDate,
              summary,
              description: descLines.join('\n'),
              categories: isPublic ? 'HOLIDAY,PUBLIC' : 'LITURGICAL,FEAST,ORTHODOX',
            });
          }
        }
      }
    }

    // 2. Process Fasting Days
    if (day.fasting && options.includeFasting) {
      const isWeeklyFast = day.fasting.name.includes('Wednesday') || day.fasting.name.includes('Friday');
      const shouldInclude = !isWeeklyFast || options.includeWeeklyFasts;

      if (shouldInclude) {
        const key = `${dateStr}-fast-${day.fasting.name}`;
        if (!processedKeys.has(key)) {
          processedKeys.add(key);

          const summary = `🐟 [Fasting] ${day.fasting.name} (${day.fasting.amharicName})`;

          const descLines: string[] = [
            `Fast: ${day.fasting.name} / ${day.fasting.amharicName}`,
            `Ethiopian Date: ${ethDateText}`,
            `Gregorian Date: ${gregDateText}`,
          ];

          if (day.fasting.description) {
            descLines.push(`Significance: ${day.fasting.description}`);
          }
          if (day.fasting.isStartDay) descLines.push(`Status: Beginning of Fast`);
          if (day.fasting.isEndDay) descLines.push(`Status: Concluding Day of Fast`);

          events.push({
            uid: `${key}@eotc-liturgical-calendar`,
            startDate,
            summary,
            description: descLines.join('\n'),
            categories: 'LITURGICAL,FASTING,ORTHODOX',
          });
        }
      }
    }

    // 3. Process Monthly Saints Commemorations
    if (day.monthlyCommemoration && options.includeMonthlyCommemorations) {
      const key = `${dateStr}-commem-${day.ethiopianDay}`;
      if (!processedKeys.has(key)) {
        processedKeys.add(key);

        const summary = `✨ [Saint Commemoration] ${day.monthlyCommemoration.amharicName} (${day.monthlyCommemoration.name})`;

        const descLines: string[] = [
          `Monthly Commemoration: ${day.monthlyCommemoration.amharicName}`,
          `English Name: ${day.monthlyCommemoration.name}`,
          `Day of Ethiopian Month: Day ${day.ethiopianDay}`,
          `Ethiopian Date: ${ethDateText}`,
          `Gregorian Date: ${gregDateText}`,
          `Significance: Traditional Ethiopian Orthodox monthly feast dedicated to saints, holy angels, or divine events.`,
        ];

        events.push({
          uid: `${key}@eotc-liturgical-calendar`,
          startDate,
          summary,
          description: descLines.join('\n'),
          categories: 'LITURGICAL,COMMEMORATION,SAINTS',
        });
      }
    }
  }

  return events;
}

// Generate full RFC 5545 ICS string formatted for calendar imports
export function generateICSContent(events: ICSEvent[], calendarTitle: string): string {
  const now = new Date();
  const dtStamp = formatDateToICSDate(now) + 'T' + 
    String(now.getUTCHours()).padStart(2, '0') + 
    String(now.getUTCMinutes()).padStart(2, '0') + 
    String(now.getUTCSeconds()).padStart(2, '0') + 'Z';

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Ethiopian Orthodox Tewahedo Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeICSText(calendarTitle)}`,
    'X-WR-CALDESC:Ethiopian Orthodox Tewahedo Church Liturgical Feasts\\, Fasting\\, Saints Commemorations & Public Holidays',
    'X-WR-TIMEZONE:UTC',
  ];

  for (const ev of events) {
    const dtStart = formatDateToICSDate(ev.startDate);
    const dtEnd = getNextDayICSDate(ev.startDate);

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${ev.uid}`);
    lines.push(`DTSTAMP:${dtStamp}`);
    lines.push(`DTSTART;VALUE=DATE:${dtStart}`);
    lines.push(`DTEND;VALUE=DATE:${dtEnd}`);
    lines.push(`SUMMARY:${escapeICSText(ev.summary)}`);
    lines.push(`DESCRIPTION:${escapeICSText(ev.description)}`);
    if (ev.categories) {
      lines.push(`CATEGORIES:${escapeICSText(ev.categories)}`);
    }
    lines.push('STATUS:CONFIRMED');
    lines.push('TRANSP:TRANSPARENT'); // All-day event doesn't block availability
    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');

  return lines.join('\r\n');
}

// Helper to trigger download of the .ics file in browser
export function triggerICSDownload(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename.endsWith('.ics') ? filename : `${filename}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Main helper function to gather days and trigger export
export function exportCalendarToICS(
  currentDays: CalendarDay[],
  currentTitle: string,
  options: ICSExportOptions
): { eventCount: number; filename: string } {
  let daysToExport: CalendarDay[] = currentDays;

  // If full year is selected, generate all days for the year
  if (options.timeframe === 'full_year') {
    const allYearDays: CalendarDay[] = [];
    if (options.mode === 'ethiopian') {
      for (let m = 1; m <= 13; m++) {
        const mDays = generateEthiopianCalendar(options.year, m, options.ausState);
        allYearDays.push(...mDays.filter(d => d.isCurrentMonth));
      }
    } else {
      for (let m = 0; m < 12; m++) {
        const mDays = generateGregorianCalendar(options.year, m, options.ausState);
        allYearDays.push(...mDays.filter(d => d.isCurrentMonth));
      }
    }
    daysToExport = allYearDays;
  }

  const events = collectICSEvents(daysToExport, options);
  
  const cleanTitle = options.timeframe === 'full_year'
    ? `EOTC Liturgical Calendar - ${options.year} ${options.mode === 'ethiopian' ? 'E.C.' : 'G.C.'}`
    : `EOTC Liturgical Calendar - ${currentTitle}`;

  const rawFilename = options.timeframe === 'full_year'
    ? `EOTC_Liturgical_Calendar_${options.year}_${options.mode.toUpperCase()}`
    : `EOTC_Calendar_${currentTitle.replace(/[^a-zA-Z0-9]/g, '_')}`;

  const icsString = generateICSContent(events, cleanTitle);
  triggerICSDownload(icsString, `${rawFilename}.ics`);

  return {
    eventCount: events.length,
    filename: `${rawFilename}.ics`,
  };
}
