import {
  ETHIOPIAN_MONTHS,
  GREGORIAN_MONTHS,
  MONTHLY_COMMEMORATIONS,
  convertEthiopianToGregorian,
  convertGregorianToEthiopian,
  getMovableFeasts,
  FIXED_ETHIOPIAN_HOLIDAYS,
  MOVABLE_LOOKUP,
  getAustralianHolidays,
} from './calendar';

export interface SearchEventItem {
  id: string;
  title: string;
  amharicTitle: string;
  category: 'major_feast' | 'minor_feast' | 'monthly_saint' | 'fasting' | 'national' | 'commemoration';
  categoryLabel: string;
  categoryColor: string; // Tailwind color class or hex
  description: string;
  amharicDescription?: string;
  // Exact Target Date
  ethYear: number;
  ethMonth: number;
  ethDay: number;
  gregDate: Date;
  isMovable?: boolean;
  isMonthlyRecurrence?: boolean;
  monthlyDayNumber?: number;
  keywords: string[];
}

// Normalize Amharic and English text for robust fuzzy search
export function normalizeSearchQuery(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    // normalize common phonetic variants in English
    .replace(/saint\s+/g, 'st ')
    .replace(/st\.\s+/g, 'st ')
    .replace(/[\'’`\-]/g, '')
    // normalize Amharic variations (e.g. ሀ, ሐ, ኀ -> ሀ ; ሠ, ሰ -> ሰ ; ዐ, አ -> አ ; ጸ, ፀ -> ጸ)
    .replace(/[ሐኀ]/g, 'ሀ')
    .replace(/[ሠ]/g, 'ሰ')
    .replace(/[ዐ]/g, 'አ')
    .replace(/[ፀ]/g, 'ጸ')
    .replace(/[ኁ]/g, 'ሁ')
    .replace(/[ኋ]/g, 'ኋ');
}

export function buildSearchIndex(
  activeEthYear: number,
  activeEthMonth: number,
  ausState: string = 'NONE'
): SearchEventItem[] {
  const items: SearchEventItem[] = [];
  const addedIds = new Set<string>();

  const addItem = (item: SearchEventItem) => {
    if (!addedIds.has(item.id)) {
      addedIds.add(item.id);
      items.push(item);
    }
  };

  // 1. Current Viewed Month's 30 Saint Days (Monthly Commemorations)
  for (let day = 1; day <= 30; day++) {
    const comm = MONTHLY_COMMEMORATIONS[day];
    if (comm) {
      const gDate = convertEthiopianToGregorian(activeEthYear, activeEthMonth, day);
      const mInfo = ETHIOPIAN_MONTHS[activeEthMonth - 1] || ETHIOPIAN_MONTHS[0];
      
      addItem({
        id: `monthly-day-${day}-current-${activeEthMonth}-${activeEthYear}`,
        title: `${comm.name} (Day ${day} • ${mInfo.name})`,
        amharicTitle: `${comm.amharicName} (${mInfo.amharicName} ${day})`,
        category: 'monthly_saint',
        categoryLabel: `Monthly Saint (Day ${day})`,
        categoryColor: 'bg-[#006732] text-white',
        description: `Monthly liturgical commemoration on day ${day} of every Ethiopian month (${mInfo.name} ${day}, ${activeEthYear} E.C.).`,
        amharicDescription: `በየወሩ በ${day} የሚታሰቡ ቅዱሳንና በዓላት (${mInfo.amharicName} ${day} ቀን ${activeEthYear} ዓ.ም)።`,
        ethYear: activeEthYear,
        ethMonth: activeEthMonth,
        ethDay: day,
        gregDate: gDate,
        isMonthlyRecurrence: true,
        monthlyDayNumber: day,
        keywords: [
          comm.name,
          comm.amharicName,
          `day ${day}`,
          `ቀን ${day}`,
          mInfo.name,
          mInfo.amharicName,
          'saint',
          'ቅዱስ',
          'መታሰቢያ',
          'ወርሃዊ',
        ],
      });
    }
  }

  // 2. Movable Feasts & Fasts for the Active Year
  try {
    const feasts = getMovableFeasts(activeEthYear);
    
    // Tsome Nenewe (Fast of Nineveh)
    const nenEth = convertGregorianToEthiopian(feasts.neneweStart);
    addItem({
      id: `mov-nenewe-${activeEthYear}`,
      title: 'Tsome Nenewe (Fast of Nineveh)',
      amharicTitle: 'ጾመ ነነዌ',
      category: 'fasting',
      categoryLabel: 'Canonical Fast (3 Days)',
      categoryColor: 'bg-[#7A1C74] text-white',
      description: 'Three-day fast of repentance commemorating the Prophet Jonah and the city of Nineveh.',
      amharicDescription: 'ነቢዩ ዮናስ ለነነዌ ሰዎች የሰበከውንና ያደረጉትን የ3 ቀን የንስሐ ጾም የምናስብበት።',
      ethYear: nenEth.year,
      ethMonth: nenEth.month,
      ethDay: nenEth.day,
      gregDate: feasts.neneweStart,
      isMovable: true,
      keywords: ['nineveh', 'nenewe', 'tsome nenewe', 'jonah', 'fast', 'ጾመ ነነዌ', 'ነነዌ', 'ዮናስ'],
    });

    // Abiy Tsom (The Great Lent) Start
    const lentEth = convertGregorianToEthiopian(feasts.abiyTsomStart);
    addItem({
      id: `mov-abiy-tsom-${activeEthYear}`,
      title: 'Abiy Tsom (The Great Lent / Hudadi) - Start',
      amharicTitle: 'ዐቢይ ጾም (ሁዳዴ) - መግቢያ',
      category: 'fasting',
      categoryLabel: 'Great Lent (55 Days)',
      categoryColor: 'bg-[#7A1C74] text-white',
      description: 'The 55-day holy fast commemorating Christ’s fast in the wilderness.',
      amharicDescription: 'ጌታችን መድኃኒታችን ኢየሱስ ክርስቶስ በገዳመ ቆሮንቶስ የጾመውን ጾም የምንከተልበት 55 ቀናት።',
      ethYear: lentEth.year,
      ethMonth: lentEth.month,
      ethDay: lentEth.day,
      gregDate: feasts.abiyTsomStart,
      isMovable: true,
      keywords: ['great lent', 'abiy tsom', 'hudadi', 'lent', 'fast', 'ዐቢይ ጾም', 'ሁዳዴ', 'ጾም'],
    });

    // Debre Zeyt (Mount of Olives)
    const dzEth = convertGregorianToEthiopian(feasts.debreZeyt);
    addItem({
      id: `mov-debre-zeyt-${activeEthYear}`,
      title: 'Debre Zeyt (Mount of Olives Sunday)',
      amharicTitle: 'ደብረ ዘይት (የዐቢይ ጾም እኩሌታ)',
      category: 'minor_feast',
      categoryLabel: 'Liturgy of the 2nd Coming',
      categoryColor: 'bg-[#006732] text-white',
      description: '5th Sunday of Lent, commemorating Christ’s teachings on the Mount of Olives regarding His Second Coming.',
      amharicDescription: 'ጌታችን በደብረ ዘይት ተራራ ስለ ዳግም ምጽአቱ ያስተማረበት ዕለት።',
      ethYear: dzEth.year,
      ethMonth: dzEth.month,
      ethDay: dzEth.day,
      gregDate: feasts.debreZeyt,
      isMovable: true,
      keywords: ['debre zeyt', 'mount of olives', 'second coming', 'ደብረ ዘይት', 'ምጽአት'],
    });

    // Hosanna (Palm Sunday)
    const hosEth = convertGregorianToEthiopian(feasts.hosanna);
    addItem({
      id: `mov-hosanna-${activeEthYear}`,
      title: 'Hosanna (Palm Sunday / King of Peace)',
      amharicTitle: 'ሆሣዕና (በዓለ ሆሣዕና)',
      category: 'major_feast',
      categoryLabel: 'Major Feast of Our Lord',
      categoryColor: 'bg-[#006732] text-white',
      description: 'Christ’s triumphal entry into Jerusalem celebrated with olive and palm leaves.',
      amharicDescription: 'ጌታችን በክብር ወደ ኢየሩሳሌም መግባቱ በዘንባባ የሚከበርበት ታላቅ በዓል።',
      ethYear: hosEth.year,
      ethMonth: hosEth.month,
      ethDay: hosEth.day,
      gregDate: feasts.hosanna,
      isMovable: true,
      keywords: ['hosanna', 'palm sunday', 'palms', 'jerusalem', 'ሆሣዕና', 'ዘንባባ', 'ኢየሩሳሌም'],
    });

    // Siklet (Good Friday)
    const sikEth = convertGregorianToEthiopian(feasts.siklet);
    addItem({
      id: `mov-siklet-${activeEthYear}`,
      title: 'Siklet (Good Friday / Crucifixion of Christ)',
      amharicTitle: 'ስቅለት (ዓርበ ስቅለት)',
      category: 'major_feast',
      categoryLabel: 'Crucifixion of Christ',
      categoryColor: 'bg-[#EF3340] text-white',
      description: 'Solemn commemoration of the crucifixion and death of Jesus Christ on Golgotha.',
      amharicDescription: 'ጌታችን መድኃኒታችን ኢየሱስ ክርስቶስ ስለ እኛ ድኅነት በመስቀል ላይ መሞቱ መታሰቢያ።',
      ethYear: sikEth.year,
      ethMonth: sikEth.month,
      ethDay: sikEth.day,
      gregDate: feasts.siklet,
      isMovable: true,
      keywords: ['siklet', 'good friday', 'crucifixion', 'cross', 'golgotha', 'ስቅለት', 'ዓርብ', 'መስቀል'],
    });

    // Tinsae / Fasika (Easter Sunday)
    const tinEth = convertGregorianToEthiopian(feasts.tinsae);
    addItem({
      id: `mov-tinsae-${activeEthYear}`,
      title: 'Tinsae (Fasika / Ethiopian Easter Sunday)',
      amharicTitle: 'ትንሣኤ (ፋሲካ / የትንሣኤ በዓል)',
      category: 'major_feast',
      categoryLabel: 'Great Feast of the Resurrection',
      categoryColor: 'bg-[#D1A110] text-brand-dark',
      description: 'The glorious Resurrection of Jesus Christ from the dead, overcoming death and sin.',
      amharicDescription: 'ጌታችን ሞትን ድል አድርጎ የተነሳበት ታላቁና ዋነኛው የክርስትና በዓል።',
      ethYear: tinEth.year,
      ethMonth: tinEth.month,
      ethDay: tinEth.day,
      gregDate: feasts.tinsae,
      isMovable: true,
      keywords: ['tinsae', 'fasika', 'easter', 'resurrection', 'passover', 'ትንሣኤ', 'ፋሲካ', 'ትንሳኤ'],
    });

    // Rikebe Kahnat
    const rikEth = convertGregorianToEthiopian(feasts.rikebeKahnat);
    addItem({
      id: `mov-rikebe-kahnat-${activeEthYear}`,
      title: 'Rikebe Kahnat (Synod of the Priests)',
      amharicTitle: 'ርክበ ካህናት',
      category: 'minor_feast',
      categoryLabel: 'Movable Liturgical Feast',
      categoryColor: 'bg-[#006732] text-white',
      description: 'Commemorates the meeting and synod of the priests 24 days after Easter.',
      amharicDescription: 'ከትንሣኤ በኋላ በ24ኛው ቀን የሚከበር የካህናት መሰብሰቢያ መታሰቢያ በዓል።',
      ethYear: rikEth.year,
      ethMonth: rikEth.month,
      ethDay: rikEth.day,
      gregDate: feasts.rikebeKahnat,
      isMovable: true,
      keywords: ['rikebe kahnat', 'priests', 'synod', 'ርክበ ካህናት', 'ካህናት'],
    });

    // Erget (Ascension Thursday)
    const ergEth = convertGregorianToEthiopian(feasts.erget);
    addItem({
      id: `mov-erget-${activeEthYear}`,
      title: 'Erget (Ascension of Jesus Christ)',
      amharicTitle: 'ዕርገት (የጌታችን ዕርገት)',
      category: 'major_feast',
      categoryLabel: 'Major Feast of Our Lord',
      categoryColor: 'bg-[#006732] text-white',
      description: 'Commemorates the bodily Ascension of Jesus Christ into heaven 40 days after Easter.',
      amharicDescription: 'ጌታችን በትንሣኤ በ40ኛው ቀን ወደ ሰማያት በክብር ያረገበት በዓል።',
      ethYear: ergEth.year,
      ethMonth: ergEth.month,
      ethDay: ergEth.day,
      gregDate: feasts.erget,
      isMovable: true,
      keywords: ['erget', 'ascension', 'heaven', 'ዕርገት', 'እርገት', 'ሰማይ'],
    });

    // Paraklitos (Pentecost Sunday)
    const parEth = convertGregorianToEthiopian(feasts.paraklitos);
    addItem({
      id: `mov-paraklitos-${activeEthYear}`,
      title: 'Paraklitos (Pentecost / Descent of the Holy Spirit)',
      amharicTitle: 'ጰራቅሊጦስ (በዓለ ኀምሳ / የጰራቅሊጦስ በዓል)',
      category: 'major_feast',
      categoryLabel: 'Major Feast of Our Lord',
      categoryColor: 'bg-[#006732] text-white',
      description: 'Descent of the Holy Spirit upon the holy Apostles 50 days after Easter.',
      amharicDescription: 'መንፈስ ቅዱስ በጽርሐ ጽዮን ለሐዋርያት የወረደበት ታላቅ በዓል።',
      ethYear: parEth.year,
      ethMonth: parEth.month,
      ethDay: parEth.day,
      gregDate: feasts.paraklitos,
      isMovable: true,
      keywords: ['paraklitos', 'pentecost', 'holy spirit', 'apostles', 'ጰራቅሊጦስ', 'መንፈስ ቅዱስ', 'በዓለ ኀምሳ'],
    });

    // Apostles Fast (Sene Tsom)
    const aposEth = convertGregorianToEthiopian(feasts.apostlesFastStart);
    addItem({
      id: `mov-apostles-fast-${activeEthYear}`,
      title: 'Sene Tsom (Fast of the Apostles) - Start',
      amharicTitle: 'ጾመ ሐዋርያት (የሰኔ ጾም) - መግቢያ',
      category: 'fasting',
      categoryLabel: 'Canonical Fast of the Apostles',
      categoryColor: 'bg-[#7A1C74] text-white',
      description: 'Fast observed by the Apostles after receiving the Holy Spirit.',
      amharicDescription: 'ሐዋርያት መንፈስ ቅዱስን ከተቀበሉ በኋላ ለስብከተ ወንጌል የጾሙት ጾም።',
      ethYear: aposEth.year,
      ethMonth: aposEth.month,
      ethDay: aposEth.day,
      gregDate: feasts.apostlesFastStart,
      isMovable: true,
      keywords: ['sene tsom', 'apostles fast', 'fast of apostles', 'ጾመ ሐዋርያት', 'የሰኔ ጾም'],
    });
  } catch (e) {
    console.error('Error computing movable feasts for search index', e);
  }

  // 3. Prominent Annual Saint Feast Days & Fixed Celebrations across the 13 Months
  const ANNUAL_FEASTS = [
    // Meskerem
    {
      id: 'ann-enkutatash',
      name: 'Enkutatash (Ethiopian New Year) & Kidus Yohannes',
      amharicName: 'እንቁጣጣሽ (አዲስ ዓመት) እና ቅዱስ ዮሐንስ',
      category: 'major_feast' as const,
      categoryLabel: 'New Year & Feast of St. John',
      m: 1, d: 1,
      desc: 'Ethiopian New Year and commemoration of Saint John the Baptist.',
      amDesc: 'የኢትዮጵያ አዲስ ዓመት እና የቅዱስ ዮሐንስ መጥምቅ መታሰቢያ።',
      kw: ['enkutatash', 'new year', 'yohannes', 'st john', 'adey abeba', 'እንቁጣጣሽ', 'አዲስ ዓመት', 'ዮሐንስ', 'መስከረም 1'],
    },
    {
      id: 'ann-meskel-demera',
      name: 'Demera (Eve of Meskel)',
      amharicName: 'ደመራ (የመስቀል ዋዜማ)',
      category: 'major_feast' as const,
      categoryLabel: 'Eve of the Holy Cross',
      m: 1, d: 16,
      desc: 'Lighting of the traditional Demera bonfire celebrating Queen Helena’s guidance.',
      amDesc: 'ንግሥት እሌኒ መስቀሉን ለማግኘት ደመራ ያበራችበት ታላቅ ዋዜማ።',
      kw: ['demera', 'bonfire', 'meskel', 'ደመራ', 'መስከረም 16'],
    },
    {
      id: 'ann-meskel',
      name: 'Meskel (Finding of the True Cross)',
      amharicName: 'መስቀል (በዓለ መስቀል)',
      category: 'major_feast' as const,
      categoryLabel: 'Major Feast of the True Cross',
      m: 1, d: 17,
      desc: 'Commemorates the finding of the True Life-Giving Cross of Jesus Christ by Empress Helena in Jerusalem.',
      amDesc: 'ንግሥት እሌኒ የጌታችንን መስቀል ከመሬት ቆፍራ ያወጣችበት ታላቅ በዓል።',
      kw: ['meskel', 'cross', 'true cross', 'helena', 'eleni', 'መስቀል', 'በዓለ መስቀል', 'እሌኒ', 'መስከረም 17'],
    },
    {
      id: 'ann-gishen-maryam',
      name: 'Gishen Debre Kerbe Maryam (Feast of the Cross Fragment)',
      amharicName: 'ግሸን ደብረ ከርቤ ማርያም (የቀኝ ክንፉ መስቀል)',
      category: 'major_feast' as const,
      categoryLabel: 'Major Feast of St. Mary & the Cross',
      m: 1, d: 21,
      desc: 'Commemorates the deposit of the Right Wing of the True Cross at Gishen Debre Kerbe sanctuary.',
      amDesc: 'የቀኝ ክንፉ ግማደ መስቀል በግሸን ደብረ ከርቤ የተቀመጠበት ታላቅ በዓል።',
      kw: ['gishen', 'gishen maryam', 'debre kerbe', 'ግሸን', 'ግሸን ማርያም', 'ደብረ ከርቤ', 'መስከረም 21'],
    },
    {
      id: 'ann-tsige-tsom',
      name: 'Tsige Tsom (Fast of the Holy Family Flowers) - Start',
      amharicName: 'ጾመ ጽጌ (የጽጌ ጾም) - መግቢያ',
      category: 'fasting' as const,
      categoryLabel: 'Fast of the Flight to Egypt',
      m: 1, d: 26,
      desc: 'Start of the 40-day optional fast honoring the flight of the Holy Family and Virgin Mary into Egypt.',
      amDesc: 'እመቤታችን ከልጇ ጋር ወደ ግብፅ የተሰደደችበትን ስደት የምናስብበት የ40 ቀን ጾም።',
      kw: ['tsige', 'tsige tsom', 'flowers', 'mahlete tsige', 'ጾመ ጽጌ', 'ጽጌ', 'ማኅሌተ ጽጌ', 'መስከረም 26'],
    },
    {
      id: 'ann-arsema-mesk',
      name: 'Saint Arsema the Martyr (Annual Feast of St. Hripsime)',
      amharicName: 'ቅድስት አርሴማ (ዓመታዊ የዕረፍት በዓል)',
      category: 'minor_feast' as const,
      categoryLabel: 'Annual Feast of Saint Arsema',
      m: 1, d: 29,
      desc: 'Annual martyrdom and victory feast of the renowned virgin martyr Saint Arsema.',
      amDesc: 'የሰማዕቷ የቅድስት አርሴማ ዓመታዊ የዕረፍትና የድል መታሰቢያ በዓል።',
      kw: ['arsema', 'saint arsema', 'hripsime', 'አርሴማ', 'ቅድስት አርሴማ', 'መስከረም 29'],
    },

    // Tikimt
    {
      id: 'ann-abo-tikimt',
      name: 'Abune Gebre Menfes Kidus (Abo) - Arrival in Ethiopia',
      amharicName: 'አቡነ ገብረ መንፈስ ቅዱስ (አቦ) - ጥቅምት አቦ',
      category: 'minor_feast' as const,
      categoryLabel: 'Feast of Abune Gebre Menfes Kidus',
      m: 2, d: 5,
      desc: 'Celebrates the arrival of the great ascetic saint Abune Gebre Menfes Kidus (Abo) in Ethiopia.',
      amDesc: 'ጻድቁ አባታችን አቡነ ገብረ መንፈስ ቅዱስ ወደ ኢትዮጵያ የገቡበት መታሰቢያ።',
      kw: ['abo', 'gebre menfes kidus', 'abune gebre menfes kidus', 'አቦ', 'ገብረ መንፈስ ቅዱስ', 'ጥቅምት አቦ', 'ጥቅምት 5'],
    },
    {
      id: 'ann-aragawi-tikimt',
      name: 'Abba Aragawi (Za-Mikael) - Disappearance & Glory',
      amharicName: 'አባ አረጋዊ (ዘሚካኤል) - ዓመታዊ በዓል',
      category: 'minor_feast' as const,
      categoryLabel: 'Feast of the Nine Saints',
      m: 2, d: 14,
      desc: 'Annual feast of Abba Aragawi, leader of the Nine Saints and founder of Debre Damo monastery.',
      amDesc: 'ከተስዓቱ ቅዱሳን አንዱ የሆኑት የአባ አረጋዊ የደብረ ዳሞ ዓመታዊ በዓል።',
      kw: ['aragawi', 'abba aragawi', 'debre damo', 'nine saints', 'አረጋዊ', 'አባ አረጋዊ', 'ደብረ ዳሞ', 'ጥቅምት 14'],
    },
    {
      id: 'ann-teklehaymanot-tikimt',
      name: 'Abune Tekle Haymanot - Standing on One Leg (Tikimt Tekle Haymanot)',
      amharicName: 'አቡነ ተክለ ሃይማኖት - እግራቸው የተሰበረበት (ጥቅምት ተክለ ሃይማኖት)',
      category: 'minor_feast' as const,
      categoryLabel: 'Feast of Abune Tekle Haymanot',
      m: 2, d: 24,
      desc: 'Commemorates Abune Tekle Haymanot standing in constant prayer for 29 years until his leg broke.',
      amDesc: 'ጻድቁ አባታችን አቡነ ተክለ ሃይማኖት ለ29 ዓመታት በአንድ እግራቸው ቆመው የጸለዩበት መታሰቢያ።',
      kw: ['tekle haymanot', 'abune tekle haymanot', 'debre libanos', 'ተክለ ሃይማኖት', 'አቡነ ተክለ ሃይማኖት', 'ደብረ ሊባኖስ', 'ጥቅምት 24'],
    },
    {
      id: 'ann-medhanealem-tikimt',
      name: 'Tikimt Medhane Alem (Feast of the Savior of the World)',
      amharicName: 'ጥቅምት መድኃኔዓለም (ዓመታዊ በዓል)',
      category: 'major_feast' as const,
      categoryLabel: 'Feast of the Savior of the World',
      m: 2, d: 27,
      desc: 'Great annual feast honoring Christ Jesus as Medhane Alem (Savior of the World).',
      amDesc: 'የጌታችን የመድኃኒታችን የኢየሱስ ክርስቶስ ታላቅ ዓመታዊ የበረከት በዓል።',
      kw: ['medhane alem', 'medhanialem', 'savior', 'jesus', 'መድኃኔዓለም', 'መድኃኔ ዓለም', 'ጥቅምት 27'],
    },

    // Hedar
    {
      id: 'ann-hedar-sillase',
      name: 'Hedar Sillase (Annual Feast of the Holy Trinity)',
      amharicName: 'ኅዳር ሥላሴ (የቅድስት ሥላሴ ዓመታዊ በዓል)',
      category: 'major_feast' as const,
      categoryLabel: 'Major Feast of the Holy Trinity',
      m: 3, d: 7,
      desc: 'Major annual celebration honoring the Father, the Son, and the Holy Spirit (Holy Trinity).',
      amDesc: 'የአብ የወልድ የመንፈስ ቅዱስ የአንድነታቸውና የሦስትነታቸው ዓመታዊ ታላቅ በዓል።',
      kw: ['sillase', 'trinity', 'holy trinity', 'hedar sillase', 'ሥላሴ', 'ቅድስት ሥላሴ', 'ኅዳር ሥላሴ', 'ኅዳር 7'],
    },
    {
      id: 'ann-hedar-michael',
      name: 'Hedar Michael (Annual Feast of Archangel Michael)',
      amharicName: 'ኅዳር ሚካኤል (የቅዱስ ሚካኤል ታላቅ ዓመታዊ በዓል)',
      category: 'major_feast' as const,
      categoryLabel: 'Great Feast of St. Michael',
      m: 3, d: 12,
      desc: 'Greatest annual celebration of Archangel Michael, commemorating his victory over Lucifer.',
      amDesc: 'የሊቀ መላእክት የቅዱስ ሚካኤል ታላቁ ዓመታዊ በዓል፤ በዲያብሎስ ላይ ድል የተቀዳጀበት።',
      kw: ['michael', 'mikael', 'hedar michael', 'archangel michael', 'ሚካኤል', 'ቅዱስ ሚካኤል', 'ኅዳር ሚካኤል', 'ኅዳር 12'],
    },
    {
      id: 'ann-hedar-rufael',
      name: 'Hedar Rufael (Consecration of Archangel Raphael Church)',
      amharicName: 'ኅዳር ሩፋኤል (የቅዱስ ሩፋኤል ቤተ ክርስቲያን ቅዳሴ)',
      category: 'minor_feast' as const,
      categoryLabel: 'Feast of Archangel Raphael',
      m: 3, d: 13,
      desc: 'Consecration of the Church of Saint Raphael the Archangel.',
      amDesc: 'የፈዋሹ መልአክ የቅዱስ ሩፋኤል ቤተ ክርስቲያን የተባረከችበት መታሰቢያ።',
      kw: ['rufael', 'raphael', 'hedar rufael', 'ሩፋኤል', 'ቅዱስ ሩፋኤል', 'ኅዳር 13'],
    },
    {
      id: 'ann-tsome-nebiyat',
      name: 'Tsome Nebiyat / Gena Tsom (Advent Fast) - Start',
      amharicName: 'ጾመ ነቢያት (የገና ጾም) - መግቢያ',
      category: 'fasting' as const,
      categoryLabel: 'Advent Fast (43 Days)',
      m: 3, d: 16,
      desc: 'Start of the 43-day Nativity/Advent Fast commemorating the prophecies of Christ’s Incarnation.',
      amDesc: 'የነቢያት ትንቢት ፍጻሜ የሆነውን የጌታችንን ልደት የምንጠባበቅበት የ43 ቀን ጾም መግቢያ።',
      kw: ['nebiyat', 'gena tsom', 'advent', 'fast of prophets', 'ጾመ ነቢያት', 'የገና ጾም', 'ኅዳር 16'],
    },
    {
      id: 'ann-tsion-maryam',
      name: 'Hedar Tsion Maryam (Feast of the Ark of the Covenant at Axum)',
      amharicName: 'ኅዳር ጽዮን ማርያም (ታቦተ ጽዮን በአክሱም)',
      category: 'major_feast' as const,
      categoryLabel: 'Feast of Our Lady of Zion',
      m: 3, d: 21,
      desc: 'Commemorates the arrival and consecration of the Ark of the Covenant (Tabote Tsion) in Axum, Ethiopia.',
      amDesc: 'ታቦተ ጽዮን ወደ አክሱም ጽዮን የገባችበትና የተቀደሰችበት ታላቅ ዓመታዊ በዓል።',
      kw: ['tsion', 'zion', 'axum', 'tabot', 'tsion maryam', 'ጽዮን', 'አክሱም', 'ጽዮን ማርያም', 'ኅዳር ጽዮን', 'ኅዳር 21'],
    },
    {
      id: 'ann-hedar-giorgis',
      name: 'Hedar Giorgis (Consecration of Church of St. George at Lydda)',
      amharicName: 'ኅዳር ጊዮርጊስ (የቅዱስ ጊዮርጊስ ቤተ ክርስቲያን ቅዳሴ)',
      category: 'minor_feast' as const,
      categoryLabel: 'Feast of Saint George',
      m: 3, d: 23,
      desc: 'Consecration of the historic Church of Saint George at Lydda (Diospolis).',
      amDesc: 'በልዳ የተሠራችው የሰማዕቱ የቅዱስ ጊዮርጊስ ቤተ ክርስቲያን የከበረችበት በዓል።',
      kw: ['giorgis', 'george', 'hedar giorgis', 'lydda', 'ጊዮርጊስ', 'ቅዱስ ጊዮርጊስ', 'ኅዳር ጊዮርጊስ', 'ኅዳር 23'],
    },
    {
      id: 'ann-merkorewos',
      name: 'Saint Mercurius (Merkorewos with Two Swords)',
      amharicName: 'ቅዱስ መርቆሬዎስ (ባለ ሁለት ሰይፍ)',
      category: 'minor_feast' as const,
      categoryLabel: 'Feast of St. Mercurius',
      m: 3, d: 25,
      desc: 'Annual feast of Saint Mercurius the Great Martyr who received two swords from Archangel Michael.',
      amDesc: 'በቅዱስ ሚካኤል ሁለት ሰይፍ የተሰጠው የሰማዕቱ የቅዱስ መርቆሬዎስ ዓመታዊ በዓል።',
      kw: ['merkorewos', 'mercurius', 'መርቆሬዎስ', 'ቅዱስ መርቆሬዎስ', 'ኅዳር 25'],
    },

    // Tahsas
    {
      id: 'ann-beata-maryam',
      name: 'Ba\'ata Maryam (Presentation of the Virgin Mary in the Temple)',
      amharicName: 'በዓታ ለማርያም (እመቤታችን ወደ ቤተ መቅደስ የገባችበት)',
      category: 'major_feast' as const,
      categoryLabel: 'Major Feast of the Virgin Mary',
      m: 4, d: 3,
      desc: 'Commemorates the 3-year-old Blessed Virgin Mary entering the Holy Temple in Jerusalem to serve God.',
      amDesc: 'እመቤታችን ቅድስት ድንግል ማርያም በሦስት ዓመቷ ወደ ቤተ መቅደስ የገባችበት ታላቅ በዓል።',
      kw: ['beata', 'baata', 'mary', 'temple', 'presentation', 'በዓታ', 'በዓታ ለማርያም', 'ታኅሣሥ 3'],
    },
    {
      id: 'ann-tahsas-gabriel',
      name: 'Tahsas Gabriel (Feast of Archangel Gabriel & Three Holy Youths)',
      amharicName: 'ታኅሣሥ ገብርኤል (ቅዱስ ገብርኤል ሠለስቱ ደቂቅን ያዳነበት)',
      category: 'major_feast' as const,
      categoryLabel: 'Great Feast of St. Gabriel',
      m: 4, d: 19,
      desc: 'Archangel Gabriel delivering Hananiah, Azariah, and Mishael from the burning fiery furnace in Babylon.',
      amDesc: 'ቅዱስ ገብርኤል ሠለስቱ ደቂቅን (አናንያ፣ አዛርያ፣ ሚሳኤል) ከእቶን እሳት ያዳነበት ታላቅ ዓመታዊ በዓል (ቁልቢ ገብርኤል)።',
      kw: ['gabriel', 'tahsas gabriel', 'kulubi', 'three youths', 'ገብርኤል', 'ቅዱስ ገብርኤል', 'ታኅሣሥ ገብርኤል', 'ቁልቢ', 'ታኅሣሥ 19'],
    },
    {
      id: 'ann-teklehaymanot-tahsas',
      name: 'Birth of Abune Tekle Haymanot',
      amharicName: 'የአቡነ ተክለ ሃይማኖት የልደት በዓል',
      category: 'minor_feast' as const,
      categoryLabel: 'Birth of Abune Tekle Haymanot',
      m: 4, d: 24,
      desc: 'Commemorates the blessed birth of Ethiopian national saint Abune Tekle Haymanot at Zorare, Shoa.',
      amDesc: 'ጻድቁ አባታችን አቡነ ተክለ ሃይማኖት በጽላልሽ ዞረሬ የተወለዱበት የልደት በዓል።',
      kw: ['tekle haymanot', 'birth', 'zorare', 'ተክለ ሃይማኖት', 'ልደት', 'ታኅሣሥ 24'],
    },
    {
      id: 'ann-lidet-gena',
      name: 'Lidet (Genna / Ethiopian Christmas / Nativity of Jesus Christ)',
      amharicName: 'ልደት (ገና / የጌታችን የልደት በዓል)',
      category: 'major_feast' as const,
      categoryLabel: 'Major Feast of the Nativity',
      m: 4, d: 29,
      desc: 'Glorious celebration of the birth of Jesus Christ in Bethlehem of Judea.',
      amDesc: 'ጌታችን መድኃኒታችን ኢየሱስ ክርስቶስ በቤተልሔም የተወለደበት ታላቅ የልደት (የገና) በዓል።',
      kw: ['lidet', 'gena', 'christmas', 'nativity', 'bethlehem', 'ልደት', 'ገና', 'ቤተልሔም', 'ታኅሣሥ 29', 'ታኅሣሥ 28'],
    },

    // Ter
    {
      id: 'ann-estifanos-ter',
      name: 'Saint Stephen the Protomartyr (Kidus Estifanos)',
      amharicName: 'ቅዱስ እስጢፋኖስ (ቀዳሜ ሰማዕት)',
      category: 'minor_feast' as const,
      categoryLabel: 'Feast of the First Martyr',
      m: 5, d: 1,
      desc: 'Commemorates the martyrdom of Saint Stephen, the first Christian deacon and protomartyr.',
      amDesc: 'የቀዳሜ ሰማዕት የቅዱስ እስጢፋኖስ ዓመታዊ የዕረፍት በዓል።',
      kw: ['estifanos', 'stephen', 'protomartyr', 'እስጢፋኖስ', 'ቅዱስ እስጢፋኖስ', 'ጥር 1'],
    },
    {
      id: 'ann-gezret',
      name: 'Gezret (Circumcision of Jesus Christ)',
      amharicName: 'ግዝረት (በዓለ ግዝረት)',
      category: 'minor_feast' as const,
      categoryLabel: 'Minor Feast of Our Lord',
      m: 5, d: 6,
      desc: 'Commemorates the circumcision of Jesus Christ on the eighth day according to Mosaic law.',
      amDesc: 'ጌታችን በሥጋ በተገረዘበት በ8ኛው ቀን የሚከበር በዓል።',
      kw: ['gezret', 'circumcision', 'ግዝረት', 'በዓለ ግዝረት', 'ጥር 6'],
    },
    {
      id: 'ann-ketera',
      name: 'Ketera (Eve of Timkat / Epiphany)',
      amharicName: 'ከተራ (የጥምቀት ዋዜማ)',
      category: 'major_feast' as const,
      categoryLabel: 'Eve of the Holy Epiphany',
      m: 5, d: 10,
      desc: 'Eve of Epiphany when sacred Tabots process with song to the baptismal waters (Jan Meda).',
      amDesc: 'ታቦታቱ በዝማሬና በሆታ ወደ ጥምቀተ ባሕር የሚወርዱበት የጥምቀት ዋዜማ።',
      kw: ['ketera', 'timkat eve', 'jan meda', 'ከተራ', 'ዋዜማ', 'ጥር 10'],
    },
    {
      id: 'ann-timkat',
      name: 'Timkat (Epiphany / Theophany / Baptism of Jesus Christ)',
      amharicName: 'ጥምቀት (በዓለ ጥምቀት / አስተርእዮ)',
      category: 'major_feast' as const,
      categoryLabel: 'Major Feast of Holy Epiphany',
      m: 5, d: 11,
      desc: 'Commemorates the Baptism of Jesus Christ in the Jordan River by John the Baptist. UNESCO inscribed.',
      amDesc: 'ጌታችን በዮርዳኖስ ባሕር በዮሐንስ እጅ የተጠመቀበት ታላቅ የጥምቀት በዓል።',
      kw: ['timkat', 'timket', 'epiphany', 'baptism', 'jordan', 'ጥምቀት', 'በዓለ ጥምቀት', 'ዮርዳኖስ', 'ጥር 11'],
    },
    {
      id: 'ann-kana-ze-galila',
      name: 'Kana Ze-Galila (Wedding at Cana / Water Turned to Wine)',
      amharicName: 'ቃና ዘገሊላ (የጌታችን የመጀመሪያ ተአምር)',
      category: 'minor_feast' as const,
      categoryLabel: 'Minor Feast of Our Lord',
      m: 5, d: 12,
      desc: 'Christ’s first miracle of turning water into wine at the wedding in Cana of Galilee.',
      amDesc: 'ጌታችን በቃና ዘገሊላ ሰርግ ላይ ውኃውን ወደ ወይን የለወጠበት ተአምራት መታሰቢያ።',
      kw: ['kana', 'cana', 'kana zegalila', 'wine', 'ቃና ዘገሊላ', 'ቃና', 'ጥር 12'],
    },
    {
      id: 'ann-ter-kirkos',
      name: 'Ter Kirkos (Saint Cyriacus and Saint Julitta)',
      amharicName: 'ጥር ቂርቆስ (ቅዱስ ቂርቆስና እናቱ ኢየሉጣ)',
      category: 'minor_feast' as const,
      categoryLabel: 'Feast of Saint Cyriacus',
      m: 5, d: 15,
      desc: 'Commemorates the martyrdom of the three-year-old Saint Cyriacus and his mother Saint Julitta.',
      amDesc: 'ሕፃኑ ቅዱስ ቂርቆስና እናቱ ቅድስት ኢየሉጣ በእሳት ውስጥ የጸኑበት ዓመታዊ በዓል።',
      kw: ['kirkos', 'cyriacus', 'ter kirkos', 'ቂርቆስ', 'ቅዱስ ቂርቆስ', 'ጥር 15'],
    },
    {
      id: 'ann-astereyo-maryam',
      name: 'Aster\'eyo Maryam (Dormition / Departure of the Virgin Mary)',
      amharicName: 'አስተርእዮ ማርያም (የእመቤታችን የዕረፍት በዓል)',
      category: 'major_feast' as const,
      categoryLabel: 'Major Feast of the Virgin Mary',
      m: 5, d: 21,
      desc: 'Commemorates the holy departure (Dormition) of the Blessed Virgin Mary surrounded by the Apostles.',
      amDesc: 'እመቤታችን ቅድስት ድንግል ማርያም ከዚህ ዓለም በሞት ያረፈችበት ታላቅ በዓል።',
      kw: ['astereyo', 'asterio', 'dormition', 'mary', 'አስተርእዮ', 'አስተርእዮ ማርያም', 'ጥር 21'],
    },
    {
      id: 'ann-urael-ter',
      name: 'Saint Uriel the Archangel (Kidus Urael)',
      amharicName: 'ቅዱስ ዑራኤል (መልአከ ሰላም ቅዱስ ዑራኤል)',
      category: 'minor_feast' as const,
      categoryLabel: 'Feast of Archangel Uriel',
      m: 5, d: 22,
      desc: 'Annual celebration honoring Archangel Uriel who carried the chalice of Christ’s blood to Ethiopia.',
      amDesc: 'የጌታችንን ክቡር ደም በጽዋ ይዞ ኢትዮጵያን የረጨው የቅዱስ ዑራኤል ዓመታዊ በዓል።',
      kw: ['urael', 'uriel', 'archangel uriel', 'ዑራኤል', 'ቅዱስ ዑራኤል', 'ጥር 22'],
    },

    // Yekatit
    {
      id: 'ann-kidane-meheret',
      name: 'Kidane Meheret (Covenant of Mercy given to St. Mary)',
      amharicName: 'ኪዳነ ምሕረት (የቃል ኪዳን በዓል)',
      category: 'major_feast' as const,
      categoryLabel: 'Great Covenant of Mercy',
      m: 6, d: 16,
      desc: 'Commemorates the great Covenant of Mercy promised by Christ to His Mother at Golgotha.',
      amDesc: 'ጌታችን ለድንግል ማርያም በጎልጎታ የገባላትን የይቅርታ ቃል ኪዳን የምናስብበት ታላቅ በዓል።',
      kw: ['kidane meheret', 'covenant of mercy', 'mercy', 'mary', 'ኪዳነ ምሕረት', 'ቃል ኪዳን', 'የካቲት 16'],
    },
    {
      id: 'ann-adwa',
      name: 'Adwa Victory Day (Battle of Adwa)',
      amharicName: 'የዓድዋ ድል መታሰቢያ',
      category: 'national' as const,
      categoryLabel: 'National Victory Day',
      m: 6, d: 23,
      desc: 'National celebration of Ethiopia’s historic victory over colonial Italian forces in 1896.',
      amDesc: 'የኢትዮጵያ ጀግኖች ወራሪውን የጣሊያን ጦር በዓድዋ ተራሮች ድል ያደረጉበት ታላቅ ቀን።',
      kw: ['adwa', 'battle of adwa', 'victory', 'ዓድዋ', 'የዓድዋ ድል', 'የካቲት 23'],
    },

    // Megabit
    {
      id: 'ann-abo-megabit',
      name: 'Abune Gebre Menfes Kidus (Abo) - Departure (Megabit Abo)',
      amharicName: 'አቡነ ገብረ መንፈስ ቅዱስ (አቦ) - ዓመታዊ የዕረፍት በዓል',
      category: 'minor_feast' as const,
      categoryLabel: 'Departure of Abune Gebre Menfes Kidus',
      m: 7, d: 5,
      desc: 'Commemorates the holy departure of Saint Abune Gebre Menfes Kidus (Abo) at Mount Ziquala.',
      amDesc: 'ጻድቁ አባታችን አቡነ ገብረ መንፈስ ቅዱስ በዝቋላ ተራራ ያረፉበት ታላቅ ዓመታዊ በዓል።',
      kw: ['abo', 'gebre menfes kidus', 'ziquala', 'megabit abo', 'አቦ', 'ገብረ መንፈስ ቅዱስ', 'መጋቢት 5', 'ዝቋላ'],
    },
    {
      id: 'ann-medhanealem-megabit',
      name: 'Megabit Medhane Alem (Crucifixion & Salvation of the World)',
      amharicName: 'መጋቢት መድኃኔዓለም (የዓለም ድኅነት መታሰቢያ)',
      category: 'major_feast' as const,
      categoryLabel: 'Feast of the Savior of the World',
      m: 7, d: 27,
      desc: 'Commemorates Christ’s historic crucifixion on Megabit 27 and redemption of mankind.',
      amDesc: 'ጌታችን በመጋቢት 27 ቀን ተሰቅሎ ዓለምን ያዳነበት ታላቅ መታሰቢያ።',
      kw: ['medhane alem', 'megabit medhane alem', 'salvation', 'redemption', 'መድኃኔዓለም', 'መጋቢት 27'],
    },

    // Miazia
    {
      id: 'ann-giorgis-miazia',
      name: 'Miazia Giorgis (Martyrdom & Victory of Saint George)',
      amharicName: 'ሚያዝያ ጊዮርጊስ (የቅዱስ ጊዮርጊስ ታላቅ የዕረፍት በዓል)',
      category: 'major_feast' as const,
      categoryLabel: 'Great Feast of Saint George',
      m: 8, d: 23,
      desc: 'Greatest annual feast of Saint George the Martyr, Prince of Martyrs.',
      amDesc: 'የሰማዕታት አለቃ የቅዱስ ጊዮርጊስ ዓመታዊ ታላቅ የዕረፍትና የድል በዓል።',
      kw: ['giorgis', 'george', 'st george', 'miazia giorgis', 'ጊዮርጊስ', 'ቅዱስ ጊዮርጊስ', 'ሚያዝያ ጊዮርጊስ', 'ሚያዝያ 23'],
    },
    {
      id: 'ann-patriots',
      name: 'Patriots\' Victory Day',
      amharicName: 'የአርበኞች ቀን (የድል በዓል)',
      category: 'national' as const,
      categoryLabel: 'National Public Holiday',
      m: 8, d: 27,
      desc: 'Commemorates the liberation of Ethiopia in 1941 from Italian fascist occupation.',
      amDesc: 'የኢትዮጵያ አርበኞች የፋሺስት ጣሊያንን ወረራ አሸንፈው ድል የተቀዳጁበት መታሰቢያ።',
      kw: ['patriots', 'arbegnoch', 'victory day', 'አርበኞች', 'የአርበኞች ቀን', 'ሚያዝያ 27'],
    },

    // Ginbot
    {
      id: 'ann-teklehaymanot-ginbot',
      name: 'Abune Tekle Haymanot - Translation of Relics (Ginbot 12)',
      amharicName: 'አቡነ ተክለ ሃይማኖት - ፍልሰተ ዐፅም (ግንቦት ተክለ ሃይማኖት)',
      category: 'minor_feast' as const,
      categoryLabel: 'Translation of Relics',
      m: 9, d: 12,
      desc: 'Commemorates the miraculous translation of the holy relics of Abune Tekle Haymanot to Debre Libanos.',
      amDesc: 'የጻድቁ የአቡነ ተክለ ሃይማኖት ቅዱስ ዐፅም የፈለሰበት ታላቅ በዓል።',
      kw: ['tekle haymanot', 'relics', 'translation', 'debre libanos', 'ተክለ ሃይማኖት', 'ፍልሰተ ዐፅም', 'ግንቦት 12'],
    },
    {
      id: 'ann-derg-downfall',
      name: 'Downfall of the Derg (National Day)',
      amharicName: 'የደርግ ውድቀት መታሰቢያ (ግንቦት 20)',
      category: 'national' as const,
      categoryLabel: 'National Public Holiday',
      m: 9, d: 20,
      desc: 'National holiday marking the end of the Derg regime in 1991.',
      amDesc: 'የደርግ ወታደራዊ አገዛዝ ያበቃበት ብሔራዊ በዓል።',
      kw: ['derg', 'ginbot 20', 'national day', 'ደርግ', 'ግንቦት 20'],
    },
    {
      id: 'ann-debre-mitmaq',
      name: 'Debre Mitmaq Maryam (Apparition of the Virgin Mary)',
      amharicName: 'ደብረ ምጥማቅ ማርያም (የእመቤታችን መገለጥ)',
      category: 'major_feast' as const,
      categoryLabel: 'Major Feast of the Virgin Mary',
      m: 9, d: 21,
      desc: 'Commemorates the miraculous 5-day apparition of the Virgin Mary at Debre Mitmaq with angels.',
      amDesc: 'እመቤታችን በደብረ ምጥማቅ ለ5 ቀናት በመላእክት ታጅባ የተገለጠችበት ታላቅ በዓል።',
      kw: ['debre mitmaq', 'apparition', 'mary', 'ደብረ ምጥማቅ', 'ማርያም', 'ግንቦት 21'],
    },

    // Sene
    {
      id: 'ann-sene-michael',
      name: 'Sene Michael (Miracle of Archangel Michael / Afomia)',
      amharicName: 'ሰኔ ሚካኤል (ቅዱስ ሚካኤል አፎምያን ያዳነበት)',
      category: 'major_feast' as const,
      categoryLabel: 'Great Feast of St. Michael',
      m: 10, d: 12,
      desc: 'Commemorates Archangel Michael saving Afomia from the devil.',
      amDesc: 'ቅዱስ ሚካኤል አፎምያን ከዲያብሎስ እጅ ያዳነበት ታላቅ ዓመታዊ በዓል።',
      kw: ['sene michael', 'michael', 'afomia', 'ሰኔ ሚካኤል', 'ሚካኤል', 'አፎምያ', 'ሰኔ 12'],
    },
    {
      id: 'ann-sene-gabriel',
      name: 'Sene Gabriel (Consecration of Archangel Gabriel Church)',
      amharicName: 'ሰኔ ገብርኤል (የቅዱስ ገብርኤል ዓመታዊ በዓል)',
      category: 'minor_feast' as const,
      categoryLabel: 'Feast of Archangel Gabriel',
      m: 10, d: 19,
      desc: 'Consecration of the Church of Saint Gabriel the Archangel.',
      amDesc: 'የቅዱስ ገብርኤል ሊቀ መላእክት ዓመታዊ መታሰቢያ በዓል።',
      kw: ['sene gabriel', 'gabriel', 'ሰኔ ገብርኤል', 'ገብርኤል', 'ሰኔ 19'],
    },
    {
      id: 'ann-sene-maryam',
      name: 'Sene Maryam (Hizkiel / Foundation of Church of Mary)',
      amharicName: 'ሕንፀተ ቤተ ክርስቲያን (ሰኔ ማርያም)',
      category: 'major_feast' as const,
      categoryLabel: 'Major Feast of the Virgin Mary',
      m: 10, d: 21,
      desc: 'Commemorates the foundation and building of the first Church in the name of Saint Mary at Philippi.',
      amDesc: 'በፊልጵስዩስ በእመቤታችን ስም የመጀመሪያዋ ቤተ ክርስቲያን የታነጸችበት በዓል።',
      kw: ['sene maryam', 'church foundation', 'mary', 'ሰኔ ማርያም', 'ሕንፀተ ቤተ ክርስቲያን', 'ሰኔ 21'],
    },

    // Hamle
    {
      id: 'ann-peter-paul',
      name: 'Feast of Saints Peter and Paul (Petros we Pawlos)',
      amharicName: 'የቅዱሳን ጴጥሮስና ጳውሎስ ዓመታዊ በዓል',
      category: 'major_feast' as const,
      categoryLabel: 'Feast of the Apostles',
      m: 11, d: 5,
      desc: 'Martyrdom and triumph of Apostles Peter and Paul in Rome.',
      amDesc: 'የሐዋርያት አለቆች የቅዱስ ጴጥሮስና የቅዱስ ጳውሎስ ዓመታዊ የዕረፍት በዓል።',
      kw: ['peter', 'paul', 'petros', 'pawlos', 'apostles', 'ጴጥሮስ', 'ጳውሎስ', 'ሐምሌ 5'],
    },
    {
      id: 'ann-hamle-sillase',
      name: 'Hamle Sillase (Feast of the Holy Trinity)',
      amharicName: 'ሐምሌ ሥላሴ (የቅድስት ሥላሴ ዓመታዊ በዓል)',
      category: 'major_feast' as const,
      categoryLabel: 'Major Feast of the Holy Trinity',
      m: 11, d: 7,
      desc: 'Annual feast honoring the Holy Trinity visiting Patriarch Abraham at the Oaks of Mamre.',
      amDesc: 'ቅድስት ሥላሴ በአብርሃም ቤት የተገለጡበት ታላቅ ዓመታዊ በዓል።',
      kw: ['hamle sillase', 'trinity', 'abraham', 'mamre', 'ሥላሴ', 'ሐምሌ ሥላሴ', 'ሐምሌ 7'],
    },

    // Nehase
    {
      id: 'ann-filseta-tsom',
      name: 'Tsome Filseta (Fast of the Assumption of Mary) - Start',
      amharicName: 'ጾመ ፍልሰታ (የፍልሰታ ጾም) - መግቢያ',
      category: 'fasting' as const,
      categoryLabel: 'Canonical Fast of Saint Mary (15 Days)',
      m: 12, d: 1,
      desc: 'Start of the sacred 15-day Fast of the Assumption of the Blessed Virgin Mary.',
      amDesc: 'የእመቤታችንን ዕረፍትና ትንሣኤ የምናስብበት የ15 ቀን ጾመ ፍልሰታ መግቢያ።',
      kw: ['filseta', 'tsome filseta', 'fast of mary', 'assumption', 'ጾመ ፍልሰታ', 'ፍልሰታ', 'ነሐሴ 1'],
    },
    {
      id: 'ann-debre-tabor',
      name: 'Debre Tabor (Buhe / Transfiguration of Jesus Christ)',
      amharicName: 'ደብረ ታቦር (ቡሄ / የጌታችን መገለጥ)',
      category: 'major_feast' as const,
      categoryLabel: 'Major Feast of Our Lord',
      m: 12, d: 13,
      desc: 'Commemorates the Transfiguration of Jesus Christ on Mount Tabor before Peter, James, and John. Popularly known as Buhe.',
      amDesc: 'ጌታችን በደብረ ታቦር ተራራ ላይ መለኮታዊ ክብሩን የገለጠበት ታላቅ በዓል (ቡሄ)።',
      kw: ['debre tabor', 'buhe', 'transfiguration', 'tabor', 'ደብረ ታቦር', 'ቡሄ', 'ነሐሴ 13'],
    },
    {
      id: 'ann-filseta-maryam',
      name: 'Filseta Maryam (Assumption & Ascension of the Virgin Mary)',
      amharicName: 'ፍልሰታ ለማርያም (የእመቤታችን ትንሣኤና ዕርገት)',
      category: 'major_feast' as const,
      categoryLabel: 'Major Feast of the Virgin Mary',
      m: 12, d: 16,
      desc: 'The Assumption and Ascension of the Holy Virgin Mary’s body into heaven.',
      amDesc: 'የእመቤታችን ቅድስት ድንግል ማርያም ሥጋዋ ተነሥቶ ያረገበት ታላቁ የፍልሰታ በዓል።',
      kw: ['filseta', 'assumption of mary', 'resurrection of mary', 'ፍልሰታ', 'ፍልሰታ ለማርያም', 'ነሐሴ 16'],
    },
    {
      id: 'ann-teklehaymanot-nehase',
      name: 'Departure of Abune Tekle Haymanot (Nehase Tekle Haymanot)',
      amharicName: 'አቡነ ተክለ ሃይማኖት - ዓመታዊ የዕረፍት በዓል (ነሐሴ ተክለ ሃይማኖት)',
      category: 'major_feast' as const,
      categoryLabel: 'Great Feast of Abune Tekle Haymanot',
      m: 12, d: 24,
      desc: 'Greatest annual feast commemorating the holy departure of Saint Abune Tekle Haymanot.',
      amDesc: 'የኢትዮጵያ ብርሃን የጻድቁ አባታችን የአቡነ ተክለ ሃይማኖት ዋነኛው ዓመታዊ የዕረፍት በዓል።',
      kw: ['tekle haymanot', 'abune tekle haymanot', 'debre libanos', 'ተክለ ሃይማኖት', 'አቡነ ተክለ ሃይማኖት', 'ነሐሴ 24'],
    },
    {
      id: 'ann-kristos-semra',
      name: 'Kristos Semra (Holy Mother Saint Kristos Semra)',
      amharicName: 'ቅድስት ክርስቶስ ሠምራ - ዓመታዊ የዕረፍት በዓል',
      category: 'minor_feast' as const,
      categoryLabel: 'Feast of Saint Kristos Semra',
      m: 12, d: 24,
      desc: 'Annual feast of the great Ethiopian female hermit and saint, Kristos Semra.',
      amDesc: 'የኢትዮጵያዊቷ ጻድቅ የቅድስት ክርስቶስ ሠምራ ዓመታዊ መታሰቢያ በዓል።',
      kw: ['kristos semra', 'saint kristos semra', 'ክርስቶስ ሠምራ', 'ቅድስት ክርስቶስ ሠምራ', 'ነሐሴ 24'],
    },

    // Pagume
    {
      id: 'ann-rufael-pagume',
      name: 'Pagume Rufael (Archangel Raphael’s Great Annual Feast)',
      amharicName: 'ጳጉሜ ሩፋኤል (የቅዱስ ሩፋኤል ሊቀ መላእክት ታላቅ በዓል)',
      category: 'major_feast' as const,
      categoryLabel: 'Great Feast of Archangel Raphael',
      m: 13, d: 3,
      desc: 'Greatest annual feast of Archangel Raphael, the angel of healing, joy, and peace.',
      amDesc: 'ፈዋሹና አስደሳቹ መልአክ የቅዱስ ሩፋኤል ሊቀ መላእክት ታላቁ ዓመታዊ በዓል።',
      kw: ['rufael', 'pagume rufael', 'raphael', 'healing', 'ሩፋኤል', 'ቅዱስ ሩፋኤል', 'ጳጉሜ ሩፋኤል', 'ጳጉሜ 3'],
    },
  ];

  ANNUAL_FEASTS.forEach(f => {
    let targetDay = f.d;
    // Leap year handling for Christmas
    if (f.id === 'ann-lidet-gena' && activeEthYear % 4 === 0) {
      targetDay = 28;
    }
    const gDate = convertEthiopianToGregorian(activeEthYear, f.m, targetDay);
    addItem({
      id: `${f.id}-${activeEthYear}`,
      title: f.name,
      amharicTitle: f.amharicName,
      category: f.category,
      categoryLabel: f.categoryLabel,
      categoryColor: f.category === 'major_feast' ? 'bg-[#006732] text-white' : f.category === 'fasting' ? 'bg-[#7A1C74] text-white' : 'bg-[#D1A110] text-brand-dark',
      description: f.desc,
      amharicDescription: f.amDesc,
      ethYear: activeEthYear,
      ethMonth: f.m,
      ethDay: targetDay,
      gregDate: gDate,
      keywords: f.kw,
    });
  });

  // 4. Fixed Ethiopian and Islamic Holidays (convert Gregorian Islamic holidays for this year)
  const gYear = activeEthYear + 8;
  const islamicLookup = MOVABLE_LOOKUP[gYear] || MOVABLE_LOOKUP[gYear - 1];
  if (islamicLookup) {
    // Eid al-Fitr
    const eidFitrGDate = new Date(gYear, islamicLookup.eidAlFitr.month - 1, islamicLookup.eidAlFitr.day);
    const eidFitrEth = convertGregorianToEthiopian(eidFitrGDate);
    addItem({
      id: `islamic-eid-fitr-${gYear}`,
      title: 'Eid al-Fitr (Islamic Festival of Breaking Fast)',
      amharicTitle: 'ዒድ አል-ፈጥር (የረመዳን ፍቺ በዓል)',
      category: 'national',
      categoryLabel: 'National Public Holiday',
      categoryColor: 'bg-brand-dark text-white',
      description: 'National public holiday marking the conclusion of Ramadan fasting.',
      amharicDescription: 'የረመዳን ጾም መጠናቀቅን ተከትሎ የሚከበር ታላቅ የእስልምና በዓል።',
      ethYear: eidFitrEth.year,
      ethMonth: eidFitrEth.month,
      ethDay: eidFitrEth.day,
      gregDate: eidFitrGDate,
      keywords: ['eid', 'fitr', 'eid al fitr', 'ramadan', 'ዒድ', 'ዒድ አል ፈጥር', 'ረመዳን'],
    });

    // Eid al-Adha
    const eidAdhaGDate = new Date(gYear, islamicLookup.eidAlAdha.month - 1, islamicLookup.eidAlAdha.day);
    const eidAdhaEth = convertGregorianToEthiopian(eidAdhaGDate);
    addItem({
      id: `islamic-eid-adha-${gYear}`,
      title: 'Eid al-Adha (Arafa / Feast of Sacrifice)',
      amharicTitle: 'ዒድ አል-አድሐ (አረፋ)',
      category: 'national',
      categoryLabel: 'National Public Holiday',
      categoryColor: 'bg-brand-dark text-white',
      description: 'National public holiday commemorating the sacrifice of Prophet Ibrahim.',
      amharicDescription: 'የመስዋዕትነት እና የታማኝነት መታሰቢያ በዓል (አረፋ)።',
      ethYear: eidAdhaEth.year,
      ethMonth: eidAdhaEth.month,
      ethDay: eidAdhaEth.day,
      gregDate: eidAdhaGDate,
      keywords: ['arafa', 'eid', 'adha', 'eid al adha', 'አረፋ', 'ዒድ አል አድሐ'],
    });

    // Mawlid
    const mawlidGDate = new Date(gYear, islamicLookup.mawlid.month - 1, islamicLookup.mawlid.day);
    const mawlidEth = convertGregorianToEthiopian(mawlidGDate);
    addItem({
      id: `islamic-mawlid-${gYear}`,
      title: 'Mawlid al-Nabi (Prophet’s Birthday)',
      amharicTitle: 'መውሊድ (የነቢዩ ሙሐመድ ልደት)',
      category: 'national',
      categoryLabel: 'National Public Holiday',
      categoryColor: 'bg-brand-dark text-white',
      description: 'National public holiday celebrating the birth of Prophet Muhammad.',
      amharicDescription: 'የነቢዩ ሙሐመድ የልደት መታሰቢያ በዓል።',
      ethYear: mawlidEth.year,
      ethMonth: mawlidEth.month,
      ethDay: mawlidEth.day,
      gregDate: mawlidGDate,
      keywords: ['mawlid', 'prophet', 'መውሊድ'],
    });
  }

  // 5. Australian Holidays if state chosen
  if (ausState && ausState !== 'NONE') {
    const ausList = getAustralianHolidays(gYear, ausState);
    ausList.forEach(a => {
      if (a.date.gregorian) {
        const gDate = new Date(gYear, a.date.gregorian.month - 1, a.date.gregorian.day);
        const eth = convertGregorianToEthiopian(gDate);
        addItem({
          id: `aus-${a.id}`,
          title: `${a.name}`,
          amharicTitle: `${a.name} (አውስትራሊያ)`,
          category: 'national',
          categoryLabel: `Australian Holiday (${ausState})`,
          categoryColor: 'bg-blue-800 text-white',
          description: a.description || `Public holiday in ${ausState}, Australia.`,
          ethYear: eth.year,
          ethMonth: eth.month,
          ethDay: eth.day,
          gregDate: gDate,
          keywords: [a.name, 'australia', ausState, 'public holiday'],
        });
      }
    });
  }

  return items;
}

// Perform search query filtering with score weighting
export function searchEvents(
  items: SearchEventItem[],
  query: string
): SearchEventItem[] {
  if (!query || !query.trim()) return [];

  const rawNormQuery = normalizeSearchQuery(query);
  const words = rawNormQuery.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const scoredResults: { item: SearchEventItem; score: number }[] = [];

  for (const item of items) {
    let score = 0;
    const normTitle = normalizeSearchQuery(item.title);
    const normAmTitle = normalizeSearchQuery(item.amharicTitle);
    const normDesc = normalizeSearchQuery(item.description);
    const normAmDesc = normalizeSearchQuery(item.amharicDescription || '');
    const normKeywords = item.keywords.map(k => normalizeSearchQuery(k));

    for (const w of words) {
      let wordMatched = false;

      // Exact match in title gives top score
      if (normTitle === w || normAmTitle === w) {
        score += 100;
        wordMatched = true;
      } else if (normTitle.startsWith(w) || normAmTitle.startsWith(w)) {
        score += 60;
        wordMatched = true;
      } else if (normTitle.includes(w) || normAmTitle.includes(w)) {
        score += 40;
        wordMatched = true;
      }

      // Check keywords
      for (const kw of normKeywords) {
        if (kw === w) {
          score += 50;
          wordMatched = true;
        } else if (kw.includes(w)) {
          score += 25;
          wordMatched = true;
        }
      }

      // Check descriptions
      if (normDesc.includes(w) || normAmDesc.includes(w)) {
        score += 15;
        wordMatched = true;
      }

      // Check month name or day number match
      if (item.isMonthlyRecurrence && item.monthlyDayNumber) {
        if (w === String(item.monthlyDayNumber) || w === `day ${item.monthlyDayNumber}`) {
          score += 35;
          wordMatched = true;
        }
      }

      if (!wordMatched) {
        score -= 20;
      }
    }

    // Boost major feasts slightly
    if (item.category === 'major_feast') {
      score += 10;
    }

    if (score > 0) {
      scoredResults.push({ item, score });
    }
  }

  // Sort descending by score
  scoredResults.sort((a, b) => b.score - a.score);
  return scoredResults.slice(0, 15).map(r => r.item);
}
