import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Languages, BookOpen, Sparkles, Clock, Calendar } from 'lucide-react';
import LiturgicalGuideModal from './LiturgicalGuideModal';

interface FastingItem {
  id: string;
  nameEn: string;
  nameAm: string;
  durationEn: string;
  durationAm: string;
  periodEn: string;
  periodAm: string;
  highlightsEn: { title: string; points: string[] }[];
  highlightsAm: { title: string; points: string[] }[];
}

const FASTING_DATA: FastingItem[] = [
  {
    id: "tsige",
    nameEn: "Tsige Tsom (Fast of the Holy Family)",
    nameAm: "የጽጌ ጾም (ማኅሌተ ጽጌ)",
    durationEn: "40 Days",
    durationAm: "40 ቀናት",
    periodEn: "September 26 – November 5 (Meskerem 26 – Hedar 5)",
    periodAm: "ከመስከረም 26 እስከ ኅዳር 5 ቀን",
    highlightsEn: [
      {
        title: "Significance and Meaning",
        points: [
          "Commemorating the Flight: It is observed to remember the hardships, hunger, and exile of the Blessed Virgin Mary and her infant Son Jesus Christ during their flight to Egypt to escape King Herod's decree.",
          "The Symbolism of Flower (Tsige): 'Tsige' translates to flower. The Holy Virgin Mary is compared to the beautiful 'Tsige-Reda' (rose) flower in her holiness, and her Son Jesus Christ is symbolized as the fruit."
        ]
      },
      {
        title: "Spiritual and Liturgical Practices",
        points: [
          "Mahlete Tsige: During the weeks of the fast (especially during Saturday and Sunday nights), special Yaeredic hymns, praises, and choral services (Mahlet) are conducted in church.",
          "Works of Abba Giyorgis of Gascha: Beautiful ancient liturgical poems and poetic chants, particularly 'Salame Tsige' (Peace of the Flower) and 'Mahlete Tsige' (Hymn of the Flower), are sung throughout the service."
        ]
      }
    ],
    highlightsAm: [
      {
        title: "የጾሙ ምስጢር እና ትርጉም",
        points: [
          "ስደትን ማሰብ፦ ድንግል ማርያም ልጇን ኢየሱስ ክርስቶስን ይዛ በሄሮድስ ዘመን ወደ ግብፅ የተሰደደችበትን መከራ ለማሰብ ይጾማል።",
          "ትርጉሙ፦ 'ጽጌ' ማለት አበባ ማለት ሲሆን፣ ድንግል ማርያም በቅድስናዋ 'የጽጌፌን አበባ'፣ ልጇ ደግሞ 'ፍሬ' ተብሎ ይመሰላል።"
        ]
      },
      {
        title: "መንፈሳዊ ሥርዓቶች",
        points: [
          "ማኅሌተ ጽጌ፦ በጾሙ ሳምንታት (በተለይ ቅዳሜ እና እሁድ ሌሊት) ልዩ ያሬዳዊ ምስጋና እና ማኅሌት ይቆማል።",
          "የአባ ጊዮርጊስ ዘጋስጫ ድርሰት፦ በማኅሌቱ ላይ 'ሰላመ ጽጌ' እና 'ማኅሌተ ጽጌ' የተሰኙ ጥንታዊ መንፈሳዊ ግጥሞችና ዜማዎች ይዘመራሉ።"
        ]
      }
    ]
  },
  {
    id: "gena",
    nameEn: "Gena Tsom / Nebiyat Tsom (Fast of the Prophets / Advent)",
    nameAm: "የገና ጾም (ጾመ ነቢያት)",
    durationEn: "43 Days",
    durationAm: "43 ቀናት",
    periodEn: "November 15 – December 28 (Hedar 15/16 – Tahsas 28)",
    periodAm: "ከሕዳር 15 ቀን እስከ ታኅሣሥ 28 ቀን ድረስ",
    highlightsEn: [
      {
        title: "Names of the Fast",
        points: [
          "Fast of the Prophets (ጾመ ነቢያት): Dedicated to the memory of the Old Testament Prophets who prayed, fasted, and prophesied about the coming and birth of Christ.",
          "Gena Tsom (ጾመ ገና): Celebrated as the fast that precedes the grand feast of Christmas (Gena).",
          "The Apostles' Fast Addition (3 extra days): After witnessing the birth of Christ, the Apostles fasted for 3 days (commemorating the mystery of the Magi offering gold, frankincense, and myrrh), which is added to the 40 days of the Prophets."
        ]
      },
      {
        title: "Spiritual and Theological Meaning",
        points: [
          "Fulfillment of Prophesies: Represents preparation to receive the Light of the Nativity, signifying humanity's salvation from the ancient curse and the fulfillment of Adam's hope.",
          "Spiritual Preparation: Believers prepare themselves through repentance, prayer, and charity to receive Christ in their hearts."
        ]
      }
    ],
    highlightsAm: [
      {
        title: "የጾሙ ስያሜዎች",
        points: [
          "ጾመ ነቢያት፦ ነቢያት ስለ ክርስቶስ መምጣትና መወለድ ትንቢት እየተናገሩ፣ በጾምና በጸሎት የጠበቁበትን ዘመን ለማሰብ በመጾሙ።",
          "ጾመ ገና / የገና ጾም፦ ከጌታ ልደት (ገና) በዓል በፊት የሚጾም በመሆኑ።",
          "ጾመ ሐዋርያት (ተደማሪው 3 ቀን)፦ ሐዋርያት የጌታን ልደት ካዩ በኋላ የጾሙት 3 ቀን (ሰብአ ሰገል የወርቅ፣ ዕጣንና ከርቤ ስጦታ ያቀረቡበትን ምስጢር ለማሰብ) ከ40ው ቀን ጋር ይደመራል።"
        ]
      },
      {
        title: "መንፈሳዊ ትርጉም",
        points: [
          "የትንቢት መፈጸም፦ የሰው ልጅ ከእርግማን ድኖ፣ የአዳም ተስፋ ተፈጽሞ ብርሃነ ልደትን ለመቀበል መዘጋጀትን ያሳያል።",
          "መንፈሳዊ ዝግጅት፦ አማኞች በንስሐ፣ በጸሎትና በበጎ ምግባር ተዘጋጅተው የክርስቶስን ልደት በልባቸው ለመቀበል ይተጋሉ።"
        ]
      }
    ]
  },
  {
    id: "nenewe",
    nameEn: "Fast of Nineveh (Tsome Nenewe)",
    nameAm: "የነነዌ ጾም (ጾመ ነነዌ)",
    durationEn: "3 Days",
    durationAm: "3 ቀናት",
    periodEn: "Determined dynamically by Bahre Hasab (Precedes Great Lent)",
    periodAm: "በባሕረ ሐሳብ ቀመር መሠረት ይወሰናል (ከዐቢይ ጾም ሁለት ሳምንት በፊት)",
    highlightsEn: [
      {
        title: "Historical and Biblical Origin",
        points: [
          "Repentance of the Ninevites: When the Prophet Jonah preached 'Destruction is coming upon you' to the people of Nineveh, the entire city, including the King, citizens, and even animals, fasted and wore sackcloth for 3 days.",
          "God's Mercy: Seeing their sincere repentance, God relented and spared them. This fast stands as a powerful symbol of true repentance and divine mercy."
        ]
      },
      {
        title: "Liturgical Choral Services and Hours",
        points: [
          "Special Prayers: During the fast (Monday to Wednesday), the church conducts special prayers of repentance and deep prostrations (known as Segenet prayers).",
          "Holy Liturgy (Kedase) Hours: Just like the Great Lent, the Divine Liturgy is celebrated late in the afternoon (at the 9th hour / 3:00 PM local time)."
        ]
      }
    ],
    highlightsAm: [
      {
        title: "የታሪክ መነሻ (የመጽሐፍ ቅዱስ ታሪክ)",
        points: [
          "የነነዌ ሰዎች ንስሐ፦ ነቢዩ ዮናስ ለነነዌ ሕዝቦች 'ጥፋት ይመጣባችኋል' ብሎ በሰበከላቸው ጊዜ፣ ንጉሡን ጨምሮ ሕዝቡና እንስሳቱ ሳይቀሩ ለ3 ቀናት በጾምና በጸሎት ማቅ ለብሰው አልቅሰዋል።",
          "የእግዚአብሔር ምሕረት፦ እግዚአብሔርም እውነተኛ ንስሐቸውን አይቶ ከጥፋት አድኗቸዋል። ይህ ጾም የእውነተኛ ንስሐ እና የምሕረት ምሳሌ ነው።"
        ]
      },
      {
        title: "ሥርዓተ ማኅሌትና ቅዳሴ",
        points: [
          "ልዩ ጸሎት፦ በነነዌ ጾም ቀናት (ከሰኞ እስከ ረቡዕ) ቤተ ክርስቲያን ልዩ የንስሐ ጸሎት (የሰገነት ጸሎት) ታደርሳለች።",
          "የቅዳሴ ሰዓት፦ የጾሙ ቅዳሴ የሚቀደሰው ልክ እንደ ዓቢይ ጾም በዘጠኝ ሰዓት (በምሽት) ላይ ነው።"
        ]
      }
    ]
  },
  {
    id: "abiytsom",
    nameEn: "Abiy Tsom / Hudadi (The Great Lent)",
    nameAm: "ዐቢይ ጾም (ጾመ ሁዳዴ)",
    durationEn: "55 Days (8 Weeks)",
    durationAm: "55 ቀናት (8 ሳምንታት)",
    periodEn: "Dynamically calculated by Bahre Hasab (In 2018 E.C.: Begins Yekatit 9)",
    periodAm: "በባሕረ ሐሳብ ቀመር መሠረት (በ2018 ዓ.ም የካቲት 9 ቀን ይገባል)",
    highlightsEn: [
      {
        title: "Historical Foundation and Duration",
        points: [
          "Jesus' Fast: Modeled after the 40 days and nights of fasting observed by our Lord and Savior Jesus Christ in the wilderness of Quarantania after His baptism.",
          "Composition of 55 Days: Composed of the Fast of Heraclius (7 days) + Fast of our Lord (40 days) + Passion Week / Semune Himamat (8 days)."
        ]
      },
      {
        title: "The Eight Sundays of the Great Lent",
        points: [
          "Zewerede: Commemorates the descent of God from Heaven to redeem humanity (the opening week).",
          "Kidist: Focuses on the holiness of the Sabbath and the purity of human life.",
          "Mikurab: Commemorates Christ entering the synagogue to teach, superseding old Jewish customs.",
          "Metsague: Remembers the healing of the paralyzed and sick, symbolizing Christ healing both body and soul.",
          "Debre Zeyt: The midpoint of the lent, commemorating Christ teaching on the Mount of Olives about His Second Coming.",
          "Gabr Her: Focuses on the parable of the good and faithful servant who works diligently.",
          "Nikodimos: Remembers the Jewish scholar Nicodemus who came to Christ by night to learn about rebirth (baptism).",
          "Hosanna: Celebrates Christ's triumphant entry into Jerusalem on a donkey, marking the entrance into Passion Week."
        ]
      }
    ],
    highlightsAm: [
      {
        title: "የጾሙ ቀናት ብዛት",
        points: [
          "ጾሙ በአጠቃላይ 55 ቀናት (8 ሳምንታት) ይቆያል።",
          "የቀናቱ ክፍፍል፦ የሕርቃል ጾም (7 ቀናት) + የጌታ ጾም (40 ቀናት) + ሰሙነ ሕማማት (8 ቀናት) በአንድነት ተደምረው 55 ቀናት ሆነዋል።"
        ]
      },
      {
        title: "ስምንቱ የዐቢይ ጾም ሳምንታት (እሑዶች)",
        points: [
          "ዘወረደ፦ አምላክ ሰውን ለማዳን ከሰማይ መውረዱ የሚታሰብበት (የጾሙ መግቢያ ሳምንት)።",
          "ቅድስት፦ የሰንበትን ቅድስና እና የሰውን ሕይወት ንጽሕና የሚያስተምር።",
          "ምኩራብ፦ ጌታ በምኩራብ ገብቶ ማስተማሩንና የአይሁድን ሥርዓት መተካቱን የሚያሳይ።",
          "መፃጉዕ፦ ጌታ ድውያንን መፈወሱና የሰውን ልጅ ከደዌ ሥጋና ደዌ ነፍስ ማዳኑ የሚነገርበት።",
          "ደብረ ዘይት፦ የጾሙ እኩሌታ (አጋማሽ) ሲሆን፣ ጌታ በደብረ ዘይት ተራራ ስለ ዳግም ምጽዓቱ ያስተማረበት።",
          "ገብር ኄር፦ ታማኝና በጎ አገልጋይ ተግቶ መሥራት እንዳለበት በምሳሌ የሚነገርበት።",
          "ኒቆዲሞስ፦ አይሁዳዊው ምሁር ኒቆዲሞስ በሌሊት ወደ ጌታ መጥቶ ስለ ዳግም ልደት (ጥምቀት) የተማረበት።",
          "ሆሣዕና፦ ጌታ በክብርና በምስጋና ወደ ኢየሩሳሌም የገባበትና የሕማማት መግቢያ።"
        ]
      }
    ]
  },
  {
    id: "hawariat",
    nameEn: "Sene Tsom / Tsome Hawariat (Fast of the Apostles)",
    nameAm: "ጾመ ሐዋርያት (የሰኔ ጾም)",
    durationEn: "15 to 45 Days (In 2018 E.C.: 41 Days)",
    durationAm: "ከ15 እስከ 45 ቀናት (በ2018 ዓ.ም ለ41 ቀናት ይጾማል)",
    periodEn: "Begins Monday after Pentecost, Ends Hamle 5 (In 2018 E.C.: Ginbot 24 – Hamle 5)",
    periodAm: "ከሰኞ ጰራቅሊጦስ ማግስት እስከ ሐምሌ 5 ቀን (በ2018 ዓ.ም ግንቦት 24 ይገባል)",
    highlightsEn: [
      {
        title: "Historical and Spiritual Origin",
        points: [
          "Apostolic Example: Kept in honor of the Holy Apostles who fasted and prayed after receiving the Holy Spirit at Pentecost, before embarking on their global missionary work.",
          "Imitation of Christ: Just as Jesus Christ fasted for 40 days in the wilderness before starting His saving ministry, the Apostles initiated their ministry with fasting.",
          "Scriptural Prophecy: Fulfills the words of our Savior: 'But the days will come when the bridegroom will be taken away from them, and then they will fast' (Matthew 9:15)."
        ]
      },
      {
        title: "Calculation of Days (Bahre Hasab)",
        points: [
          "Fluctuating Dates: The starting date of Sene Tsom fluctuates yearly depending on Easter. It can range from 15 to 45 days.",
          "2018 E.C. Calculation: In 2018 E.C., Easter falls on Miyazia 4, placing Pentecost on Ginbot 23; therefore, Sene Tsom begins the very next day on Ginbot 24 and concludes on Hamle 5 (lasting exactly 41 days)."
        ]
      },
      {
        title: "Liturgical and Communal Aspect",
        points: [
          "Called Sene Tsom: Popularly referred to as 'Sene Tsom' (Sene's Fast) because it is primarily observed during the Ethiopian month of Sene (June).",
          "Holy Liturgy: Fasting is strictly observed until the 9th hour (3:00 PM), when the Divine Liturgy is celebrated."
        ]
      }
    ],
    highlightsAm: [
      {
        title: "የታሪክና የመንፈሳዊ መነሻ",
        points: [
          "የሐዋርያት አብነት፦ ቅዱሳን ሐዋርያት በዓለ ጰራቅሊጦስ መንፈስ ቅዱስን ከተቀበሉ በኋላ፣ ለስብከተ ወንጌል ወደ ተለያዩ የዓለም ክፍሎች ከመሰማራታቸው በፊት የጾሙት ጾም ነው።",
          "የጌታ ምሳሌነት፦ ጌታችን ኢየሱስ ክርስቶስ የማዳን ሥራውንና ትምህርቱን ከመጀመሩ በፊት በገዳመ ቆሮንቶስ እንደጾመ ሁሉ፣ ሐዋርያትም አገልግሎታቸውን በጾም ጀምረዋል።",
          "የትንቢት ቃል፦ ጌታችን በወንጌል ላይ 'ሙሽራው ከእነርሱ የሚወሰድበት ወራት ይመጣል፥ በዚያን ጊዜም ይጾማሉ' (ማቴ 9:15) ብሎ የተናገረው ትንቢት ፍጻሜ ነው።"
        ]
      },
      {
        title: "የጾሙ ቀናት ስሌት (ባሕረ ሐሳብ)",
        points: [
          "ተለዋዋጭነት፦ የጾመ ሐዋርያት መግቢያ ቀን እንደ በዓለ ትንሣኤ አወጣጥ በየዓመቱ ይለዋወጣል። ጾሙ ቢያንስ 15 ቀናት፣ ቢበዛ ደግሞ 45 ቀናት ሊቆይ ይችላል።",
          "የ2018 ዓ.ም ስሌት፦ በ2018 ዓ.ም የትንሣኤ በዓል ሚያዝያ 4 ቀን በመዋሉ ምክንያት የጰራቅሊጦስ በዓል ግንቦት 23 ቀን ይውላል፤ በመሆኑም ማግስቱ ግንቦት 24 ቀን ጾሙ ገብቶ ሐምሌ 5 ቀን ሲያበቃ ለ41 ቀናት ይጾማል።"
        ]
      },
      {
        title: "ሥርዓተ ማኅሌትና ቅዳሴ",
        points: [
          "የሰኔ ጾም መባል፦ አብዛኛውን ጊዜ በሰኔ ወር ውስጥ ስለሚጾም በምእመናን ዘንድ 'የሰኔ ጾም' ተብሎ ይጠራል።",
          "የቅዳሴ ሥርዓት፦ በጾሙ ቀናት ውስጥ እስከ 9 ሰዓት (በምሽት) ድረስ የመጾም ሥርዓት አለ።"
        ]
      }
    ]
  }
];

