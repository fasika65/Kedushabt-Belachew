import { toEthiopian, toGregorian } from 'ethiopian-date';
import { Holiday, CalendarDay, EthiopianMonthInfo, FastingInfo } from '../types';

// Ethiopian Month metadata
export const ETHIOPIAN_MONTHS: EthiopianMonthInfo[] = [
  { number: 1, name: 'Meskerem', amharicName: 'መስከረም', gregorianRange: 'Sep - Oct' },
  { number: 2, name: 'Tekemt', amharicName: 'ጥቅምት', gregorianRange: 'Oct - Nov' },
  { number: 3, name: 'Hedar', amharicName: 'ኅዳር', gregorianRange: 'Nov - Dec' },
  { number: 4, name: 'Tahsas', amharicName: 'ታኅሣሥ', gregorianRange: 'Dec - Jan' },
  { number: 5, name: 'Ter', amharicName: 'ጥር', gregorianRange: 'Jan - Feb' },
  { number: 6, name: 'Yekatit', amharicName: 'የካቲት', gregorianRange: 'Feb - Mar' },
  { number: 7, name: 'Megabit', amharicName: 'መጋቢት', gregorianRange: 'Mar - Apr' },
  { number: 8, name: 'Miazia', amharicName: 'ሚያዝያ', gregorianRange: 'Apr - May' },
  { number: 9, name: 'Ginbot', amharicName: 'ግንቦት', gregorianRange: 'May - Jun' },
  { number: 10, name: 'Sene', amharicName: 'ሰኔ', gregorianRange: 'Jun - Jul' },
  { number: 11, name: 'Hamle', amharicName: 'ሐምሌ', gregorianRange: 'Jul - Aug' },
  { number: 12, name: 'Nehase', amharicName: 'ነሐሴ', gregorianRange: 'Aug - Sep' },
  { number: 13, name: 'Pagume', amharicName: 'ጳጉሜ', gregorianRange: 'Sep' },
];

export const GREGORIAN_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const WEEKDAYS = [
  { name: 'Sunday', shortName: 'Sun', amharicName: 'እሁድ', shortAmharicName: 'እሁ' },
  { name: 'Monday', shortName: 'Mon', amharicName: 'ሰኞ', shortAmharicName: 'ሰኞ' },
  { name: 'Tuesday', shortName: 'Tue', amharicName: 'ማክሰኞ', shortAmharicName: 'ማክ' },
  { name: 'Wednesday', shortName: 'Wed', amharicName: 'ረቡዕ', shortAmharicName: 'ረቡ' },
  { name: 'Thursday', shortName: 'Thu', amharicName: 'ሐሙስ', shortAmharicName: 'ሐሙ' },
  { name: 'Friday', shortName: 'Fri', amharicName: 'አርብ', shortAmharicName: 'አር' },
  { name: 'Saturday', shortName: 'Sat', amharicName: 'ቅዳሜ', shortAmharicName: 'ቅዳ' },
];

// EOTC Monthly Commemoration Cycles (saints and angels commemorated on days 1 to 30 of every Ethiopian month)
export const MONTHLY_COMMEMORATIONS: Record<number, { name: string; amharicName: string }> = {
  1: { name: "Lideta (Birth of Mary) • Raguel • Elias", amharicName: "ልደታ፣ ራጉኤል፣ ኤልያስ" },
  2: { name: "Thaddaeus the Apostle (Tadeos) • Job the Righteous", amharicName: "ታዴዎስ ሐዋርያ፣ ኢዮብ ጻድቅ" },
  3: { name: "Ba'ata Maryam (Presentation of Mary) • Zena Markos • Ne'akuto Le'Ab", amharicName: "በዓታ ማርያም፣ ዜና ማርቆስ፣ ነአኩቶ ለአብ" },
  4: { name: "Yohannes Wolde Negodgwad (John the Apostle, Son of Thunder)", amharicName: "ዮሐንስ ወልደ ነጎድጓድ" },
  5: { name: "Petros we Pawlos (Peter and Paul) • Abune Gebre Menfes Kidus", amharicName: "ጴጥሮስ ወጳውሎስ፣ አቡነ ገብረ መንፈስ ቅዱስ" },
  6: { name: "Iyasus (Feast of Jesus) • Qusquam • Saint Arsema", amharicName: "ኢየሱስ፣ ቁስቋም፣ አርሴማ ቅድስት" },
  7: { name: "Sillase (Holy Trinity) • Philimon • Ablanios", amharicName: "ሥላሴ፣ ፊሊሞን፣ አብላንዮስ" },
  8: { name: "Matewos (Matthew the Apostle) • Yolianos • Abba Kiros", amharicName: "ማቴዎስ፣ ዮልያኖስ፣ አባ ኪሮስ" },
  9: { name: "Thomas the Apostle • Andrias (Andrew) the Apostle • Eusabios • Forty Martyrs (Arba Semat)", amharicName: "ቶማስ ሐዋርያ፣ እንድርያስ ሐዋርያ፣ አውሳብዮስ፣ አርባ ሰማዕታት" },
  10: { name: "Be'ale Meskelu Le'Egzi'ene (Feast of the Cross)", amharicName: "በዓለ መስቀሉ ለእግዚእነ" },
  11: { name: "Hana we Iyakem (Hannah & Joachim) • Saint Fasilides (Basilides) the Martyr", amharicName: "ሃና ወኢያቄም፣ ቅዱስ ፋሲለደስ ሰማዕት" },
  12: { name: "Saint Michael • Kristos Semra", amharicName: "ቅዱስ ሚካኤል፣ ክርስቶስ ሠምራ" },
  13: { name: "Egziabher Ab (God the Father) • Saint Raphael (Refael)", amharicName: "እግዚአብሔር አብ፣ ቅዱስ ሩፋኤል ሊቀ መላእክት" },
  14: { name: "Abba Aragawi • Abba Gebre Kristos • Demtianos (Domitian) the Martyr", amharicName: "አባ አረጋዊ፣ አባ ገብረ ክርስቶስ፣ ድምጥያኖስ ሰማዕት" },
  15: { name: "Kirkos we Iyaluta (Cyriacus and Julitta) • Silfacos", amharicName: "ቂርቆስና ኢየሉጣ، ስልፋኮስ" },
  16: { name: "Kidane Meheret (Covenant of Mercy) • Michael the Bishop", amharicName: "ኪዳነ ምሕረት፣ ሚካኤል ጳጳስ" },
  17: { name: "Saint Stephen (Estifanos) • Lucas (Luke) of the Pillar of Light", amharicName: "ቅዱስ እስጢፋኖስ፣ ሉቃስ ዘዓምደ ብርሃን" },
  18: { name: "Philip the Apostle • Esidros the Martyr • Ewostatewos the Martyr", amharicName: "ፊልጶስ ሐዋርያ፣ ኤስድሮስ ሰማዕት፣ ኤዎስጣጤዎስ ሰማዕት" },
  19: { name: "Saint Gabriel • Arkadios (Arcadius)", amharicName: "ቅዱስ ገብርኤል፣ አርቃዲዎስ" },
  20: { name: "Conception of Mary (Tsinseta LeMaryam) • Prophet Elisha (Elsa) • Prophet Haggai (Hage) • Abba Salama the Translator", amharicName: "ጽንሰታ ለማርያም፣ ነቢዩ ኤልሳ፣ ሐጌ ነቢይ፣ አባ ሰላማ መተርጉም" },
  21: { name: "Be'ale Egzi'etne Maryam (Feast of Our Lady Mary)", amharicName: "በዓለ እግዝእትነ ማርያም" },
  22: { name: "Saint Urael • Ya'eqob the Easterner • Deksius", amharicName: "ቅዱስ ዑራኤል፣ ያዕቆብ ምሥራቃዊ፣ ደቅስዮስ" },
  23: { name: "Saint George (Giorgis) • Leginos the Martyr", amharicName: "ቅዱስ ጊዮርጊስ፣ ለጊኖስ ሰማዕት" },
  24: { name: "Abune Tekle Haymanot", amharicName: "አቡነ ተክለ ሃይማኖት" },
  25: { name: "Mercurius (Merkorewos) • Anifnos", amharicName: "መርቆሬዎስ፣ አኒፍኖስ" },
  26: { name: "Prophet Hosea (Hose'e) • Sadoq (Zadok) the Martyr", amharicName: "ሆሴዕ ነቢይ፣ ሳዶቅ ሰማዕት" },
  27: { name: "Medhane Alem (Savior of the World) • Prophet Hezekiah (Hizqiyas) • Abba Yohannes", amharicName: "መድኃኔዓለም፣ ሕዝቅያስ ነቢይ፣ አባ ዮሐንስ" },
  28: { name: "Amanuel (Emmanuel) • Constantinos (Constantine) • Abraham", amharicName: "አማኑኤል፣ ቆስጠንጢኖስ፣ አብርሃም" },
  29: { name: "Be'ale Wold (Feast of the Son) • Samuel of Wegeg", amharicName: "በዓለ ወልድ፣ ሳሙኤል ዘወገግ" },
  30: { name: "Mark the Evangelist (Markos)", amharicName: "ማርቆስ ወንጌላዊ" },
};

