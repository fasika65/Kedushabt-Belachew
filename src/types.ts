export type CalendarMode = 'gregorian' | 'ethiopian';

export interface Holiday {
  id: string;
  name: string;
  localName?: string; // e.g. Amharic name
  date: {
    gregorian?: { month: number; day: number }; // 1-indexed (1-12)
    ethiopian?: { month: number; day: number }; // 1-indexed (1-13)
  };
  category: 'major_feast' | 'minor_feast' | 'commemoration' | 'national';
  description?: string;
  localDescription?: string; // Amharic description
}

export interface FastingInfo {
  name: string;
  amharicName: string;
  description?: string;
  isStartDay?: boolean;
  isEndDay?: boolean;
  isOptional?: boolean;
}

export interface CalendarDay {
  id: string;
  gregorianDate: Date;
  gregorianYear: number;
  gregorianMonth: number; // 0-11
  gregorianDay: number; // 1-31
  ethiopianYear: number;
  ethiopianMonth: number; // 1-13
  ethiopianDay: number; // 1-30
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  isCurrentMonth: boolean; // relative to currently viewed month (Gregorian or Ethiopian)
  isToday: boolean;
  holidays: Holiday[];
  fasting?: FastingInfo;
  monthlyCommemoration?: { name: string; amharicName: string };
}

export interface EthiopianMonthInfo {
  number: number; // 1-13
  name: string; // English phonetic
  amharicName: string; // Ge'ez characters
  gregorianRange: string; // e.g., "Sep - Oct"
}