export default function FastingGuide() {
  const [lang, setLang] = useState<'am' | 'en' | 'bilingual'>('bilingual');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="flex flex-col gap-4 w-full bg-white border border-brand-dark/15 p-4 sm:p-5 md:p-6" id="fasting-guide-component">
      {/* Header */}
      <div className="flex flex-col gap-1.5" id="fasting-guide-header">
        <div className="flex items-center justify-between gap-2" id="fasting-header-top">
          <h3 className="text-xs uppercase tracking-[0.25em] font-sans font-black text-brand-dark flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-brand-dark/40" /> EOTC Fasting Guide (ስለ አጽዋማት)
          </h3>
          <div className="flex items-center gap-1 text-[10px] font-sans font-bold text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/15">
            <Sparkles className="w-3 h-3" /> Bilingual
          </div>
        </div>
        <p className="text-xs text-brand-dark/60 font-sans">
          Detailed theological insights, historical origin, and spiritual practices of the major fasts.
        </p>

        {/* Dynamic Liturgical Guide Modal Button */}
        <button
          id="open-liturgical-guide-btn"
          onClick={() => setIsGuideModalOpen(true)}
          className="w-full mt-2 bg-gradient-to-r from-[#006732]/8 to-[#D1A110]/8 hover:from-[#006732]/12 hover:to-[#D1A110]/12 text-[#006732] font-sans font-extrabold text-[10.5px] uppercase tracking-wider py-2.5 px-4 border border-[#006732]/15 hover:border-[#006732]/30 rounded-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm"
        >
          <BookOpen className="w-4 h-4 text-[#006732]" />
          <span>Open Full Liturgical Guide (ሙሉ መመሪያ)</span>
        </button>
      </div>

      {/* Language Toggle */}
      <div className="flex bg-brand-bg/50 p-1 border border-brand-dark/10 rounded-sm items-center gap-1" id="fasting-lang-selector">
        <button
          id="lang-am-btn"
          onClick={() => setLang('am')}
          className={`flex-1 text-center py-1.5 text-[10px] font-sans font-bold rounded-sm transition-all cursor-pointer
            ${lang === 'am'
              ? 'bg-[#006732] text-white shadow-none'
              : 'text-brand-dark/50 hover:text-brand-dark'}
          `}
        >
          አማርኛ
        </button>
        <button
          id="lang-bilingual-btn"
          onClick={() => setLang('bilingual')}
          className={`flex-1 text-center py-1.5 text-[10px] font-sans font-bold rounded-sm transition-all cursor-pointer inline-flex items-center justify-center gap-1
            ${lang === 'bilingual'
              ? 'bg-[#006732] text-white shadow-none'
              : 'text-brand-dark/50 hover:text-brand-dark'}
          `}
        >
          <Languages className="w-3 h-3" /> Bilingual
        </button>
        <button
          id="lang-en-btn"
          onClick={() => setLang('en')}
          className={`flex-1 text-center py-1.5 text-[10px] font-sans font-bold rounded-sm transition-all cursor-pointer
            ${lang === 'en'
              ? 'bg-[#006732] text-white shadow-none'
              : 'text-brand-dark/50 hover:text-brand-dark'}
          `}
        >
          English
        </button>
      </div>

      {/* Accordion List */}
      <div className="flex flex-col gap-2.5" id="fasting-accordion-list">
        {FASTING_DATA.map((fast) => {
          const isExpanded = expandedId === fast.id;
          const showAm = lang === 'am' || lang === 'bilingual';
          const showEn = lang === 'en' || lang === 'bilingual';

          return (
            <div
              key={fast.id}
              className={`border rounded-sm transition-all duration-200 overflow-hidden
                ${isExpanded 
                  ? 'border-brand-gold/30 bg-brand-gold/[0.01]' 
                  : 'border-brand-dark/10 bg-white hover:border-brand-dark/20'}`}
              id={`fasting-card-${fast.id}`}
            >
              {/* Accordion Trigger Header */}
              <button
                id={`fasting-trigger-${fast.id}`}
                onClick={() => toggleExpand(fast.id)}
                className="w-full flex items-center justify-between p-4 text-left cursor-pointer select-none"
              >
                <div className="flex flex-col gap-1 flex-1 pr-2" id={`fasting-trigger-info-${fast.id}`}>
                  {/* Title */}
                  <div className="flex flex-col gap-0.5" id={`fasting-trigger-titles-${fast.id}`}>
                    {showAm && (
                      <span className="font-serif font-black text-sm text-brand-dark tracking-wide leading-tight">
                        {fast.nameAm}
                      </span>
                    )}
                    {showEn && (
                      <span className="font-serif font-medium text-xs text-brand-dark/80 tracking-normal leading-tight">
                        {fast.nameEn}
                      </span>
                    )}
                  </div>
                  {/* Subtitle / Duration Metadata */}
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-1 text-[10px] font-sans font-bold text-brand-dark/50" id={`fasting-meta-triggers-${fast.id}`}>
                    <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-500/10 px-1.5 py-0.2 rounded-sm uppercase">
                      <Clock className="w-3 h-3" /> {lang === 'am' ? fast.durationAm : fast.durationEn}
                    </span>
                    <span className="inline-flex items-center gap-1 uppercase">
                      <Calendar className="w-3 h-3" /> {lang === 'am' ? fast.periodAm : fast.periodEn}
                    </span>
                  </div>
                </div>
                {/* Arrow */}
                <div className="p-1 text-brand-dark/40" id={`fasting-trigger-arrow-${fast.id}`}>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Accordion Content Panel */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    id={`fasting-content-${fast.id}`}
                    className="border-t border-brand-dark/10"
                  >
                    <div className="p-4 flex flex-col gap-4 text-xs font-sans leading-relaxed text-brand-dark/80" id={`fasting-expanded-inner-${fast.id}`}>
                      
                      {/* Bilingual Side-by-Side or Stacked Content */}
                      {showAm && (
                        <div className="flex flex-col gap-3" id={`fasting-am-content-${fast.id}`}>
                          {lang === 'bilingual' && (
                            <span className="text-[9px] uppercase font-sans font-black tracking-widest text-brand-green/70 flex items-center gap-1 border-b border-brand-green/10 pb-0.5">
                              🇪🇹 አማርኛ (Amharic)
                            </span>
                          )}
                          {fast.highlightsAm.map((section, sIdx) => (
                            <div key={sIdx} className="flex flex-col gap-1.5" id={`fasting-am-section-${fast.id}-${sIdx}`}>
                              <h4 className="font-serif font-black text-brand-dark text-[11px] uppercase tracking-wide flex items-center gap-1">
                                ✦ {section.title}
                              </h4>
                              <ul className="list-disc list-outside pl-4 space-y-1 font-sans text-brand-dark/80 text-[11px] md:text-xs">
                                {section.points.map((pt, pIdx) => (
                                  <li key={pIdx}>{pt}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}

                      {showEn && (
                        <div className="flex flex-col gap-3 mt-1" id={`fasting-en-content-${fast.id}`}>
                          {lang === 'bilingual' && (
                            <span className="text-[9px] uppercase font-sans font-black tracking-widest text-brand-blue/70 flex items-center gap-1 border-b border-brand-blue/10 pb-0.5 mt-2">
                              🇬🇧 English (እንግሊዝኛ)
                            </span>
                          )}
                          {fast.highlightsEn.map((section, sIdx) => (
                            <div key={sIdx} className="flex flex-col gap-1.5" id={`fasting-en-section-${fast.id}-${sIdx}`}>
                              <h4 className="font-serif font-bold text-brand-dark text-[11px] uppercase tracking-wide flex items-center gap-1">
                                ✦ {section.title}
                              </h4>
                              <ul className="list-disc list-outside pl-4 space-y-1 font-sans text-brand-dark/80 text-[11px] md:text-xs">
                                {section.points.map((pt, pIdx) => (
                                  <li key={pIdx}>{pt}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Liturgical Guide Modal */}
      <LiturgicalGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </div>
  );
}