export function getMonthlyCommemoration(month: number, day: number) {
  if (month === 13) {
    const pagumeComm: Record<number, { name: string; amharicName: string }> = {
      1: { name: "Enoch (Enoch's translation)", amharicName: "ቅዱስ ሄኖክ" },
      2: { name: "Didymus", amharicName: "ቅዱስ ዲዲሞስ" },
      3: { name: "Refael (Archangel Raphael's Great Feast)", amharicName: "ሩፋኤል ሊቀ መላእክት (ታላቅ በዓል)" },
      4: { name: "John the Apostle / Melchizedek", amharicName: "ዮሐንስ ወንጌላዊ / መልከ ጼዴቅ" },
      5: { name: "Petros (Apostle Peter)", amharicName: "ቅዱስ ጴጥሮስ" },
      6: { name: "Gratitude / End of Year", amharicName: "የምስጋና ቀን" }
    };
    return pagumeComm[day];
  }
  return MONTHLY_COMMEMORATIONS[day];
}

// Lookup table for movable national religious holidays (Islamic) 2024-2030
interface MovableHolidays {
  eidAlFitr: { month: number; day: number };
  eidAlAdha: { month: number; day: number };
  mawlid: { month: number; day: number };
}

export const MOVABLE_LOOKUP: Record<number, MovableHolidays> = {
  2024: {
    eidAlFitr: { month: 4, day: 10 },
    eidAlAdha: { month: 6, day: 16 },
    mawlid: { month: 9, day: 15 },
  },
  2025: {
    eidAlFitr: { month: 3, day: 30 },
    eidAlAdha: { month: 6, day: 6 },
    mawlid: { month: 9, day: 4 },
  },
  2026: {
    eidAlFitr: { month: 3, day: 20 },
    eidAlAdha: { month: 5, day: 26 },
    mawlid: { month: 8, day: 25 },
  },
  2027: {
    eidAlFitr: { month: 3, day: 10 },
    eidAlAdha: { month: 5, day: 16 },
    mawlid: { month: 8, day: 14 },
  },
  2028: {
    eidAlFitr: { month: 2, day: 27 },
    eidAlAdha: { month: 5, day: 5 },
    mawlid: { month: 8, day: 3 },
  },
  2029: {
    eidAlFitr: { month: 2, day: 15 },
    eidAlAdha: { month: 4, day: 24 },
    mawlid: { month: 7, day: 23 },
  },
  2030: {
    eidAlFitr: { month: 2, day: 4 },
    eidAlAdha: { month: 4, day: 13 },
    mawlid: { month: 7, day: 12 },
  },
};

// --- Australian Public Holiday Computation Functions ---

