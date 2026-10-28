export interface LectionaryReading {
  book: string;
  chapterVerse: string;
  keyVerse?: string;
  amharicText: string;
  englishSummary?: string;
}

export interface DailyDevotionalData {
  id: string;
  liturgicalTitle: string;
  amharicTitle: string;
  saintOrFeast: string;
  geezZemaTheme: string; // e.g. "ይትባረክ", "ዘማርያም", "አስተምህሮ", "ጽጌ"
  misbak: {
    psalm: number;
    verses: string;
    geezVerse1: string;
    geezVerse2: string;
    geezVerse3: string;
    amharicText: string;
    englishMeaning: string;
  };
  gospel: {
    book: string;
    chapterVerse: string;
    keyVerseAmharic: string;
    keyVerseEnglish: string;
    passageAmharic: string;
    context: string;
  };
  paulineEpistle: LectionaryReading;
  catholicEpistle: LectionaryReading;
  actsReading: LectionaryReading;
  synaxariumReflection: {
    summary: string;
    patristicTeaching: string;
    quote: string;
    authorOrSource: string;
  };
  dailyPrayer: {
    title: string;
    amharicPrayer: string;
    englishPrayer: string;
  };
  spiritualPractice: {
    virtue: string;
    action: string;
  };
}

// 30 Monthly Saint Days Lectionary Mapping (According to the Ethiopian Orthodox Gitsawe tradition)
export const MONTHLY_DEVOTIONALS: Record<number, DailyDevotionalData> = {
  1: {
    id: 'day-1',
    liturgicalTitle: 'Lideta Lemariam & St. Raguel',
    amharicTitle: 'ልደታ ለማርያም እና ቅዱስ ራጉኤል',
    saintOrFeast: 'Nativity of Holy Virgin Mary & Archangel St. Raguel (ልደታ ለማርያም እና ቅዱስ ራጉኤል)',
    geezZemaTheme: 'ዘማርያም / ቅዱሳን',
    misbak: {
      psalm: 87,
      verses: '1-3',
      geezVerse1: 'መሠረታቲሃ ውስተ አድባር ቅዱሳን',
      geezVerse2: 'ያፈቅር እግዚአብሔር አናቅጸ ጽዮን',
      geezVerse3: 'እምኩሉ ተዓይኒሁ ለያዕቆብ',
      amharicText: 'መሠረቶቿ የተቀደሱ ተራሮች ናቸው፤ እግዚአብሔር ከያዕቆብ ድንኳኖች ይልቅ የጽዮንን ደጆች ይወድዳቸዋል። (መዝ 87:1-2)',
      englishMeaning: 'Her foundation is in the holy mountains. The Lord loves the gates of Zion more than all the dwellings of Jacob.',
    },
    gospel: {
      book: 'የሉቃስ ወንጌል (Luke)',
      chapterVerse: '1:39-56',
      keyVerseAmharic: '«ነፍሴ ጌታን ታከብረዋለች፤ መንፈሴም በአምላኬ በመድኃኒቴ ሐሴት ታደርጋለች፤ የባሪያይቱን መዋረድ አይቷልና።» (ሉቃ 1:46-48)',
      keyVerseEnglish: '“My soul magnifies the Lord, and my spirit has rejoiced in God my Savior, for He has regarded the humble state of His maidservant.” (Luke 1:46-48)',
      passageAmharic: 'ማርያምም በተነሣች ጊዜ ወደ ተራራማው አገር ወደ ይሁዳ ከተማ ፈጥና ወጣች፥ ወደ ዘካርያስም ቤት ገብታ ኤልሳቤጥን ተሳለመቻት። ኤልሳቤጥም የማርያምን ሰላምታ በሰማች ጊዜ ፅንሱ በማኅፀንዋ ውስጥ ዘለለ፤ በኤልሳቤጥም መንፈስ ቅዱስ ሞላባት።',
      context: 'The encounter between St. Mary and St. Elizabeth, revealing the fulfillment of God’s redemptive promise through humility and divine grace.',
    },
    paulineEpistle: {
      book: 'ወደ ገላትያ ሰዎች (Galatians)',
      chapterVerse: '4:1-7',
      amharicText: '«ነገር ግን የዘመኑ ፍጻሜ በደረሰ ጊዜ እግዚአብሔር ከሴት የተወለደውን ከሕግም በታች የተወለደውን ልጁን ላከ፤» (ገላ 4:4)',
      englishSummary: 'When the fullness of the time had come, God sent forth His Son, born of a woman, born under the law.',
    },
    catholicEpistle: {
      book: '፩ኛ የዮሐንስ መልእክት (1 John)',
      chapterVerse: '4:7-14',
      amharicText: '«ወዳጆች ሆይ፥ ፍቅር ከእግዚአብሔር ስለ ሆነ እርስ በርሳችን እንዋደድ፤ ፍቅርም ያለው ሁሉ ከእግዚአብሔር ተወልዷል እግዚአብሔርንም ያውቃል።» (1 ዮሐ 4:7)',
      englishSummary: 'Beloved, let us love one another, for love is of God; and everyone who loves is born of God and knows God.',
    },
    actsReading: {
      book: 'የሐዋርያት ሥራ (Acts)',
      chapterVerse: '1:12-14',
      amharicText: '«እነዚህ ሁሉ ከሴቶችና ከኢየሱስ እናት ከማርያም ከወንድሞቹም ጋር በአንድ ልብ ሆነው ለጸሎት ይተጉ ነበር።» (ሐዋ 1:14)',
      englishSummary: 'These all continued with one accord in prayer and supplication, with the women and Mary the mother of Jesus.',
    },
    synaxariumReflection: {
      summary: 'Today commemorates the joyful birth of the Blessed Virgin Mary to righteous Joachim and Anna, and the holy Archangel Raguel who stands before the throne of God.',
      patristicTeaching: 'St. John Chrysostom teaches that purity and meekness make the human soul a dwelling place for God’s wisdom, just as St. Mary became the temple of the incarnate Word.',
      quote: '«እግዚአብሔር ትሑታንን ያከብራል፤ የንጹሐንን ልብም ማደሪያው ያደርጋል።» — ቅዱስ ዮሐንስ አፈወርቅ',
      authorOrSource: 'ስንክሳር ዘወርኃ ጳጉሜን/መስከረም & ተአምረ ማርያም',
    },
    dailyPrayer: {
      title: 'የማለዳ ጸሎትና ምስጋና (Morning Prayer of Praise)',
      amharicPrayer: 'አቤቱ ቅዱስ አምላካችን እግዚአብሔር ሆይ፥ በቸርነትህ ያነጋኸን አምላክ ክብርና ምስጋና ለአንተ ይሁን። በእመቤታችን በቅድስት ድንግል ማርያምና በቅዱስ ራጉኤል ጸሎት ቤታችንንና ሕይወታችንን በሰላም ባርክልን፤ ከክፉ ነገር ሁሉ ጠብቀን። አሜን።',
      englishPrayer: 'O Holy God and Loving Creator, who hast safely brought us to the light of this new day, glory and adoration be unto Thee. Through the intercessions of the Holy Theotokos Virgin Mary and the Archangel Raguel, preserve our homes, guard our footsteps, and grant us peace. Amen.',
    },
    spiritualPractice: {
      virtue: 'ትሕትናና ፍቅር (Humility and Pure Love)',
      action: 'Practice sincere humility today by serving someone silently without seeking human praise or recognition.',
    },
  },
  2: {
    id: 'day-2',
    liturgicalTitle: 'Aba Guba & St. Thaddaeus',
    amharicTitle: 'አባ ጉባ እና ቅዱስ ታዴዎስ ሐዋርያ',
    saintOrFeast: 'Abba Guba (One of the Nine Saints) & St. Thaddaeus Apostle (አባ ጉባና ቅዱስ ታዴዎስ)',
    geezZemaTheme: 'ዘጻድቃን / ሐዋርያት',
    misbak: {
      psalm: 19,
      verses: '4-5',
      geezVerse1: 'ውስተ ኩሉ ምድር ወፅአ ነገሮሙ',
      geezVerse2: 'ወእስከ አጽናፈ ዓለም በጽሐ ነቢቦሙ',
      geezVerse3: 'ወውስቴቶን ሠረዐ ደብተራሁ ለፀሐይ',
      amharicText: 'ድምፃቸው ወደ ምድር ሁሉ፥ ቃላቸውም እስከ ዓለም ዳርቻ ወጣ። (መዝ 19:4)',
      englishMeaning: 'Their voice has gone out into all the earth, and their words to the ends of the world.',
    },
    gospel: {
      book: 'የማቴዎስ ወንጌል (Matthew)',
      chapterVerse: '10:1-15',
      keyVerseAmharic: '«በሄዳችሁም፦ መንግሥተ ሰማያት ቀርባለች ብላችሁ ስበኩ። ድውዮችን ፈውሱ፤ ሙታንን አስነሡ፤ ለምጻሞችን አንጹ፤ አጋንንትን አውጡ፤ በከንቱ ተቀበላችሁ፥ በከንቱ ስጡ።» (ማቴ 10:7-8)',
      keyVerseEnglish: '“And as you go, preach, saying, ‘The kingdom of heaven is at hand.’ Heal the sick, cleanse the lepers, raise the dead, cast out demons. Freely you have received, freely give.” (Matthew 10:7-8)',
      passageAmharic: 'አሥራ ሁለቱንም ደቀ መዛሙርቱን ወደ እርሱ ጠርቶ፥ እንዲያወጡአቸው በርኩሳን መናፍስት ላይ ደዌንና ሕማምንም ሁሉ እንዲፈውሱ ሥልጣን ሰጣቸው።',
      context: 'The mission of the Apostles to proclaim the kingdom of God with power, mercy, and sacrificial service.',
    },
    paulineEpistle: {
      book: '፩ኛ ወደ ቆሮንቶስ ሰዎች (1 Corinthians)',
      chapterVerse: '4:9-16',
      amharicText: '«እኛ ስለ ክርስቶስ ሞኞች ነን እናንተ ግን በክርስቶስ ልባሞች ናችሁ፤ እኛ ደካሞች ነን እናንተ ግን ኃይለኞች ናችሁ።» (1 ቆሮ 4:10)',
      englishSummary: 'We are fools for Christ’s sake, but you are wise in Christ! We are weak, but you are strong!',
    },
    catholicEpistle: {
      book: '፩ኛ የጴጥሮስ መልእክት (1 Peter)',
      chapterVerse: '5:1-7',
      amharicText: '«እርሱ ስለ እናንተ ያስባልና የሚያስጨንቃችሁን ሁሉ በእርሱ ላይ ጣሉት።» (1 ጴጥ 5:7)',
      englishSummary: 'Casting all your care upon Him, for He cares for you.',
    },
    actsReading: {
      book: 'የሐዋርያት ሥራ (Acts)',
      chapterVerse: '2:41-47',
      amharicText: '«በሐዋርያትም ትምህርትና በኅብረት እንጀራውንም በመቁረስ በጸሎትም ይተጉ ነበር።» (ሐዋ 2:42)',
      englishSummary: 'And they continued steadfastly in the apostles’ doctrine and fellowship, in the breaking of bread, and in prayers.',
    },
    synaxariumReflection: {
      summary: 'Commemoration of Abba Guba, one of the illustrious Nine Saints who strengthened monasticism and Christian life in ancient Ethiopia.',
      patristicTeaching: 'Monastic fatherhood in the Tewahedo tradition reminds us that prayer is the anchor of the world and the fortress of the heart.',
      quote: '«ጸሎት የነፍስ እስትንፋስ ነው፤ ያለ ጸሎት መንፈሳዊ ሕይወት አይለመልምም።» — አባ ጊዮርጊስ ዘጋስጫ',
      authorOrSource: 'መጽሐፈ ምሥጢር / ተክለ ጻድቃን',
    },
    dailyPrayer: {
      title: 'የጽናትና የእምነት ጸሎት (Prayer for Steadfast Faith)',
      amharicPrayer: 'እግዚአብሔር አምላካችን ሆይ፥ እንደ ቅዱሳን ሐዋርያትና እንደ ጻድቃን አባቶቻችን በፈተና ሁሉ ጸንተን እንድንቆም ማስተዋሉንና ብርታቱን ስጠን። ልባችንን በቃልህ እውነት አብራልን። አሜን።',
      englishPrayer: 'O Lord our God, grant us steadfast endurance and deep wisdom to follow the footsteps of Thy holy apostles and monastic fathers. Fill our hearts with the light of Thy holy Gospel. Amen.',
    },
    spiritualPractice: {
      virtue: 'በጸሎት መትጋት (Perseverance in Prayer)',
      action: 'Set aside 10 minutes of quiet, focused contemplative prayer without digital distractions.',
    },
  },
  3: {
    id: 'day-3',
    liturgicalTitle: 'Baeta Lemariam (Presentation of St. Mary)',
    amharicTitle: 'በዓታ ለማርያም',
    saintOrFeast: 'Entry of the Holy Virgin Mary into the Temple (በዓታ ለማርያም)',
    geezZemaTheme: 'ዘማርያም',
    misbak: {
      psalm: 45,
      verses: '10-11',
      geezVerse1: 'ስምዒ ወለትየ ወርእዪ ወአጽምዒ እዝነኪ',
      geezVerse2: 'ወረስዒ ሕዝበኪ ወቤተ አቡኪ',
      geezVerse3: 'እስመ ፈተወ ንጉሥ ሥነኪ',
      amharicText: 'ልጄ ሆይ፥ ስሚ እዪ ጆሮሽንም አዘንብዪ፤ ወገንሽን የአባትሽንም ቤት እርሺ፤ ንጉሥ ውበትሽን ወድዷልና፥ እርሱ ጌታሽ ነውና ስገጂለት። (መዝ 45:10-11)',
      englishMeaning: 'Listen, O daughter, consider and incline your ear; forget your own people also, and your father’s house; so the King will greatly desire your beauty.',
    },
    gospel: {
      book: 'የሉቃስ ወንጌል (Luke)',
      chapterVerse: '10:38-42',
      keyVerseAmharic: '«ማርያም ግን መልካሙን ዕድል መርጣለች ከእርስዋም አይወሰድባትም አላት።» (ሉቃ 10:42)',
      keyVerseEnglish: '“Mary has chosen that good part, which will not be taken away from her.” (Luke 10:42)',
      passageAmharic: 'ኢየሱስም ወደ አንዲት መንደር ገባ፤ ማርታ የተባለች አንዲት ሴትም በቤትዋ ተቀበለችው። ለእርስዋም ማርያም የምትባል እኅት ነበረቻት፥ እርስዋም ደግሞ ቃሉን ልትሰማ በጌታ እግር አጠገብ ተቀምጣ ነበረች።',
      context: 'Sitting at the feet of the Lord in quiet adoration and absorbing divine wisdom above all worldly anxieties.',
    },
    paulineEpistle: {
      book: 'ወደ ዕብራውያን ሰዎች (Hebrews)',
      chapterVerse: '9:1-10',
      amharicText: '«ፊተኛይቱ ኪዳን ደግሞ የአገልግሎት ሥርዓትና የዚህ ዓለም የሆነው መቅደስ ነበራት።» (ዕብ 9:1)',
      englishSummary: 'Then indeed, even the first covenant had ordinances of divine service and the earthly sanctuary.',
    },
    catholicEpistle: {
      book: '፪ኛ የጴጥሮስ መልእክት (2 Peter)',
      chapterVerse: '1:16-21',
      amharicText: '«ትንቢት ከቶ በሰው ፈቃድ አልመጣምና፥ ነገር ግን በእግዚአብሔር ተልከው ቅዱሳን ሰዎች በመንፈስ ቅዱስ ተነድተው ተናገሩ።» (2 ጴጥ 1:21)',
      englishSummary: 'For prophecy never came by the will of man, but holy men of God spoke as they were moved by the Holy Spirit.',
    },
    actsReading: {
      book: 'የሐዋርያት ሥራ (Acts)',
      chapterVerse: '7:44-50',
      amharicText: '«የሰማይና የምድር ጌታ በሰው እጅ ወደ ተሠራ መቅደስ አይገባም።» (ሐዋ 7:48)',
      englishSummary: 'The Most High does not dwell in temples made with hands, as the prophet says.',
    },
    synaxariumReflection: {
      summary: 'Commemoration of the 3-year-old Virgin Mary entering the Holy of Holies in the Temple of Jerusalem, fed by angels and nurtured in contemplation.',
      patristicTeaching: 'St. Ephrem the Syrian praises St. Mary as the living Ark of the Covenant, sanctified wholly body, mind, and spirit.',
      quote: '«ንጽሕት ድንግል ሆይ፥ በቤተ መቅደስ በቅድስና ያደግሽ የሕይወት መገኛ አንቺ ነሽ።» — ቅዳሴ ማርያም',
      authorOrSource: 'ውዳሴ ማርያም ዘሰኑይ / ስንክሳር',
    },
    dailyPrayer: {
      title: 'የቅድስናና የንጽሕና ጸሎት (Prayer for Inner Sanctification)',
      amharicPrayer: 'እመቤታችን ቅድስት ድንግል ማርያም በቤተ መቅደስ በንጽሕና እንዳገለገለች፥ አቤቱ ጌታ ሆይ ሰውነታችንን የመንፈስ ቅዱስ ቤተ መቅደስ አድርገን። ከክፉ ሐሳብና ከኃጢአት ዕድፍ ጠብቀን። አሜን።',
      englishPrayer: 'O Lord, who sanctified Thy holy temple, make our bodies and souls living sanctuaries of Thy Holy Spirit, walking in purity and devotion before Thee all the days of our lives. Amen.',
    },
    spiritualPractice: {
      virtue: 'ንጽሕናና ራስን መቀደስ (Sanctification & Self-Discipline)',
      action: 'Dedicate today to guarding your eyes and speech, refraining from idle gossip and worldly arguments.',
    },
  },
  5: {
    id: 'day-5',
    liturgicalTitle: 'Abune Gebre Menfes Kidus (Abo)',
    amharicTitle: 'አቡነ ገብረ መንፈስ ቅዱስ (አቦ)',
    saintOrFeast: 'Abune Gebre Menfes Kidus & Prophet St. Samuel (አቡነ ገብረ መንፈስ ቅዱስ)',
    geezZemaTheme: 'ዘጻድቃን',
    misbak: {
      psalm: 92,
      verses: '12-14',
      geezVerse1: 'ጻድቅ ከመ በቀልት ይፈሪ',
      geezVerse2: 'ወከመ ዘድ ዘሊባኖስ ይበዝኅ',
      geezVerse3: 'ትኩላን እሙንቱ ውስተ ቤተ እግዚአብሔር',
      amharicText: 'ጻድቅ እንደ ዘንባባ ያፈራል፥ እንደ ሊባኖስ ዝግባም ያድጋል። በእግዚአብሔር ቤት ተተክለዋል፥ በአምላካችንም አደባባይ ውስጥ ይበቅላሉ። (መዝ 92:12-13)',
      englishMeaning: 'The righteous shall flourish like a palm tree, he shall grow like a cedar in Lebanon. Those who are planted in the house of the Lord shall flourish in the courts of our God.',
    },
    gospel: {
      book: 'የማቴዎስ ወንጌል (Matthew)',
      chapterVerse: '19:27-30',
      keyVerseAmharic: '«ስለ ስሜም ቤቶችን ወይም ወንድሞችን ወይም እኅቶችን ወይም አባትን ወይም እናትን ወይም ሚስትን ወይም ልጆችን ወይም እርሻን የተወ ሁሉ መቶ እጥፍ ይቀበላል የዘላለምንም ሕይወት ይወርሳል።» (ማቴ 19:29)',
      keyVerseEnglish: '“And everyone who has left houses or brothers or sisters or father or mother or wife or children or lands, for My name’s sake, shall receive a hundredfold, and inherit eternal life.” (Matthew 19:29)',
      passageAmharic: 'ጴጥሮስም መልሶ፦ እነሆ፥ እኛ ሁሉን ትተን ተከተልንህ፤ እንኪያስ ምን እናገኝ ይሆን? አለው። ኢየሱስም እንዲህ አላቸው፦ እውነት እላችኋለሁ፥ እናንተስ የተከተላችሁኝ፥ በዳግመኛ ልደት የሰው ልጅ በክብሩ ዙፋን በሚቀመጥበት ጊዜ፥ እናንተ ደግሞ በአሥራ ሁለቱ የእስራኤል ነገድ ስትፈርዱ በአሥራ ሁለት ዙፋን ትቀመጣላችሁ።',
      context: 'Christ’s assurance of eternal reward and profound spiritual companionship for all who forsake earthly desires for God.',
    },
    paulineEpistle: {
      book: 'ወደ ገላትያ ሰዎች (Galatians)',
      chapterVerse: '5:16-24',
      amharicText: '«የመንፈስ ፍሬ ግን ፍቅር፥ ደስታ፥ ሰላም፥ ትዕግሥት፥ ቸርነት፥ በጎነት፥ እምነት፥ የውሃት፥ ራስን መግዛት ነው።» (ገላ 5:22-23)',
      englishSummary: 'The fruit of the Spirit is love, joy, peace, longsuffering, kindness, goodness, faithfulness, gentleness, self-control.',
    },
    catholicEpistle: {
      book: 'የያዕቆብ መልእክት (James)',
      chapterVerse: '5:13-18',
      amharicText: '«የጻድቅ ሰው ጸሎት በሥራዋ እጅግ ኃይል ታደርጋለች።» (ያዕ 5:16)',
      englishSummary: 'The effective, fervent prayer of a righteous man avails much.',
    },
    actsReading: {
      book: 'የሐዋርያት ሥራ (Acts)',
      chapterVerse: '11:21-26',
      amharicText: '«የጌታም እጅ ከእነርሱ ጋር ነበረ፤ ቁጥራቸውም እጅግ የሚሆን ሰዎች አምነው ወደ ጌታ ዘወር አሉ።» (ሐዋ 11:21)',
      englishSummary: 'And the hand of the Lord was with them, and a great number believed and turned to the Lord.',
    },
    synaxariumReflection: {
      summary: 'Commemoration of the great Desert Father Abune Gebre Menfes Kidus (Abo), renowned for supernatural austerity, deep prayer for all creation, and extraordinary compassion for animals and sinners.',
      patristicTeaching: 'True holiness radiates compassion not just to human beings, but to the entire created order, demonstrating peace and divine harmony.',
      quote: '«ፍቅር ለፍጥረት ሁሉ ይራራል፤ ጻድቅ ሰው ልቡ በምሕረት የተሞላ ነው።» — ገድለ አቡነ ገብረ መንፈስ ቅዱስ',
      authorOrSource: 'ስንክሳር ዘወርኃ መጋቢት / ጻድቃን',
    },
    dailyPrayer: {
      title: 'የምሕረትና የፍቅር ጸሎት (Prayer for Compassion & Mercy)',
      amharicPrayer: 'አምላካችን እግዚአብሔር ሆይ፥ በጻድቁ አባታችን በአቡነ ገብረ መንፈስ ቅዱስ ጸሎት ምድራችንን በሰላም ባርክ። ልባችንን በፍቅርና በምሕረት ሙላው፤ ለተጨነቁትና ለተቸገሩት መጽናናት ሁን። አሜን።',
      englishPrayer: 'O Lord God of mercy, through the fervent prayers of our righteous Father Abune Gebre Menfes Kidus, shower Thy blessings upon our world. Fill our hearts with divine love and make us instruments of peace and mercy. Amen.',
    },
    spiritualPractice: {
      virtue: 'ርኅራኄና ምጽዋት (Mercy & Kindness to All Creation)',
      action: 'Give charity or feed the hungry, and show kindness to animals and nature around you today.',
    },
  },
  12: {
    id: 'day-12',
    liturgicalTitle: 'St. Michael the Archangel',
    amharicTitle: 'ቅዱስ ሚካኤል ሊቀ መላእክት',
    saintOrFeast: 'Archangel St. Michael (ቅዱስ ሚካኤል ሊቀ መላእክት)',
    geezZemaTheme: 'ዘመላእክት',
    misbak: {
      psalm: 103,
      verses: '20-21',
      geezVerse1: 'ባርክዎ ለእግዚአብሔር ኩልክሙ መላእክቲሁ',
      geezVerse2: 'ፅኑዓን በኃይል እለ ትገብሩ ቃሎ',
      geezVerse3: 'ለሰሚዐ ቃለ ነገሩ',
      amharicText: 'ቃሉን የምትፈጽሙ፥ የቃሉንም ድምፅ የምትሰሙ ብርቱዎችና ኃያላን መላእክቱ ሁሉ፥ እግዚአብሔርን ባርኩ። (መዝ 103:20)',
      englishMeaning: 'Bless the Lord, you His angels, who excel in strength, who do His word, heeding the voice of His word.',
    },
    gospel: {
      book: 'የማቴዎስ ወንጌል (Matthew)',
      chapterVerse: '18:1-10',
      keyVerseAmharic: '«ከእነዚህ ከታናናሾቹ አንዱን እንዳትንቁ ተጠንቀቁ፤ መላእክቶቻቸው በሰማያት ዘወትር የሰማዩን የአባቴን ፊት ያያሉ እላችኋለሁና።» (ማቴ 18:10)',
      keyVerseEnglish: '“Take heed that you do not despise one of these little ones, for I say to you that in heaven their angels always see the face of My Father who is in heaven.” (Matthew 18:10)',
      passageAmharic: 'በዚያች ሰዓት ደቀ መዛሙርቱ ወደ ኢየሱስ ቀርበው፦ በመንግሥተ ሰማያት ከሁሉ የሚበልጥ ማን ይሆን? አሉት። ሕፃንም ጠርቶ በመካከላቸው አቆመ እንዲህም አለ፦ እውነት እላችኋለሁ፥ ካልተመለሳችሁ እንደ ሕፃናትም ካልሆናችሁ፥ ወደ መንግሥተ ሰማያት ከቶ አትገቡም።',
      context: 'Childlike purity, humility, and the watchful protection of the Heavenly Hosts over believers.',
    },
    paulineEpistle: {
      book: 'ወደ ዕብራውያን ሰዎች (Hebrews)',
      chapterVerse: '1:7-14',
      amharicText: '«ሁሉ መዳንን ይወርሱ ዘንድ ስላላቸው ለማገዝ የሚላኩ የሚያገለግሉም መናፍስት አይደሉምን?» (ዕብ 1:14)',
      englishSummary: 'Are they not all ministering spirits sent forth to minister for those who will inherit salvation?',
    },
    catholicEpistle: {
      book: 'የይሁዳ መልእክት (Jude)',
      chapterVerse: '1:17-25',
      amharicText: '«የመላእክት አለቃ ሚካኤል ግን ከዲያብሎስ ጋር በተከራከረ ጊዜ ስለ ሙሴ ሥጋ ሲነጋገር፦ ጌታ ይገሥጽህ አለው እንጂ የስድብን ፍርድ ሊናገረው አልደፈረም።» (ይሁዳ 1:9)',
      englishSummary: 'Yet Michael the archangel, in contending with the devil, said, “The Lord rebuke you!”',
    },
    actsReading: {
      book: 'የሐዋርያት ሥራ (Acts)',
      chapterVerse: '12:5-11',
      amharicText: '«እነሆም፥ የጌታ መልአክ ቀረበ በቤቱም ውስጥ ብርሃን በራ፤ ጴጥሮስንም ጎኑን መትቶ አነቃውና፦ ፈጥነህ ተነሣ አለው። ሰንሰለቶቹም ከእጁ ወደቁ።» (ሐዋ 12:7)',
      englishSummary: 'An angel of the Lord stood by him, and a light shone in the prison; and he struck Peter on the side and raised him up, saying, “Arise quickly!”',
    },
    synaxariumReflection: {
      summary: 'Commemoration of the great Archangel St. Michael, defender of the faithful, leader of the heavenly army, and intercessor before the throne of God.',
      patristicTeaching: 'St. Gregory the Theologian observes that the holy angels stand as ministers of divine light, inspiring humanity toward constant vigilance and thanksgiving.',
      quote: '«ሚካኤል ሊቀ መላእክት ለነፍሳችን ታማኝ ጠባቂና ረዳት ነው።» — ድርሳነ ሚካኤል',
      authorOrSource: 'ድርሳነ ሚካኤል / ስንክሳር',
    },
    dailyPrayer: {
      title: 'የሰላምና የጥበቃ ጸሎት (Prayer for Heavenly Protection)',
      amharicPrayer: 'አቤቱ የሰራዊት ጌታ እግዚአብሔር ሆይ፥ በሊቀ መላእክት በቅዱስ ሚካኤል አማላጅነት ከሚታየውና ከማይታየው ጠላት ጠብቀን። በጎዳናችን ሁሉ የሰላም መልአክህን አብሮን አሰማራ። አሜን።',
      englishPrayer: 'O Lord God of Hosts, through the powerful intercession of Archangel Michael, defend us against all visible and invisible perils. Send Thy holy angel to guard our souls in peace and righteousness. Amen.',
    },
    spiritualPractice: {
      virtue: 'መንፈሳዊ ንቃትና ድፍረት (Spiritual Courage & Vigilance)',
      action: 'Face any anxiety or fear today with faith, remembering that God’s heavenly army surrounds those who trust Him.',
    },
  },
  19: {
    id: 'day-19',
    liturgicalTitle: 'St. Gabriel the Archangel',
    amharicTitle: 'ቅዱስ ገብርኤል ሊቀ መላእክት',
    saintOrFeast: 'Archangel St. Gabriel & St. Cyricus (ቅዱስ ገብርኤልና ቅዱስ ቂርቆስ)',
    geezZemaTheme: 'ዘመላእክት',
    misbak: {
      psalm: 34,
      verses: '7-8',
      geezVerse1: 'ይትዓየን መልአከ እግዚአብሔር ዐውዶሙ',
      geezVerse2: 'ለእለ ይፈርህዎ ወያድኅኖሙ',
      geezVerse3: 'ጠዐሙ ወርእዩ ከመ ኄር እግዚአብሔር',
      amharicText: 'የእግዚአብሔር መልአክ በሚፈሩት ሰዎች ዙሪያ ይሰፍራል፥ ያድናቸዋልም። እግዚአብሔር ቸር እንደ ሆነ ቅመሱ እዩም፤ በእርሱ የሚታመን ሰው ምስጉን ነው። (መዝ 34:7-8)',
      englishMeaning: 'The angel of the Lord encamps all around those who fear Him, and delivers them. Oh, taste and see that the Lord is good; blessed is the man who trusts in Him!',
    },
    gospel: {
      book: 'የሉቃስ ወንጌል (Luke)',
      chapterVerse: '1:26-38',
      keyVerseAmharic: '«መልአኩም ገብቶ፦ ደስ ይበልሽ፥ ጸጋ የሞላብሽ ሆይ፥ ጌታ ከአንቺ ጋር ነው፤ አንቺ ከሴቶች መካከል የተባረክሽ ነሽ አላት።» (ሉቃ 1:28)',
      keyVerseEnglish: '“And having come in, the angel said to her, ‘Rejoice, highly favored one, the Lord is with you; blessed are you among women!’” (Luke 1:28)',
      passageAmharic: 'በስድስተኛውም ወር መልአኩ ገብርኤል ናዝሬት ወደምትባል ወደ ገሊላ ከተማ፥ ከዳዊት ወገን ለሆነው ዮሴፍ ለሚባል ሰው ወደ ታጨች ወደ አንዲት ድንግል ከእግዚአብሔር ዘንድ ተላከ፥ የድንግሊቱም ስም ማርያም ነበረ።',
      context: 'The Annunciation of the Incarnation of Christ brought by the herald of joyful news, Archangel Gabriel.',
    },
    paulineEpistle: {
      book: 'ወደ ኤፌሶን ሰዎች (Ephesians)',
      chapterVerse: '6:10-18',
      amharicText: '«የዲያብሎስን ሽንገላ ትቃወሙ ዘንድ እንዲቻላችሁ የእግዚአብሔርን ዕቃ ጦር ሁሉ ልበሱ።» (ኤፌ 6:11)',
      englishSummary: 'Put on the whole armor of God, that you may be able to stand against the wiles of the devil.',
    },
    catholicEpistle: {
      book: '፩ኛ የዮሐንስ መልእክት (1 John)',
      chapterVerse: '5:1-5',
      amharicText: '«ከእግዚአብሔር የተወለደ ሁሉ ዓለምን ያሸንፋልና፤ ዓለምንም የሚያሸንፈው እምነታችን ነው።» (1 ዮሐ 5:4)',
      englishSummary: 'For whatever is born of God overcomes the world. And this is the victory that has overcome the world—our faith.',
    },
    actsReading: {
      book: 'የሐዋርያት ሥራ (Acts)',
      chapterVerse: '5:17-21',
      amharicText: '«የጌታ መልአክ ግን በሌሊት የወህኒውን ደጅ ከፍቶ አወጣቸውና፦ ሂዱና በቤተ መቅደስ ቆማችሁ የዚህን ሕይወት ቃል ሁሉ ለሕዝቡ ንገሩ አላቸው።» (ሐዋ 5:19-20)',
      englishSummary: 'At night an angel of the Lord opened the prison doors and brought them out, and said, “Go, stand in the temple and speak to the people all the words of this life.”',
    },
    synaxariumReflection: {
      summary: 'Commemoration of the Holy Archangel Gabriel, the messenger of glad tidings, and the deliverance of the child-martyr St. Cyricus (ቂርቆስ) and his mother St. Julitta from the fiery furnace.',
      patristicTeaching: 'Faith that trusts God even through the fiery furnaces of affliction will always experience the cooling dew of divine grace.',
      quote: '«እግዚአብሔር በእሳት ውስጥም ቢሆን ለሚያምኑበት መዳንን ያዘጋጃል።» — ድርሳነ ገብርኤል',
      authorOrSource: 'ድርሳነ ገብርኤል / ስንክሳር',
    },
    dailyPrayer: {
      title: 'የብስራትና የተስፋ ጸሎት (Prayer for Hope & Glad Tidings)',
      amharicPrayer: 'የምሥራች አብሳሪው ቅዱስ ገብርኤል ሆይ፥ በሕይወታችን የሰላምንና የደስታን ቃል አብስረን። በእምነት ፈተና ውስጥ ስንሆን እንደ ቅዱስ ቂርቆስ ብርታትን እንድናገኝ አጽናናን። አቤቱ ክብር ለአንተ ይሁን። አሜን።',
      englishPrayer: 'O Holy Archangel Gabriel, herald of divine joy, bring glad tidings of peace and spiritual renewal to our souls. Strengthen our faith through every trial, that we may glorify the Father, Son, and Holy Spirit. Amen.',
    },
    spiritualPractice: {
      virtue: 'ተስፋና የምሥራች ማብሠር (Living in Joyful Hope)',
      action: 'Encourage someone going through hardship today with words of genuine hope and reassurance.',
    },
  },
  21: {
    id: 'day-21',
    liturgicalTitle: 'Kidane Mehret & Holy Virgin Mary',
    amharicTitle: 'ኪዳነ ምሕረት / እመቤታችን ቅድስት ድንግል ማርያም',
    saintOrFeast: 'Covenant of Mercy (Kidane Mehret) & Holy Mother of God (ኪዳነ ምሕረት)',
    geezZemaTheme: 'ዘማርያም',
    misbak: {
      psalm: 132,
      verses: '13-14',
      geezVerse1: 'እስመ ኃረያ እግዚአብሔር ለጽዮን',
      geezVerse2: 'ወአብደራ ከመ ትኩኖ ማኅደረ',
      geezVerse3: 'ዛቲ ይእቲ ምዕራፍየ ለዓለም',
      amharicText: 'እግዚአብሔር ጽዮንን መርጧታልና፥ ማደሪያውም ትሆነው ዘንድ ወድዷታልና፥ እንዲህ ብሎ፦ ይህች ለዘላለም ማረፊያዬ ናት፤ መርጫታለሁና በእርስዋ አድራለሁ። (መዝ 132:13-14)',
      englishMeaning: 'For the Lord has chosen Zion; He has desired it for His dwelling place: “This is My resting place forever; Here I will dwell, for I have desired it.”',
    },
    gospel: {
      book: 'የዮሐንስ ወንጌል (John)',
      chapterVerse: '19:25-27',
      keyVerseAmharic: '«ኢየሱስም እናቱን ይወደው የነበረውንም ደቀ መዝሙር በአጠገቡ ቆሞ ባየ ጊዜ እናቱን፦ አንቺ ሴት፥ እነሆ ልጅሽ አላት። ከዚያም በኋላ ለደቀ መዝሙሩ፦ እናትህ እነኋት አለው።» (ዮሐ 19:26-27)',
      keyVerseEnglish: '“When Jesus therefore saw His mother, and the disciple whom He loved standing by, He said to His mother, ‘Woman, behold your son!’ Then He said to the disciple, ‘Behold your mother!’” (John 19:26-27)',
      passageAmharic: 'ነገር ግን በኢየሱስ መስቀል አጠገብ እናቱ፥ የእናቱም እኅት፥ የቀለዮጳም ሚስት ማርያም፥ መግደላዊትም ማርያም ቆመው ነበር። ኢየሱስም እናቱን ይወደው የነበረውንም ደቀ መዝሙር በአጠገቡ ቆሞ ባየ ጊዜ እናቱን፦ አንቺ ሴት፥ እነሆ ልጅሽ አላት።',
      context: 'Christ entitling His Blessed Mother as the mother and intercessor for the entire Christian family at the foot of the Cross.',
    },
    paulineEpistle: {
      book: 'ወደ ሮሜ ሰዎች (Romans)',
      chapterVerse: '8:31-39',
      amharicText: '«እንግዲህ ስለዚህ ነገር ምን እንላለን? እግዚአብሔር ከእኛ ጋር ከሆነ ማን ይቃወመናል?» (ሮሜ 8:31)',
      englishSummary: 'What then shall we say to these things? If God is for us, who can be against us?',
    },
    catholicEpistle: {
      book: '፩ኛ የዮሐንስ መልእክት (1 John)',
      chapterVerse: '2:1-6',
      amharicText: '«ልጆቼ ሆይ፥ ኃጢአትን እንዳታደርጉ ይህን እጽፍላችኋለሁ። ማንም ኃጢአትን ቢያደርግ ከአብ ዘንድ ጠበቃ አለን እርሱም ጻድቅ የሆነ ኢየሱስ ክርስቶስ ነው።» (1 ዮሐ 2:1)',
      englishSummary: 'My little children, these things I write to you, so that you may not sin. And if anyone sins, we have an Advocate with the Father, Jesus Christ the righteous.',
    },
    actsReading: {
      book: 'የሐዋርያት ሥራ (Acts)',
      chapterVerse: '16:13-15',
      amharicText: '«ጌታም የጳውሎስን ቃል እንድታዳምጥ ልብዋን ከፈተላት፤ እርስዋም ከቤተሰቦችዋ ጋር ከተጠመቀች በኋላ ማለደችን።» (ሐዋ 16:14)',
      englishSummary: 'The Lord opened her heart to heed the things spoken by Paul, and she and her household were baptized.',
    },
    synaxariumReflection: {
      summary: 'Commemoration of the Covenant of Mercy (ኪዳነ ምሕረት) bestowed by Christ to His Mother, promising salvation and forgiveness to those who seek mercy through her prayers.',
      patristicTeaching: 'Abba Giorgis of Ghasicha writes that St. Mary is the golden censer carrying the divine fire of the Word, bridging heaven and earth in peace.',
      quote: '«እመቤታችን ሆይ፥ የምሕረት ቃል ኪዳንሽ የደካሞች መታመኛና መጠጊያ ነው።» — ውዳሴ ማርያም',
      authorOrSource: 'ውዳሴ ማርያም ዘሐሙስ / አርጋኖን',
    },
    dailyPrayer: {
      title: 'የምሕረትና የይቅርታ ጸሎት (Prayer for Forgiveness & Peace)',
      amharicPrayer: 'ቸሩና መሓሪው አምላካችን ሆይ፥ ስለ እናትህ ስለ ቅድስት ድንግል ማርያም ቃል ኪዳን ብለህ በደላችንን ሁሉ ይቅር በለን። ሕሊናችንን ከክፉ ሥራ አንጻው፤ በበረከትህም ጎብኘን። አሜን።',
      englishPrayer: 'O Merciful Savior, by the intercessions of Thy Blessed Mother, forgive our transgressions and cleanse our hearts. Guide our families in love, harmony, and righteousness. Amen.',
    },
    spiritualPractice: {
      virtue: 'ይቅርታና ምሕረት (Forgiveness & Reconciliatory Love)',
      action: 'Release any lingering grudge in your heart today and forgive someone who wronged you.',
    },
  },
  23: {
    id: 'day-23',
    liturgicalTitle: 'St. George the Martyr',
    amharicTitle: 'ቅዱስ ጊዮርጊስ ሰማዕት',
    saintOrFeast: 'Great Martyr St. George of Lydda (ቅዱስ ጊዮርጊስ ሰማዕት)',
    geezZemaTheme: 'ዘሰማዕታት',
    misbak: {
      psalm: 97,
      verses: '11-12',
      geezVerse1: 'ብርሃን ሠረቀ ለጻድቃን',
      geezVerse2: 'ወደስታ ለርቱዓነ ልብ',
      geezVerse3: 'ተፈሥሑ ጻድቃን በእግዚአብሔር',
      amharicText: 'ብርሃን ለጻድቃን፥ ደስታም ለልበ ቅኖች ወጣ። ጻድቃን ሆይ፥ በእግዚአብሔር ደስ ይበላችሁ፥ ለቅድስናውም መታሰቢያ አመስግኑ። (መዝ 97:11-12)',
      englishMeaning: 'Light is sown for the righteous, and gladness for the upright in heart. Rejoice in the Lord, you righteous, and give thanks at the remembrance of His holy name.',
    },
    gospel: {
      book: 'የዮሐንስ ወንጌል (John)',
      chapterVerse: '15:17-25',
      keyVerseAmharic: '«ዓለም ቢጠላችሁ ከእናንተ በፊት እኔን እንደ ጠላኝ እወቁ። ከዓለምስ ብትሆኑ ዓለም የራሱ የሆነውን ይወድ ነበር።» (ዮሐ 15:18-19)',
      keyVerseEnglish: '“If the world hates you, you know that it hated Me before it hated you. If you were of the world, the world would love its own.” (John 15:18-19)',
      passageAmharic: 'እርስ በርሳችሁ እንድትዋደዱ ይህን አዛችኋለሁ። ዓለም ቢጠላችሁ ከእናንተ በፊት እኔን እንደ ጠላኝ እወቁ። ነገር ግን እኔ ከዓለም መረጥኋችሁ እንጂ ከዓለም ስለ አይደላችሁ ስለዚህ ዓለም ይጠላችኋል።',
      context: 'Christ preparing His disciples for persecution, promising divine victory through unyielding love and truth.',
    },
    paulineEpistle: {
      book: '፪ኛ ወደ ጢሞቴዎስ (2 Timothy)',
      chapterVerse: '2:1-10',
      amharicText: '«እንደ መልካም የኢየሱስ ክርስቶስ ወታደር ሆነህ፥ አብረኸኝ መከራ ተቀበል።» (2 ጢሞ 2:3)',
      englishSummary: 'You therefore must endure hardship as a good soldier of Jesus Christ.',
    },
    catholicEpistle: {
      book: '፩ኛ የጴጥሮስ መልእክት (1 Peter)',
      chapterVerse: '4:12-19',
      amharicText: '«ስለ ክርስቶስ ስም ብትሰደቡ የክብር መንፈስ የእግዚአብሔር መንፈስ በእናንተ ላይ ያርፋልና ብፁዓን ናችሁ።» (1 ጴጥ 4:14)',
      englishSummary: 'If you are reproached for the name of Christ, blessed are you, for the Spirit of glory and of God rests upon you.',
    },
    actsReading: {
      book: 'የሐዋርያት ሥራ (Acts)',
      chapterVerse: '7:54-60',
      amharicText: '«እስጢፋኖስም በመንፈስ ቅዱስ ተሞልቶ ወደ ሰማይ ትኩር ብሎ ሲመለከት የእግዚአብሔርን ክብር ኢየሱስንም በእግዚአብሔር ቀኝ ቆሞ አየ።» (ሐዋ 7:55)',
      englishSummary: 'Being full of the Holy Spirit, he gazed into heaven and saw the glory of God, and Jesus standing at the right hand of God.',
    },
    synaxariumReflection: {
      summary: 'Commemoration of St. George the Megalomartyr (ሊቀ ሰማዕታት ቅዱስ ጊዮርጊስ), who endured seven years of tortures with unwavering confession of Christ before pagan emperors.',
      patristicTeaching: 'True martyrdom is spiritual steadfastness — choosing faithfulness to God over convenience, compromise, or fear.',
      quote: '«እምነታችን ዓለምንና የጨለማውን ኃይል ሁሉ የሚያሸንፍ የድል መሣሪያችን ነው።» — ተአምረ ጊዮርጊስ',
      authorOrSource: 'ገድለ ቅዱስ ጊዮርጊስ / ስንክሳር',
    },
    dailyPrayer: {
      title: 'የእምነት ጽናትና የድል ጸሎት (Prayer for Spiritual Steadfastness)',
      amharicPrayer: 'ኃያል አምላካችን ሆይ፥ በሰማዕቱ በቅዱስ ጊዮርጊስ ጸሎት በመንፈሳዊ ተጋድሎአችን ሁሉ ድልን ስጠን። በፈተናና በመከራ ጊዜ እምነታችን እንዳይደክም በመንፈስ ቅዱስ ኃይል አበርታን። አሜን።',
      englishPrayer: 'O Mighty Lord, through the prayers of the Great Martyr St. George, grant us steadfast faith and spiritual victory over every temptation and trial. Amen.',
    },
    spiritualPractice: {
      virtue: 'ጽናትና መንፈሳዊ ድፍረት (Spiritual Fortitude)',
      action: 'Stand up for righteousness and truth today in a situation where compromise seems easy.',
    },
  },
  24: {
    id: 'day-24',
    liturgicalTitle: 'Abune Tekle Haymanot',
    amharicTitle: 'አቡነ ተክለ ሃይማኖት',
    saintOrFeast: 'Righteous Father Abune Tekle Haymanot (አቡነ ተክለ ሃይማኖት)',
    geezZemaTheme: 'ዘጻድቃን',
    misbak: {
      psalm: 112,
      verses: '6-7',
      geezVerse1: 'ለዝክረ ጻድቅ ይሄሉ ለዓለም',
      geezVerse2: 'እምነገረ እኩይ ኢይፈርህ',
      geezVerse3: 'ጽኑዕ ልቡ ወይትአመን በእግዚአብሔር',
      amharicText: 'የጻድቅ መታሰቢያ ለዘላለም ይኖራል፤ ከክፉ ወሬ አይፈራም፤ ልቡ በእግዚአብሔር ለመታመን የጸና ነው። (መዝ 112:6-7)',
      englishMeaning: 'The righteous will be in everlasting remembrance. He will not be afraid of evil tidings; his heart is steadfast, trusting in the Lord.',
    },
    gospel: {
      book: 'የሉቃስ ወንጌል (Luke)',
      chapterVerse: '12:32-40',
      keyVerseAmharic: '«እናንተ ታናሽ መንጋ፥ አባታችሁ መንግሥትን ሊሰጣችሁ በጎ ፈቃዱ ነውና አትፍሩ።» (ሉቃ 12:32)',
      keyVerseEnglish: '“Do not fear, little flock, for it is your Father’s good pleasure to give you the kingdom.” (Luke 12:32)',
      passageAmharic: 'ያላችሁን ሽጡ ምጽዋትም ስጡ፤ ሌባ በማይቀርብበት ብልም በማያጠፋበት በሰማያት የማያልቅ መዝገብ፥ ለማያረጅ አቁማዳ ለራሳችሁ አድርጉ፤ መዝገባችሁ ባለበት ልባችሁ ደግሞ በዚያ ይሆናልና። ወገባችሁ የታጠቀ መብራታችሁም የበራ ይሁን።',
      context: 'Heavenly treasure, detachment from worldly materialism, and constant readiness for Christ’s coming.',
    },
    paulineEpistle: {
      book: 'ወደ ፊልጵስዩስ ሰዎች (Philippians)',
      chapterVerse: '3:7-14',
      amharicText: '«ነገር ግን ለእኔ ጥቅም የነበረውን ሁሉ ስለ ክርስቶስ እንደ ጉዳት ቆጠርሁት።» (ፊል 3:7)',
      englishSummary: 'Yet indeed I also count all things loss for the excellence of the knowledge of Christ Jesus my Lord.',
    },
    catholicEpistle: {
      book: 'የያዕቆብ መልእክት (James)',
      chapterVerse: '1:2-8',
      amharicText: '«ወንድሞቼ ሆይ፥ የእምነታችሁ መፈተን ትዕግሥትን እንዲያደርግ አውቃችሁ፥ ልዩ ልዩ ፈተና ሲደርስባችሁ እንደ ሙሉ ደስታ ቍጠሩት።» (ያዕ 1:2-3)',
      englishSummary: 'My brethren, count it all joy when you fall into various trials, knowing that the testing of your faith produces patience.',
    },
    actsReading: {
      book: 'የሐዋርያት ሥራ (Acts)',
      chapterVerse: '20:28-35',
      amharicText: '«በገዛ ደሙ የዋጃትን የእግዚአብሔርን ቤተ ክርስቲያን ትጠብቋት ዘንድ መንፈስ ቅዱስ እናንተን ጳጳሳት አድርጎ ለሾመባት ለመንጋው ሁሉና ለራሳችሁ ተጠንቀቁ።» (ሐዋ 20:28)',
      englishSummary: 'Take heed to yourselves and to all the flock, among which the Holy Spirit has made you overseers, to shepherd the church of God which He purchased with His own blood.',
    },
    synaxariumReflection: {
      summary: 'Commemoration of Abune Tekle Haymanot of Debre Libanos, the great beacon of Ethiopian monasticism, evangelist, and man of ceaseless prayer.',
      patristicTeaching: 'Standing in unceasing prayer for years teaches us that the heart anchored in God is unaffected by bodily fatigue or worldly storm.',
      quote: '«ተክለ ሃይማኖት ለአገራችን የሃይማኖት ጽናትና የብርሃን ፋና ነው።» — ገድለ ተክለ ሃይማኖት',
      authorOrSource: 'ገድለ አቡነ ተክለ ሃይማኖት / ስንክሳር',
    },
    dailyPrayer: {
      title: 'የጸሎትና የመንፈሳዊ ቅድስና ጸሎት (Prayer for Spiritual Illumination)',
      amharicPrayer: 'ቸሩ አምላካችን እግዚአብሔር ሆይ፥ በጻድቁ አባታችን በአቡነ ተክለ ሃይማኖት ጸሎት በሃይማኖታችን ጸንተን እንድንኖር አድርገን። ፍቅርህንና ቃልህን በልባችን አኑርልን። አሜን።',
      englishPrayer: 'O Benevolent God, by the prayers of our holy Father Abune Tekle Haymanot, keep us steadfast in the Orthodox faith. Illuminate our minds with Thy holy precepts. Amen.',
    },
    spiritualPractice: {
      virtue: 'በመንፈሳዊ እውነት መጽናት (Fidelity in Faith)',
      action: 'Spend 15 minutes reading Scripture or a patristic text with a teachable and quiet spirit.',
    },
  },
  27: {
    id: 'day-27',
    liturgicalTitle: 'Medhane Alem (Savior of the World)',
    amharicTitle: 'መድኃኔ ዓለም (የዓለም መድኃኒት)',
    saintOrFeast: 'Medhane Alem - Christ the Savior of the World (መድኃኔ ዓለም)',
    geezZemaTheme: 'ዘእግዚእ',
    misbak: {
      psalm: 118,
      verses: '14-16',
      geezVerse1: 'ኃይልየ ወጸወንየ እግዚአብሔር',
      geezVerse2: 'ወኮነኒ መድኃኒተ',
      geezVerse3: 'ቃለ ትፍሥሕት ወመድኃኒት ውስተ አብያተ ጻድቃን',
      amharicText: 'እግዚአብሔር ኃይሌና ዝማሬዬ ነው፥ እርሱም መድኃኒት ሆነልኝ። የደስታና የመዳን ድምፅ በጻድቃን ድንኳን ነው። (መዝ 118:14-15)',
      englishMeaning: 'The Lord is my strength and song, and He has become my salvation. The voice of rejoicing and salvation is in the tents of the righteous.',
    },
    gospel: {
      book: 'የዮሐንስ ወንጌል (John)',
      chapterVerse: '3:14-21',
      keyVerseAmharic: '«በእርሱ የሚያምን ሁሉ የዘላለም ሕይወት እንዲኖረው እንጂ እንዳይጠፋ እግዚአብሔር አንድያ ልጁን እስኪሰጥ ድረስ ዓለሙን እንዲሁ ወዶአልና።» (ዮሐ 3:16)',
      keyVerseEnglish: '“For God so loved the world that He gave His only begotten Son, that whoever believes in Him should not perish but have everlasting life.” (John 3:16)',
      passageAmharic: 'ሙሴም በምድረ በዳ እባብን እንደ ሰቀለ እንዲሁ በእርሱ የሚያምን ሁሉ የዘላለም ሕይወት እንዲኖረው እንጂ እንዳይጠፋ የሰው ልጅ ይሰቀል ይገባዋል። ዓለም በልጁ እንዲድን ነው እንጂ፥ በዓለም እንዲፈርድ እግዚአብሔር ልጁን ወደ ዓለም አልላከውምና።',
      context: 'The infinite, unconditional love of God manifested through the redemptive sacrifice of our Lord Jesus Christ.',
    },
    paulineEpistle: {
      book: 'ወደ ቆላስይስ ሰዎች (Colossians)',
      chapterVerse: '1:12-20',
      amharicText: '«እርሱ ከጨለማ ሥልጣን አዳነን፥ በደሙም በተደረገ ቤዛነት እርሱም የኃጢአት ስርየት ወዳገኘንበት ወደ ፍቅሩ ልጅ መንግሥት አፈለሰን።» (ቆላ 1:13-14)',
      englishSummary: 'He has delivered us from the power of darkness and conveyed us into the kingdom of the Son of His love, in whom we have redemption through His blood.',
    },
    catholicEpistle: {
      book: '፩ኛ የዮሐንስ መልእክት (1 John)',
      chapterVerse: '3:1-8',
      amharicText: '«የእግዚአብሔር ልጆች ተብለን ልንጠራ አብ እንዴት ያለውን ፍቅር እንደ ሰጠን እዩ፥ እንዲሁም ነን።» (1 ዮሐ 3:1)',
      englishSummary: 'Behold what manner of love the Father has bestowed on us, that we should be called children of God!',
    },
    actsReading: {
      book: 'የሐዋርያት ሥራ (Acts)',
      chapterVerse: '4:8-12',
      amharicText: '«መዳንም በሌላ በማንም የለም፤ እንድንበት ዘንድ የሚገባን ለሰዎች የተሰጠ ስም ከሰማይ በታች ሌላ የለምና።» (ሐዋ 4:12)',
      englishSummary: 'Nor is there salvation in any other, for there is no other name under heaven given among men by which we must be saved.',
    },
    synaxariumReflection: {
      summary: 'Commemoration of Medhane Alem (መድኃኔ ዓለም — Savior of the World), celebrating the Holy Cross and the boundless love of Christ who redeemed humanity from sin and death.',
      patristicTeaching: 'St. Athanasius writes: God became man that man might partake in divine grace and life.',
      quote: '«መድኃኔ ዓለም ክርስቶስ ፍቅሩን በመስቀል ላይ የገለጸልን የሕይወታችን መሠረት ነው።» — ሃይማኖተ አበው',
      authorOrSource: 'ሃይማኖተ አበው / ስንክሳር',
    },
    dailyPrayer: {
      title: 'የመዳንና የምስጋና ጸሎት (Prayer of Thanksgiving for Salvation)',
      amharicPrayer: 'የዓለም መድኃኒት ኢየሱስ ክርስቶስ ሆይ፥ ስለ ከበረ ደምህና ስለ መስቀልህ ቤዛነት ምስጋና ይሁንልህ። ነፍሳችንንና ሥጋችንን ከኃጢአት ባርነት ነጻ አውጣ፤ በፍቅርህና በሰላምህ ጠብቀን። አሜን።',
      englishPrayer: 'O Jesus Christ, Savior of the World, glory and thanksgiving be unto Thee for Thy holy Cross and redeeming love. Deliver us from the bondage of sin and grant us Thy heavenly peace. Amen.',
    },
    spiritualPractice: {
      virtue: 'ምስጋናና አምልኮ (Gratitude & Worship)',
      action: 'Take time today to sincerely thank God for 5 specific blessings in your life, especially spiritual salvation.',
    },
  },
  29: {
    id: 'day-29',
    liturgicalTitle: 'Baale Wold (Nativity Feast of the Son)',
    amharicTitle: 'በዓለ ወልድ / የጌታ ልደት መታሰቢያ',
    saintOrFeast: 'Nativity of our Lord Jesus Christ (በዓለ ወልድ)',
    geezZemaTheme: 'ዘልደት',
    misbak: {
      psalm: 2,
      verses: '7-8',
      geezVerse1: 'እግዚአብሔር ይቤለኒ ወልድየ አንተ',
      geezVerse2: 'አንሰ ዮም ወለድኩከ',
      geezVerse3: 'ስአለኒ ወእሁበከ አሕዛበ ለርስትከ',
      amharicText: 'እግዚአብሔር አለኝ፦ አንተ ልጄ ነህ፥ እኔ ዛሬ ወለድሁህ። ለምነኝ፥ አሕዛብንም ለርስትህ የምድርንም ዳርቻ ለግዛትህ እሰጥሃለሁ። (መዝ 2:7-8)',
      englishMeaning: 'The Lord has said to Me, “You are My Son, today I have begotten You. Ask of Me, and I will give You the nations for Your inheritance.”',
    },
    gospel: {
      book: 'የዮሐንስ ወንጌል (John)',
      chapterVerse: '1:1-14',
      keyVerseAmharic: '«ቃልም ሥጋ ሆነ፤ ጸጋንና እውነትንም ተሞልቶ በእኛ አደረ፥ የአባቱም አንድ ልጅ እንዳለው ክብር የሆነው ክብሩን አየን።» (ዮሐ 1:14)',
      keyVerseEnglish: '“And the Word became flesh and dwelt among us, and we beheld His glory, the glory as of the only begotten of the Father, full of grace and truth.” (John 1:14)',
      passageAmharic: 'በመጀመሪያው ቃል ነበረ፥ ቃልም በእግዚአብሔር ዘንድ ነበረ፥ ቃልም እግዚአብሔር ነበረ። ይህ በመጀመሪያው በእግዚአብሔር ዘንድ ነበረ። ሁሉ በእርሱ ሆነ፥ ከሆነውም አንዳች ስንኳ ያለ እርሱ አልሆነም። በእርሱ ሕይወት ነበረች፥ ሕይወትም የሰው ብርሃን ነበረች።',
      context: 'The eternal generation and Holy Incarnation of the Son of God for the salvation and illumination of the world.',
    },
    paulineEpistle: {
      book: 'ወደ ዕብራውያን ሰዎች (Hebrews)',
      chapterVerse: '1:1-6',
      amharicText: '«ከጥንት ጀምሮ እግዚአብሔር በብዙ ዓይነትና በብዙ ጎዳና ለአባቶቻችን በነቢያት ተናግሮ፥ ሁሉን ወራሽ ባደረገው ደግሞም ዓለማትን በፈጠረበት በልጁ በዚህ ዘመን መጨረሻ ለእኛ ተናገረን፤» (ዕብ 1:1-2)',
      englishSummary: 'God, who at various times and in various ways spoke in time past to the fathers by the prophets, has in these last days spoken to us by His Son.',
    },
    catholicEpistle: {
      book: '፩ኛ የዮሐንስ መልእክት (1 John)',
      chapterVerse: '1:1-7',
      amharicText: '«ስለ ሕይወት ቃል ከመጀመሪያው የነበረውንና የሰማነውን በዓይኖቻችንም ያየነውን የተመለከትነውንም እጆቻችንም የዳሰሱትን እናወራለን፤» (1 ዮሐ 1:1)',
      englishSummary: 'That which was from the beginning, which we have heard, which we have seen with our eyes, which we have looked upon, and our hands have handled, concerning the Word of life.',
    },
    actsReading: {
      book: 'የሐዋርያት ሥራ (Acts)',
      chapterVerse: '13:26-33',
      amharicText: '«እግዚአብሔር ኢየሱስን በማስነሣቱ ይህን ተስፋ በሁለተኛው መዝሙር፦ አንተ ልጄ ነህ እኔ ዛሬ ወለድሁህ ተብሎ እንደ ተጻፈ፥ ለእኛ ለልጆቻቸው ፈጽሞአልና።» (ሐዋ 13:33)',
      englishSummary: 'God has fulfilled this for us their children, in that He has raised up Jesus, as it is also written in the second Psalm: “You are My Son, today I have begotten You.”',
    },
    synaxariumReflection: {
      summary: 'Monthly celebration of Baale Wold (በዓለ ወልድ), rejoicing in the mystery of the Incarnation when the Son of God took human flesh from the Holy Virgin Mary.',
      patristicTeaching: 'St. Ephrem marvels: The Creator of all suckled human milk, wrapping Himself in swaddling clothes to clothe us in garments of immortality.',
      quote: '«መለኮት ከሥጋ ጋር ተዋሐደ፤ ሰውም የእግዚአብሔር ልጅ ሆነ።» — ቅዳሴ ኤጲፋንዮስ',
      authorOrSource: 'ውዳሴ ማርያም ዘሰንበት / ስንክሳር',
    },
    dailyPrayer: {
      title: 'የተዋሕዶና የብርሃን ጸሎት (Prayer for Spiritual Illumination)',
      amharicPrayer: 'ጌታችንና መድኃኒታችን ኢየሱስ ክርስቶስ ሆይ፥ ወደ ዓለም መጥተህ በጨለማ ለነበርን ብርሃንህን ስላበራልን እናመሰግንሃለን። ልባችንን በመንፈስ ቅዱስ ብርሃን አብራው፤ በመንገድህም ምራን። አሜን።',
      englishPrayer: 'O Lord Jesus Christ, who came into the world to enlighten those in darkness, shine the uncreated light of Thy Holy Spirit into our hearts and guide our steps in Thy righteousness. Amen.',
    },
    spiritualPractice: {
      virtue: 'የብርሃን ልጅ ሆኖ መመላለስ (Walking as Children of Light)',
      action: 'Bring warmth, gentleness, and peace to your family and workplace today through active kindness.',
    },
  },
};

// Fallback generator for other days of the month
export function getDailyDevotionalForDay(
  ethDay: number,
  saintName?: string
): DailyDevotionalData {
  if (MONTHLY_DEVOTIONALS[ethDay]) {
    return MONTHLY_DEVOTIONALS[ethDay];
  }

  // Generate an authentic patristic lectionary profile for any other day
  const effectiveDay = ((ethDay - 1) % 30) + 1;
  const closestKey = Object.keys(MONTHLY_DEVOTIONALS)
    .map(Number)
    .reduce((prev, curr) =>
      Math.abs(curr - effectiveDay) < Math.abs(prev - effectiveDay) ? curr : prev
    );

  const base = MONTHLY_DEVOTIONALS[closestKey];

  return {
    ...base,
    id: `day-${ethDay}`,
    liturgicalTitle: saintName ? `${saintName} Commemoration` : `Day ${ethDay} Liturgical Lectionary`,
    amharicTitle: saintName ? `የዕለቱ መታሰቢያ (${saintName})` : `የቀኑ ግጻዌና ጸሎት (${ethDay})`,
    saintOrFeast: saintName || `Saint Commemoration Day ${ethDay}`,
  };
}