export function getGregorianEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const L = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * L) / 451);
  const month = Math.floor((h + L - 7 * m + 114) / 31);
  const day = ((h + L - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

export function getNthWeekdayOfMonth(year: number, month: number, weekday: number, n: number): Date {
  if (n > 0) {
    let count = 0;
    for (let d = 1; d <= 31; d++) {
      const date = new Date(year, month, d);
      if (date.getMonth() !== month) break;
      if (date.getDay() === weekday) {
        count++;
        if (count === n) return date;
      }
    }
  } else {
    const lastDay = new Date(year, month + 1, 0).getDate();
    for (let d = lastDay; d >= 1; d--) {
      const date = new Date(year, month, d);
      if (date.getDay() === weekday) return date;
    }
  }
  return new Date(year, month, 1);
}

function getNewYearHolidays(year: number) {
  const base = new Date(year, 0, 1);
  const list = [{ date: base, isSubstitute: false, name: "New Year's Day" }];
  if (base.getDay() === 0 || base.getDay() === 6) {
    const monday = base.getDay() === 6 ? new Date(year, 0, 3) : new Date(year, 0, 2);
    list.push({ date: monday, isSubstitute: true, name: "New Year's Day (Substitute Day)" });
  }
  return list;
}

function getAustraliaDayHolidays(year: number) {
  const base = new Date(year, 0, 26);
  const list = [{ date: base, isSubstitute: false, name: "Australia Day" }];
  if (base.getDay() === 0 || base.getDay() === 6) {
    const monday = base.getDay() === 6 ? new Date(year, 0, 28) : new Date(year, 0, 27);
    list.push({ date: monday, isSubstitute: true, name: "Australia Day (Substitute Day)" });
  }
  return list;
}

function getAnzacDayHolidays(year: number, state: string) {
  const base = new Date(year, 3, 25);
  const list = [{ date: base, isSubstitute: false, name: "Anzac Day" }];
  if (base.getDay() === 0) {
    if (['WA', 'ACT', 'NT', 'QLD', 'SA'].includes(state)) {
      list.push({ date: new Date(year, 3, 26), isSubstitute: true, name: "Anzac Day (Substitute Day)" });
    }
  } else if (base.getDay() === 6) {
    if (state === 'WA') {
      list.push({ date: new Date(year, 3, 27), isSubstitute: true, name: "Anzac Day (Substitute Day)" });
    }
  }
  return list;
}

function getChristmasBoxingHolidays(year: number, state: string) {
  const xmas = new Date(year, 11, 25);
  const boxingName = state === 'SA' ? "Proclamation Day" : "Boxing Day";
  const boxing = new Date(year, 11, 26);
  const list = [
    { date: xmas, isSubstitute: false, name: "Christmas Day" },
    { date: boxing, isSubstitute: false, name: boxingName }
  ];
  const xmasDay = xmas.getDay();
  if (xmasDay === 6) {
    list.push({ date: new Date(year, 11, 27), isSubstitute: true, name: "Christmas Day (Substitute Day)" });
    list.push({ date: new Date(year, 11, 28), isSubstitute: true, name: `${boxingName} (Substitute Day)` });
  } else if (xmasDay === 0) {
    list.push({ date: new Date(year, 11, 27), isSubstitute: true, name: "Christmas Day (Substitute Day)" });
    list.push({ date: new Date(year, 11, 28), isSubstitute: true, name: `${boxingName} (Substitute Day)` });
  } else if (xmasDay === 5) {
    list.push({ date: new Date(year, 11, 28), isSubstitute: true, name: `${boxingName} (Substitute Day)` });
  }
  return list;
}

function getReconciliationDay(year: number): Date {
  const base = new Date(year, 4, 27);
  const day = base.getDay();
  if (day === 1) return base;
  const diff = (8 - day) % 7;
  return addDays(base, diff === 0 ? 7 : diff);
}

export function getAustralianHolidays(year: number, state: string): Holiday[] {
  if (state === 'NONE' || !state) return [];
  const holidays: Holiday[] = [];
  const easter = getGregorianEaster(year);

  const addAusHoliday = (name: string, date: Date, description: string) => {
    holidays.push({
      id: `aus-${state.toLowerCase()}-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${year}-${date.getMonth() + 1}-${date.getDate()}`,
      name: `${name} (${state})`,
      category: 'national',
      date: {
        gregorian: { month: date.getMonth() + 1, day: date.getDate() }
      },
      description: `${description} - Public holiday in ${state}, Australia.`,
    });
  };

  getNewYearHolidays(year).forEach(h => {
    addAusHoliday(h.name, h.date, "New Year's Day celebration.");
  });

  getAustraliaDayHolidays(year).forEach(h => {
    addAusHoliday(h.name, h.date, "Australia's national day, marking the 1788 arrival of the First Fleet.");
  });

  addAusHoliday("Good Friday", addDays(easter, -2), "Solemn Christian commemoration of the crucifixion of Jesus Christ.");

  if (!['TAS', 'WA'].includes(state)) {
    addAusHoliday("Easter Saturday", addDays(easter, -1), "Day of reflection between Good Friday and Easter Sunday.");
  }

  if (!['WA', 'TAS'].includes(state)) {
    addAusHoliday("Easter Sunday", easter, "Christian celebration of the Resurrection of Jesus Christ.");
  }

  addAusHoliday("Easter Monday", addDays(easter, 1), "Gregorian Easter Monday public holiday.");

  getAnzacDayHolidays(year, state).forEach(h => {
    addAusHoliday(h.name, h.date, "National day of remembrance in Australia and New Zealand for those who served.");
  });

  if (['ACT', 'NSW', 'NT', 'SA', 'TAS', 'VIC'].includes(state)) {
    addAusHoliday("King's Birthday", getNthWeekdayOfMonth(year, 5, 1, 2), "Public holiday celebrating the sovereign's official birthday.");
  } else if (state === 'WA') {
    addAusHoliday("King's Birthday", getNthWeekdayOfMonth(year, 8, 1, -1), "Public holiday celebrating the sovereign's official birthday.");
  } else if (state === 'QLD') {
    addAusHoliday("King's Birthday", getNthWeekdayOfMonth(year, 9, 1, 1), "Public holiday celebrating the sovereign's official birthday.");
  }

  if (['ACT', 'NSW', 'SA'].includes(state)) {
    addAusHoliday("Labour Day", getNthWeekdayOfMonth(year, 9, 1, 1), "Honors workers' achievements and the 8-hour workday.");
  } else if (state === 'VIC') {
    addAusHoliday("Labour Day", getNthWeekdayOfMonth(year, 2, 1, 2), "Honors workers' achievements and the 8-hour workday.");
  } else if (state === 'TAS') {
    addAusHoliday("Eight Hours Day", getNthWeekdayOfMonth(year, 2, 1, 2), "Honors workers' achievements and the 8-hour workday.");
  } else if (state === 'WA') {
    addAusHoliday("Labour Day", getNthWeekdayOfMonth(year, 2, 1, 1), "Honors workers' achievements and the 8-hour workday.");
  } else if (state === 'QLD') {
    addAusHoliday("Labour Day", getNthWeekdayOfMonth(year, 4, 1, 1), "Honors workers' achievements and the 8-hour workday.");
  } else if (state === 'NT') {
    addAusHoliday("May Day", getNthWeekdayOfMonth(year, 4, 1, 1), "Honors workers' achievements and the 8-hour workday.");
  }

  getChristmasBoxingHolidays(year, state).forEach(h => {
    addAusHoliday(h.name, h.date, h.name === "Proclamation Day" ? "South Australian celebration of the establishment of government." : "Festive commemoration of the Nativity of Christ.");
  });

  if (state === 'ACT') {
    addAusHoliday("Canberra Day", getNthWeekdayOfMonth(year, 2, 1, 2), "Celebrating the naming of the nation's capital.");
    addAusHoliday("Reconciliation Day", getReconciliationDay(year), "Marks the anniversary of the 1967 referendum.");
  } else if (state === 'WA') {
    addAusHoliday("Western Australia Day", getNthWeekdayOfMonth(year, 5, 1, 1), "Celebrating the founding of the Swan River Colony.");
  } else if (state === 'NT') {
    addAusHoliday("Picnic Day", getNthWeekdayOfMonth(year, 7, 1, 1), "Traditional Northern Territory holiday.");
  } else if (state === 'VIC') {
    addAusHoliday("Melbourne Cup Day", getNthWeekdayOfMonth(year, 10, 2, 1), "The race that stops a nation.");
    const septLastFri = getNthWeekdayOfMonth(year, 8, 5, -1);
    addAusHoliday("Friday before AFL Grand Final", septLastFri, "Grand Final eve public holiday.");
  } else if (state === 'SA') {
    addAusHoliday("Adelaide Cup Day", getNthWeekdayOfMonth(year, 2, 1, 2), "Celebrating the Adelaide Cup horse race.");
  }

  return holidays;
}

// Helper to add calendar days safely avoiding DST/timezone shifts
export function addDays(date: Date, days: number): Date {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  result.setDate(result.getDate() + days);
  return result;
}

// Helper to determine Ghad (strict fasting eve) with the Saturday/Sunday Friday-shift rule
function isGhadFast(gDate: Date, nominalEve: Date): boolean {
  const gDateMidnight = new Date(gDate.getFullYear(), gDate.getMonth(), gDate.getDate());
  const nominalMidnight = new Date(nominalEve.getFullYear(), nominalEve.getMonth(), nominalEve.getDate());
  const dayOfWeek = nominalMidnight.getDay(); // 0 = Sunday, 6 = Saturday
  
  if (dayOfWeek === 0) {
    const shiftedFriday = addDays(nominalMidnight, -2);
    return gDateMidnight.getTime() === shiftedFriday.getTime();
  } else if (dayOfWeek === 6) {
    const shiftedFriday = addDays(nominalMidnight, -1);
    return gDateMidnight.getTime() === shiftedFriday.getTime();
  } else {
    return gDateMidnight.getTime() === nominalMidnight.getTime();
  }
}

// Helper to check if two dates are on the same day
function isSameDay(d1: Date, d2: Date): boolean {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}

// Helper to check if a date falls between two dates inclusive
function isBetweenDays(target: Date, start: Date, end: Date): boolean {
  const t = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  const e = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
  return t >= s && t <= e;
}

// Bahre Hasab - Calculate the exact Ethiopian date (month and day) of Tsome Nenewe for an Ethiopian year
export function calculateNenewe(ey: number): { month: number; day: number } {
  const amheteAlem = ey + 5500;
  const medeb = amheteAlem % 19;
  const wenber = medeb === 0 ? 18 : medeb - 1;
  const abeqte = wenber === 0 ? 0 : (wenber * 11) % 30;
  const metqie = 30 - abeqte;
  
  let metqieMonth = 1; // Meskerem
  if (metqie >= 1 && metqie <= 14) {
    metqieMonth = 2; // Tekemt
  }
  
  const gMetqieDate = convertEthiopianToGregorian(ey, metqieMonth, metqie);
  const dayOfWeek = gMetqieDate.getDay(); // 0 = Sunday, ..., 6 = Saturday
  
  const dayTewsak: { [key: number]: number } = {
    6: 8, // Saturday
    0: 7, // Sunday
    1: 6, // Monday
    2: 5, // Tuesday
    3: 4, // Wednesday
    4: 3, // Thursday
    5: 2  // Friday
  };
  
  const tewsak = dayTewsak[dayOfWeek];
  let mebajaHamer = metqie + tewsak;
  if (mebajaHamer > 30) {
    mebajaHamer -= 30;
  }
  
  let neneweMonth = 5; // Tir
  if (metqieMonth === 1) { // Meskerem
    if (metqie + tewsak > 30) {
      neneweMonth = 6; // Yekatit
    } else {
      neneweMonth = 5; // Tir
    }
  } else { // Tekemt
    if (metqie + tewsak > 30) {
      neneweMonth = 7; // Megabit
    } else {
      neneweMonth = 6; // Yekatit
    }
  }
  
  return { month: neneweMonth, day: mebajaHamer };
}

// Calculate all movable feasts/fasts of the liturgical year for a given Ethiopian Year
export function getMovableFeasts(ey: number) {
  const neneweEth = calculateNenewe(ey);
  const neneweG = convertEthiopianToGregorian(ey, neneweEth.month, neneweEth.day);
  
  const abiyTsomStart = addDays(neneweG, 14);
  const abiyTsomEnd = addDays(neneweG, 68);
  
  const debreZeyt = addDays(neneweG, 41);
  const hosanna = addDays(neneweG, 62);
  const siklet = addDays(neneweG, 67);
  const tinsae = addDays(neneweG, 69);
  const rikebeKahnat = addDays(neneweG, 93);
  const erget = addDays(neneweG, 108);
  const paraklitos = addDays(neneweG, 118);
  
  const apostlesFastStart = addDays(neneweG, 119);
  const apostlesFastEnd = convertEthiopianToGregorian(ey, 11, 4); // Hamle 4 (Eve of Peter & Paul)
  
  return {
    neneweStart: neneweG,
    neneweEnd: addDays(neneweG, 2),
    abiyTsomStart,
    abiyTsomEnd,
    debreZeyt,
    hosanna,
    siklet,
    tinsae,
    rikebeKahnat,
    erget,
    paraklitos,
    apostlesFastStart,
    apostlesFastEnd
  };
}

// Check if a date falls into the Ethiopian Orthodox Tewahedo Church (EOTC) fasting calendar
export function getFastingInfo(gDate: Date, ey: number, em: number, ed: number): FastingInfo | undefined {
  const feasts = getMovableFeasts(ey);
  
  // 1. Fast of Nineveh (Tsome Nenewe / ጾመ ነነዌ) - 3 days
  if (isBetweenDays(gDate, feasts.neneweStart, feasts.neneweEnd)) {
    return {
      name: "Fast of Nineveh (Tsome Nenewe)",
      amharicName: "ጾመ ነነዌ",
      description: "Tsome Nenewe is a three-day fast commemorating the repentance of the people of Nineveh in response to the preaching of Prophet Jonah.",
      isStartDay: isSameDay(gDate, feasts.neneweStart),
      isEndDay: isSameDay(gDate, feasts.neneweEnd)
    };
  }
  
  // 2. The Great Lent (Abiy Tsom / ዐቢይ ጾም) - 55 days
  if (isBetweenDays(gDate, feasts.abiyTsomStart, feasts.abiyTsomEnd)) {
    return {
      name: "Abiy Tsom (The Great Lent / Hudadi)",
      amharicName: "ዐቢይ ጾም (ሁዳዴ)",
      description: "The most sacred fast of 55 days including Semune Himamat (Passion Week), commemorating the 40-day wilderness fast of Jesus Christ.",
      isStartDay: isSameDay(gDate, feasts.abiyTsomStart),
      isEndDay: isSameDay(gDate, feasts.abiyTsomEnd)
    };
  }

  // 3. Fast of the Apostles (Sene Tsom / ጾመ ሐዋርያት)
  if (isBetweenDays(gDate, feasts.apostlesFastStart, feasts.apostlesFastEnd)) {
    return {
      name: "Sene Tsom (Fast of the Apostles)",
      amharicName: "ጾመ ሐዋርያት (የሰኔ ጾም)",
      description: "Dedicated to the ministry of the Apostles. Starts on the Monday following Pentecost and concludes on the eve of the feast of Saints Peter and Paul (Hamle 4).",
      isStartDay: isSameDay(gDate, feasts.apostlesFastStart),
      isEndDay: isSameDay(gDate, feasts.apostlesFastEnd)
    };
  }

  // 4. Fast of the Assumption / Holy Virgin Mary (Tsome Filseta / ጾመ ፍልሰታ) - 15 days
  if (em === 12 && ed >= 1 && ed <= 15) {
    return {
      name: "Filseta Tsom (Fast of the Assumption of Mary)",
      amharicName: "ጾመ ፍልሰታ",
      description: "A beloved 15-day fast from Nehase 1 to Nehase 15 commemorating the departure and assumption of the Holy Virgin Mary into heaven.",
      isStartDay: ed === 1,
      isEndDay: ed === 15
    };
  }

  // 5. Fast of the Holy Family (Tsige Tsom / ጾመ ጽጌ) - 40 days (Optional)
  const inTsige = (em === 1 && ed >= 26) || em === 2 || (em === 3 && ed <= 6);
  if (inTsige) {
    return {
      name: "Tsige Tsom (Fast of the Holy Family)",
      amharicName: "ጾመ ጽጌ",
      description: "A 40-day optional fast from Meskerem 26 to Hedar 5, commemorating the flight of the Holy Family into Egypt.",
      isStartDay: em === 1 && ed === 26,
      isEndDay: em === 3 && ed === 6,
      isOptional: true
    };
  }

  // 6. Fast of the Prophets / Advent (Tsome Nebiyat / ጾመ ነቢያት)
  const isLeapGena = ey % 4 === 0;
  const endNebiyatDay = isLeapGena ? 27 : 28;
  const inNebiyat = (em === 3 && ed >= 16) || (em === 4 && ed <= endNebiyatDay);
  if (inNebiyat) {
    return {
      name: "Gena Tsom / Nebiyat Tsom (Advent)",
      amharicName: "ጾመ ነቢያት (የገና ጾም)",
      description: "The 43-day Advent fast preceding Christmas (Gena) to commemorate the prophecies regarding the birth of Christ.",
      isStartDay: em === 3 && ed === 16,
      isEndDay: em === 4 && ed === endNebiyatDay
    };
  }

  // 7. Fast of Ghad / Eve of Christmas and Epiphany (Tsome Gehad / ጾመ ገሃድ)
  const nominalChristmasEve = convertEthiopianToGregorian(ey, 4, isLeapGena ? 27 : 28);
  const nominalEpiphanyEve = convertEthiopianToGregorian(ey, 5, 10);
  
  const isChristmasGhad = isGhadFast(gDate, nominalChristmasEve);
  const isEpiphanyGhad = isGhadFast(gDate, nominalEpiphanyEve);
  
  if (isChristmasGhad || isEpiphanyGhad) {
    return {
      name: "Fast of Gehad (Eve of Feasts)",
      amharicName: "ጾመ ገሃድ",
      description: "A strict fast observed on the eve of Christmas and Epiphany. Shunted to Friday if the eve falls on Saturday or Sunday.",
      isStartDay: true,
      isEndDay: true
    };
  }

  return undefined;
}

// Convert Gregorian to Ethiopian (safely wrapped)
export function convertGregorianToEthiopian(gregorianDate: Date): { year: number; month: number; day: number } {
  const gy = gregorianDate.getFullYear();
  const gm = gregorianDate.getMonth() + 1;
  const gd = gregorianDate.getDate();
  try {
    const [ey, em, ed] = toEthiopian(gy, gm, gd);
    return { year: ey, month: em, day: ed };
  } catch (e) {
    return { year: gy - 8, month: 1, day: 1 };
  }
}

// Convert Ethiopian to Gregorian (safely wrapped)
export function convertEthiopianToGregorian(ey: number, em: number, ed: number): Date {
  try {
    const [gy, gm, gd] = toGregorian(ey, em, ed);
    return new Date(gy, gm - 1, gd);
  } catch (e) {
    return new Date(ey + 8, 8, 11);
  }
}

// Fixed EOTC and National Holidays of Ethiopia
export const FIXED_ETHIOPIAN_HOLIDAYS = [
  { id: 'eth-enkutatash', name: 'Enkutatash (New Year) & Kidus Yohannes (St. John)', localName: 'እንቁጣጣሽ (አዲስ ዓመት) እና ቅዱስ ዮሐንስ', category: 'national', date: { ethiopian: { month: 1, day: 1 } }, description: "Ethiopian New Year, marking Meskerem 1st, celebrating the end of the rainy season and St. John the Baptist as the herald of the new era of grace.", localDescription: "የኢትዮጵያ አዲስ ዓመት (እንቁጣጣሽ) እና የቅዱስ ዮሐንስ መታሰቢያ በዓል።" },
  { id: 'eth-meskel', name: 'Finding of the True Cross (Meskel)', localName: 'መስቀል (ደመራ)', category: 'major_feast', date: { ethiopian: { month: 1, day: 17 } }, description: "Commemorates the finding of the True Cross by Roman Empress Helena, marked by burning a Demera bonfire.", localDescription: "በእሌኒ ንግሥት አማካኝነት የክርስቶስ መስቀል መገኘቱን የምናስብበት በዓል።" },
  { id: 'eth-beata-tahs', name: 'Presentation of Mary (Be\'ata)', localName: 'በዓታ ለማርያም', category: 'minor_feast', date: { ethiopian: { month: 4, day: 3 } }, description: "Commemorates the presentation of the Blessed Virgin Mary in the Temple at Jerusalem at the age of three.", localDescription: "እመቤታችን በሦስት ዓመቷ ወደ ቤተ መቅደስ መግባቷ የምናስብበት ታላቅ በዓል።" },
  { id: 'eth-lidet', name: 'Lidet (Genna / Christmas)', localName: 'ልደት (ገና)', category: 'major_feast', date: { ethiopian: { month: 4, day: 29 } }, description: "Ethiopian Christmas, celebrating the birth of Jesus Christ.", localDescription: "የጌታችንና የመድኃኒታችን የኢየሱስ ክርስቶስ ልደት በዓል።" },
  { id: 'eth-gezret', name: 'Circumcision of Christ (Gezret)', localName: 'ግዝረት (በዓለ ግዝረት)', category: 'minor_feast', date: { ethiopian: { month: 5, day: 6 } }, description: "Commemorates the circumcision of Jesus Christ on the eighth day according to Mosaic law.", localDescription: "ጌታችን በሥጋ በተገረዘበት ስምንተኛ ቀን የሚከበር በዓል።" },
  { id: 'eth-timkat', name: 'Epiphany (Timkat)', localName: 'ጥምቀት', category: 'major_feast', date: { ethiopian: { month: 5, day: 11 } }, description: "Commemorates the Baptism of Jesus Christ in the Jordan River.", localDescription: "ጌታችን በጥምቀተ ባሕር የተጠመቀበትን በዓል።" },
  { id: 'eth-kana-ze-galila', name: 'Wedding at Cana (Kana Ze-Galila)', localName: 'ቃና ዘገሊላ', category: 'minor_feast', date: { ethiopian: { month: 5, day: 12 } }, description: "Commemorates Christ's first miracle of turning water into wine at the wedding in Cana of Galilee.", localDescription: "ጌታችን በቃና ዘገሊላ ሰርግ ላይ ውሃውን ወደ ወይን የለወጠበት ተአምራት መታሰቢያ።" },
  { id: 'eth-adwa', name: 'Adwa Victory Day', localName: 'የዓድዋ ድል መታሰቢያ', category: 'national', date: { ethiopian: { month: 6, day: 23 } }, description: "Commemorates Ethiopia's historic victory over Italian forces in 1896.", localDescription: "የዓድዋ ጀግኖች ወራሪውን የጣሊያን ጦር ያሸነፉበት ታላቅ ድል።" },
  { id: 'eth-st-george', name: 'Feast of Saint George the Martyr', localName: 'ሚያዝያ ጊዮርጊስ (የቅዱስ ጊዮርጊስ በዓል)', category: 'minor_feast', date: { ethiopian: { month: 8, day: 23 } }, description: "Annual major commemoration of Saint George the Martyr, marking his triumphant martyrdom and the great covenant given to him.", localDescription: "የሰማዕታት አለቃ የቅዱስ ጊዮርጊስ ዓመታዊ የዕረፍትና የድል መታሰቢያ በዓል።" },
  { id: 'eth-patriots', name: 'Patriots\' Victory Day', localName: 'የአርበኞች ቀን', category: 'national', date: { ethiopian: { month: 8, day: 27 } }, description: "Honors the patriots who fought against Italian fascist occupation (1936-1941).", localDescription: "የጣሊያንን ፋሺስት ወራሪ የተከላከሉ ጀግኖች አርበኞች መታሰቢያ።" },
  { id: 'eth-derg-downfall', name: 'Downfall of the Derg', localName: 'የደርግ ውድቀት መታሰቢያ', category: 'national', date: { ethiopian: { month: 9, day: 20 } }, description: "National day commemorating the end of the military Derg regime in 1991.", localDescription: "የደርግ ወታደራዊ አገዛዝ ማክተሚያ እና የሽግግር ወቅት መታሰቢያ።" },
  { id: 'eth-debre-tabor', name: 'Transfiguration (Debre Tabor / Buhe)', localName: 'ደብረ ታቦር (ቡሄ)', category: 'major_feast', date: { ethiopian: { month: 12, day: 13 } }, description: "Commemorates the Transfiguration of Jesus on Mount Tabor.", localDescription: "ጌታችን በደብረ ታቦር ተራራ ላይ ክብሩን መግለጡ መታሰቢያ።" },
  { id: 'eth-filseta-maryam', name: 'Assumption of Mary (Filseta)', localName: 'ፍልሰታ ለማርያም', category: 'minor_feast', date: { ethiopian: { month: 12, day: 16 } }, description: "Commemorates the ascension of the Blessed Virgin Mary into heaven.", localDescription: "የቅድስት ድንግል ማርያም እርገት በዓል።" },
];

// Master holiday list builder that resolves dynamic, movable, and EOTC holidays
export function getHolidays(year: number, state?: string): Holiday[] {
  const list: Holiday[] = [];

  // 1. Add Fixed Ethiopian & National Holidays
  FIXED_ETHIOPIAN_HOLIDAYS.forEach(h => {
    list.push({
      id: h.id,
      name: h.name,
      localName: h.localName,
      category: h.category as any,
      date: h.date,
      description: h.description,
      localDescription: h.localDescription,
    });
  });

  // 2. Add Movable EOTC Feasts (Calculated dynamically)
  const feasts = getMovableFeasts(year - 8);

  // Hosanna (Palm Sunday)
  list.push({
    id: `eth-hosanna-${year}`,
    name: 'Hosanna (Palm Sunday)',
    localName: 'ሆሣዕና',
    category: 'major_feast',
    date: { gregorian: { month: feasts.hosanna.getMonth() + 1, day: feasts.hosanna.getDate() } },
    description: "Commemorates Jesus Christ's triumphal entry into Jerusalem.",
    localDescription: "ጌታችን በአህያ ውርንጭላ ተጭኖ ወደ ኢየሩሳሌም በክብር መግባቱ መታሰቢያ።"
  });

  // Siklet (Good Friday)
  list.push({
    id: `eth-siklet-${year}`,
    name: 'Siklet (Good Friday)',
    localName: 'ስቅለት',
    category: 'major_feast',
    date: { gregorian: { month: feasts.siklet.getMonth() + 1, day: feasts.siklet.getDate() } },
    description: "The commemoration of the crucifixion and death of Jesus Christ on the cross.",
    localDescription: "ጌታችን መድኃኒታችን ኢየሱስ ክርስቶስ ስለ እኛ በመስቀል ላይ መሞቱ መታሰቢያ።"
  });

  // Tinsae / Fasika (Easter Sunday)
  list.push({
    id: `eth-tinsae-${year}`,
    name: 'Tinsae (Fasika / Easter)',
    localName: 'ትንሣኤ (ፋሲካ)',
    category: 'major_feast',
    date: { gregorian: { month: feasts.tinsae.getMonth() + 1, day: feasts.tinsae.getDate() } },
    description: "The glorious Resurrection of Jesus Christ from the dead, concluding the Great Lent.",
    localDescription: "ጌታችን ሞትን ድል አድርጎ የተነሳበት ታላቅ የትንሣኤ በዓል።"
  });

  // Debre Zeyt (Sunday, 41 days after Nenewe)
  list.push({
    id: `eth-debre-zeyt-${year}`,
    name: 'Debre Zeyt (Mount of Olives)',
    localName: 'ደብረ ዘይት',
    category: 'minor_feast',
    date: { gregorian: { month: feasts.debreZeyt.getMonth() + 1, day: feasts.debreZeyt.getDate() } },
    description: "Commemorates Christ's teachings on the Mount of Olives regarding His Second Coming.",
    localDescription: "ጌታችን በደብረ ዘይት ተራራ ላይ ስለ ዳግም ምጽዓቱ ያስተማረበት ዕለት።"
  });

  // Erget (Ascension Thursday)
  list.push({
    id: `eth-erget-${year}`,
    name: 'Erget (Ascension)',
    localName: 'ዕርገት',
    category: 'major_feast',
    date: { gregorian: { month: feasts.erget.getMonth() + 1, day: feasts.erget.getDate() } },
    description: "Commemorates the Ascension of Jesus Christ into heaven forty days after His resurrection.",
    localDescription: "ጌታችን በትንሣኤ በ40ኛው ቀን ወደ ሰማይ ማረጉ መታሰቢያ በዓል።"
  });

  // Paraklitos (Pentecost Sunday)
  list.push({
    id: `eth-paraklitos-${year}`,
    name: 'Paraklitos (Pentecost)',
    localName: 'ጰራቅሊጦስ',
    category: 'major_feast',
    date: { gregorian: { month: feasts.paraklitos.getMonth() + 1, day: feasts.paraklitos.getDate() } },
    description: "Commemorates the descent of the Holy Spirit upon the Apostles fifty days after Easter.",
    localDescription: "መንፈስ ቅዱስ ለሐዋርያት የወረደበት በዓል።"
  });

  // 3. Add Movable Islamic National Holidays
  const movLookup = MOVABLE_LOOKUP[year];
  if (movLookup) {
    list.push({
      id: `eth-eid-fitr-${year}`,
      name: 'Eid al-Fitr',
      localName: 'ዒድ አል-ፈጥር',
      category: 'national',
      date: { gregorian: movLookup.eidAlFitr },
      description: "The Islamic festival marking the end of Ramadan. National public holiday in Ethiopia.",
      localDescription: "የረመዳን ጾም መጠናቀቅን ተከትሎ የሚከበር ታላቅ የእስልምና በዓል።"
    });

    list.push({
      id: `eth-eid-adha-${year}`,
      name: 'Eid al-Adha (Arafa)',
      localName: 'ዒድ አል-አድሐ (አረፋ)',
      category: 'national',
      date: { gregorian: movLookup.eidAlAdha },
      description: "Islamic Feast of Sacrifice. National public holiday in Ethiopia.",
      localDescription: "የመስዋዕትነት እና የታማኝነት መታሰቢያ በዓል (አረፋ)።"
    });

    list.push({
      id: `eth-mawlid-${year}`,
      name: 'Mawlid al-Nabi',
      localName: 'መውሊድ (የነቢዩ ልደት)',
      category: 'national',
      date: { gregorian: movLookup.mawlid },
      description: "Celebration of the birthday of the Prophet Muhammad.",
      localDescription: "የነቢዩ ሙሐመድ የልደት መታሰቢያ በዓል።"
    });
  }

  // International Workers' Day (May 1)
  list.push({
    id: `eth-workers-day-${year}`,
    name: "International Workers' Day",
    localName: "የሠራተኞች ቀን (ሜይ ዴይ)",
    category: 'national',
    date: { gregorian: { month: 5, day: 1 } },
    description: "International Workers' Day, celebrated as a national public holiday on May 1.",
    localDescription: "የሠራተኞች ቀን ብሔራዊ በዓል።"
  });

  // 4. Add Australian Public Holidays if a state is selected
  if (state && state !== 'NONE') {
    const ausHolidays = getAustralianHolidays(year, state);
    list.push(...ausHolidays);
  }

  return list;
}

// Check if a day has a specific holiday
export function getHolidaysForDay(
  gy: number, gm: number, gd: number,
  ey: number, em: number, ed: number,
  allHolidays: Holiday[]
): Holiday[] {
  return allHolidays.filter(h => {
    if (h.date.gregorian) {
      return h.date.gregorian.month === gm && h.date.gregorian.day === gd;
    }
    if (h.date.ethiopian) {
      if (h.id === 'eth-lidet') {
        const targetDay = (ey % 4 === 0) ? 28 : 29;
        return em === 4 && ed === targetDay;
      }
      return h.date.ethiopian.month === em && h.date.ethiopian.day === ed;
    }
    return false;
  });
}

// Generate the day list for Gregorian view
export function generateGregorianCalendar(year: number, month: number, state?: string): CalendarDay[] {
  const days: CalendarDay[] = [];
  const firstDayOfMonth = new Date(year, month, 1);
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) - 6 (Sat)
  
  const yearHolidays = getHolidays(year, state);
  const prevYearHolidays = getHolidays(year - 1, state);
  const nextYearHolidays = getHolidays(year + 1, state);
  
  const getHolidaysLookup = (y: number) => {
    if (y === year) return yearHolidays;
    if (y < year) return prevYearHolidays;
    return nextYearHolidays;
  };

  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const totalDaysInPrevMonth = new Date(year, month, 0).getDate();

  const today = new Date();
  const isTodayCheck = (d: Date) => {
    return d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear();
  };

  // 1. Padding days from previous month
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const dayDate = totalDaysInPrevMonth - i;
    const gDate = new Date(year, month - 1, dayDate);
    const gy = gDate.getFullYear();
    const gm = gDate.getMonth() + 1;
    const gd = gDate.getDate();

    const { year: ey, month: em, day: ed } = convertGregorianToEthiopian(gDate);
    const dayHolidays = getHolidaysForDay(gy, gm, gd, ey, em, ed, getHolidaysLookup(gy));
    const fasting = getFastingInfo(gDate, ey, em, ed);

    days.push({
      id: `prev-${gy}-${gm}-${gd}`,
      gregorianDate: gDate,
      gregorianYear: gy,
      gregorianMonth: gDate.getMonth(),
      gregorianDay: gd,
      ethiopianYear: ey,
      ethiopianMonth: em,
      ethiopianDay: ed,
      dayOfWeek: gDate.getDay(),
      isCurrentMonth: false,
      isToday: isTodayCheck(gDate),
      holidays: dayHolidays,
      fasting,
      monthlyCommemoration: getMonthlyCommemoration(em, ed),
    });
  }

  // 2. Days of current month
  for (let i = 1; i <= totalDaysInMonth; i++) {
    const gDate = new Date(year, month, i);
    const gy = gDate.getFullYear();
    const gm = gDate.getMonth() + 1;
    const gd = gDate.getDate();

    const { year: ey, month: em, day: ed } = convertGregorianToEthiopian(gDate);
    const dayHolidays = getHolidaysForDay(gy, gm, gd, ey, em, ed, getHolidaysLookup(gy));
    const fasting = getFastingInfo(gDate, ey, em, ed);

    days.push({
      id: `current-${gy}-${gm}-${gd}`,
      gregorianDate: gDate,
      gregorianYear: gy,
      gregorianMonth: month,
      gregorianDay: gd,
      ethiopianYear: ey,
      ethiopianMonth: em,
      ethiopianDay: ed,
      dayOfWeek: gDate.getDay(),
      isCurrentMonth: true,
      isToday: isTodayCheck(gDate),
      holidays: dayHolidays,
      fasting,
      monthlyCommemoration: getMonthlyCommemoration(em, ed),
    });
  }

  // 3. Padding days from next month to complete 42-cell grid
  const remainingCells = 42 - days.length;
  for (let i = 1; i <= remainingCells; i++) {
    const gDate = new Date(year, month + 1, i);
    const gy = gDate.getFullYear();
    const gm = gDate.getMonth() + 1;
    const gd = gDate.getDate();

    const { year: ey, month: em, day: ed } = convertGregorianToEthiopian(gDate);
    const dayHolidays = getHolidaysForDay(gy, gm, gd, ey, em, ed, getHolidaysLookup(gy));
    const fasting = getFastingInfo(gDate, ey, em, ed);

    days.push({
      id: `next-${gy}-${gm}-${gd}`,
      gregorianDate: gDate,
      gregorianYear: gy,
      gregorianMonth: gDate.getMonth(),
      gregorianDay: gd,
      ethiopianYear: ey,
      ethiopianMonth: em,
      ethiopianDay: ed,
      dayOfWeek: gDate.getDay(),
      isCurrentMonth: false,
      isToday: isTodayCheck(gDate),
      holidays: dayHolidays,
      fasting,
      monthlyCommemoration: getMonthlyCommemoration(em, ed),
    });
  }

  return days;
}

// Generate the day list for Ethiopian view
export function generateEthiopianCalendar(year: number, month: number, state?: string): CalendarDay[] {
  const days: CalendarDay[] = [];
  
  // Total days in Ethiopian month: 1-12 are 30 days, Pagume (13) is 5 or 6 (leap year if year % 4 === 3)
  const isLeapYear = year % 4 === 3;
  const totalDays = month === 13 ? (isLeapYear ? 6 : 5) : 30;

  const firstDayGDate = convertEthiopianToGregorian(year, month, 1);
  const startDayOfWeek = firstDayGDate.getDay(); // 0 (Sun) - 6 (Sat)

  const startGy = firstDayGDate.getFullYear();
  const startHolidays = getHolidays(startGy, state);
  const prevHolidays = getHolidays(startGy - 1, state);
  const nextHolidays = getHolidays(startGy + 1, state);

  const getHolidaysLookup = (gY: number) => {
    if (gY === startGy) return startHolidays;
    if (gY < startGy) return prevHolidays;
    return nextHolidays;
  };

  const today = new Date();
  const isTodayCheck = (d: Date) => {
    return d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear();
  };

  // 1. Padding days from previous Ethiopian Month
  const prevMonth = month === 1 ? 13 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const prevMonthIsLeap = prevYear % 4 === 3;
  const prevTotalDays = prevMonth === 13 ? (prevMonthIsLeap ? 6 : 5) : 30;

  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const ed = prevTotalDays - i;
    const gDate = convertEthiopianToGregorian(prevYear, prevMonth, ed);
    const gy = gDate.getFullYear();
    const gm = gDate.getMonth() + 1;
    const gd = gDate.getDate();

    const dayHolidays = getHolidaysForDay(gy, gm, gd, prevYear, prevMonth, ed, getHolidaysLookup(gy));
    const fasting = getFastingInfo(gDate, prevYear, prevMonth, ed);

    days.push({
      id: `prev-eth-${prevYear}-${prevMonth}-${ed}`,
      gregorianDate: gDate,
      gregorianYear: gy,
      gregorianMonth: gDate.getMonth(),
      gregorianDay: gd,
      ethiopianYear: prevYear,
      ethiopianMonth: prevMonth,
      ethiopianDay: ed,
      dayOfWeek: gDate.getDay(),
      isCurrentMonth: false,
      isToday: isTodayCheck(gDate),
      holidays: dayHolidays,
      fasting,
      monthlyCommemoration: getMonthlyCommemoration(prevMonth, ed),
    });
  }

  // 2. Days of current Ethiopian Month
  for (let ed = 1; ed <= totalDays; ed++) {
    const gDate = convertEthiopianToGregorian(year, month, ed);
    const gy = gDate.getFullYear();
    const gm = gDate.getMonth() + 1;
    const gd = gDate.getDate();

    const dayHolidays = getHolidaysForDay(gy, gm, gd, year, month, ed, getHolidaysLookup(gy));
    const fasting = getFastingInfo(gDate, year, month, ed);

    days.push({
      id: `current-eth-${year}-${month}-${ed}`,
      gregorianDate: gDate,
      gregorianYear: gy,
      gregorianMonth: gDate.getMonth(),
      gregorianDay: gd,
      ethiopianYear: year,
      ethiopianMonth: month,
      ethiopianDay: ed,
      dayOfWeek: gDate.getDay(),
      isCurrentMonth: true,
      isToday: isTodayCheck(gDate),
      holidays: dayHolidays,
      fasting,
      monthlyCommemoration: getMonthlyCommemoration(month, ed),
    });
  }

  // 3. Padding days from next Ethiopian Month
  const nextMonth = month === 13 ? 1 : month + 1;
  const nextYear = month === 13 ? year + 1 : year;
  const remainingCells = 42 - days.length;

  for (let ed = 1; ed <= remainingCells; ed++) {
    const gDate = convertEthiopianToGregorian(nextYear, nextMonth, ed);
    const gy = gDate.getFullYear();
    const gm = gDate.getMonth() + 1;
    const gd = gDate.getDate();

    const dayHolidays = getHolidaysForDay(gy, gm, gd, nextYear, nextMonth, ed, getHolidaysLookup(gy));
    const fasting = getFastingInfo(gDate, nextYear, nextMonth, ed);

    days.push({
      id: `next-eth-${nextYear}-${nextMonth}-${ed}`,
      gregorianDate: gDate,
      gregorianYear: gy,
      gregorianMonth: gDate.getMonth(),
      gregorianDay: gd,
      ethiopianYear: nextYear,
      ethiopianMonth: nextMonth,
      ethiopianDay: ed,
      dayOfWeek: gDate.getDay(),
      isCurrentMonth: false,
      isToday: isTodayCheck(gDate),
      holidays: dayHolidays,
      fasting,
      monthlyCommemoration: getMonthlyCommemoration(nextMonth, ed),
    });
  }

  return days;
}

// Full detailed string format for a date
export function formatEthiopianDateFull(ey: number, em: number, ed: number): string {
  const monthInfo = ETHIOPIAN_MONTHS[em - 1];
  return `${monthInfo.name} (${monthInfo.amharicName}) ${ed}, ${ey} E.C.`;
}

export function formatGregorianDateFull(date: Date): string {
  const dayName = WEEKDAYS[date.getDay()].name;
  const monthName = GREGORIAN_MONTHS[date.getMonth()];
  return `${dayName}, ${monthName} ${date.getDate()}, ${date.getFullYear()}`;
}

// Convert a standard number (1-99) into Ge'ez numerals
export function getGeezNumeral(num: number): string {
  const ones = ["", "፩", "፪", "፫", "፬", "፭", "፮", "፯", "፰", "፱"];
  const tens = ["", "፲", "፳", "፴", "፵", "፶", "፷", "፸", "፹", "፺"];
  if (num <= 0) return "";
  const t = Math.floor(num / 10);
  const o = num % 10;
  return tens[t] + ones[o];
}

export interface EvangelistInfo {
  nameAm: string;
  nameEn: string;
  remainder: number;
  quotient: number;
  formula: string;
  descriptionAm: string;
  descriptionEn: string;
  ameteAlem: number;
  ameteAlemFormula: string;
}

export function getEvangelistInfo(year: number): EvangelistInfo {
  const remainder = year % 4;
  const quotient = Math.floor(year / 4);
  const ameteAlem = year + 5500;
  
  let nameAm = '';
  let nameEn = '';
  let descriptionAm = '';
  let descriptionEn = '';
  
  if (remainder === 1) {
    nameAm = 'ዘመነ ማቴዎስ';
    nameEn = 'Year of Matthew';
    descriptionAm = 'የሰላም፣ የፍሬ እና የበረከት ዓመት ተደርጎ የሚወሰድ ሲሆን፣ የመኸር ዝናብ በጥሩ ሁኔታ እንደሚዘንብ ይታመናል።';
    descriptionEn = 'Considered a year of peace, harvest, and blessings. It is characterized by timely and abundant autumn rains.';
  } else if (remainder === 2) {
    nameAm = 'ዘመነ ማርቆስ';
    nameEn = 'Year of Mark';
    descriptionAm = 'ጾም እና ጸሎት የሚበዛበት፣ አብዛኛውን ጊዜ ደግሞ የበልግ ወቅት ዝናብ ጥሩ እንደሚሆን የሚታመንበት የልምላሜና የጸጋ ዘመን ተደርጎ ይወሰዳል።';
    descriptionEn = 'A year of abundant fasting and prayer. It is traditionally believed to bring excellent spring (Belg) rains, signifying fertility and grace.';
  } else if (remainder === 3) {
    nameAm = 'ዘመነ ሉቃስ';
    nameEn = 'Year of Luke (Leap Year)';
    descriptionAm = 'የበረከት ዘመን ሲሆን፣ ጳጉሜ ስድስት ቀናት የምትሆንበት የትርፍ ዓመት (Leap Year) ነው።';
    descriptionEn = 'A year of abundant blessings. It serves as the Ethiopian Leap Year, where the 13th month of Pagume contains 6 full days instead of 5.';
  } else {
    nameAm = 'ዘመነ ዮሐንስ';
    nameEn = 'Year of John';
    descriptionAm = 'የሰላምና የእርቅ ዘመን ተደርጎ ይቆጠራል፤ ወንዞች የሚሞሉበትና የክረምት ወቅት በጥሩ ሁኔታ የሚጠናቀቅበት የሰላም ዓመት ነው።';
    descriptionEn = 'Regarded as a season of peace, reconciliation, and renewal. It is characterized by full flowing rivers and a peaceful conclusion of the rainy season.';
  }

  return {
    nameAm,
    nameEn,
    remainder,
    quotient,
    formula: `${year} ÷ 4 = ${quotient} ቀሪው (Remainder) ${remainder}`,
    descriptionAm,
    descriptionEn,
    ameteAlem,
    ameteAlemFormula: `${year} + 5500 = ${ameteAlem}`,
  };
}
