import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, BookOpen, Clock, Calendar, Sparkles, Filter, Globe, Landmark } from 'lucide-react';

interface LiturgicalGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GuideItem {
  id: string;
  category: 'fasting' | 'feast';
  nameEn: string;
  nameAm: string;
  periodEn: string;
  periodAm: string;
  durationEn: string;
  durationAm: string;
  theologyEn: string;
  theologyAm: string;
  observanceEn: string[];
  observanceAm: string[];
  narrative?: {
    titleAm: string;
    titleEn: string;
    paragraphsAm?: string[];
    paragraphsEn?: string[];
    paragraphs?: string[];
    blessingAm?: string;
    blessingEn?: string;
  };
}

const GUIDE_ITEMS: GuideItem[] = [
  {
    id: 'tsome-filseta',
    category: 'fasting',
    nameEn: 'Tsome Filseta (Fast of the Assumption of Mary)',
    nameAm: 'ጾመ ፍልሰታ ለማርያም',
    periodEn: 'August 1 – August 16 (Nehase 1 – Nehase 16)',
    periodAm: 'ከነሐሴ 1 እስከ ነሐሴ 16 ቀን',
    durationEn: '16 Days',
    durationAm: '16 ቀናት',
    theologyEn: 'Commemorates the death, burial, resurrection, and bodily assumption of the Blessed Virgin Mary into heaven. Highly beloved and strictly observed in Ethiopia.',
    theologyAm: 'እመቤታችን ቅድስት ድንግል ማርያም ያረፈችበትን፣ የተቀበረችበትን፣ በሦስተኛው ቀን ተነስታ በክብር ያረገችበትን መለኮታዊ ምስጢር ለማሰብ የሚጾም እጅግ የተወደደ ጾም ነው።',
    observanceEn: [
      'Daily devotional retreats (Sube\'ae) inside or around church compounds.',
      'Sincere spiritual fasting until 3:00 PM (the 9th hour) or evening, with complete abstention from meat, dairy, and eggs.',
      'Night-time Yaeredic hymn praises (Mahlet) and continuous holy liturgies.',
      'Special participation by youth and children who dedicatedly sleep at churches.'
    ],
    observanceAm: [
      'ምእመናን በቤተ መቅደስ ውስጥ ወይም በአቅራቢያው ሱባኤ በመግባት ይጸልያሉ።',
      'ከእንስሳት ተዋጽኦ (ሥጋ፣ ወተት፣ ቅቤ፣ ዕንቁላል) ሙሉ በሙሉ በመከልከል እስከ ዘጠኝ ሰዓት (3:00 PM) መጾም።',
      'ልዩ ያሬዳዊ የሌሊት ማኅሌትና የማያቋርጥ የበዓል ቅዳሴ አገልግሎት።',
      'ሕፃናትና ወጣቶች በቤተ ክርስቲያን አድረው በታላቅ ትጋትና ፍቅር ይሳተፋሉ።'
    ]
  },
  {
    id: 'abiy-tsom',
    category: 'fasting',
    nameEn: 'Abiy Tsom / Hudadi (The Great Lent)',
    nameAm: 'ዐቢይ ጾም (ጾመ ሁዳዴ)',
    periodEn: 'Variable: Begins 55 Days before Easter (Yekatit / Megabit)',
    periodAm: 'ተለዋዋጭ፦ ከትንሣኤ በዓል 55 ቀናት ቀድሞ ይገባል (የካቲት / መጋቢት)',
    durationEn: '55 Days (8 Weeks)',
    durationAm: '55 ቀናት (8 ሳምንታት)',
    theologyEn: 'The longest and most solemn fast of the year. Modeled after the 40 days of fasting observed by Lord Jesus Christ in the wilderness, extended by the week of Heraclius and the Holy Passion Week.',
    theologyAm: 'በዓመት ውስጥ የሚጾም ረጅሙና ታላቁ ጾም። ጌታችን ኢየሱስ ክርስቶስ በገዳመ ቆሮንቶስ የጾመውን 40 ቀን፣ የቅድመ-ጾም የሕርቃልን ሳምንት እንዲሁም ሰሙነ ሕማማትን ያካትታል።',
    observanceEn: [
      'Strict daily fasting until 3:00 PM (9th hour) or later during weekdays.',
      'No liturgies performed during the mornings on weekdays; all Divine Liturgies are scheduled late in the afternoon.',
      'Deep repentance, spiritual meditations, and numerous prostrations (Segdet).',
      'Special focus on eight theological weekly themes (Zewerede, Kidist, Mikurab, Metsague, Debre Zeyt, Gabr Her, Nikodimos, Hosanna).'
    ],
    observanceAm: [
      'በሳምንቱ ቀናት እስከ 9 ሰዓት (በምሽት) ድረስ በጥብቅ መጾም።',
      'በሳምንቱ ቀናት ጠዋት ቅዳሴ አይቀደስም፤ ሁሉም መደበኛ ቅዳሴዎች የሚከናወኑት በሰርክ (በዘጠኝ ሰዓት) ላይ ነው።',
      'ጥልቅ ንስሐ፣ መንፈሳዊ ተጋድሎ እና በርካታ ስግደቶች (የሰገነት ጸሎቶች)።',
      'ስምንቱን ሳምንታት (ዘወረደ፣ ቅድስት፣ ምኩራብ፣ መፃጉዕ፣ ደብረ ዘይት፣ ገብር ኄር፣ ኒቆዲሞስ፣ ሆሣዕና) በማስተማር ማክበር።'
    ]
  },
  {
    id: 'gena-tsom',
    category: 'fasting',
    nameEn: 'Gena Tsom / Nebiyat Tsom (Advent / Fast of the Prophets)',
    nameAm: 'የገና ጾም (ጾመ ነቢያት)',
    periodEn: 'November 24 – January 6 (Hedar 15 – Tahsas 28)',
    periodAm: 'ከኅዳር 15 እስከ ታኅሣሥ 28 ቀን ድረስ',
    durationEn: '43 Days',
    durationAm: '43 ቀናት',
    theologyEn: 'Precedes the grand feast of Christmas (Gena). Commemorates the fasting and intense expectation of the Old Testament prophets who foretold the incarnation and birth of Jesus Christ.',
    theologyAm: 'የልደትን በዓል (ገናን) ለመቀበል የሚጾም ጾም ነው። ስለ ክርስቶስ መምጣትና በሥጋ መገለጥ ትንቢት የተናገሩትን ቅዱሳን ነቢያት ልመና፣ ጾምና ጸሎት ለማሰብ ይጾማል።',
    observanceEn: [
      'Abstaining from all animal products for 43 days.',
      'Daily scriptural readings of Old Testament Messianic prophecies.',
      'The final 3 days commemorate the fast of the Apostles after seeing the Nativity (associated with the Magi offering gifts).'
    ],
    observanceAm: [
      'ለ43 ቀናት ከእንስሳት ተዋጽኦ ሙሉ በሙሉ መከልከልና መጾም።',
      'ስለ ክርስቶስ መወለድ የሚናገሩትን የነቢያትን የትንቢት መጻሕፍት ማንበብ።',
      'የመጨረሻዎቹ 3 ቀናት ሐዋርያት የጌታን ልደት ካዩ በኋላ የጾሙትን ጾም (ሰብአ ሰገል ያቀረቡትን ስጦታ በማሰብ) ያካትታል።'
    ]
  },
  {
    id: 'sene-tsom',
    category: 'fasting',
    nameEn: 'Sene Tsom / Tsome Hawariat (Fast of the Apostles)',
    nameAm: 'ጾመ ሐዋርያት (የሰኔ ጾም)',
    periodEn: 'Begins Monday after Pentecost, Ends Hamle 5 (June – July)',
    periodAm: 'ከሰኞ ጰራቅሊጦስ ማግስት እስከ ሐምሌ 5 ቀን ድረስ',
    durationEn: '15 to 45 Days',
    durationAm: 'ከሰኔ እስከ ሐምሌ (ከ15 እስከ 45 ቀናት ይለዋወጣል)',
    theologyEn: 'Kept in honor of the Holy Apostles who fasted and prayed after receiving the Holy Spirit on Pentecost before starting their missionary work to spread the Gospel across the world.',
    theologyAm: 'ቅዱሳን ሐዋርያት በበዓለ ጰራቅሊጦስ መንፈስ ቅዱስን ከተቀበሉ በኋላ፣ በዓለም ዙሪያ ወንጌልን ለማስተማርና ለመስበክ ከመውጣታቸው በፊት የጾሙትና የጸለዩበት በዓል መታሰቢያ ነው።',
    observanceEn: [
      'Fasting during the day until 3:00 PM.',
      'Celebrating the feast of Saints Peter and Paul on the final day (Hamle 5).',
      'Prayers for global evangelism, peace in the church, and strength in Christian testimony.'
    ],
    observanceAm: [
      'በቀን እስከ 9 ሰዓት ድረስ በመጾም ወንጌልን ማስፋፋት።',
      'በመጨረሻው ቀን (ሐምሌ 5) የቅዱሳን ጴጥሮስና ጳውሎስን ዓመታዊ በዓል በታላቅ ድምቀት ማክበር።',
      'ስለ ወንጌል መስፋፋት፣ ስለ ቤተ ክርስቲያን አንድነትና ሰላም መጸለይ።'
    ]
  },
  {
    id: 'tsome-nenewe',
    category: 'fasting',
    nameEn: 'Tsome Nenewe (Fast of Nineveh)',
    nameAm: 'የነነዌ ጾም (ጾመ ነነዌ)',
    periodEn: 'Variable: Precedes Great Lent by 14 Days (Monday – Wednesday)',
    periodAm: 'ተለዋዋጭ፦ ከዐቢይ ጾም ሁለት ሳምንታት ቀድሞ ይገባል (ከሰኞ እስከ ረቡዕ)',
    durationEn: '3 Days',
    durationAm: '3 ቀናት',
    theologyEn: 'Commemorates the legendary repentance of the city of Nineveh in response to the warning preached by Prophet Jonah. It stands as a profound model of true repentance and divine mercy.',
    theologyAm: 'ነቢዩ ዮናስ ለነነዌ ሕዝቦች ንስሐን በሰበከ ጊዜ፣ ከንጉሡ እስከ እንስሳቱ ድረስ በጾምና በጸሎት ንስሐ ገብተው እግዚአብሔር ከጥፋት ማዳኑን ለማሰብ የሚጾም ነው።',
    observanceEn: [
      'Extremely strict 3-day fasting, with some believers abstaining from both water and food for the entire 3 days.',
      'Continuous liturgies scheduled late in the afternoons.',
      'Sincere repentance prayers, deep prostrations, and seeking forgiveness from others.'
    ],
    observanceAm: [
      'ለ3 ቀናት በጥብቅ መጾም፤ አንዳንድ ምእመናን ለ3ቱ ቀናት ያለምግብና ያለውኃ ይጾማሉ።',
      'በእነዚህ ሦስት ቀናት ከሰዓት በኋላ የሚከናወኑ የቅዳሴ ጸሎቶች።',
      'ጥልቅ የንስሐ ጸሎት ማቅረብ፣ መደጋገም እና ከሰዎች ጋር መታረቅ።'
    ]
  },
  {
    id: 'tsome-gehad',
    category: 'fasting',
    nameEn: 'Tsome Gehad (The Gahad Fast / Eves of Christmas & Epiphany)',
    nameAm: 'ጾመ ገሃድ (የገናና የጥምቀት ዋዜማ)',
    periodEn: 'Eves of Christmas (Jan 6 / Tahsas 28) and Epiphany (Jan 18 / Tir 10)',
    periodAm: 'የልደት ዋዜማ (ታኅሣሥ 28) እና የጥምቀት ዋዜማ (ጥር 10)',
    durationEn: '1 Day (per eve)',
    durationAm: '1 ቀን (ለእያንዳንዱ ዋዜማ)',
    theologyEn: 'Observed to prepare the mind, body, and soul for the reception of the great feasts of the Nativity (Gena) and the Theophany/Baptism (Timkat).',
    theologyAm: 'በልደት እና በጥምቀት ዋዜማ ላይ የሚጾም ሲሆን፣ በእነዚህ ታላላቅ በዓላት ለመንፈሳዊ ዝግጅት የሚደረግ ጾም ነው።',
    observanceEn: [
      'Observed strictly if the actual holiday falls on Wednesday or Friday, or modified to transfer the fasting requirement to prevent feasting on fast-days.',
      'Fasting with anticipation of the holy waters of Timkat or the midnight Liturgy of Christmas.'
    ],
    observanceAm: [
      'በዓላቱ ረቡዕ ወይም ዓርብ ላይ በሚውሉበት ጊዜ ዋዜማው በጥብቅ ይጾማል።',
      'የገናን እኩለ ሌሊት ቅዳሴ ወይም የጥምቀትን ቅዱስ ጸበል በታላቅ በረከት ለመቀበል መዘጋጀት።'
    ]
  },
  {
    id: 'lidet-gena',
    category: 'feast',
    nameEn: 'Lidet / Gena (Christmas / Nativity)',
    nameAm: 'በዓለ ልደት (ገና)',
    periodEn: 'January 7 (Tahsas 29 / Tahsas 28 in leap years)',
    periodAm: 'ታኅሣሥ 29 ቀን (በዘመነ ዮሐንስ ታኅሣሥ 28 ቀን)',
    durationEn: 'Feast Day',
    durationAm: 'የበዓል ዕለት',
    theologyEn: 'The birth of our Lord and Savior Jesus Christ in a humble manger in Bethlehem, representing the ultimate incarnation of the Word of God for humanity\'s salvation.',
    theologyAm: 'ጌታችንና መድኃኒታችን ኢየሱስ ክርስቶስ ሰውን ለማዳን በቤተልሔም በረት በቅድስት ድንግል ማርያም በሥጋ መወለዱ የሚታሰብበት ታላቅ በዓል።',
    observanceEn: [
      'Attending the Midnight Divine Liturgy (Kedase), ending with the breaking of the long 43-day fast.',
      'Preparing traditional festive foods like Doro Wat (chicken stew) and Genfo (porridge).',
      'Gathering with family and playing the traditional "Gena" hockey-like game.'
    ],
    observanceAm: [
      'የልደት እኩለ ሌሊት ቅዳሴ መሳተፍና የ43 ቀናቱን ጾመ ነቢያት መፍታት።',
      'የባህል ምግቦችን (ዶሮ ወጥ፣ ገንፎ ወዘተ) ማዘጋጀትና ከቤተሰብ ጋር መቋደስ።',
      'ቤተሰብን መጠየቅና ባህላዊውን "የገና ጨዋታ" መጫወት።'
    ]
  },
  {
    id: 'timkat-epiphany',
    category: 'feast',
    nameEn: 'Timkat (Epiphany / Baptism)',
    nameAm: 'በዓለ ጥምቀት',
    periodEn: 'January 19 (Tir 11 / Tir 12 in leap years)',
    periodAm: 'ጥር 11 ቀን (በዘመነ ዮሐንስ ጥር 12 ቀን)',
    durationEn: 'Feast Day',
    durationAm: 'የበዓል ዕለት',
    theologyEn: 'Commemorates the baptism of Jesus Christ in the River Jordan by John the Baptist, where the Holy Trinity was revealed to humankind (The Voice of the Father, the Son in Jordan, and the Holy Spirit as a dove).',
    theologyAm: 'ጌታችን በዮርዳኖስ ወንዝ በቅዱስ ዮሐንስ እጅ የተጠመቀበት፣ የሥላሴ ምስጢር (የአብ ድምፅ፣ የወልድ በሥጋ መሆን፣ የመንፈስ ቅዱስ በርግብ አምሳል መውረድ) የተገለጠበት በዓል።',
    observanceEn: [
      'Ketera (the eve): Procession of the Tabots (holy replica of the Ark of the Covenant) to a water source or pool.',
      'All-night outdoor prayers and chants by the clergy around the tents housing the Tabots.',
      'Morning blessing of the waters, sprinkling of the holy water (Tsebel) on the crowd, and joyful return of the Tabots with singing.'
    ],
    observanceAm: [
      'ከተራ (ጥር 10 ዋዜማ)፦ ታቦታት ከየአብያተ ክርስቲያኑ ተነስተው ወደ ጥምቀተ ባሕሩ በታላቅ በረከትና ዝማሬ ይጓዛሉ።',
      'በጥምቀተ ባሕር ድንኳኖች ዙሪያ ሌሊቱን ሙሉ የሚከናወን የጸሎትና የማኅሌት ሥርዓት።',
      'በማለዳው ውኃውን መባረክ፣ በምእመናን ላይ በረከቱን (ጸበሉን) መርጨትና ታቦታቱን በዝማሬ መመለስ።'
    ]
  },
  {
    id: 'kana-ze-galila',
    category: 'feast',
    nameEn: 'Kana Ze-Galila (Wedding at Cana)',
    nameAm: 'ቃና ዘገሊላ',
    periodEn: 'January 20 (Tir 12 / Tir 13 in leap years)',
    periodAm: 'ጥር 12 ቀን (በዘመነ ዮሐንስ ጥር 13 ቀን)',
    durationEn: 'Feast Day',
    durationAm: 'የበዓል ዕለት',
    theologyEn: 'Commemorates Jesus Christ\'s first miracle of turning water into wine at the wedding in Cana of Galilee, signifying His blessing of marriage and the transformation of the law.',
    theologyAm: 'ጌታችን በቃና ሰርግ ላይ ውሃውን ወደ ጣፋጭ ወይን በመለወጥ የመጀመሪያውን መለኮታዊ ተአምር ማድረጉን፣ ጋብቻን መባረኩን የሚያሳይ ታላቅ በዓል።',
    observanceEn: [
      'Usually celebrated alongside the return of the Tabot of Saint Michael on the day after Timkat.',
      'Sermons focusing on family life, Christian marriage, and the intercession of the Virgin Mary who prompted the miracle.'
    ],
    observanceAm: [
      'ከጥምቀት ማግስት የታቦተ ቅዱስ ሚካኤል መመለስ ጋር ተያይዞ በደስታ ይከበራል።',
      'ስለ ትዳር ክብር፣ ስለ ክርስቲያናዊ የትዳር ሕይወት እና ስለ ድንግል ማርያም አማላጅነት የሚሰበኩ ስብከቶች።'
    ]
  },
  {
    id: 'tinsae-easter',
    category: 'feast',
    nameEn: 'Tinsae (Feast of the Resurrection / Easter)',
    nameAm: 'በዓለ ትንሣኤ (ፋሲካ)',
    periodEn: 'Variable: Calculated by Bahre Hasab (Miyazia / Megabit)',
    periodAm: 'ተለዋዋጭ፦ በባሕረ ሐሳብ ቀመር መሠረት (መጋቢት / ሚያዝያ)',
    durationEn: 'Feast Day',
    durationAm: 'የበዓል ዕለት',
    theologyEn: 'The supreme Christian triumph celebrating the glorious Resurrection of Jesus Christ from the dead on the third day, conquering death, sin, and Hades.',
    theologyAm: 'ጌታችንና መድኃኒታችን ኢየሱስ ክርስቶስ ሞትን ድል አድርጎ በሦስተኛው ቀን በታላቅ መለኮታዊ ሥልጣን መነሳቱንና የሰውን ልጅ ነፃ ማውጣቱን የሚገልጽ ታላቅ የክርስቲያን በዓል።',
    observanceEn: [
      'All-night vigil liturgy (Tinsae Kedase) starting Saturday evening until Sunday 3:00 AM, breaking the 55-day Great Lent.',
      'Spitting "Kristos Tensea em-mutan" (Christ has risen from the dead!) and the response "Be-abiy hayl we-seletan" (With great power and authority!).',
      'Joyous family feasts and the preparation of traditional bread (Dabo) and slaughtering of sheep or cattle.'
    ],
    observanceAm: [
      'ከሰንበት ምሽት ጀምሮ እሁድ ማለዳ እስከ 9 ሰዓት የሚከናወን የበዓለ ትንሣኤ ቅዳሴ በመሳተፍ የ55 ቀናቱን ጾመ ሁዳዴ መፍታት።',
      '"ክርስቶስ ተንሥአ እሙታን!" (ክርስቶስ ከሙታን ተለይቶ ተነሳ!) እና "በዐቢይ ኃይል ወሥልጣን!" በማለት እርስ በእርስ ሰላምታ መለዋወጥ።',
      'ባህላዊ ድግሶች፣ ትልቅ ፋሲካ ዳቦ ማዘጋጀት እና ከቤተሰብ ጋር በደስታ መዋደድ።'
    ]
  },
  {
    id: 'adwa-victory',
    category: 'feast',
    nameEn: 'Adwa Victory Day (National Holiday)',
    nameAm: 'የዓድዋ ድል በዓል',
    periodEn: 'March 2 (Yekatit 23)',
    periodAm: 'የካቲት 23 ቀን',
    durationEn: 'National Holiday',
    durationAm: 'ብሔራዊ በዓል',
    theologyEn: 'Commemorates Ethiopia\'s miraculous and historical victory over colonial Italian invaders at the Battle of Adwa in 1896, preserving Ethiopia\'s ancient independence and serving as a symbol of black liberty.',
    theologyAm: 'በ1888 ዓ.ም የዓድዋ ጀግኖች አባቶቻችን ወራሪውንና በዘመናዊ መሣሪያ የታጠቀውን የጣሊያን ጦር ያሸነፉበትና የኢትዮጵያ ነፃነትና ታሪክ የተጠበቀበት ታላቅ ብሔራዊ በዓል።',
    observanceEn: [
      'National parades, patriotic speeches, and wreath-laying ceremonies at Adwa monuments.',
      'Public artistic performances, songs, and historical storytelling.',
      'Wearing traditional white Ethiopian clothing (Habesha Kemis / Netela) decorated with the green, yellow, and red colors.'
    ],
    observanceAm: [
      'የአርበኞች ሰልፍ፣ ብሔራዊ ንግግሮች እና በጀግኖች ሐውልት ፊት የአበባ ጉንጉን የማስቀመጥ ሥርዓት።',
      'የኪነ-ጥበብ ዝግጅቶች፣ የሀገር ፍቅር መዝሙሮች እና የታሪክ ትረካዎች።',
      'ባህላዊ ነጭ የሀበሻ ልብሶችን (ቀሚስ፣ ነጠላ) መልበስና በኢትዮጵያ ሰንደቅ ዓላማ ቀለማት መጌጥ።'
    ]
  },
  {
    id: 'saint-gabriel-hamle-19',
    category: 'feast',
    nameEn: 'Annual Feast of Archangel Saint Gabriel (Hamle 19)',
    nameAm: 'የቅዱስ ገብርኤል ዓመታዊ ክብረ በዓል (ሐምሌ 19)',
    periodEn: 'July 26 (Hamle 19)',
    periodAm: 'ሐምሌ 19 ቀን',
    durationEn: 'High Feast',
    durationAm: 'ታላቅ በዓል',
    theologyEn: 'Commemorates the great Archangel Gabriel rescuing Saint Juliet (Iyeluta) and her 3-year-old child Saint Cyriacus (Kirkos) from the boiling cauldron of the pagan governor during the Era of Martyrs.',
    theologyAm: 'ሊቀ መላእክት ቅዱስ ገብርኤል ቅድስት እየሉጣንና ልጇን ቅዱስ ቂርቆስን ከፈላ የብረት ጋን ውስጥ በትእምርተ መስቀል እሳቱን አቀዝቅዞ ከሞት አደጋ እንደታደገበት የሚታሰብበት ታላቅ ዓመታዊ ክብረ በዓል ነው።',
    observanceEn: [
      'Commemorating the miraculous deliverance of Saints Juliet and Cyriacus.',
      'Reflecting on the theological message of absolute faith in the midst of extreme trials.',
      'Church services with special chanting of Yaredic hymns, Dirsane Gabriel readings, and liturgy.',
      'Seeking the intercession and protection of the Archangel Gabriel.'
    ],
    observanceAm: [
      'ሊቀ መላእክት ቅዱስ ገብርኤል ያደረገውን ይህን ታላቅ ተአምር ድንቅ ሥራ በማሰብ እግዚአብሔርን ማመስገን።',
      'በዘመነ ሰማእታት ቅድስት እየሉጣና የሦስት ዓመት ሕፃን ቅዱስ ቂርቆስ ያሳዩትን ታላቅ የእምነት ጽናት ማሰብ።',
      'ልዩ ያሬዳዊ የሌሊት ማኅሌት፣ የበዓል ቅዳሴ አገልግሎት እና የሐምሌ ወር ድርሳነ ገብርኤል ንባብ።',
      'ቅዱሳን እየሉጣና ቂርቆስ ጥር 15 ቀን በሰይፍ ተመትተው ሰማዕትነትን እስከተቀበሉበት ጊዜ ድረስ የተደረገላቸውን እርዳታ መዘከር።'
    ],
    narrative: {
      titleAm: 'የቅዱስ ገብርኤል፣ የቅድስት እየሉጣና የቅዱስ ቂርቆስ ሙሉ ታሪክ',
      titleEn: 'The Miraculous Martyrdom & Deliverance Narrative',
      paragraphs: [
        'በቤተ ክርስቲያን ሥርዓት መሠረት ሐምሌ 19 የቅዱስ ገብርኤል አመታዊ በአል ነው፡፡ ይህ ቀን ሊቀ መላእክት ቅዱስ ገብርኤል ቅድስት እየሉጣንና ልጇን ቅዱስ ቂርቆስን ከሞት አደጋ እንደታደገበት የሚታሰብበት ዕለት ነው፡፡ የሐምሌ 19 ስንክሳርና የሐምሌ ወር ድርሳነ ገብርኤል እንዲህ ተርከውታል፡፡',
        'በዘመነ ሰማእታት ከሐድያን ነገሥታትና መኳንንት በክርስቲያኖች ላይ መከራ አጽንተውባቸው ነበር፡፡ በዚህም ምክንያት ብዙዎች ሰማእትነትን ሲቀበሉ የተቀሩት አገር ጥለው ተሰደዱ፡፡ እየሉጣም የሦስት ዓመት ህፃን የነበረውን ቅዱስ ቂርቆስን ይዛ ሸሸች በዚያም የሸሸችውን መኮንን አገኘችው ሰዎችም ነገር አሰሩባት ወደእርሷ አስቀረባት እና ስለ አምልኮ ጠየቃት እርሷም መኮንን ሆይ ዕድሜው ሦስት አመት የሆነው ህፃን አለ አማልክቶችህን ማምለክ መልካም እንደሆነ ወይም እንዳልሆነ ያስረዳን ዘንድ እሱን ጠይቅ አለችው፡፡',
        'ህፃኑም ወዳለበት ጭፍራውን ልኮ ወደእርሱ አስመጣው ህፃኑም ፊቱ ብሩህና ደስተኛ እንደሆነ አየውና አንተ ደስተኛ ህፃን ሆይ እንዴት ነህ አለው፡፡ ህፃኑም መልሶ አዎ ለኔ ተጠብቆልኛል ላንተ ግን ሐዘንና ለቅሶ ጥርስ ማፋጨትም ነው፡፡ መጻሐፍ ለዝንጉዎች ተድላ ደስታ የላቸውም ብሏል እና አለው፡፡ እግዚአብሔር ኃይልና ንግግርን ሰጥቶታልና ብዙ ተናገረ በዚያም ያሉትን እስካስደነገጣቸው ድረስ ንጉሱን መኳንንቱንና ጣኦታቱን ረገማቸው፡፡ ከብርታቱም የተነሳ አደነቁ፡፡ መኮንኑም በአፈረ ጊዜ በያይነቱ በሆነ ስቃይ ታላላቆች የማይችሉትን ታላቅና አስጨናቂ የሆነ ስቃይን አሰቃየው እናቱንም ከእርሱ ጋር አሰቃያት፡፡ እግዚአብሔርም ያለ ምንም ጉዳት ያነሳቸው ነበር፡፡ ብዙዎች አህዛብም ይኸንን አይተው አደነቁ ክብር ይግባውና በጌታችን በኢየሱስ ክርስቶስም አምነው በሰማእትነት ሞቱ፡፡ የሰማእትነትንም አክሊል ተቀበሉ፡፡',
        'በህፃኑም ላይ የመንፈስ ቅዱስ ጸጋ አደረበት፡፡ ታላላቅ ድንቆችና تአምራቶችንም አደረገ ብዙዎች በሽተኞችንም አዳናቸው፡፡',
        'መስፍኑም በውስጡ ሰም፣ ጨው፣ ባሩድ፣ ሙጫ፣ የዶሮ ማር፣ እርሳስ፣ ብረት፣ ቅንጭብ፣ ቁልቋል ጨምራችሁ ታላቅ የብረት ጋን አንጡልኝ ብሎ ጭፍሮቹን አዘዛቸው፡፡ ጭፍሮቹም እንዳዘዛቸው ካአደረጉ በኋላ ያዘዝከንን ሁሉ ፈጽመን እሳቱ ነዶ ፈልቷል፡፡ ድምፁ እንደነጐድጓድ ይጮኸል ወላፈኑም እንደጸሐይ ነጸብራቅ በሩቁ ይጋረፋል፡፡ የፍላቱም ኃይል በ14 ክንድ ያኽል ከፍታ ወደ ላይ ይዘላል፡፡ እንግዲህ በውስጡ የሚጣሉትን እዘዝ አሉት በዚህ ጊዜ ህፃን ቂርቆስና እናቱ እየሉጣ በክርስቶስ ሥም ስለሚያምኑ አስረዋቸው ነበርና ከፍላቱ ሊጨምሯቸው ከእስር ቤት አወጧቸው፡፡ በዚያም ፍላቱ ወደላይ በሚዘል ብረት ጋን ውስጥ ለመጨመር ሲወስዷቸው የነዚህን ቅዱሳን አሟሟት ያዩ ዘንድ በብዙ ሺህ የሚቆጠሩ ሰዎች እንዲሰበሰቡ አዘዛቸው፡፡ በዚህን ጊዜ ቅድስት እየሉጣ የፍላቱን ጩኸት በሰማችና ባየች ጊዜ ተሸበረች፡፡ ተዘጋጅቶላት ከነበረው ክብር ልታፈገፍግ ሞከረች፡፡',
        'ልጇ ቅዱስ ቂርቆስ ግን እናት ሆይ ከዚህ የብረት ጋን ግርማ የተነሳ አትፍሪ ድንጋጼም አይደርብሽ አናንያንና አዛርያን ሚሳኤልንም እግዚአብሔር ከእቶነ እሳት እንዳወጣቸው ሁሉ እኛንም ከዚህ ከብረት ጋን ሊያወጣን ችሎታ ያለው መሆኑን አትጠራጠሪ፡፡ እናት ሆይ ከዚህ ከሚያልፈው ዓለም ጭንቅና መከራ ለመዳን ስትይ በማያልፈው ዘላለማዊ እሳት ለመቀጣት ትመርጫለሽን ይኽስ አይሆንም ይቅርብሽ፡፡ በአሁኑ ጊዜ እግዚአብሔር በመካከላችን አለና ይረዳናል፡፡ እናት ሆይ ሶስናን ከእደ ረበናት /መምህደራነ አይሁድ/ ዳንኤልን ከአፈ አናብስት ያዳነ እርሱ እኛንም ከጋን ፍላት ያወጣናል፡፡ ይልቁንም እግዚአብሔር በዚህ የብረት ጋን ውስጥ ግዳጃችንን ልንፈጽም ፈቅዶ ከሆነ ኢዮብ ንብረቱንና ገንዘቡን ልጆቹንና ሚስቱን በመጨረሻም የተፈጥሮ አካሉን ባሳጣው ጊዜ እግዚአብሔርን አመሰግነዋለሁ እግዚአብሐር ሰጠ እግዚአብሔር ነሳ እግዚአብሔርም እንደወደደ አደረገ ከማለት በስተቀር ምንም የተናገረው ነገር እንደሌለ ሁሉ እኛም የሱን ዓላማ በመከተል ይኽንን መከራ ልንታገስ ይገባናል፡፡',
        'ነገር ግን እናቱ በዚህ ምክር ልትጽናና ባለመቻሏ ቅዱስ ቂርቆስ ዐይኑን ወደ ሰማይ አቅንቶ አቤቱ አምላክ ሆይ ይችን ባሪያህን ከርስትህ የምትለያት ከሆነ ከባለሟልነትህ መጽሐፍ ፋቀኝ፤ አቤቱ አዝመራውን አቃጥለህ ፍሬውን ልትባርክ ትወዳለህን ይኽን እንዳታደርግ ግን ቸርነትህ ትከለክልኸለች፡፡ አቤቱ እንጨቱን ቆርጣችሁ አንድዱት ቅጠሉን ግን ጠብቁት ብለኽ ልታዝ መለኮታዊ ባሕሪህ አይደለም፡፡ ነገር ግን እንጨቱንም ቅጠሉንም በአንድ ጠብቁት ብለኽ ታዝዛለኽ እንጂ፡፡ እንግዲህ በዚህ ምክንያት ይኽንን ያየ ሁሉ ማዳን የሚችል አምላክ ቢኖራቸውስ ኖሮ ከእሳት ባልሸሹም ነበር ብሎ አይጠራጠር፡፡ አቤቱ ዲያብሎስም ከባለስልጣኑ ይልቅ እኔ በረታሁ ቅዱሳኖቹንም ድል ነሳኋቸው ብሎ እንዳይመካ ከመንጋውም አንድ በግ ቀማው በማለት እንዳይደነፋ ለእናቴ ጽኑ የሆነ ኃይለ መንፈስ ቅዱስን ስጣት ብሎ በጸለየ ጊዜ ዲያብሎስ ከእየሉጣ አጠገብ ብን ብሎ ጠፋ፡፡',
        'ከዚህ በኋላ ቅድስት እናቱ በሰማያዊ መንግሥት አባት የሆንከኝ ልጄ ሆይ ጌታኽ ኃይልን ሰጥቶኛልና የሚጠብቀንን ገድላችንን ፈጽመን ድል እናድርግ እነሆ በብረት ጋን ውስጥ የሚነደውን እሳት በማይበት ጊዜ በለምለም /በምንጭ/ ላይ እንደሚወርድ ጠል ሆኖ አይቸዋለሁና አለችው፡፡ እኒኽም ቅዱሳን ይኽንን በሚነጋገሩበት ጊዜ በውስጡ አንገትን የሚቆለምም ልብንም የሚያቀልጥ ሆድን የሚሰነጥቅ ሥርን የሚበጣጥስ መሳሪያ ካለበት የብረት ጋን ውስጥ ጨመራቸው፡፡ ከዚህ በኋላ የመላእክት አለቃ ቅዱስ ገብርኤል ከሰማይ ወረደና የብረቱን ጋን እሳት አጠፋው፡፡ ከቅዱሳኑም አንዳቸውንም ሳያቃጥላቸው የብረቱ ጋር ማቃጠሉና መፍላቱ ጸጥ አለ፡፡ ወንድሞቻችን ሆይ እንግዲህ በጭንቃቸው ጊዜ ገድላቸውን እስኪፈጽሙ ድረስ ይህ መልአክ ከሰማእታትና ከጻድቃን ጐን እንደማይለይ እወቁ ለኃጥአንም ኃጢአታቸውን ይቅር ይላቸው ዘንድ ወደ እግዚአብሔር ይጸልይላቸዋል፡፡ እኛም የዚህ የሊቀ መላእክት ቅዱስ ገብርኤል በአሉን እያከበርን አማላጅና ወዳጅ እናድርገው፡፡ በዚህም በሚመጣውም ዓለም ሊረዳን ይችላልና፡፡',
        'ዳግመኛም መስፍኑ ሐሳቡ ሳይሳካለት ስለቀረ 14 የሾሉና የጋሉ የብረት ችንካሮች አምጥተው ሰባቱን በእናቱ በኢዮልጣ አካል ሰባቱን በራሱ በቂርቆስ አካል ማለት ሁለቱን በጆሮዎቹ ሁለቱን በዐይኖቹ ሁለቱን በአፍንጫዎቹ አንዱን በልቡ ይቸነክራቸው ዘንድ ጭፍሮቹን አዘዘ፡፡ ዳግመኛም የህፃኑን የእራስ ቆዳ ገፈው እሳት ውስጥ ይጨምሩ ዘንድ አዘዘ፡፡ አሁንም መልአኩ መጥቶ ይህንን መከራ ከእርሱ አራቀለት፡፡ ቀጥሎም በመቃን ውስጥ ጨምረው በገመድ እንዲገትቱት አዘዘ፡፡ በዚህም ጊዜ መልአኩ አዳነው፡፡ ሕዝቡም ይህንን ሁሉ ተአምር ባዩ ጊዜ እግዚአብሔርን አመሰግኑት ቅዱስ ገብርኤልንም አከበሩት፡፡',
        'ቅዱስ ቂርቆስና ቅድስት እየሉጣ ብዙ መከራ ከተቀበሉ በኋላ ጥር 15 በሰይፍ ተመትተው ስማትነትን ተቀብለዋል። የሊቀ መላእክት የቅዱስ ገብራኤል ፣ ቅዱስ ቂርቆስና የእናቱ የቅድስት እየሉጣ ተራዳኢነት ጸሎት አይለየን።',
        'ከዚህ በኋላ ሕፃኑን አስፈልገው ቢጠይቁት ነቢዩ ዳዊት የተናገረው ኃይለ ቃል መንፈስ ቅዱስ ተገልጾለት፤ ‹‹የአሕዛብ ጣዖታት የወርቅና የብር የሰው እጅ ሥራዎች ናቸው፡፡ የሚታመኑባቸውም ሁሉ እንደ እነርሱ ይሁኑ›› (መዝ. ፻፴3፡05)፡፡ በማለት ሲዘልፏቸው አገር ገዥው ሰምቶ ተቆጣና የብረት ጋን አስመጥቶ ውኃ ሞልቶ ከዕቶን እሳት ላይ ጥዶ ልዩ ልዩ ማገዶዎች በመጨመር ነበልባሉ ከመጠን በላይ ሆነ፡፡ የብረት ጋኑም ድምፅ እንደ ክረምት መብረቅና ነጎድጓድ እስኪያስፈራ ድረስ አስነድዶ ሕፃኑን ከነእናቱ ወስዳችሁ ጨምሩአቸው ብሎ አዘዘ፡፡ በዚህ ጊዜ ቅድስት ኢየሉጣ በጣም ፈራች፡፡ የእግዚአብሔር ሥራ እፁብ ድንቅ ግሩም ረቂቅ ነው፡፡ ገና አፉን ያልፈታ የሦስት ዓመት ሕፃን ‹‹እናቴ ሆይ! ገድላችን እንፈጽም ዘንድ ጨክኝ በርቺ›› አላት፡፡ ቅድስት ኢየሉጣም ‹‹ልጄ የነፍስ አባት ሁነኝ›› አለችው፡፡',
        'ሕፃኑ ቅዱስ ቂርቆስም ከዘመናቸው ሳይደርስ፣ ታሪካቸውን ሳይማር የሠለስቱ ደቂቅን ታሪክ መንፈስ ቅዱስ ገልጾለት ‹‹አናንያን፣ አዛርያንና ሚሳኤልን ያዳነ አምላክ ያድነናል›› ቢላት ፍርሃቱ ሊለቃት ባለመቻሉ፣ ወደ እግዚአብሔር እንዲህ ሲል ጸለየ፡፡ ‹‹ጌታ ሆይ! የወይኑን ፍሬ ስትሻ ግንዱን ታጠፋለህን? እንደዚህስ ሁሉ እኔን አድነህ እናቴን ታጠፋታለህን?›› ብሎ በጸለየ ጊዜ መንፈስ ቅዱስ አደረባትና መንግሥተ ሰማያትን በዓይነ ሥጋ እንድታይ አደረጋት፡፡',
        'ከዚህ በኋላ ፍርሃቱ ለቀቃትና ‹‹ልጄ ሆይ! ከዛሬ ጀምሮ መምህሬ፣ አባቴ፣ መካሪዬ እልሃለሁ እንጂ ልጄ አልልህም›› ብላ በጭካኔ ከልጅዋ ጋር ወደ ፈላው የብረት ጋን ገባችበት፡፡ በዚህ ጊዜ ሕፃኑ ቂርቆስ አናንያን፣ አዛርያንና ሚሳኤልን ያዳነ አምላክ ያድነናል ያለውን ቃል ለመፈጻም እግዚአብሔር አምላክ መልአኩ ቅዱስ ገብርኤልን ላከላቸው፡፡ መልአኩም በትእምርተ መስቀል እሳቱን ቢባርከው እንደ በረዶ ቀዝቅዞላቸዋል፡፡ በመልካቸውም እንደ ፀሐይ አበራ፡፡ ከእግር ጥፍራቸው እስከ ራስ ጠሩራቸው አንድም ሳይጎዳቸው በደህና ወጡ፡፡',
        'በመጨረሻም ሕፃኑ ሰማዕት ቅዱስ ቂርቆስ እንዲህ አለ፡፡ ይህን ያህል ገድል ተጋድዬ ምን ዋጋ ትሰጠኛለህ ቢለው፣ ጌታ በልብህ ያለውን ሁሉ እሰጥሃለሁ አለው፡፡ ዳግመኛም ሥጋህ በምድር ላይ እንዳይፈርስ እንዳይበሰብስ በኤልያስ ሠረገላ ላይ አኖርሃለሁ አለው፡፡ ስለሆነም በዚህ ዕለት ቤተክርስቲያናችን መልአኩ ቅዱስ ገብርኤል ለእናታችን ለቅድስት ኢየሉጣ እና ለሕፃኑ ለቅዱስ ቂርቆስ ያደረገውን ይህን ታላቅ ተአምር ድንቅ ሥራ በማሰብ ከዋዜማው ጀምራ እግዚአብሔርን ስታመሰግን ትውላለች ታድራለች፡፡ የመልአኩ የቅዱስ ገብርኤል በረከት ተራዳኢነት ከሁላችን ጋር ይኑር አሜን፡፡'
      ],
      blessingAm: 'የቅዱስ ገብርኤል፣ የቅዱስ ቂርቆስና የቅድስት እየሉጣ በረከትና ረድኤት አይለየን፣ አሜን።',
      blessingEn: 'May the blessing and protection of Saint Gabriel, Saint Cyriacus, and Saint Juliet be with us, Amen.'
    }
  },
  {
    id: 'abune-gebre-menfes-kidus',
    category: 'feast',
    nameEn: 'Feast of the Righteous Abune Gebre Menfes Kidus (Abo)',
    nameAm: 'የጻድቁ አቡነ ገብረ መንፈስ ቅዱስ በዓል',
    periodEn: 'Megabit 5 & Hamle 5 (March 14 & July 12)',
    periodAm: 'መጋቢት 5 እና ሐምሌ 5 ቀን',
    durationEn: 'High Feast',
    durationAm: 'ታላቅ በዓል',
    theologyEn: 'Abune Gebre Menfes Kidus (Abo) lived an angelic, deeply ascetic life of prayer for the salvation of humanity. Clothed only in his hair and accompanied by 60 lions and 60 leopards, he spent 100 years praying suspended upside down in Mount Zequala’s lake. He received a divine covenant (Kidane) from God promising mercy to those who commemorate him and for the entire nation of Ethiopia.',
    theologyAm: 'ጻድቁ አባታችን አቡነ ገብረ መንፈስ ቅዱስ (አቦ) ለመላእክት የሚተካከል ፍጹም መንፈሳዊ ተጋድሎ በማድረግ በጫካና በበረሃ የኖሩ አባት ናቸው። በዝቋላ ተራራ ባለው ባሕር ውስጥ ፩፻ (መቶ) ዓመታት ተዘቅዝቀው ስለ ኢትዮጵያና ስለ ሕዝቦቿ ምሕረትን የለመኑበትና ከእግዚአብሔር ዘንድ የማይፈርስ የቃል ኪዳን በረከትን የተቀበሉበት ታላቅ ክብረ በዓል ነው።',
    observanceEn: [
      'Commemorating the saint’s exceptional hagiography, wilderness prayers, and covenant.',
      'Pilgrimages to Mount Zequala (ዝቋላ) and Midre Kebd (ምድረ ከብድ) monasteries.',
      'Night-time vigils, Yaredic chanting (Mahlet), liturgy, and reading of the Saint’s hagiography (Gadle).',
      'Seeking the saint’s powerful intercession and the mercy promised in his covenant.'
    ],
    observanceAm: [
      'የጻድቁን አቡነ ገብረ መንፈስ ቅዱስን ፍጹም የቅድስና ሕይወት፣ ገድልና ድንቅ ተአምራትን መዘከር።',
      'በዝቋላ ገዳምና በምድረ ከብድ የተጋደሉትን ታላቅ ተጋድሎ በማሰብ ምእመናን ወደ ገዳማቱ መንፈሳዊ ጉዞ ያደርጋሉ።',
      'በቤተ ክርስቲያን የሚካሄድ የሌሊት ማኅሌት፣ የበዓል ኪዳን፣ ቅዳሴና የገድላቸውን ንባብ ማዳመጥ።',
      'እግዚአብሔር ለጻድቁ የገባለትን ታላቅ የኪዳን በረከት በማሰብ በጾምና በጸሎት መትጋት።'
    ],
    narrative: {
      titleAm: 'የጻድቁ አቡነ ገብረ መንፈስ ቅዱስ (አቦ) የተጋድሎና የቃል ኪዳን ታሪክ',
      titleEn: 'Hagiography and Covenant of the Righteous Abune Gebre Menfes Kidus',
      paragraphsAm: [
        'በምድረ በዳ እንደመላእክት የኖሩትና በዝቋላ ተራራ ባለው ባሕር ውስጥ ፻ (መቶ) ዓመት ተዘቅዝቀው ለኢትዮጵያ ሰዎች ምሕረትን የለመኑት አቡነ ገብረ መንፈስ ቅዱስ ቃል ኪዳን የተቀበሉበት ዕለት በሀገራችን ኢትዮጵያ በድምቀት ይከበራል፡፡',
        'አባታችን አቡነ ገብረ መንፈስ ቅዱስ ሀገራቸው ንሂሳ ግብጽ ነው፡፡ አባታቸው ስምዖን እናታቸው አቅሌስያ ይባላሉ፡፡ ልጅ አጥተው ፴ (ሠላሳ) ዘመን ሲያዝኑ ኖረዋል፡፡ አንድ ቀን አቅሌሲያ ቤተ እግዚአብሔር ገብታ ከሥዕለ ሥላሴ ሥር ወድቃ ስትማጸን ክብሩ ከሰማይ ከፍታ የሚበጥ ልጅ እንኪ ተቀበይ የሚል ድምጽ ሰማች፡፡ ‹‹ሥልጣኑ ከሰማይ ከፍታ ከፍ የሚል ንጽሕናው ከሚካኤል ከገብርኤል የሚተካከል ክህነቱ እንደ መልከጼዴቅ እንደ መጥምቁ ዮሐንስ እንደ ነቢይ ኤልያስ የሆነ ልጅ እንቺ ተቀበይ›› አላት፡፡ አቅሌስያም በመጋቢት ፳፱ ቀን ፀንሳ በታኅሣሥ ፳፱ ቀን ደም ግባቱ እጅግ የሚያምር ወንድ ልጅ እንደወለደች መልአኩ ቅዱስ ገብርኤል በሰው አምሳል መጥቶ ‹‹የዚህ ልጅሽ ስሙ ገብረ መንፈስ ቅዱስ ይሁን›› አላት፡፡ ወዲያውም ሕፃኑ ተነሥቶ ከእናቱ ጭን ወርዶ ለአብ ለወልድ ለመንፈስ ቅዱስ ሦስት ጊዜ ሰገደ፡፡ ዳግመኛም ‹‹ከጨለማ ወደ ብርሃን ለአወጣኸኝ ለአብ ለወልድ ለመንፈስ ቅዱስ ምስጋና ይሁን›› አለ፡፡',
        'ከዚህም በኋላ ጻድቁ አቡነ ገብረ መንፈስ ቅዱስ መጋቢት ፳፱ (ሃያ ዘጠኝ) ቀን ተፀንሰው ታኀሣሥ ፳፱ (ሃያ ዘጠኝ) ተወለዱ፡፡ አባታችን ዓይን በገለጹ ጊዜ ከሚታይ ነገር ላይ እንዲያርፍ እርሳቸውም በተወለዱ ጊዜ ተነሥተው «ስብሐት ለአብ ስብሐት ለወልድ ስብሐት ለመንፈስ ቅዱስ ዘዓውፃእከኒ እምጽልመት ውስተ ብረሃን» ብለው አመስግነዋል። ቅዱስ አባታችን ለአምላካቸው ሰግዶ አብ ወልድ መንፈስ ቅዱስ ካመሰገነ በኋላ እናታቸው አላቀፈቻችውም፤ ጡትም አልጠቡም፡፡',
        'ሦስት ዓመት ሲሞላቸው እግዚአብሔር አምላክ መልአኩ ቅዱስ ገብርኤልን እንዲህ ብሎ አዘዘው፡- ‹‹ሕፃኑን ከእናቱ ክንድ ተቀበል፣ ብዙ ገዳማውያን ወዳሉበት ገዳም ውሰድና ከበራቸው አስቀምጠው፤ አበ ምኔቱንም ሕፃኑን ከበር አንሥተህ ካንተ ዘንድ አኑረው፤ ስለ ልብሱ ስለ ምግቡ አታስብ፤ ሕፃኑ የመንፈስ ቅዱስ ማደሪያ ነውና ምግቡም መንፈሳዊ ነው፡፡ ይኸውም ከእግዚአብሔር የሚወጣ ቃል ነው፤ ሰው በእንጀራ ብቻ እንደማይኖር ዕወቅ በለው›› በማለት አዘዘው፡፡ ብርሃናዊው መልአክ የራማው ልዑል ቅዱስ ገብርኤልም እንደታዘዘው ከሰማይ ወርዶ ሕፃኑን ከእናቱ ክንድ ወስዶ በክንፎቹ አቅፎ ስሞ እስከ ሰባቱ ሰማይ አውጥቶ በሥሉቅ ቅዱስ ፊት አቅርቦት አስባረከው፡፡ እግዚአብሔርም መልአኩን ‹‹ወደ እናቴ ወደ ማርያም ውሰደውና ትባርከው›› አለውና ወስዶት እመቤታችንም ባረከችው፡፡',
        'ዳግመኛም ከአዳም ጀምሮ ሄሮድስ በግፍ እስካስፈጃቸው ሕፃናት ያሉት ሁሉም ቅዱሳን ነቢያት፣ ሐዋርያት፣ ጻድቃን፣ ሰማዕታት፣ ደናግልና መነኮሳት ሁሉም እንዲባርኩት አደረገው መልሶ ከእግዚአብሔር ፊት አቆመው፡፡ መድኅን ጌታም ሕፃን ገብረ መንፈስ ቅዱስን ‹‹በመንግሥቴ ከእኔ ጋር ትነግሣለህና ደስ ይበልህ፣ በርታ የሚደርስብህን ሁሉ ታገሥ ብዙ ነፍሳት በአንተ ምክንያት ይድናሉ፤ ሰላሜ ከአንተ ጋር ይሆናል›› አለው፡፡ ከዚህም በኋላ መልአኩ አባ ዘመደ ብርሃን ወዳለበት ገዳም አወረደውና ሕፃኑን ከበር ላይ አስቀምጦ እርሱ ወደ ውስጥ ገብቶ እግዚአብሔር እንዳዘዘው ሁሉን ነገረው፡፡ አባ ዘመደ ብርሃንም ሕፃኑን አስገብቶ በእንክብካቤ የቤተ ክርስቲያንን ትምህርት ሁሉ እያስተማረ አሳደገው፡፡ ሕፃኑም ትምህርቱን በጨረሰ ጊዜ ዲቁና ተቀብሎ እንደ ቅዱስ እስጢፋኖስ ጸጋንና ሞገስን የተመላ ሆነ፡፡ ፍጹም የእግዚአብሔር ጸጋ አድሮበታልና ሥራው ሁሉ በዕውቀት የተመላና የተቃና ሆነ፡፡ አባ ዘመድ ብርሃንም በሕፃኑ ላይ ያደረበትን ጸጋ እያየ እጅግ ደስ ይለው ስለነበር እንደ ቅዱስ እንጦንስ አስኬማን ሰጠው፡፡ ከዚህም በኋላ ገብረ መንፈስ ቅዱስ ቅስናን ተቀበሉና በጾም በጸሎት ተጠምደው በታላቅ ተጋድሎ መኖር ጀመሩ፡፡ እንደ ሐዋርያትም የተአምራትና የፈውስ ሀብት ተሰጣቸውና ድውያንን የሚፈውሱ፣ ሙታንን የሚያነሡ፣ አጋንንትን የሚያወጡ ሆኑ፡፡',
        'መልአኩ ቅዱስ ገብርኤል ዳግመኛ ተገልጦላቸው ወደ ሰማይ አሳረጋቸውና ከእግዚአብሔር ፊት አቆማቸው፡፡ ያን ጊዜም ጌታችን ክቡራን የሆኑ እጆቹን ዘርግቶ ከባረካቸው በኋላ ‹‹በጸሎትህ ከሲኦል የምታወጣቸው ብዙ ነፍሳት አሉ፤ ድውያንንም ትፈውሳለህ፤ ከእንግዲህ ወዲህ ከሰው ተለይተህ ወደ ጫካ ገብተህ ከአንበሶችና ከነብሮች ጋር ኑር›› አላቸው፡፡ አባታችንም ጌታችንን ‹‹የሰጠኸኝ እነዚህ አንበሶችና ነብሮች ምን ይመገባሉ?›› አሉት፡፡ ጌታችንም ‹‹የረገጥከውን መሬት ይልሳሉ በዚያም ይጠግባሉ፡፡ ወደ እኔም እስክትመጣ ድረስ ይኸው ምግብ ይሆናቸዋል›› አላቸው፡፡ ቅዱሳን መላእክትም ይህንን በሰሙ ጊዜ ደስ አላቸው፡፡ ጌታችንም መልአኩን ወደ ቀደመ ቦታቸው ይመልሳቸው ዘንድ አዘዘው፡፡ ከዚህ በኋላ አቡነ ገብረ መንፈስ ቅዱስ ከራሳቸው እስከ እግራቸው ድረስ ጠጉር በቀለላቸው፡፡ የጠጉራቸውም ርዝመቱ አንድ ክንድ ከስንዝር ነው፡፡ አባታችንም በታላቅ ተጋድሎ ሲኖሩ በጸጋ ላይ ጸጋ ተጨመረላቸው፡፡ ከዕለታት በአንደዋ ቀን የፈወሳቸው ሕሙማን ብዛታቸው እልፍ ሆነ፡፡ የሀገሩ ሰዎችም ሥራቸውን ስላወቁባቸው አዘኑ፡፡ ‹‹ውዳሴ ከንቱ እንዳይሆንብኝ ተነሥቼ ሰው ወደማያውቀኝ አገር እሄዳለሁ›› ብለው ተነሥተው ሄዱ፡፡ ሕዝቡም አባታችን እንደተሰወሩ ባወቁ ጊዜ በኀዘን አለቀሱ፡፡',
        'ከዚህም በኋላ አባታችን ወደ ጫካ ገብተው ብቻቸውን የበጋውን ሐሩር የክረምቱን ቁር ታግሠው ምንም ልብስ ሳይለብሱ ራቁታቸውን ሆነው በተጋድሎ ኖሩ፡፡ ከጽኑው ተጋድሎአቸውና ከጫካው ቅዝቃዜ የተነሣ ሰውነታቸው አልቆ ከአጥንታቸው ጋር ተጣበቀ፡፡ ፍራፍሬም ሆነ ምንም ነገር አይመገቡም፤ ውኃም ፈጽሞ አይጠጡም ነበር፡፡ አባታችን በምድረ በዳ እንደሰው ሳይሆን እንደመላእክት ኖሩ፡፡ ቅዱሳን መልእክትም ዘወትር ይጎበኟቸው ነበር፤ ስለምግባቸውም ሰማያዊ ኅብስት አምጥተው ይሰጧቸዋል፡፡ ነገር ግን አባታችን ያንን ኅብስት አይመገቡትም፤ ይልቁንም ጽዋውን ባሸቱት ጊዜ እንዲሁ ይጠግባሉ፤ ይረካሉ፡፡',
        'አባታችን በተወለዱበትም ቤት አልኖሩምና እናት አባታቸው የሥጋ ዘመዶቻቸውም አላወቋቸውም፡፡ በበረሃ ብቻቸውን ኖሩ እንጂ፡፡ ነገር ግን ሰማያውያን ሁሉ ወዳጆቻቸው ሆኑ፤ እመቤታችን ወዳጄ ትላቸዋለች፡፡ ነቢያት፣ ሐዋርያት፣ ወገናችን ይሏቸዋል፡፡ መላእክትም ወዳጃችን እያሉ በክንፋቸው ያቅፏቸዋል፡፡ የአባታችን መዓዛቸው ጫካውን ይሞላው ነበር፡፡ በመንፈስ ቅዱስም ኃይል ወደፈለጉት ቦታ በፍጥነት እንደወፍ ይበራሉ፡፡ ስለተሰጣቸውም ጸጋ የበረሃ እንስሳት (አንበሳና ነብር) ሁሉ ያገለግሏቸዋል፡፡ አባታችን ሁልጊዜ እንዲህ ይሉ ነበር፡- ‹‹የሚጣፍጥ ምግብን መውደድ ኃጢአትን ያመጣል፣ ሞትን ያስከትላል፡፡ ክንፍ ያላቸው የሰማይ ወፎች እንኳን በመብል ምክንያት ይጠመዳሉ፣ ምግብ በመሻት ከምድር ላይ ይወድቃሉ በወጥመድም ይያዛሉ፡፡ የሰው ልጅም ምግብን በመውደድ በኃጢአት ይወድቃልና እኔስ ለሰውነቴ ምግብ መጠጥን አልፈልግም፤ ልብስም አልሻም ዕራቁቴን ከእናቴ ማኅፀን እንደወጣሁ እንዲሁ ዕረቁቴን ወደ መቃብር እመለሳለሁ እንጂ፡፡›› አባታችን ራሳቸውን ለሞት አሳልፈው ይሰጡ ነበር ነገር ግን አራዊቱ ሁሉ እየሰገዱላቸው ይገዙላቸው ከእግራቸውም በታች ይተኙ ነበር።',
        'በአንደኛው ዕለት አባታችን ጸሎታቸውን እንደጨረሱ ሰማይ ተከፍቶ የእሳት ድንኳን ተገልጦ አርባእቱ እንስሳ የእግዚአብሔርን ዙፋን ተሸክመው ፳፬ቱ ካህናተ ሰማይ ማዕጠንት ይዘው፣ ቅዱሳን መላእክትና አለቆቻቸው በየነገዳቸው በዙሪያው ቆመው ጌታችን ለአቡነ ገብረ መንፈስ ቅዱስ በአንድነት በሦስትነት እንዳለ ተገለጠላቸው፡፡ አባታችንም ይህንን ባዩ ጊዜ እጅግ ፈርተውና ደንግጠው መሬት ላይ ወደቁ፡፡ ጌታችንም ካጸናቸውና ካበረታቸው በኋላ ‹‹ሰማንያ ዓመት በጫካ ኖርክ፤ በረሃዎችን ዞርክ፤ ከአንበሶችና ነብሮች ከአራዊትም ጋር መኖርን አልፈራህም፤ ጨክነህ እስከ ሞት ድረስ ታገሥህ፡፡ የመረጥኩህ ወዳጄ ገብረ መንፈስ ቅዱስ ሆይ! ምን አደርግልህ ዘንድ ትወዳለህ?›› አላቸው፡፡ አባታችንም ይህንን ቃል ከጌታችን ሲሰሙ ‹‹አምላኬ ሆይ ይህን ልታደርግልኝ አይገባኝም፡፡ በፊትህስ ሞገስን ካገኘሁ የገቦታን ሰዎች ማርልኝ፤ እነርሱ ኃጥአን ናቸውና አንተ ንስሓን ለማይሹ ጻድቃን አልመጣህምና ኃጥአንን ወደ ንስሓ ልትመልስ ነው እንጂ›› አሉት፡፡ ጌታችንም ‹‹ወዳጄ ሆይ የለመንከኝን አልከለክልህም፣ እንደቸርነቴም ስምህን የጠሩትን መታሰቢያህን ያደረጉትን ኃጥአንን ምሬልሃለሁ፤ የለመንከኝንም ሁሉ አደርግልህ ዘንድ ቃል ኪዳንን ሰጥቼሃለሁ›› አላቸው፡፡',
        'አባታችን ይህንን ቃልኪዳን ሲቀበሉ ዕድሜአቸው ፫፻ (ሦስት መቶ) ዓመት ነበር፡፡ ጌታችንም የመላእክት አለቆችን ‹‹ስለ ወዳጄ ገብረ መንፈስ ቅዱስ ምልጃ ወደ ገሃነም ሂዱና የኃጥአንን ነፍስ አውጡ፤ ከእስራታቸውም ፍቱአቸው›› አላቸውና እነርሱም የገቦታ ሰዎችን ሦስት ሺህ ነፍሳት ከደይን አውጥተው ወደ ገነት አገቧቸው፡፡ ዳግመኛም እግዚአብሔር አቡነ ገብረ መንፈስ ቅዱስን ‹‹ወደ ኢትዮጵያ ሂድ፤ በዚያም ከደይን የምታወጣቸው ነፍሳት አሉ›› አላቸው፡፡ አባታችንም ‹‹አምላኬ ሆይ ወደዚያች አገር ማን ያደርሰኛል?›› አሉት፡፡ እግዚአብሔርም ‹‹እኔ በሥልጣኔ አደርስሃለሁ›› ካላቸው በኋላ ከእርሳቸው ተሰወረ፡፡',
        'አባታችንም የገቦታ ሰዎች ምሕረትን ሲያገኙ አይተው እጅግ ተደሰቱ፡፡ በሌላም ጊዜ አባታችን አራት ሺህ እልፍ እየሰገዱ፣ ፫፻ (ሦስት መቶ) ጊዜ የቀኝ ፫፻ (ሦስት መቶ) ጊዜ ደግሞ የግራ ፊታቸውን በድንጋይ እየመቱ፣ መዝሙረ ዳዊትን እየደገሙ ለኃጥአን ምሕረትን ሲለምኑ ዕንባቸው እንደ ውኃ ይፈስ ነበር፡፡ ጌታችንም ‹‹በተወለድሁባት፣ በተጠመቅሁባትና ከሞት በተነሣሁባት ዕለት እልፍ እልፍ ነፍሳትን እምርልሃለሁ›› አላቸው፡፡ ከዚህም በኋላ አባታችን ስድሳ አንበሶችና ስድሳ ነብሮች እየተከተሏቸው ወደ ሀገራችን ኢትዮጵያ መጡ፡፡ ብርሃናዊው መልአክ ቅዱስ ገብርኤልም ከእነዚሁ ተከታዮቻቸው ጋር በነፋስ ሠረገላ ጭኖ ምድረ ከብድ አደረሳቸው፡፡',
        'ዳግመኛም ‹‹ደብር ቅዱስ›› ወደሚባለው ወደ ዝቋላ ወሰዳቸው፡፡ አባታችንም የኢትዮጵያን ሰዎች ኃጢአታቸውን በግልጽ በተመለከቱ ጊዜ ተወርውረው ወደ ባሕሩ በመግባት ተዘቅዝቀው መጸለይ ጀመሩ፡፡ ‹‹ከባሕር እንዳልወጣ፣ በእግሬም እንዳልቆም በሕያው ስምህ ምያለሁ›› ብለው ዐርባ መዓልት ዐርባ ሌሊት ቆዩ፡፡ አባታችን በዚያ ባሕር ውስጥ መቶ ዓመት ተዘቅዝቀው ሲጸልዩ ኖሩ፡፡ አባታችንም በባሕሩ ውስጥ ተዘቅዝቀው መቶ ዓመት ሲጸልዩ ከኖሩ በኋላ ደማቸው ፈሶ አለቀና ውኃው ደም መሰለ፡፡ ሥጋቸውም አልቆ አጥንቶቻው እንደበረዶ ሆኑ፡፡ ሰባት ሺህ እልፍ ሦስት መቶ የሚሆኑ አጋንንትም ከአራቱም አቅጣጫ እየመጡ ሰውነታቸውን በፍላፃዎቻቸው ይወጓቸው ነበር፡፡ ጌታችን መጥቶ ከባሕሩ ዳር በመቆም ‹‹ወዳጄ ገብረ መንፈስ ቅዱስ ሆይ! መላ ኢትዮጵያን ምሬልሃለሁና ተነሥ ከባሕሩ ውጣ›› አላቸው፡፡ ጌታችን በክቡራን እጆቹ ሁለንተናቸውን ቢዳስሳቸው እንደቀድሞው ደህና ሆኑ፡፡',
        'አቡነ ገብረ መንፈስ ቅዱስ ምድረ ከብድ እንደደረሱ እንደ ዓምድ ተተክለው ሰባት ዓመት ቆመው ጸለዩ፡፡ በዚህም ጊዜ ሰይጣን በቁራ ተመስሎ መጥቶ ሁለት ዐይኖቻቸውን አንቁሮ አጠፋቸው ነገር ግን አባታችን ጸሎታቸውን ሳያቋርጡ ሁለት ሳምንት በጸሎት ቆዩ፡፡ ከሁለት ሳምንት በኋላ ቅዱስ ሚካኤልና ቅዱስ ገብርኤል መጥተው በዐይኖቻቸው ላይ እፍ ብለው ብርሃናቸውን ከመለሱላቸው በኋላ አባታችንን ‹‹ከሰማይ ፍጹም ኃይል ይሰጥሃልና ጠላቶችህን ትበቀል ዘንድ ወደ ዝቋላ ሂድ›› ብለዋቸው ዐረጉ፡፡ አቡነ ገብረ መንፈስ ቅዱስም እንደታዘዙት ወደ ዝቋላ እየሄዱ ሳለ በመንገድ ላይ ሦስት ሽማግሌዎችን አገኙ፡፡ ሦስቱንም በየተራ እያዘሉ ከአንድ ምዕራፍ አደረሷቸው፡፡ ሦስቱም ሰዎች ለአባታችን በአንድነት በሦስትነት ተገለጡላቸው። የእግዚአብሔርንም ክብር ስላዩ አባታችን ፊታቸው እንደፀሐይ አበራ።',
        'ከዚህ በኋላ ጌታችን አባታችንን ቀሰቀሳቸውና ‹‹ወደ ዝቋላ ውረድ መቶ ዓመት ሙሉ አጥንትህን ሥጋህን እየነደፉ የተዋጉህን አጋንንት ታጠፋቸው ዘንድ›› አላቸው፡፡ ያንጊዜም አባታችን በመብረቅ ላይ ሆነው እነዚያ አጋንንት ወዳሉበት ወረዱ፡፡ አጋንንቱንም ደመናት ከበቡአቸው፣ መላእክትም በእሳት ሰይፍ መተሩአቸው፣ በመብረቅ አጨዷቸው፤ አመድ ሆነው በነፋስ በተኗቸው፡፡ የእነዚያም አጋንንት ቁጥራቸው ሰባ ሺህ እልፍ ከአንድ ሺህ ነበር፡፡ አባታችንም አንበሶችና ነብሮች፣ ድብና ዘንዶ ወዳሉበት ምድረ ከብድ ተመለሱ፡፡',
        'አባታችንም ወደ ምድረ ከብድ ከተመለሱ በኋላ መንፈስ ቅዱስ የጠራቸው ሦስት ቅዱሳን የዋልድባው አቡነ ሳሙኤል፣ የአዘሎው አቡነ አንበስ እና ከላዕላይ ግብፅ ተነሥቶ የመጣው አቡነ ብንያም በየአንበሶቻቸው ላይ ተቀምጠው መጡ። የአባታችን የሚያስፈሩ አንበሶች ወጥተው የቅዱሳኑን አንበሶቻቸውን ገድለው በሉ፡፡ አባታችንም አንበሶቻቸውን ‹‹የበላችሁትን ትፉ›› አሏቸው፡፡ እነዚያም አንበሶች የበሉትን የአንበሶቹን ሥጋቸውን አጥንታቸውን ከደም ጋር ተፉ፤ በሆዳቸውም የቀረ የለም፡፡ አባታችንም በጸሎትና በመስቀል ምልክት ባርከው ከሞት አስነሧቸው፡፡',
        'ከዚህም በኋላ ለአባታችን ጌታችን ተገልጦ ብዙ ምሥጢራትን ከነገራቸው በኋላ ወደ አረማውያን አገር ሄደው እንዲያስተምሩ ነገራቸው፡፡ አባታችንም ወደ ዐረብ አገራት ሄዱ፡፡ የዐረብ ንጉሥም በጣም ተቆጥቶ በእቶን እሳት ውስጥ ጨመራቸው፡፡ ነገር ግን እሳቱ እንደ ወንዝ ውኃ ሆነ፡፡ የንጉሡም ሠራዊት ይህንን ከመለከቱ በኋላ ግማሾቹ አመኑ, ንጉሡም ሰይፉን መዝዞ የአባታችንን ራስ ሊቆርጥ ሲሄድ ጽኑ የመብረቅ ነጎድጓድ ሆኖ ንጉሡንና ሠራዊቶቹን ሁሉ አጠፋቸው፡፡ አባታችንም በገደል እግራቸውን በገመድ አሥረው ቁልቁል ተዘቅዝቀው በጥርስ ድንጋይ ነክሰው እስከ ፴ ዓመት ተዘቅዝቀው ስለነዚያ ሙታን ሲጸልዩ ኖሩ፡፡ ከ፴ ዓመትም በኋላ ጌታችን ሰባቱን ሊቃነ መላአክትና እናቱን ቅድስት ድንግል ማርያን አስከትሎ መጥቶ ‹‹እነዚያን ከሐዲዎች ምሬልሃለሁ›› አላቸው፡፡ አባታችንም ሙታኑን ሁሉ ከሞት አስነሥተው አጥምቀው ክርስቲያን አደረጓቸው፡፡',
        'አባታችን ጻድቁ አቡነ ገብረ መንፈስ ቅዱስ በኢትዮጵያ ፪፻፷፪ (ሁለት መቶ ስድሳ ሁለት) ዓመት ኖረው በ፭፻፷፪ (አምስት መቶ ስድሳ ሁለት) ዓመታቸው በተስፋቸው ያመነውን በኪዳናቸው የተማጸነ ጌታ ከመከራ ሥጋ ከመከራ ነፍስ ሊምርላቸው ተስፋቸውን ተቀብለው በዕለተ እሑድ ዐርፈዋል፡፡ መላእክት በአክናፈ እሳት ኢየሩሳሌም ወስደው በየማነ ምስዋዕ ቀብረዋቸዋል፡፡'
      ],
      paragraphsEn: [
        'The feast of Abune Gebre Menfes Kidus, who lived like the angels in the wilderness and prayed suspended upside down for 100 years in Mount Zequala’s lake to plead for mercy for the people of Ethiopia, is celebrated with great devotion across the nation.',
        'Our father Abune Gebre Menfes Kidus was born in Nehisa, Egypt, to devout parents Simon and Aqlesya. Having been childless for 30 years, Aqlesya prayed before the icon of the Holy Trinity and was promised a son of transcendent purity and glory. Conceived on Megabit 29 and born on Tahsas 29, the Archangel Gabriel named him. Upon birth, the child stood up and bowed three times, praising God for bringing him from darkness into light.',
        'From his infancy, the saint refused to nurse in a worldly manner. When he reached three years of age, God commanded Archangel Gabriel to place him at the gate of a monastery, telling the Abbot that the child’s food would be purely spiritual—the word of God. The Archangel carried him to the seventh heaven to be blessed by the Holy Trinity and then by the Virgin Mary.',
        'He was blessed by all the prophets, apostles, and martyrs since Adam. God promised him that many souls would be saved through him. He was raised and taught by Abbot Abba Zemedebirhan, ordained a deacon, and later clothed in the monastic habit (Askema) of St. Anthony. Eventually, he became a priest, living a life of intense fasting, prayer, healing the sick, and raising the dead.',
        'Archangel Gabriel ascended him to heaven again, where our Lord commanded him to depart human society and live in the wilderness accompanied by wild lions and leopards. The Lord promised that the beasts would lick the dust of his footsteps to be satisfied. Following this, long hair grew all over his body, measuring a cubit and a span, and he departed to the deepest deserts to avoid vain glory.',
        'In the forest, he endured extreme summer heat and winter cold, completely naked except for his thick hair. He consumed no earthly food, fruits, or water, living like an angel. Holy angels visited him and offered him heavenly bread, but he was fully sustained merely by inhaling the fragrance of the spiritual chalice.',
        'He lived completely separate from his biological family but was embraced by the heavenly hosts. The Virgin Mary called him her friend, and angels wrapped him in their wings. By the Holy Spirit, he could fly like a bird. He preached that the love of food brings sin and death, choosing to completely surrender his body, yet the wild beasts bowed before him and slept at his feet.',
        'One day, the Lord revealed Himself in Trinity, surrounded by the heavenly hosts. The Lord offered the Saint any request he desired. Our father asked for the salvation of the sinners of Gebota. The Lord agreed, promising: ‘I have forgiven those who call upon your name or commemorate you, and I establish My covenant of mercy with you.’',
        'The Saint was 300 years old when he received this covenant. In response to his intercession, three thousand souls from Gebota were delivered from Hades. The Lord then commanded him: ‘Now, depart to the land of Ethiopia, for there are many souls there to be delivered from Sheol through your prayers.’',
        'The Saint performed intense prostrations and prayers, weeping for sinners, and the Lord promised to forgive thousands on the days of His Birth, Baptism, and Resurrection for his sake. Cloned with 60 lions and 60 leopards, the Archangel Gabriel transported him and his beasts on a chariot of wind to Ethiopia, landing at Midre Kebd.',
        'He was then taken to the lake of Mount Zequala. Seeing the sins of the people of Ethiopia, he threw himself into the lake and began praying suspended upside down, swearing by God that he would not leave until the entire nation was forgiven. He stayed there praying upside down for 100 years. His blood drained, his flesh dissolved, and his bones shone like snow, while legions of demons attacked him.',
        'Finally, our Lord stood by the lake and said: ‘My beloved, I have forgiven the entire nation of Ethiopia for your sake! Arise and come out.’ When he emerged, the Lord touched his weakened body and restored it to perfect health. He then went to Midre Kebd, standing like a pillar praying for seven years, during which Satan took the form of a raven and blinded him, but the Archangels Michael and Gabriel restored his sight.',
        'On his way back to Zequala, he carried three weary elderly travelers on his back, who then revealed themselves to be the Holy Trinity, just as they had appeared to Abraham at Mamre. The Holy Trinity blessed him, and his face shone like the sun.',
        'The Lord then instructed him to go down to Zequala and destroy the legions of demons. Riding upon lightnings and assisted by the seven archangels, the Saint vanquished 70,000 legions of demons, scattering them like ashes in the wind, before returning to Midre Kebd.',
        'At Midre Kebd, three great saints—Abune Samuel of Waldiba, Abune Anbes of Azelo, and Abune Benjamin of Upper Egypt—visited him on their lions. The Saint’s lions killed and ate the visitors’ lions. Our father commanded his lions to vomit the remains, and he raised the visiting lions back to life by the sign of the cross and his prayers.',
        'Later, our Lord instructed him to preach in Arab lands. The pagan king, infuriated by his preaching, threw him into a blazing furnace, but the flames turned cool like river water. When the king rushed to execute the Saint, lightning struck, destroying the king and his army. Out of compassion, the Saint suspended himself upside down over a cliff for 30 years to pray for them, until the Lord returned with Saint Mary and forgave them. The Saint then raised the dead army back to life and baptized them.',
        'The righteous father Abune Gebre Menfes Kidus lived for 262 years in Ethiopia, and departed peacefully on a Sunday at the age of 562, having received the final covenant of mercy from the Lord. Angels of fire carried his holy body to Jerusalem, where he was laid to rest on the right side of the altar.'
      ],
      blessingAm: 'የጻድቁ የአቡነ ገብረ መንፈስ ቅዱስ በረከትና አማላጅነት አይለየን፣ አሜን።',
      blessingEn: 'May the blessing, intercession, and covenant of the righteous father Abune Gebre Menfes Kidus be with us, Amen.'
    }
  },
  {
    id: 'kidane-mihret',
    category: 'feast',
    nameEn: 'Feast of Kidane Mihret (Covenant of Mercy)',
    nameAm: 'ኪዳነ ምሕረት (የምሕረት ቃል ኪዳን)',
    periodEn: 'Yekatit 16 (February 23)',
    periodAm: 'የካቲት ፲፮ ቀን',
    durationEn: 'High Feast',
    durationAm: 'ታላቅ በዓል',
    theologyEn: 'Kidane Mihret refers to the "Covenant of Mercy" that our Lord Jesus Christ granted to His mother, the Virgin Mary. This is the ultimate fulfillment of all divine covenants (with Adam, Noah, Abraham, and David). It promises eternal salvation and forgiveness to all who seek her powerful intercession, commemorate her, do deeds of charity in her name, or give cold water to the thirsty in faith.',
    theologyAm: 'ኪዳነ ምሕረት ማለት የምሕረት ቃል ኪዳን ማለት ነው። ይህ በዓል ጌታችን መድኃኒታችን ኢየሱስ ክርስቶስ ለእናቱ ለቅድስት ድንግል ማርያም በእሷ ስም ለሚማጸኑ፣ ለሚዘክሩና ለሚራሩ ዘላለማዊ የምሕረትና የይቅርታ ቃል ኪዳን የገባበትን ዕለት ለማሰብ በየዓመቱ የካቲት ፲፮ ቀን በታላቅ በረከትና በድምቀት ይከበራል።',
    observanceEn: [
      'Special liturgies, beautiful hymns (Mahlet), and Divine Liturgy dedicated to the Covenant of Mercy.',
      'Commemorating the covenant as the crown and completion of all historic covenants (Adam, Noah, Abraham, David).',
      'Acts of charity, specifically giving food, offering cold water to the thirsty, and helping the needy in the Virgin Mary’s name.',
      'Seeking the Virgin Mary\'s swift, powerful intercession (Aftanite Red\'iet) in times of tribulation and sickness.'
    ],
    observanceAm: [
      'የምሕረት ቃል ኪዳኑን በማሰብ በቅዳሴ፣ በየማኅሌትና በዝማሬ እግዚአብሔርንና እመቤታችንን ማመስገን።',
      'ይህ በዓል ቀድሞ ለነበሩት ኪዳናት (ኪዳነ አዳም፣ ኪዳነ ኖህ፣ ኪዳነ አብርሃም፣ ኪዳነ ዳዊት) መደምደሚያ መሆኑን መዘከር።',
      'በእመቤታችን ስም ለተቸገሩት መመጽወት፣ ቀዝቃዛ ውኃ ማጠጣትና የበረከት ሥራዎችን መሥራት።',
      'በችግርና በመከራ ጊዜ ከዓይን ጥቅሻ ፈጥና የምትደርሰውን የእመቤታችንን አማላጅነትና ረድኤት (አፍጣኒተ ረድኤት) መለመን።'
    ],
    narrative: {
      titleAm: 'የቅድስት ድንግል ማርያም የኪዳነ ምሕረት ቃል ኪዳንና የበላዔ ሰብእ ታሪክ',
      titleEn: 'The Covenant of Mercy of the Holy Virgin Mary and the Story of Bela\'e Seb\'e (Simeon)',
      paragraphsAm: [
        'ኪዳነ ምህረት ማለት የምህረት ቃል ኪዳን ማለት ነው፡፡ ይህም ፍጹም ከከበሩ የእመቤታችን በዓላት አንዱ ከልጇ ከወዳጇ ከኢየሱስ ክርስቶስ ዘንድ የማይጠፋ የዘላለም ኪዳን የሰጠበት ዕለት መታሰቢያ ነው፡፡ ታላቁ የነገረ ማርያም መጽሐፍ እንደሚያስረዳን ጌታችን ካረገ በኋላ እመቤታችን ጌታ ወደ ተቀበረበት ጎልጎታ እየሄደች ትጸልይ ነበር:: ከዕለታት ባንዳቸው በየካቲት ፲፮ ዕለት ከወትሮው ለየት ባለ መልኩ “ልጄ ወዳጄ ሆይ ከሥጋዬ ሥጋ ከነፍሴ ነፍስ ነሥተህ ሰው በመሆንህ ዘጠኝ ወር ከአምስት ቀን በቻለችህ ማኅፀኔ ከአንተ ጋር ሀገር ለሀገር ስለመሰደዴ መጥተህ ልመናዬን ትሰማኝ ዘንድ እለምንሃለሁ” እያለች ስትጸልይ ጌታችንም ምን እንዲያደርግላት ሲጠይቃት በስሟ ለሚማጸኑ መታሰቢያዋን ለሚያደርጉ ለችግረኛ ለሚራሩ በስሟ ቤተ ክርስቲያን ለሚያንጹ ዕጣን ዘይትና መብአ ለቤተ ክርስቲያን ለሚሰጡ ምሕረትን እንዲያደርግላቸው ጠየቀችው፡፡ ጌታችን መድኃኒታችን ኢየሱስ ክርስቶስም “መሐልኩ ለኪ በርእስየ ወበአቡየ ወበመንፈስ ቅዱስ ሕያው” ብሎ በየካቲት ፲፮ እለት ቃል ኪዳን ገብቶላታል::',
        'ይህ በታላቅ ድምቀት የሚከበረው የኪዳነ ምህረት በዓል ቀድሞ ለነበሩ ኪዳናት ኪዳነ አዳም፣ ኪዳነ ኖህ፣ ኪዳነ አብርሃም፣ ኪዳነ ዳዊት፣ መደምደሚያ ነው፡፡ ለዚህም የማያልፍ የምህረት ቃል ኪዳንን ስለገባላት ኪዳነ ምሕረት የምሕረት የይቅርታ መሐላ ውል ስምምነት እየታሰበ በመዝሙር፣ በማኅሌትና በቅዳሴ ይከበራል፡፡ ምዕመናንም በዚሁ ዕለት በረከትን ከእመቤታችን ከቅድስት ድንግል ማርያም ይቀበላሉ፡፡ በስንክሳር እንደተጻፈው “መታሰቢያዋን ለሚያደርግ ስሟን ለሚጠራ ለድሆችና ለችግረኞች ቀዝቃዛ ውኃ ለሚሰጥ የክብር ባለቤት ከሆነ ከተወደደ ልጅዋ ከጌታችን ከአምላካችንና ከመድኃኒታችን ኢየሱስ ክርስቶስ የምሕረት ቃል ኪዳንን ተቀብላላች::”',
        '“ስምሽን የጠራ” ሲል በጸሎቱ በእርሷ የተደረገለትን የአምላክ ቸርነት እያሰበ ዘወትርና እስከ ሕይወቱ ፍጻሜ በእምነት ጸንቶ በጎ ምግባርን እየፈጸመ ስሟን የሚጠራ ይድናል ማለቱ ነው። “ዝክርሽንም ያዘከረ” ሲል በእርሷ የተደረገለትን ድኅነት እያሰበ፣ በስሟ ለተቸገረ የሚመጸውት የዘላለም ሕይወትን ያገኛል ሲል ነው። “በስምሽ ቤተክርስቲያን ያሠራ” የሚለው ሀረግ የምዕመናንን ኅብረት በእምነት ያጸና፣ ቅዱስ ሥጋውና ክቡር ደሙ የሚፈተትበትን ቤተ እግዚአብሔር ያሳነጸ፣ የእግዚአብሔር ቤተመቅደስ የሆነውን የሰውን ልጅ የተዋሕዶን ትምህርት አስተምሮ ያሳመነና ያጠመቀ ድኅነትን ያገኛል ማለቱ ነው።',
        'የእመቤታችን የቅድስት ድንግል ማርያም የምህረት ቃል ኪዳን የሚያገለግለው በሃይማኖታቸው ጸንተው በመልካም በቅድስና ሥራ በመትጋት ለሚደከሙ ለኃጥአን ነው:: በተአምረ ማርያም ከተመዘገቡትና የእመቤታችንን አማላጅነት ከሚያሳዩት ታሪኮች አንዱ የስምዖን (የበላዔ ሰብእ) ታሪክ ነው:: በላዔ ሰብእ አስቀድሞ ቅምር በምትባል ሀገር በአብርሃማዊ ኑሮ የሚኖር ደግ ሰው ነበር:: በላዔ ሰብእ የቀናው ዲያብሎስም በቅድስት ሥላሴ አምሳል ሦስት ሰዎችን ተመስሎ እንግዳ ሆኖ ወደ ቤቱ መጣ፡፡ በላዔ ሰብእም እግዚአብሔርን ያስተናገድኩ መስሎት በደስታ ያማረ ምንጣፍ ጎዝጉዞ የሰባውን ፍሪዳ በመሰዋት አስተናገደው:: ዲያብሎስ ግን ስምዖንን “ልጅህን ሠውተህ እራት አዘጋጅልን” ብሎ ጠየቀው፡፡ ስምዖንም መሃላውን እያሰበ ልጁን አቅርቦ ሰዋው:: እንደትእዛዛቸው ከቀረበው መስዋዕት አስቀድሞም ቀመሰ:: ከዚህ በኋላ ዲያብሎስም ተሰወረው::',
        'በላዔ ሰብእ የልጁን ሥጋ በመብላቱ ጠባዩ ተለውጦ ከዚያ በኋላ ቤተ ሰቦቹን ጨምሮ ሰባ ስምንት ሰዎችን በልቷል:: ሰውን የሚበላ በሚል “በላዔ ሰብእ” ተባለ። በዚህም ሕይወት ሲዘዋወር ሳለ ሁለንተናው በቁስል የታመመ ሰው ተመለከተ:: ይህም ሰው በላዔ ሰብእን ‘አምላክን ስለ ወለደች ድንግል ማርያም ብለህ ውሃ አጠጣኝ” ሲለው በላዔ ሰብእም ልቡ ራርቶ ለድሀው ያለውን ውኃ ሰጠው፡፡ በላዔ ሰብእ ከሞተ በኋላ ነፍሱ በፈጣሪ ፊት ለፍርድ ስትቆም ጨለማ የለበሱ ሰይጣናት ይህቺን ነፍስ እያስፈራሩ ወደ ሲዖል ወሰዷት:: እመቤታችን ግን ልጄ ወዳጄ ማርልኝ ስትል ለመነችው፡፡ ሰባ ስምንት ነፍሳትን የበላው በላዔ ሰብእ የእመቤታችን ቃል ኪዳኗ በሚታሰብበት እለት ለድሃው ውኃን ስላጠጣ ነፍሱ በእመቤታችን ቃል ኪዳን አማላጅነት ዳነች::',
        'እመቤታችን ቅድስት ድንግል ማርያም ለሁላችን አማላጅ እናት ትሆን ዘንድ በቀራንዮ ተሰጥታናለችና ለልጆችዋ ምህረትን የምትለምን አዛኝት እናት ነት:: ዛሬም ስሟን ጠርተው ለማይጠግቡ ሲያወድሷት ለማይሰለቹ ዝክሯን በማዘከር መታሰቢያዋን በማድረግ ዘወትር ተአምሯን በመስማት በማሰማት ለሚተጉ መቅደሷን ለሚሰሩ ፈጥና የምትደርስ አፍጣኒተ ረድኤት ናት።'
      ],
      paragraphsEn: [
        'Kidane Mihret means the "Covenant of Mercy." This is one of the most revered and sacred feasts of the Virgin Mary, commemorating the day her beloved Son, Jesus Christ, gave her an everlasting, unfailing covenant of mercy. According to the hagiographic texts, after our Lord’s Ascension, the Virgin Mary used to pray daily at Golgotha, where Christ was buried. On Yekatit 16 (February 23), she prayed with special intensity, saying: "O my beloved Son, who took flesh from my flesh and soul from my soul, and spent nine months and five days in my womb, and with whom I fled from country to country, I beseech Thee to hear my prayer."',
        'When our Lord asked what she desired, she pleaded for mercy on behalf of all mankind: those who commemorate her, those who invoke her name, those who show mercy to the poor, those who build churches in her name, or offer incense, oil, and offerings. Our Lord Jesus Christ swore a solemn oath, saying, "I swear by Myself, by My Father, and by the Living Holy Spirit," establishing this everlasting covenant of mercy on Yekatit 16.',
        'The Ethiopian Orthodox Tewahedo Church celebrates this day with great spiritual joy. This Covenant of Mercy is the crown and final completion of all previous covenants—including the Covenant of Adam, the Covenant of Noah, the Covenant of Abraham, and the Covenant of David. It is a covenant of absolute reconciliation and forgiveness. As written in the Synaxarium, anyone who commemorates her, invokes her name, or gives a cup of cold water to the poor and needy in her name will receive salvation and mercy.',
        'The hagiographic texts explain the terms of the covenant: "Invoking her name" means always keeping faith, performing good deeds, and remembering God\'s mercy through her. "Commemorating her" (Zikir) means giving alms to the needy in her name. "Building a church in her name" extends to building the spiritual assembly of believers, teaching the true Tewahedo faith, and preserving the temple of God. One of the most famous stories illustrating the power of her intercession is the story of Simeon, also known as "Bela\'e Seb\'e" (The Human Eater).',
        'Simeon was originally a wealthy and hospitable man who lived like Abraham. However, the devil, disguising himself as three travelers (simulating the Holy Trinity), deceived Simeon. He made Simeon swear an oath to fulfill all their demands, then commanded him to sacrifice his own son for their dinner. Distraught but bound by his oath, Simeon sacrificed his son and tasted the flesh first, after which the devil vanished. Overcome by a demonic curse, Simeon lost his sanity and went on to consume seventy-eight people, earning the name "Bela\'e Seb\'e" (the cannibal).',
        'One day, Simeon encountered a poor beggar covered in sores, who begged him: "In the name of the Virgin Mary, Mother of God, give me a drop of water." Overcome with compassion at the name of Mary, Simeon shared his remaining water. When Simeon died, dark demons dragged his soul toward Hades, but the Virgin Mary interceded before her Son, pleading: "If we do not save sinners, what is the purpose of the Covenant you gave me?" Because he had given a cup of cold water to a needy man in her name, Simeon\'s soul was spared from damnation and granted mercy.',
        'The Virgin Mary was given to all of us as an intercessor at Cavalry. She is "Aftanite Red\'iet" (the swift helper) who arrives faster than the blink of an eye in times of tribulation. The Church celebrates this feast annually to receive her blessings and to dedicate themselves to living lives of faith, prayer, and active charity under her protection.'
      ],
      blessingAm: 'የእመቤታችን የቅድስት ድንግል ማርያም የኪዳነ ምሕረት አማላጅነት፣ በረከትና ረድኤት ከሁላችን ጋር ይሁን፣ አሜን።',
      blessingEn: 'May the intercession, covenant of mercy, and blessing of our Holy Mother Virgin Mary be with us all, Amen.'
    }
  },
  {
    id: 'saint-uriel',
    category: 'feast',
    nameEn: 'Feast of Archangel Saint Uriel',
    nameAm: 'የሊቀ መላዕክት ቅዱስ ዑራኤል በዓል',
    periodEn: 'Hamle 22 (July 29)',
    periodAm: 'ሐምሌ ፳፪ ቀን',
    durationEn: 'High Feast',
    durationAm: 'ዓመታዊ ክብረ በዓል',
    theologyEn: 'Saint Uriel (meaning "Lord of Light" or "My Light is God") is one of the seven archangels, appointed over thunder, lightning, and heavenly luminaries. He is celebrated for guiding the Holy Family during their flight to Egypt, collecting the precious Blood of Christ in a chalice of light at the Crucifixion to sprinkle it across the earth, and giving the cup of wisdom and knowledge to Ezra Sutuel and Abba Giyorgis of Gascha.',
    theologyAm: 'ዑራኤል ማለት “የብርሃን ጌታ”፣ ”የአምላክ ብርሃን” ማለት ነው። ቅዱስ ዑራኤል ከ7ቱ ሊቃነ መላእክት አንዱ ሲሆን በመብረቅና በነጎድጓድ ላይ የተሾመ፣ ምስጢር ሰባኪና የብርሃን መሪ መልአክ ነው። ቅድስት ድንግል ማርያምንና ልጇን ወደ ግብጽ ስትሰደድ መንገድ የመራ፣ ክርስቶስ በተሰቀለ ጊዜ ክቡር ደሙን በብርሃን ጽዋ ተቀብሎ በዓለም ላይ የረጨ፣ ለዕዝራ ሱቱኤልና ለአባ ጊዮርጊስ ዘጋስጫ የጥበብና የዕውቀት ጽዋን ያጠጣ ታላቅ መልአክ ነው።',
    observanceEn: [
      'Commemorating his annual feast of the consecration of his sanctuary on Hamle 22 (July 29).',
      'Remembering his three main feasts: Tir 22 (Appointment), Megabit 27 (Sprinkling Christ\'s Blood), and Hamle 22 (Sanctuary Consecration).',
      'Seeking physical and spiritual healing by drinking and bathing in his blessed holy water (Tsebel) with faith.',
      'Participating in Yaredic chants (Mahlet), liturgy, and celebrations in churches dedicated to him, including Debre Mihret St. Uriel Church in Adelaide, South Australia.'
    ],
    observanceAm: [
      'ሐምሌ ፳፪ ቀን የቅዱስ ዑራኤልን ዓመታዊ የቅዳሴ ቤቱ በዓል በታላቅ ድምቀት ማክበር።',
      'በየዓመቱ ጥር ፳፪ (በዓለ ሲመት)፣ መጋቢት ፳፯ (የጌታን ደም የረጨበት) እና ሐምሌ ፳፪ (ቅዳሴ ቤቱ) ክብረ በዓላቱን መዘከር።',
      'የቅዱስ ዑራኤልን አማላጅነት አምኖ በተጸለየበትና በተባረከበት ጸበል መጠመቅና መጠጣት፣ ከበሽታዎችም ፈውስን መሻት።',
      'በታላቅ በዓልነት በአድላይድ (ደቡብ አውስትራሊያ) የደብረ ምሕረት ቅዱስ ዑራኤል ቤተክርስቲያንን ጨምሮ በመላው ዓለም ማኅሌትና ቅዳሴ መካሄዱ።'
    ],
    narrative: {
      titleAm: 'የሊቀ መላእክት የቅዱስ ዑራኤል የክብርና የቃል ኪዳን ታሪክ',
      titleEn: 'The Glory and Covenant of the Archangel Saint Uriel',
      paragraphsAm: [
        'የአድላይድ/ደቡብ አውስትራሊያውን "የደብረ-ምሕረት ቅዱስ ዑራኤል ቤተክርስቲያንን ጨምሮ፣ በየዓመቱ ሐምሌ ፳፪ (22) ቀን የሚከበረው የሊቀ መላእክት የቅዱስ ዑራኤል ዓመታዊ በዓል የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን ከምታከብራቸው ታላላቅ የበዓላት አንዱ ነው። ይህ በዓል መልአኩ ለነቢዩ ዕዝራ ሱቱኤል ሰማያዊ ምሥጢር የገለጠበት እና የክብሩ መታሰቢያ የሚደረግበት ዕለት ነው።',
        'ዑራኤል የሚለው ስም “ዑር” እና “ኤል” ከሚሉ ሁለት ቃላት የተመሠረተ ነው። ዑራኤል ማለት ትርጉሙ “የብርሃን ጌታ”፣ ”የአምላክ ብርሃን” ማለት ነው። ቅዱስ ዑራኤል ከ7ቱ ሊቃነ መላእክት አንዱ ሲሆን ከፍጥረተ ዓለም ጀምሮ በመብረቅና በነጎድጓድ ላይ የተሾመ መልአክ ነው። በመሆኑም መባርቅት ለጥጋብና ለበረከት እንዲበርቁ ነጎድጓድም ለሰላም እንዲሆን ያሰማራል። መጽሐፈ ሄኖክ 6፥2 ምስጢረ ሰማይና እውቀትንም ሁሉ ለሄኖክ የገለጸለት የፀሐይን የጨረቃን የከዋክብትንና የሰማይ ሰራዊትን ብርሃንን የሚመራ እርሱ መሆኑን ለሄኖክ ነግሮታል። (መጽሐፈ ሄኖክ 28፥13)',
        'ቅዱስ ዑራኤል ቅድስት ድንግል ማርያምን፣ ከልጇ ከአምላካችን ከኢየሱስ ክርስቶስ ጋር ወደ ግብጽ ስትሰደድ መንገድ የመራ፤ ክርስቶስ ለዓለም ቤዛ በተሰቀለ ጊዜ፣ ክቡር ደሙን በብርሃን ጽዋ ተቀብሎ፣ በብርሃነ መነሳንስ በዓለም ላይ የረጨ፤ እውቀት ለተሰወረባቸው ለነቢዩ ዕዝራ ሱቱኤል ጽዋ ጥበብን ያጠጣ፤ ኢትዮጵያዊውን ሊቅ አባ ጊዮርጊስ ዘጋስጫ በርካታ ቅዱሳት መጻሕፍትን አንዲደርሱ ያገዘ፣ የረዳና የዕውቀት ጽዋን ያጠጣ መልአኩ ቅዱስ ዑራኤል ነው፡፡',
        'የቅዱስ ዑራኤል ዓመታዊ ክብረ በዓላት የሚከተሉት ናቸው፡፡ ጥር 22 ቀን የሹመቱ/በዓለ ሲመቱ፣ መጋቢት 27 ቀን የጌታን ደም ለዓለም የረጨበት፣ ሐምሌ 22 ቀን ደግሞ ቅዳሴ ቤቱ የሚከበርበት ዕለት ነው። ሊቀ መላዕክት ቅዱስ ዑራኤል በጸሎቱ ለተማጸነ ከአምላኩ በረከትን እና ምህረትን የሚያሰጥ አዛኝ እሩህሩህና ፈጣን መልአክ ነው። አሁንም ይህ ዓለም በአማላጅነቱ አምኖ ጸበሉን ቢጠጣ ከክፉ በሽታ እንደሚፈወሱ ቃል ኪዳን ተሰጥቶታል።'
      ],
      paragraphsEn: [
        'The annual feast of the Archangel Saint Uriel, celebrated on Hamle 22 (July 29), is one of the most prominent feasts in the Ethiopian Orthodox Tewahedo Church. This holy day is commemorated globally, including at Debre Mihret Saint Uriel Church in Adelaide, South Australia. It honors the Archangel’s glory and the day he revealed heavenly mysteries to the Prophet Ezra Sutuel.',
        'The name Uriel is derived from the Semitic words "Ur" and "El," which translate to "Lord of Light" or "My Light is God." As one of the seven great Archangels, Saint Uriel is appointed over thunder, lightning, and meteorology from the beginning of creation. He directs lightning for bounty and blessing and guides thunder for peace. In the Book of Enoch, he is described as the guide of all heavenly luminaries—the sun, moon, and stars—and the one who revealed heavenly secrets and knowledge to Enoch.',
        'Archangel Uriel is deeply revered in Ethiopian tradition for several miraculous acts. He guided the Holy Virgin Mary and her beloved Son, Jesus Christ, during their flight to Egypt. When Christ was crucified on Calvary as the savior of the world, Saint Uriel collected His precious Blood in a cup of light and sprinkled it across the world with a light-sprinkler to sanctify the earth. Furthermore, he offered the cup of wisdom to the Prophet Ezra Sutuel and aided the great Ethiopian saint and scholar, Abba Giyorgis of Gascha, enabling him to write his profound theological books by feeding him the cup of knowledge.',
        'The annual feasts of Saint Uriel are: Tir 22 (commemorating his appointment as Archangel), Megabit 27 (commemorating his sprinkling of Christ\'s precious Blood), and Hamle 22 (commemorating the consecration of his sanctuary). Archangel Saint Uriel is a compassionate, gentle, and swift intercessor who obtains mercy and blessing from God for those who invoke him. He holds a divine covenant promising that those who drink of his holy water (Tsebel) with faith will be healed from severe illnesses.'
      ],
      blessingAm: 'የሊቀ መላእክት የቅዱስ ዑራኤል በረከት፣ ተራዳኢነትና ምልጃ በሁላችንም ላይ ይደርብን፣ አሜን።',
      blessingEn: 'May the blessing, protection, and intercession of Archangel Saint Uriel be with us all, Amen.'
    }
  },
  {
    id: 'abune-tekle-haymanot',
    category: 'feast',
    nameEn: 'Feast of Abune Tekle Haymanot of Debre Libanos',
    nameAm: 'የደብረ ሊባኖሱ የቅዱስ አቡነ ተክለ ሃይማኖት በዓል',
    periodEn: 'Nehasse 24 & Tahsas 24 (August 30 & January 2)',
    periodAm: 'ነሐሴ ፳፬ እና ታኅሣሥ ፳፬ ቀን',
    durationEn: 'High Feast',
    durationAm: 'ታላቅ በዓል',
    theologyEn: 'Abune Tekle Haymanot (meaning "Plant of the Faith") was a great Ethiopian monk and evangelist who spent his life reviving Christianity across the nation, earning the title "New Apostle" and "The Light of Ethiopia." Guided by Archangel Michael, he established the renowned monastery of Debre Libanos, spent decades in extreme asceticism praying on one foot, and received a divine covenant from Christ ensuring mercy for those who honor him.',
    theologyAm: 'ጻድቁ አባታችን አቡነ ተክለ ሃይማኖት (ተክለ ሃይማኖት ማለት "የሃይማኖት ተክል" ማለት ነው) ኢትዮጵያን በወንጌል ብርሃን የቀደሱ፣ ጣዖታትን ያፈረሱ፣ "ሐዲስ ሐዋርያ" እና "የኢትዮጵያ ብርሃን" ተብለው የሚጠሩ ታላቅ ጻድቅ ናቸው። በሊቀ መላእክት ቅዱስ ሚካኤል መሪነት ታላቁን የደብረ ሊባኖስ ገዳም መሥርተዋል፤ ለአዝራር ዓመታት በአንድ እግራቸው ቆመው በመጸለይና በትጋት በመጋደል ታላቅ የቃል ኪዳን በረከትን ተቀብለዋል።',
    observanceEn: [
      'Commemorating the saint\'s departure (Nehasse 24) and birth (Tahsas 24) with grand Yaredic liturgies (Mahlet) and divine liturgies.',
      'Reflecting on his apostolic travels, the uprooting of the sacred tree of Damot, and his established monastic lineages (the 12 stars).',
      'Emulating his profound humility and devotion by practicing fasting, constant prayers, and acts of love and compassion.',
      'Seeking the saint\'s powerful intercession and the mercy promised in his everlasting covenant.'
    ],
    observanceAm: [
      'በየዓመቱ ነሐሴ ፳፬ (ዕረፍታቸው) እና ታኅሣሥ ፳፬ (ልደታቸው) ቀናትን በታላቅ የሌሊት ማኅሌትና የበዓል ቅዳሴ ማክበር።',
      'የጻድቁን ሐዋርያዊ ጉዞዎች፣ የጣዖታትን መነቀልና የደብረ ሊባኖስን ገዳም መመሥረትና የመነኮሳትን ትውልድ መዘከር።',
      'ጻድቁ አባታችን አቡነ ተክለ ሃይማኖት የሰጡትን ታላቅ የነፍስ ስንቅና የሃይማኖት ኑዛዜ ምክርን በተግባር መፈጸም።',
      'እግዚአብሔር ለአባታችን የሰጣቸውን የማይፈርስ የቃል ኪዳን በረከት በማሰብ በጾምና በጸሎት መትጋት።'
    ],
    narrative: {
      titleAm: 'የሐዲስ ሐዋርያ የቅዱስ አቡነ ተክለ ሃይማኖት የተጋድሎና የቃል ኪዳን ታሪክ',
      titleEn: 'The Hagiography, Monastic Labors, and Covenant of the New Apostle Saint Tekle Haymanot',
      paragraphsAm: [
        'ነሐሴ ፳፬ ቀን ምግባር ሃይማኖት፣ ገድል ትሩፋታቸው ከማር ወላላ ይልቅ እጅግ የጣፈጠ የሁለት ታላላቅ አባቶችና የአንዲት ቅድስት እናታችን የዕረፍታቸው በዓል ነው፡፡ ‹‹ሐዲስ ሐዋርያ›› የተባሉ የኢትዮጵያ ብርሃኗ የሆኑ የደብረ ሊባኖሱ የአቡነ ተክለ ሃይማኖት እና የሰማዕቱ የአቡነ ቶማስ ዘመርዓስ ዕረፍታቸው ነው፡፡ ተክለሃይማኖት ማለት ‹‹የሃይማኖት ተክል፣ ተክለ አብ ተክለ ወልድ ተክለ መንፈስ ቅዱስ›› ማለት ነው፡፡ ጻድቁ አባታችን በሊቀ መላእክት በቅዱስ ሚካኤል አብሳሪነት ከአባታቸው ከካህኑ ጸጋ ዘአብና ከእናታቸው ከቅድስት እግዚእ ኀረያ መጋቢት ፳፬ ቀን ተፀንሰው ታኅሣሥ ፳፬ ቀን ፲፩፻፺፯ ዓ.ም ተወለዱ፡፡ በተወለዱ በሦስተኛው ቀን ከእናታቸው ዕቅፍ ወርደው ‹‹አሐዱ አብ ቅዱስ አሐዱ ወልድ ቅዱስ አሐዱ ውእቱ መንፈስ ቅዱስ›› በማለት የፈጠራቸውን አምላክ አመስግነውታል። ወላጆቻቸውም ስማቸውን ፍሥሐ ጽዮን (የጽዮን ተድላዋ) አሏቸው። ከልጅነታቸው ጀምሮ በወላጅ አባታቸው በካህኑ ቅዱስ ጸጋ ዘአብ ግብረ ዲቁናን ሥርዓተ ቤተ ክርስቲያንን አጥንተው ከእስክንድርያው ሊቀ ጳጳስ ከአቡነ ቄርሎስ ዲቁናንና ቅስናን ተቀብለዋል።',
        'ከዕለታት በአንዱ ቀን አባታችን ለአደን ወደ ዱር ሄደው ሳለ ሊቀ መላእክት ቅዱስ ሚካኤል ተገለጠላቸው። ቅዱስ ሚካኤልም ‹‹ከእንግዲህ አውሬ አዳኝ አትሁን፤ ሰውን ወደ እግዚአብሔር ለመመለስ ሰውን በትምህርት የምታድን ሁን እንጂ፡፡ እነሆ እግዚአብሔር ጽኑዕ ሥልጣን ሰጥቶሃልና፤ ሙት ታስነሣለህ፤ ድውያንን ትፈውሳለህ፤ አጋንንትም አንተን በመፍራት ይሸሻሉ፡፡ ስምህ ፍሥሐ ጽዮን አይሁን፤ ተክለ ሃይማኖት ይሁን እንጂ›› አላቸው። በዚያም ጌታችን መድኃኒታችን ኢየሱስ ክርስቶስ መልከ መልካም ጎልማሳ መስሎ ተገልጦላቸዋል፤ በክቡር እጆቹ ባረካቸውና ‹‹ንሣእ መንፈስ ቅዱስ›› ብሎ የሹመትን ሀብት አሳደረባቸው። ‹‹በምድር ያሰርከው በሰማይ የታሰረ ይሁን፤ በምድርም የፈታኸው በሰማይ የታፈታ ይሁን። ሐዋርያት ወዳልደረሱበት ሕዝብ በመምህርነት እልክህ ዘንድ በሚካኤል ቃል አዲስ ስም አወጣሁልህ፤ ሐዲስ ሐዋርያ አድርጌሃለሁና›› ብሎ ቃል ኪዳን ሰጣቸው። ብፁዕ አባታችንም ያላቸውን ሀብት ንብረት ሁሉ ለቤተ ክርስቲያን፣ ለድኆችና ለጦም አዳሪዎች ሰጥተው ጨረሱ። ከዚያም ‹‹አቤቱ ጌታዬ ኢየሱስ ክርስቶስ ሆይ! የመንግሥተ ሰማያትን በር ትከፍትልኝ ዘንድ እነሆ ቤቴን እንደተከፈተ ተውኩልህ›› ብለው ወንጌልን ለማስተማር ወጡ።',
        'ጻድቁ አባታችን በሀገራችን ኢትዮጵያ እየተዘዋወሩ ሕዝቡን ከኃጢአት ወደ ገቢረ ጽድቅ፣ ከክህደት ወደ ኃይማኖት በመመለስ ለኢትዮጵያውያን ታላቅ ብርሃን ሆኑ። ከ፲፪፲፱-፲፪፪፪ ዓ.ም በከተታ ሦስት ዓመት፣ ቀጥለውም ዘጠኝ ወር በዊፋት ወንጌልን አስተማሩ። ከ፲፪፪፫-፲፪፫፬ ዓ.ም በዳሞት (ወላይታ) ለ፲፪ ዓመታት ሕዝቡን በማስተማር ከአምልኮተ ጣዖት ወደ አምልኮተ እግዚአብሔር መልሰዋል። በዚህ ሀገር ዲያብሎስ በዛፍ ላይ አድሮ ሕዝቡን ያሳስትበት የነበረውን ታላቅ ዛፍ በተአምራት ከሥሩ ነቅለው አፍልሰውታል። ከ፲፪፫፬-፲፪፵፬ ዓ.ም ደግሞ ወደ አማራ ሳይንት ወሎ በመሄድ ከአባ በጸሎተ ሚካኤል ገዳም ገብተው ሥርዓተ ምንኲስናን እየተማሩ ለ፲ ዓመታት በተጋድሎ አገለገሉ። ከ፲፪፵፬-፲፪፶፬ ዓ.ም አባ ኢየሱስ ሞዐ ወዳሉበት ሐይቅ ቅዱስ እስጢፋኖስ ገዳም በቅዱስ ሚካኤል መሪነት ሐይቁን በእግራቸው እንደ ደረቅ መሬት በመርገጥ ገብተው የምንኲስናን ቀሚስ ተቀበሉ።',
        'ከ፲፪፶፬-፲፪፷፮ ዓ.ም ወደ ትግራይ ሄደው ከአቡነ አረጋዊ ገዳም ደብረ ዳሞ ገብተው ከአባ ዮሐኒ ቆብና አስኬማ ተቀብለው ለ፲፪ ዓመታት በገድል በትሩፋት ኖሩ። ከደብረ ዳሞ ገዳም ወደ ሌላ ገዳም ለመሄድ ሲነሡ መነኮሳቱ ሲሸኟቸው አርባ ክንድ ርዝመት ባለው ገመድ ገደሉን ለመውረድ እንደጀመሩ ሰይጣን ገመዱን ቆረጠባቸው። ቅዱስ አባታችን ግን በዚህ ጊዜ ስድስት የብርሃን ክንፎች ተሰጣቸውና እየበረሩ ሦስት ምዕራፍ ሄደው አረፉ። ከ፲፪፷፮-፲፪፷፯ ዓ.ም የትግራይን ገዳማት በሙሉ በመጐብኘት ወደ ኢየሩሳሌምና ወደ ግብፅም ሄደው ቅዱሳን መካናትን ጎብኝተው ተመለሱ። ከዚያም ‹‹ዳዳ›› በተባለ ስፍራ ይመለክ የነበረውን ፸፭ ክንድ የሚረዝመውን ዘንዶ በጸሎትና በመስቀል ምልክት በተአምራት ገድለውታል። በቦታውም ቤተ ክርስቲያን አንጸው ፫ ሺህ በጣዖት የሚያመልኩ ሰዎችን አስተምረው አጥምቀዋል።',
        'ከ፲፪፷፯-፲፪፹፱ ዓ.ም ደግሞ በደብረ ሊባኖስ ካለው አስቦ ዋሻ ገብተው ፰ ጦሮችን (ሁለቱን ፊት፣ ሁለቱን ኋላ፣ ሁለቱን በቀኝ፣ ሁለቱን በግራ) አስተክለው እጆቻቸውን በትእምርተ መስቀል በመዘርጋት ያለማቋረጥ በጾምና በጸሎት በአርምሞ ሲጋደሉ ከቁመት ብዛት የተነሣ ጥር ፬ ቀን ፲፪፹፱ ዓ.ም. አንዲቱ የእግራቸው አገዳ ተሰብራለች። ከ፲፪፹፱-፲፪፺፮ ዓ.ም ለሰባት ዓመታት በአንድ እግራቸው በመቆም ያለምግብና ያለውኃ በትኅርምት እንቅልፍ በማጣት እንደ ምሰሶ ጸንተው በተመስጦ ጸለዩ። በዚህ ጊዜ ጌታችን ተገልጦ በእጆቹ ባረካቸው፤ በመስቀል ምልክት የተጌጡት ሰባት የሕይወት አክሊላትን አቀዳጅቷቸዋል። ዝክራቸውን የሚያደርጉ፣ ስማቸውን የሚጠሩ ሁሉ በዚህ ዓለምም ሆነ በወዲያኛው ዓለም ፍጹም ዋጋና ፍጹም ክብር እንደሚያገኙ ጌታችን ታላቅ ቃል ኪዳን ገብቶላቸዋል። ጻድቁ አባታችን ለ፲ ቀናት በተስቦ ሕመም ቆይተው ለልጆቻቸው ፍቅራቸውን፣ ሃይማኖትን ጠብቁ የሚለውን ምክራቸውንና ቃል ኪዳኑን ከነገሯቸው በኋላ ነሐሴ ፳፬ ቀን በታላቅ ክብር ዐርፈዋል።'
      ],
      paragraphsEn: [
        'Nehasse 24 (August 30) marks the departure (holy rest) of two great fathers and one holy mother whose righteous deeds, faith, hagiographies, and virtues are sweeter than the finest honey. Chief among them is the "New Apostle," the Light of Ethiopia, Abune Tekle Haymanot of Debre Libanos, along with the martyr Abune Thomas of Meras. The name Tekle Haymanot translates to "Plant of the Faith, Plant of the Father, Plant of the Son, Plant of the Holy Spirit." Chosen by God as the New Apostle of Ethiopia, the righteous father was announced by the Archangel Michael, conceived on Megabit 24, and born on Tahsas 24, 1197 E.C. (A.D. 1204) to the priest Tsega Ze-Ab and Saint Egzi’e Haraya. On the third day after his birth, the infant slipped from his mother\'s embrace, stood up, and praised his Creator, saying: "One is the Holy Father, One is the Holy Son, One is the Holy Spirit." His parents named him Fisseha Tsion, meaning "Joy of Zion." Under his father\'s guidance, he mastered the church liturgy and was ordained a deacon and priest by Archbishop Kyrillos of Alexandria.',
        'One day, while hunting in the wilderness, the Archangel Michael appeared to him in great glory and said: "From now on, hunt wild animals no more, but hunt human souls to return them to God through spiritual teaching. Behold, God has given you great authority to raise the dead, heal the sick, and cast out demons. Your name shall no longer be Fisseha Tsion, but Tekle Haymanot." At that moment, our Lord Jesus Christ appeared to him as a beautiful young man, blessed him, breathed on him saying "Receive the Holy Spirit," and granted him apostolic authority. Responsive to this divine call, he returned home, distributed all his earthly possessions to the Church, the poor, and the needy, and prayed: "O Lord Jesus Christ, I leave my doors wide open so that You may open the gates of heaven for me." He then departed to preach the Gospel.',
        'The righteous father traveled extensively throughout Ethiopia, converting people from sin to righteousness and from paganism to faith, earning the title "The Light of Ethiopia." He preached in Katata for three years (A.D. 1226-1229) and in Wifat for nine months. From A.D. 1230-1241, he spent twelve years in Damot (Wolaita), converting the population from idol worship and building churches. There, he performed a famous miracle by uprooting a giant sacred tree where a demon resided, claiming to be a god and deceiving the local people. From A.D. 1241-1251, by God\'s command, he went to Wollo (Amhara Sayint), entering the monastery of Abba Betselote Michael to learn monastic discipline. From A.D. 1251-1261, guided by the Archangel Michael, he walked across the waters of Lake Hayq as if on dry land to enter the island monastery of Saint Gregory / Saint Stephen, serving under Abba Jesus Mo\'a, from whose hands he received the monastic habit.',
        'From A.D. 1261-1273, he traveled to Tigray and entered the mountaintop monastery of Debre Damo, founded by Abune Aregawi, where he received the holy skullcap (Qob) and monastic girdle (Askema) from Abbot Abba Yohani, spending twelve years in rigorous spiritual combat. When he was about to depart from Debre Damo, he began climbing down the steep cliff using a rope of forty cubits. The devil, seeking to kill him, severed the rope. At that precise moment, God bestowed upon him six wings of light, enabling him to fly gracefully for three leagues before landing safely. From A.D. 1273-1274, he spent a year visiting monasteries in Tigray and went on pilgrimages to Egypt and the Holy Land of Jerusalem. Upon his return, he vanquished a massive demonic serpent measuring 75 cubits that was worshipped in a place called "Dada," built a church dedicated to the Four Heavenly Beasts on that site, and baptized over three thousand former pagan worshippers.',
        'From A.D. 1274-1296, he entered the cave of Debre Asbo (later Debre Libanos), standing in continuous prayer day and night, arms outstretched in the sign of the cross to meditate on the Passion of Christ. To prevent sleep, he placed eight sharp spears around him (two in front, two behind, and two on each side). Due to decades of standing in prayer without rest, one of his legs broke on Tir 4, 1289 E.C. (A.D. 1297) when he was 92 years old. For the next seven years (A.D. 1297-1304), he stood firmly on his remaining leg like a solid pillar, praying without sleep, food, or water, except for a sip of water in the fourth year. During this time, our Lord appeared to him, clothed him in a heavenly garment with a tongue of divine fire, and crowned him with seven crowns of life for his orthodox faith and extreme asceticism. Our Lord established a solemn covenant (Kidane) with him, promising eternal salvation to all who commemorate his hagiography or do charitable acts in his name. Finally, after enduring a fever for ten days, he revealed the divine covenant to his spiritual children and departed peacefully in great glory on Nehasse 24, 1296 E.C. (August 30, 1304).'
      ],
      blessingAm: 'የሐዲስ ሐዋርያ የኢትዮጵያ ብርሃን የቅዱስ አቡነ ተክለ ሃይማኖት በረከትና ምልጃ በሁላችንም ላይ ይደርብን፣ አሜን።',
      blessingEn: 'May the blessing, intercession, and apostolic covenant of our holy father Saint Tekle Haymanot be with us all, Amen.'
    }
  },
  {
    id: 'assumption-virgin-mary',
    category: 'feast',
    nameEn: 'Feast of the Assumption of the Virgin Mary (Filseta / Erget)',
    nameAm: 'የእመቤታችን ቅድስት ድንግል ማርያም በዓለ እርገት (ፍልሰታ)',
    periodEn: 'Nehasse 16 (August 22)',
    periodAm: 'ነሐሴ ፲፮ ቀን',
    durationEn: 'High Feast',
    durationAm: 'ታላቅ በዓል',
    theologyEn: 'The Assumption (Filseta or Erget) of the Virgin Mary commemorates her bodily resurrection and ascension into heaven on the third day after her departure, mirroring the Resurrection of her beloved Son, Jesus Christ. This feast marks the culmination of the 15-day Fast of the Prophets/Apostles (Tsome Filseta).',
    theologyAm: 'የእመቤታችን ቅድስት ድንግል ማርያም በዓለ እርገት (ፍልሰታ) በጥልቅ ፍቅርና በታላቅ በረከት የሚከበር፣ እመቤታችን በጥር ፳፩ ቀን ካረፈች በኋላ በነሐሴ ፲፮ ቀን ልክ እንደ ልጇ ትንሣኤ በሦስተኛው ቀን ከሙታን ተለይታ ተነሥታ ወደ ሰማይ ማረጓን (ዕርገቷን) የምናስብበትና የ፲፭ቱ ቀናት የፍልሰታ ጾም መደምደሚያ የሆነ ታላቅ በዓል ነው።',
    observanceEn: [
      'Concluding the 15-day Fast of the Virgin Mary (Tsome Filseta) with fasting, intense prayers, and divine liturgy.',
      'Commemorating her bodily resurrection and ascension to heaven, celebrated on Nehasse 16.',
      'Reflecting on the story of the Apostle Saint Thomas, who witnessed her ascension and received her holy sash (Seben) as a witness.',
      'Distributing the holy sash (Seben) symbolically represented by the bands/sashes worn by priests and deacons during liturgies.'
    ],
    observanceAm: [
      'ከነሐሴ ፩ እስከ ፲፭ ቀን የተጾመውን የፍልሰታን ጾም በመጾምና በመጸለይ ነሐሴ ፲፮ ቀን በታላቅ ቅዳሴና ምስጋና በዓሉን ማክበር።',
      'እመቤታችን በጥር ወር ካረፈች በኋላ በነሐሴ ወር ሐዋርያት ሱባዔ ገብተው ሥጋዋን ተቀብለው ከቀበሯት በኋላ በ፫ኛው ቀን መነሣቷንና ማረጓን መዘከር።',
      'ሐዋርያው ቅዱስ ቶማስ የእመቤታችንን ትንሣኤና ዕርገት አይቶ የተቀበለውንና ለሐዋርያት የሰጠውን ሰበን (መታጠቂያ) ምሥጢር ማሰብ።',
      'በቅዳሴ ጊዜ ሠራዒ ዲያቆኑና አባቶች ካህናት በመስቀላቸው ላይ የሚያስሩትንና በራሳቸው ላይ የሚጠመጥሙትን ሰበን (ነጭ ሻሽ) እንደ በረከት መቁጠር።'
    ],
    narrative: {
      titleAm: 'የእመቤታችን ቅድስት ድንግል ማርያም የትንሣኤና የዕርገት (የፍልሰታ) ታሪክ',
      titleEn: 'The Resurrection, Assumption, and Covenant of the Holy Virgin Mary (Filseta)',
      paragraphsAm: [
        '“ተንስእ እግዚኦ ውስተ ዕረፍትከ አንተ ወታቦተ መቅደስከ” (አቤቱ ወደ ዕረፍትህ ተነስ አንተና የመቅደስህ ታቦት - መዝ. ፻፴፩፥፰)። እመቤታችን ቅድስት ድንግል ማርያም ጥር ፳፩ ቀን በ፵፱ ዓ.ም በ፷፬ ዓመቷ ከዚህ ዓለም ውጣ ውረድና ድካም ባረፈች ጊዜ ቅዱሳን ሐዋርያት ሊቀብሯት ወደ ጌቴሴማኒ ይዘዋት ሔዱ፡፡ በዚህ ጊዜ አይሁድ ‹‹እንደ ልጇ ‹ተነሣች፤ ዐረገች› እያሉ እንዳያውኩን በእሳት እናቃጥላት›› ብለው ሥጋዋን ሊያጠፉ በዓመፃ ተነሡ፡፡ ታውፋንያ የሚባል አይሁዳዊም አጎበሩን ይዞ ሊያወርዳት ሲል የእግዚአብሔር መልአክ ሁለት እጆቹን ቀጣው፡፡ ከዚህ በኋላ እግዚአብሔር አምላክ ሐዋርያው ቅዱስ ዮሐንስን ጨምሮ እመቤታችንን በደመና ነጥቆ ወደ ገነት ወስዶ ከዕፀ ሕይወት ሥር አስቀመጣት፡፡ ቅዱሳን ሐዋርያትም እመቤታችን ያለችበት ቦታ እንዲገለጥላቸው ባረፈች በስምንተኛው ወር ከነሐሴ ፩ ቀን ጀምረው ሱባዔ ገብተው እግዚአብሔርን በጸሎት መጠየቅ ጀመሩ፡፡',
        'እዚህ ላይ ‹‹ስምንት ወር ሙሉ ምን ይዘው ቆይተው ነሐሴ ላይ ሱባዔ ገቡ?›› የሚል ጥያቄ ሊነሣ ይችላል፡፡ በመሠረቱ ቅዱሳን ሐዋርያት ከስብከተ ወንጌል፣ ከጾም፣ ከጸሎት፣ ከገቢረ ተአምራት ተለይተው እንደማያውቁ መንፈሳዊ ሕይወታቸው ምስክር ነው፡፡ በመኾኑም እመቤታችን ካረፈችበት ቀን ከጥር ወር ጀምሮ እስከ ነሐሴ ድረስ ጥያቄያቸውንና ጸሎታቸውን ባያቋርጡም ከሰው ተለይተው ሱባዔ ገብተው ጾም ጸሎት የጀመሩት ግን ከነሐሴ ፩ ቀን ጀምረው ነው፡፡ ቀድሞስ የክብር ባለቤት የጌታችን አምላካችንና መድኀኒታችን ኢየሱስ ክርስቶስ ደቀ መዛሙርት ኾነው እናቱ ቅድስት ድንግል ማርያም ተሰውራባቸው እንዴት ዝም ብለው ይቀመጣሉ? ቅዱሳን ሐዋርያት ሁለት ሱባዔ (ዐሥራ አራት ቀናት) ካደረሱ በኋላም የነገሩትን የማይረሳ፣ የለመኑትን የማይነሳ እግዚአብሔር አምላካችን ጸሎታቸውን ሰምቶ ነሐሴ ፲፭ ቀን የእመቤታችንን ሥጋ ሰጥቷቸው በክብር ገንዘው በጌቴሴማኒ ቀብረዋታል፡፡ በሦስተኛው ቀንም (ነሐሴ ፲፮) እንደ ልጇ እንደ ጌታችን አምላካችንና መድኀኒታችን ኢየሱስ ክርስቶስ ከሙታን ተለይታ ተነሥታለች፡፡ ትንሣኤዋን ‹‹ከመ ትንሣኤ ወልዳ፤ እንደ ልጇ ትንሣኤ›› ያሰኘውም ይህ ምሥጢር ነው፡፡',
        'ሐዋርያው ቅዱስ ቶማስ ሲሰብክ ቆይቶ ደመና ጠቅሶ ከሀገረ ስብከቱ ወደ ኢየሩሳሌም ሲመጣ እመቤታችን ከሙታን ተለይታ ተነሥታ ወደ ሰማይ ስታርግ ጠፈር ላይ አገኛት፡፡ በዚህ ጊዜ ‹‹ቀድሞ የልጅሽን ትንሣኤ፤ ዛሬ ደግሞ ያንቺን ትንሣኤ ሳላይ ቀረሁን?›› ብሎ ትንሣኤዋን ባለማየቱ ኀዘን ስለ ተሰማው ከደመናው ይወድቅ ዘንድ ወደደ፡፡ ‹‹ወፈቀደ ይደቅ እምደመናሁ›› እንዲል፡፡ እመቤታችንም ‹‹አይዞህ! አትዘን፤ ባልንጀሮችህ ሐዋርያት ያላዩትን ትንሣኤዬን አንተ አይተሃልና ደስ ይበልህ!›› ብላ ከሙታን ተለይታ መነሣቷንና ማረጓን ለሐዋርያት እንዲነግራቸው አዝዛ የያዘቸውን ሰበን ሰጥታ ሰደደችው፡፡ ከዚያም እርሷ ወደ ሰማይ ዐረገች፤ እርሱም ወደ ኢየሩሳሌም ወረደ፡፡ ቅዱስ ቶማስ ትእዛዟን ተቀብሎ በክብር ከተሰናበታት በኋላ ወደ ሐዋርያት ሔዶ እንዳልሰማ እንዳላየ መስሎ ‹‹የእመቤታችን ነገር እንደምን ኾነ?›› ሲል ጠየቃቸው፡፡ እነርሱም ‹‹አግኝተን ቀበርናት›› ሲሉት ‹‹ሞት በጥር በነሐሴ መቃብር እንዴት ይኾናል?›› አላቸው፡፡',
        'በዚህ ጊዜ ቅዱስ ጴጥሮስ ከዚህ በፊት የክርስቶስን ትንሣኤ መጠራጠሩንጠቅሶ እየገሠፀ መከራከሩንና መጠራጠሩን ትቶ ስለ እመቤታችን መቀበር እነርሱ የሚነግሩትን ዅሉ አምኖ መቀበል እንደሚገባው ለቅዱስ ቶማስ አስረዳው፡፡ ቅዱስ ቶማስም የያዘውን ያውቃልና ጸጥ ብሎ ሲሰማው ቆየ፡፡ ቅዱስ ጴጥሮስም ተቈጥቶ የእመቤታችንን ክቡር ሥጋ ለቅዱስ ቶማስ ለማሳየት ሔዶ መቃብሯን ቢከፍት የእመቤታችንን ሥጋ ሊያገኘው አልቻለም፡፡ በዚህ ጊዜ ቅዱስ ጴጥሮስ ደንግጦ ቆመ፡፡ ቅዱስ ቶማስም ‹‹ወንድሞቼ! አታምኑኝም ብዬ ነው እንጂ እመቤታችንስ ከሙታን ተለይታ ተነሥታ ስታርግ አግኝቻታለሁ›› ብሎ እመቤታን የሰጠችውን ሰበን ለሐዋርያት ሰጥቷቸዋል፡፡ እነርሱም በእመቤታችን ቅድስት ድንግል ማርያም ትንሣኤና ዕርገት እየተደሰቱ ሰበኑን ለበረከት ተካፍለውታል፡፡',
        'ሊቃውንተ ቤተ ክርስቲያን እንደሚያስተምሩን በቅዳሴ ጊዜ ሠራዒ ዲያቆኑ በሚይዘው መስቀል ላይ የሚታሠረው መቀነት መሰል ልብስ፤ እንደዚሁም አባቶች ካህናት በመስቀላቸው ላይ የሚያደርጉት ቀጭን ልብስና በራሳቸው ላይ የሚጠመጥሙት ነጭ ሻሽ የእመቤታችን ሰበን ምሳሌ ነው፡፡ የእግዚአብሔር ቸርነት፣ የእመቤታችን የቅድስት ድንግል ማርያም አማላጅነት፣ የቅዱሳን ሐዋርያት ጸጋና በረከት አይለየን። ወስብሐት ለእግዚአብሔር።'
      ],
      paragraphsEn: [
        '"Arise, O Lord, into Thy rest; Thou, and the Ark of Thy sanctuary" (Psalms 132:8). On Tir 21 (January 29) in 49 A.D., at the age of 64, the Holy Virgin Mary reposed and rested from the trials of this world. When the holy Apostles carried her blessed body to Gethsemane for burial, hostile forces arose, saying, "Lest they say she has resurrected and ascended like her Son, let us burn her body." A man named Tawfanya attempted to pull down her bier, but an angel of God struck his hands. Following this, God took her blessed body away in a cloud of light, accompanied by the Apostle Saint John, placing her beneath the Tree of Life in Paradise. Seeking to know her whereabouts, the Apostles began a fast and vigil (Subae) in the eighth month after her departure, beginning on Nehasse 1 (August 7).',
        'One might ask why the Apostles waited eight months to enter a dedicated vigil in Nehasse. The Apostles spent their lives in evangelism, fasting, prayer, and miracles, praying continuously since her departure in January. However, they entered a formal, secluded, and intense 14-day vigil starting Nehasse 1. How could the disciples of our Lord stay silent when the Mother of God was hidden from them? After two weeks of prayer, God answered their supplications and delivered her body to them on Nehasse 15. They wrapped it in fine linen and buried it in Gethsemane. On the third day (Nehasse 16 / August 22), she resurrected from the dead, mirroring the Resurrection of her beloved Son, Jesus Christ—a mystery celebrated as "Keme Tinsae Welda" (Like the Resurrection of her Son).',
        'As the Apostle Saint Thomas was returning from his mission field on a cloud, he encountered the Holy Virgin Mary ascending into heaven. Filled with sorrow because he had missed both the Resurrection of Christ and now the Resurrection of Mary, he wished to cast himself down from the cloud. Seeing his distress, the Virgin Mary comforted him: "Do not grieve, Thomas! For you have witnessed my resurrection and ascension, which the other Apostles did not see. Rejoice!" She then gave him her holy sash (Seben) as a witness of her bodily assumption and sent him to Jerusalem to bear witness. She then ascended into heaven, and Thomas descended to Jerusalem.',
        'After receiving her blessing, Thomas went to the other Apostles and, pretending to know nothing, asked, "What has become of our Holy Mother?" They replied, "We found her body and buried her." Thomas remarked, "How can a death that occurred in January have a burial in August?" Enraged, Saint Peter rebuked Thomas for his historical doubt and asserted that he must accept the testimony of her burial. Peter went to open the tomb to show Thomas the body, but upon opening it, they found the tomb empty. Peter stood there in absolute shock and wonder.',
        'Thomas then revealed the truth: "My brothers, I asked only because I feared you wouldn\'t believe me, but I indeed met our Holy Mother as she ascended." He presented her holy shroud (Seben) to them. Rejoicing in her glorious resurrection and assumption, the Apostles divided the sash among themselves for blessing. The church scholars teach that the long sash tied to the hand-crosses of deacons and priests, and the white turban (Shash) wrapped around their heads, are symbolic representations of the Virgin Mary\'s holy sash. May the mercy of God, the intercession of the Virgin Mary, and the blessings of the Apostles be with us all.'
      ],
      blessingAm: 'የእግዚአብሔር ቸርነት፣ የእመቤታችን የቅድስት ድንግል ማርያም አማላጅነት፣ የቅዱሳን ሐዋርያት ጸጋና በረከት አይለየን፣ አሜን።',
      blessingEn: 'May the grace of God, the intercession of our Lady Virgin Mary, and the blessing of the holy Apostles be with us all, Amen.'
    }
  },
  {
    id: 'new-year-enkutatash',
    category: 'feast',
    nameEn: 'Ethiopian New Year (Enkutatash & Saint John)',
    nameAm: 'መስከረም ፩ ቀን የዘመን መለወጫ (ዕንቁጣጣሽና ቅዱስ ዮሐንስ)',
    periodEn: 'Meskerem 1 (September 11 or 12 in leap years)',
    periodAm: 'መስከረም ፩ ቀን',
    durationEn: 'High Feast',
    durationAm: 'ታላቅ በዓል',
    theologyEn: 'Meskerem 1 is the beginning of all months and the New Year in Ethiopia, known as Zemen Melowecha, Enkutatash, and the Feast of St. John the Baptist. It marks the renewal of creation, where the day and night are exactly equal (12 hours each) as the heavenly luminaries complete their annual cycles. It commemorates the appearance of dry land after Noah\'s flood, the arrival of the Queen of Sheba with jewels ("Enku") returning from King Solomon, and St. John as the gateway to the Gospel.',
    theologyAm: 'በኢትዮጵያ የወራት ሁሉ መጀመሪያ መስከረም ፩ ቀን ነው፡፡ ይህ ዕለት ዘመን መለወጫ፣ ዕንቁጣጣሽ እና የቅዱስ ዮሐንስ በዓል እየተባለ ይጠራል። ብርሃናት (ፀሐይ፣ ጨረቃና ከዋክብት) የዓመት ዑደታቸውን በጳጉሜ ጨርሰው አዲስ ዑደት የሚጀምሩበት፣ ሌሊቱና ቀኑ እኩል ፲፪ ሰዓት የሚሆንበት፣ በኖኅ ዘመን ከጥፋት ውኃ በኋላ ምድር የታየችበት፣ ንግሥተ ሳባ ከሰሎሞን ዘንድ ስትመለስ "ዕንቁ ለጣትሽ" ተብሎ የተሰጣት ቀለበትና መጥምቁ ዮሐንስ የዘመነ ወንጌል መነሻ ወይም በር በመሆኑ የሚከበር ታላቅ በዓል ነው።',
    observanceEn: [
      'Celebrating the New Year (Zemen Melowecha) with prayers of thanksgiving, seeking divine renewal: "Renew our days as of old" (Lamentations 5:21).',
      'Singing traditional hymns and welcoming the spring season symbolized by the blooming of Adey Abeba (yellow daisies).',
      'Commemorating Saint John the Baptist as the voice of one crying in the wilderness and the gateway to the New Covenant (New Testament).',
      'Exchanging New Year blessings, wearing traditional white cultural clothing, and sharing festive meals with family and the needy.'
    ],
    observanceAm: [
      '“ዘመናችንን እንደ ቀድሞ አድሱ” (ሰቆቃወ ኤር. ፭፥፳፩) በማለት አዲሱን ዓመት በምስጋና፣ በጾምና በጸሎት ፈጣሪን በመለመን መጀመር።',
      'ምድር በአደይ አበባ አሸብርቃ የምትታይበትን የጸደይ (አበባ) ወቅት መግባት በደስታና በአዲስ ተስፋ ማክበር።',
      'መጥምቁ ዮሐንስን የዘመነ ወንጌል በር ወይም መነሻ በማድረግ ማሰብ፣ በስንክሳር የተጻፈውን የበረከት ቃል መዘከር።',
      'የእንቁጣጣሽ በዓልን ምክንያት በማድረግ ነጭ ባህላዊ ልብሶችን በመልበስ፣ ለተቸገሩት መመጽወትና በረከትን መካፈል።'
    ],
    narrative: {
      titleAm: 'የዘመን መለወጫ፣ የእንቁጣጣሽ እና የቅዱስ ዮሐንስ በዓል ታሪካዊ አመጣጥ',
      titleEn: 'The Historical Origin of the Ethiopian New Year, Enkutatash, and the Feast of Saint John',
      paragraphsAm: [
        'በኢትዮጵያ የወራት ሁሉ መጀመሪያ መስከረም ነው፡፡ ይህ ወር ዘመን መለወጫ፣ ዕንቁጣጣሽ፣ ቅዱስ ዮሐንስ እየተባለ ይጠራል፡፡ ስለ አዲስ ዓመት በተለያየ ስም የመጠራቱ ታሪካዊ አመጣጥና ስያሜ መነሻ ሃሳቡ የሚከተለው ነው፡፡',
        'የመጀመሪያው ስያሜ ዘመን መለወጫ ነው፡፡ ዘመን መለወጫ መስከረም ወር የሆነበት ምክንያት ብርሃናት (ፀሐይ፣ ጨረቃ፣ ከዋክብት) የዓመት ዑደታቸውን በጳጉሜ ወር ጨርሰው በመስከረም ወር ስለሚጀምሩ ነው፡፡ “ሌሊቱም ከቀኑ ጋራ ይተካከላል፡፡ ዓመቱንም ጠንቅቀው ቢቆጥሩት ሦስት መቶ ስልሳ አራት ቀን ይሆናል” (መጽሐፈ ሄኖክ ፳፮፥፵፬)። ቅዱስ መጽሐፍ “ዘመናችንን እንደ ቀድሞ አድሱ” (ሰቆቃወ ኤር. ፭፥፳፩) ይላል። በሌላ በኩል በዘመነ ኖኅ ዓለምን ንፍር ውኃ ካጠለቀለቃት በኋላ ዳግመኛ ውኃው የጎደለበት በመሆኑ (መጽሐፈ ኩፋሌ ፯፥፩) “በመጀመሪያው ወር መባቻም ምድር ታየች” ተብሎ የተጻፈው በዚህ ዕለት ነው።',
        'ሁለተኛው ስያሜ ዕንቁጣጣሽ ነው፡፡ ዕንቁጣጣሽ የተባለበት ምክንያት አንደኛ “ዕንቁ - ዕፅ አመጣሽ” ብሎ የአበባውን በአህጉራት ላይ መፈንዳትና መብቀል ያመለክታል፡፡ ሁለተኛ ኖኅ ለሦስቱ ልጆቹ በእጣ ሲያካፍላቸው አፍሪካ ለካም ደረሰችው፡፡ በአፍሪካ ምድርም ሲገባ በመጀመሪያ ያረፈው በኢትዮጵያ ነበር፡፡ ሀገሪቱም በአደይ አበባ አሸብርቃ ነበር፡፡ ወሩ ወርኀ መስከረም በመሆኑ ደስ ብሎት "ዕንቁ ዕጣ ወጣሽልኝ" በማለት ይህችን ወቅት እንቁጣጣሽ ብሏታል፡፡ ሦስተኛው ታሪክ (፩ ነገሥት ፲፥፩-፲) ኢትዮጵያዊቷ ንግሥት ሣባ (ንግሥተ አዜብ) የንጉሡን የሰሎሞንን ጥበብ ከመስማት ማየትን መርጣ ወደ ኢየሩሳሌም ከብዙ ሠራዊቶቿ ጋር ሄደች፡፡ ንጉሡም በደስታ ተቀብሎ እርሱም “እንቁ ለጣትሽ ወርኀ ጌጥ ይሁንሽ” በማለት አራት አይነት ቀለም የሚታይበት በቀንና በሌሊት የሚያበራ ቀለበት ሰጥቷታል፡፡ ወሩም መስከረም ነበር፡፡ ከዚህ በመነሣት "ዕንቁጣጣሽ" የሚለው ስያሜ ወጥቷል፡፡',
        'ሦስተኛው የአዲስ ዘመን ስያሜ ቅዱስ ዮሐንስ ነው፡፡ የመጥምቁ ዮሐንስ ተግባር ለዘመነ ወንጌል በር ወይም መነሻ እንዲሆን ለኢትዮጵያ ዐውደ ዓመት መስከረም አንድ ቀን እንዲከበር አባቶች ወስነዋል (ድርሳነ ዮሐንስ አፈወርቅ ገጽ ፩-፫)። መጽሐፈ ስንክሳር “የመስከረም ወር የተባረከ ነው፡፡ እርሱም የግብጽና የኢትዮጵያ ዓመቶች መጀመሪያ ነው፡፡ የዚህ ወር ቀኑና ሌሊቱ እኩል ፲፪ ሰዓት ነው፡፡ ከዚህ በኋላ ቀኑ እየጎደለ ይሄዳል” በማለት ይገልጸዋል።'
      ],
      paragraphsEn: [
        'In Ethiopia, the beginning of all months is Meskerem (September). This month is beautifully called Zemen Melowecha (New Year), Enkutatash (Gift of Jewels), and Saint John (Feast of Saint John the Baptist). The historical origins and theological significance of these three distinct names are rooted in biblical, astronomical, and national histories.',
        'The first name, Zemen Melowecha (New Year), is chosen because the heavenly luminaries—the sun, moon, and stars—complete their annual cycles in Pagume (the 13th month of 5 or 6 days) and begin their new orbit in Meskerem. As written in the Book of Enoch 26:44: "The night is equalized with the day, and when the year is counted precisely, it is three hundred and sixty-four days." The scriptures appeal: "Renew our days as of old" (Lamentations 5:21). Historically, this day also commemorates the end of Noah\'s flood, as written in the Book of Jubilees 7:1: "On the first day of the first month, the dry land appeared."',
        'The second name, Enkutatash, has three traditional origins. First, it literally means "gem of plants," referring to the sudden blossoming of beautiful yellow daisies (Adey Abeba) across the mountains. Second, when Noah divided the earth among his three sons, Africa fell to Ham. Upon entering the continent, Ham\'s descendants first arrived in Ethiopia, which was adorned with blooming Adey Abeba flowers. Delighted by its beauty, Noah declared, "A gem of a lot has come out to you!" giving rise to "Enku-Tatash." Third, as recorded in 1 Kings 10:1-10, when the Ethiopian Queen of Sheba returned from visiting King Solomon in Jerusalem, the king gifted her a magnificent ring that shone day and night with four colors, saying, "A gem (Enku) for your finger (Tatash), let this be your month of adornment." Since this exchange occurred in Meskerem, the season was named Enkutatash.',
        'The third name is Saint John, dedicated to Saint John the Baptist. The early Church Fathers designated Meskerem 1 for his feast so that his ministry as the forerunner would serve as the gateway (entrance) to the New Covenant/New Year (Homily of St. John Chrysostom, pp. 1-3). The Synaxarium states: "The month of Meskerem is blessed. It is the beginning of the years of Egypt and Ethiopia. In this month, the day and night are exactly equal to 12 hours, after which the days begin to shorten."'
      ],
      blessingAm: 'አዲሱ ዓመት የሰላም፣ የፍቅርና የበረከት ዘመን ያድርግልን፣ አሜን።',
      blessingEn: 'May the New Year be a season of peace, love, and divine blessings for us all, Amen.'
    }
  },
  {
    id: 'archangel-michael-hidar',
    category: 'feast',
    nameEn: 'Feast of Archangel Saint Michael (Hidar 12)',
    nameAm: 'የሊቀ መላእክት የቅዱስ ሚካኤል የሹመት በዓል (ሕዳር ፲፪)',
    periodEn: 'Hidar 12 (November 21)',
    periodAm: 'ሕዳር ፲፪ ቀን',
    durationEn: 'High Feast',
    durationAm: 'ታላቅ በዓል',
    theologyEn: 'Michael means "Who is like God?", signifying God\'s absolute greatness and that there is no other deity like Him. This feast on Hidar 12 commemorates his appointment as the chief of all heavenly hosts, replacing Satnael (Satan) who fell due to his pride. He is honored as the Angel of Power, the Steward of the Old Testament, and the Angel of Counsel. St. Michael also guided and protected the people of Israel from Egypt all the way to Canaan, the Promised Land.',
    theologyAm: 'ሚካኤል ማለት "እንደ እግዚአብሔር ያለ ማነው?" ማለት ነው፡፡ ይህም የእግዚአብሔርን ታላቅነትና እርሱን የሚመስል አምላክ እንደሌለ ያመለክታል። ሕዳር ፲፪ ቀን መልአከ ኃይል፣ መጋቤ ብሉይ፣ መልአከ ምክር የተባለው ታላቁ መልአክ ቅዱስ ሚካኤል በኢዮር ባለችው በአራተኛይቷ ከተማ በሚኖሩት ኃይላት እና በአሥሩ ነገደ መላእክት ላይ አለቃ ሆኖ የተሾመበት (የቆመበት) ዕለት ነው። እግዚአብሔር ሳጥናኤልን በትዕቢቱ ምክንያት ሥልጣኑን ገፍፎ ወደ ምድር ሲጥለው ቅዱስ ሚካኤል በእርሱ ቦታ ተሹሟል። እንዲሁም ቅዱስ ሚካኤል ሕዝበ እስራኤልን ከግብጽ ምድር ጀምሮ ከነዓን እስኪገቡ ድረስ እየመራ፣ እየጠበቀና አብሯቸው በመጓዝ ምድረ ርስት እንዲገቡ ያደረገበት መታሰቢያ ነው።',
    observanceEn: [
      'Commemorating the appointment and coronation of Archangel Michael on Hidar 12 with grand Yaredic hymns (Mahlet) and Divine Liturgies.',
      'Celebrating the protective presence of Saint Michael, who guided Israel from Egypt through the wilderness to the Promised Land.',
      'Praising the angel who stands as the chief intercessor for all creation and the one who opens and closes the veil of the Holy Trinity.',
      'Seeking Saint Michael’s powerful intercession, protection against spiritual enemies, and emulating his supreme humility.'
    ],
    observanceAm: [
      'በየዓመቱ ሕዳር ፲፪ ቀንን በታላቅ የሌሊት ማኅሌትና በበዓል ቅዳሴ የቅዱስ ሚካኤልን የሹመት ክብርና ባለሟልነት በደስታ ማክበር።',
      'ቅዱስ ሚካኤል ሕዝበ እስራኤልን ከግብጽ ምድር መርቶ በበረሃ ተራድቶ ምድረ ርስት እንዲገቡ ያደረገውን ድንቅ የእግዚአብሔር ጥበቃና ተራዳኢነት ማሰብ።',
      'ለትውልድ ሁሉ የሚማልደውን፣ የቅድስት ሥላሴን መንጦላዕት የሚከፍተውንና የሚዘጋውን የመላእክት አለቃ ክብርና የባለሟልነት ቃል ኪዳን መዘከር።',
      'የመልአኩን ታላቅ ትሕትና ምሳሌ በማድረግ፣ በትዕቢት የወደቀውን ሳጥናኤልን ድል የነሳበትን ኃይል እያሰቡ በሃይማኖትና በትሕትና መኖር።'
    ],
    narrative: {
      titleAm: 'የሊቀ መላእክት የቅዱስ ሚካኤል የሹመት፣ የባለሟልነትና የተራዳኢነት ታሪክ (ሕዳር ፲፪)',
      titleEn: 'The History of the Coronation, Intercession, and Miraculous Guidance of Archangel Saint Michael (Hidar 12)',
      paragraphsAm: [
        'ሕዳር ፲፪ ቀን በኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን ዘንድ በታላቅ ክብርና መንፈሳዊ ደስታ ከሚከበሩት የቅዱስ ሚካኤል በዓላት መካከል ዋነኛው ነው፡፡ ሚካኤል ማለት "እንደ እግዚአብሔር ያለ ማነው?" ማለት ነው፡፡ ይህም የእግዚአብሔርን ገናንነትና እሱ የሚመስል አምላክ እንደሌለ የሚያመለክት ነው። ቅዱስ ሚካኤል የስሙ ዘርፍ ሆነው የሚጨመሩ ታላላቅ መጠሪያዎች አሉት፤ እነዚህም ከእግዚአብሔር ዘንድ የተሰጠውን የባለሟልነትና የክብር ታላቅነት የሚገልጹ ናቸው፡፡ ይኸውም መልአከ ኃይል፣ መጋቤ ብሉይ፣ መልአከ ምክሩ በመባል ይጠራል።',
        'መልአከ ኃይል የተባለው እግዚአብሔር በእርሱ አማካይነት ታላላቅ ሥራዎችን በመሥራት ኃይሉን ስለገለጸ - በትዕቢት ተሞልቶ የነበረውን ዲያብሎስን (ሳጥናኤልን) ከነሠራዊቱ ድል አድርጎ ወደ ምድር ስለጣለው ነው፡፡ መጋቤ ብሉይ የተባለበት ምክንያት ደግሞ በብሉይ ኪዳን ውስጥ ከእግዚአብሔር እየተላከ ብዙ ታላላቅና ድንቅ ሥራዎችን የሠራ፣ የእግዚአብሔርን ሕዝብ የመራ በመሆኑ ነው፡፡ መልአከ ምክር ወይም የእግዚአብሔር የምክሩ አበጋዝ የተባለበት ምክንያት እግዚአብሔርን በምክሩ ይረዳዋል ለማለት ሳይሆን እግዚአብሔር የሚሠራውን ድንቅ የፍጥረት ሥራና የደኅንነት ምስጢር ለቅዱስ ሚካኤል ስለሚገልጽለት፣ በእርሱም አማካኝነት ለፍጥረት ስለሚሠራ ነው፡፡',
        'እንደ ቅዱሳን አባቶቻችን አስተምህሮ ሕዳር ፲፪ ቀን ታላቁ መልአክ ቅዱስ ሚካኤል በኢዮር ባለችው በአራተኛይቷ ከተማ በሚኖሩት ኃይላት እና በአሥሩ ነገደ መላእክት ላይ አለቃ ሆኖ የተሾመበት (የቆመበት) ቀን ነው። እግዚአብሔር ሳጥናኤልን በትዕቢቱ ምክንያት ሥልጣኑን ገፍፎ ወደ ምድር ሲጥለው ቅዱስ ሚካኤል በእርሱ ቦታ በአሥሩ ከተማ በመቶውም ነገደ መላእክት ላይ ተሹሟል፡፡ ይህን ሁለተኛውን ሹመት ያገኘው በሚያዚያ ፪ ቀን እንደሆነ "አክሲማሮስ" በሚባለው የቤተክርስቲያናችን መጽሐፍ ላይ ተጽፎ እናገኘዋለን።',
        'ሌላው ታላቅ የታሪክ መታሰቢያ ደግሞ በዚህች ቀን የሰማይ ሰራዊት ሁሉ አለቃቸው፣ የቅድስት ሥላሴን መንጦላእት የሚከፍትና የሚዘጋው፣ ለፍጥረት ሁሉ የሚማልደው ታላቁ መልአክ ቅዱስ ሚካኤል የተሾመበት መሆኑ ብቻ ሳይሆን፣ ሕዝበ እስራኤልን ከግብጽ ምድር ጀምሮ ከነዓን እስኪገቡ ድረስ በደመናና በእሳት ዓምድ እየመራ፣ በበረሃው ጠብቆና ተራድቶ አብሯቸው በመጓዝ ምድረ ርስት እንዲገቡ ያደረገበት ታላቅ ዕለት ነው። በመሆኑም በየዓመቱ ሕዳር ፲፪ ቀን ምእመናን ይህንን ታላቅ ውለታና የመልአኩን ተራዳኢነት በማሰብ በታላቅ በረከት ያከብሩታል።'
      ],
      paragraphsEn: [
        'Hidar 12 (November 21) is one of the most prominent monthly and annual feasts of Archangel Saint Michael celebrated with immense spiritual joy in the Ethiopian Orthodox Tewahedo Church. The name Michael translates to "Who is like God?" This holy name signifies the absolute supremacy of God, proclaiming that there is no other savior or deity like Him. Saint Michael is addressed with several highly honored titles that reveal his divine intimacy and status before God, such as the "Angel of Power" (Mela\'eke Hayl), "Steward of the Old Testament" (Megabe Bluy), and "Angel of Counsel" (Mela\'eke Mikru).',
        'He is called the "Angel of Power" because God executed mighty works through his hand, most notably defeating the proud Satnael (Satan) and casting him and his rebellious host out of heaven. He is named the "Steward of the Old Testament" because he was repeatedly sent by God to perform great wonders, deliver divine messages, and protect the patriarchs and prophets. Finally, he is titled the "Angel of Counsel" or "Chief of God\'s Counsel," not because God requires advice, but because the Almighty reveals His glorious creations and salvation plans to Saint Michael and accomplishes them through him.',
        'According to the teachings of the Holy Fathers, Hidar 12 is the day when the great Archangel Michael was officially appointed and stood as the chief over the "Powers" (Hailat) dwelling in the fourth city of the highest heaven (Iyor) and over the ten legions of angels. When God stripped Satnael of his authority due to his pride, Saint Michael was elevated in his place over all ten celestial cities and the hundred legions of angels. (Note: His second coronation/appointment is remembered on Miazia 2, as documented in the liturgical book "Aksimaros").',
        'Beyond his heavenly coronation, St. Michael is commemorated on this day for his earthly guidance of the children of Israel. He accompanied, protected, and led them from the land of Egypt, through the perilous wilderness, all the way to Canaan, enabling them to inherit the Promised Land. He is also honored as the great mediator who opens and closes the veil of the Holy Trinity to present the prayers of all creation. Thus, believers celebrate Hidar 12 to seek his powerful intercession and thank God for sending such a helper.'
      ],
      blessingAm: 'የሰማይ ሠራዊት አለቃ የቅዱስ ሚካኤል ጥበቃ፣ ምልጃና በረከት ከሁላችን ጋር ይሁን፣ አሜን።',
      blessingEn: 'May the protection, intercession, and blessing of Saint Michael, the chief of the heavenly hosts, be with us all, Amen.'
    }
  },
  {
    id: 'tsion-mariam-hidar',
    category: 'feast',
    nameEn: 'Feast of Saint Mary of Zion (Hidar Tsion)',
    nameAm: 'ኅዳር ጽዮን ማርያም (የታቦተ ጽዮን ወደ ኢትዮጵያ መምጣት በዓል)',
    periodEn: 'Hidar 21 (November 30 or December 1 in leap years)',
    periodAm: 'ኅዳር ፳፩ ቀን',
    durationEn: 'High Feast',
    durationAm: 'ታላቅ በዓል',
    theologyEn: 'Hidar Tsion commemorates the historical arrival of the Ark of the Covenant (Tabote Tsion) in Aksum, Ethiopia, during the reign of Emperor Menelik I, and honors the Holy Virgin Mary as the True Ark of the New Covenant. In EOTC theology, the Old Testament Ark, which contained the Tablets of the Law and performed immense miracles, prefigured the Virgin Mary, who carried the Incarnate Word of God within her womb.',
    theologyAm: 'ኅዳር ፳፩ ቀን የእመቤታችን የቅድስት ድንግል ማርያም የ“ኅዳር ጽዮን” በዓል ነው። ይህ ዕለት ታቦተ ጽዮን በቀዳማዊ ምኒልክ አማካኝነት በፈቃደ እግዚአብሔርና በቅዱስ ሚካኤል መሪነት ከአክሱም የደረሰችበት፣ በብሉይ ኪዳን ታቦትና በዘመነ ሐዲስ በእመቤታችን መካከል ያለውን ረቂቅና ድንቅ ምስጢራዊ ንጽጽር የምናስብበት፣ ክርስትና የሀገሪቱ ብሔራዊ ሃይማኖት ሆኖ የታወጀበትና በአብርሃ ወአጽብሃ የተሠራው ቤተ መቅደስ የቅዳሴ ቤቱ የተከበረበት ታላቅ ታሪካዊና መንፈሳዊ በዓል ነው።',
    observanceEn: [
      'Embarking on grand pilgrimages to the Cathedral of Our Lady Mary of Zion in Aksum, the spiritual center of Ethiopian Orthodox Christianity.',
      'Reflecting on the theological typologies compiled by Saint Ephrem, comparing the gold-plated Ark of Covenant to the pure, stainless virginity and holiness of Mary.',
      'Commemorating the multi-faceted historical events of Hidar 21, including the arrival of the Ark in Ethiopia and the 330 A.D. proclamation of Christianity by Kings Abraha and Atsbeha.',
      'Participating in vibrant Yaredic chanting (Mahlet), divine liturgies, and holy processions celebrating the covenant of mercy.'
    ],
    observanceAm: [
      'የኢትዮጵያ ክርስትናና ሥልጣኔ መገኛ ወደሆነችው አክሱም ማርያም ጽዮን በመጓዝ በዓሉን በታላቅ የቤተ ክርስቲያን ሥርዓትና መንፈሳዊ ሐሴት ማክበር።',
      'ቅዱስ ኤፍሬም በድርሳናቱ እንደገለጠው፣ ከማይነቅዝ እንጨት ተቀርጾ በወርቅ ከተለበጠው የብሉይ ኪዳን ታቦት ይልቅ በቅድስና ያጌጠችውን የእመቤታችንን ምስጢር ማሰብ።',
      'በዕለቱ የሚከበሩትን ታሪካዊ መታሰቢያዎች (የአብርሃ ወአጽብሃ አዋጅ፣ የታቦቱ ከዝዋይ ሐይቅ መመለስና የነቢያቱን ራእይ) በጸሎት መዘከር።',
      'ካህናትና ምእመናን ሌዋውያን ታቦተ ጽዮንን ከበው ያቀርቡት እንደነበረው ውዳሴ በካህናት ዝማሬ፣ ማኅሌትና በቅዳሴ እመቤታችንን ማክበር።'
    ],
    narrative: {
      titleAm: 'የታቦተ ጽዮን ታሪክ፣ ወደ ኢትዮጵያ መምጣትና የእመቤታችን የቅድስት ድንግል ማርያም ምስጢራዊ ንጽጽር',
      titleEn: 'The History of the Ark of Zion, Its Arrival in Ethiopia, and Its Sacred Typology to the Blessed Virgin Mary',
      paragraphsAm: [
        'በቅዱሳት መጻሕፍት ጽዮን የሚለው ቃል ተደጋግሞ በነቢያቱ ተነግሯል፡፡ ሆኖም የጽዮን ትርጉም እንደተነገረበት ዐውደ ትንቢት እንደተሰበከበት መዋዕለ ትምህርት ምስጢሩ ይለያያል፡፡ ታቦተ ጽዮን በፈቃደ እግዚአብሔር በነቢዩ ሙሴ አማካኝነት ለሰው ልጆች ተሰጥታ እስራኤላውያን ሲባረኩባት፣ መሥዋዕታቸውን ሲያቀርቡባት ከእግዚአብሔር ሲታረቁባት ኖረዋል፡፡ ለአርባ ዓመታት ያህል እስራኤላውያንን በክህነት ያገለግል የነበረው ካህኑ ዔሊ ዕድሜው ሲገፋ ሁለት ልጆቹን አፍኒን እና ፊንሐስን ሾማቸው፡፡ ሆኖም እነዚህ ወጣቶች ፈቃደ እግዚአብሔርን ተላልፈው መቅረዙን በማጥፋት፣ የመሥዋዕቱን ሥጋ ለራሳቸው በመውሰድና በዝሙት በመውደቅ ታላቅ በደል ፈጸሙ፡፡ በዚህም ምክንያት ፍልስጥኤማውያን በጦርነት አሸነፏቸው፤ ታቦተ ጽዮንም ተማረከች፡፡ ፍልስጥኤማውያን ታቦቷን ዳጎን ከተባለው ጣዖታቸው ላይ ቢያስቀምጧትም በማግስቱ ዳጎን ወድቆና ተሰባብሮ አገኙት (፩ ሳሙ ፭፥፬)። ኢትዮጵያዊው ሊቅ አባ ጽጌ ድንግል በሰቆቃወ ድንግል ድርሰቱ የእመቤታችንን ወደ ግብፅ መሰደድና የጣዖታትን መውደቅ ከታቦተ ጽዮንና ከዳጎን መቆራረጥ ጋር በማነጻጸር በጥልቀት ገልጾታል። ታቦተ ጽዮን በፍልስጥኤም ምድር እባጭና ቸነፈር ስላመጣችባቸውም በታላቅ ፍርሃት ወደ እስራኤል መለሷት።',
        'የታቦተ ጽዮን ወደ ሀገራችን ወደ ኢትዮጵያ መምጣት ታላቅ መንፈሳዊ ታሪክና ምስጢር ያለው ነው፡፡ ቅድስት ኢትዮጵያ በእግዚአብሔር የተወደደች ለመሆኗ ነቢያቱ መስክረዋል፡፡ ነቢዩ ቅዱስ ዳዊት “ኢትዮጵያ እጆቿን ወደ እግዚአብሔር ትዘረጋለች” (መዝ. ፷፰፥፴፩) በማለት እንደጻፈው ሕዝቡ በአምልኮተ እግዚአብሔር, በጾምና በጸሎት የሚኖር በመሆኑ ምድሪቱ የቃል ኪዳን ሀገር ሆናለች፡፡ የታቦተ ጽዮን ወደ ኢትዮጵያ መምጣት ዋናው ምክንያት በንግሥት ሳባ እና በንጉሥ ሰሎሞን ግንኙነት የጀመረው ታሪክ ነው፡፡ ንግሥተ ሳባ ወደ ኢየሩሳሌም ሄዳ የሰሎሞንን ጥበብ አይታ ካመሰገነች በኋላ ከንጉሡ ምኒልክን (እብነ መለክ - የንጉሥ ልጅ) ፀንሳ በጉዞ ላይ ወለደችው። ምኒልክ በሃያ ሁለት ዓመቱ አባቱን ለመጠየቅ ወደ ኢየሩሳሌም ሄዶ ሕገ ኦሪትንና ቋንቋውን ካጠና በኋላ፤ አሥራ ሁለት ሺሕ እስራኤላውያንን አስከትሎ ወደ ኢትዮጵያ ተመለሰ።',
        'ምኒልክና አብረውት የተነሡት ዕብራውያን ከታቦተ ጽዮን መለየቱ እጅግ አሳዝኖአቸው ስለነበር፣ በፈቃደ እግዚአብሔር ታቦተ ጽዮንን ከመንበሯ አንሥተው በሊቀ መላእክት በቅዱስ ሚካኤል መሪነት ይዘዋት ተጓዙ፡፡ እነርሱም ታቦተ ጽዮንን ይዘው አክሱም የደረሱበት ዕለት ኅዳር ፳፩ ቀን ነበር፡፡ ንግሥተ ሳባም በታላቅ ደስታና ክብር ተቀብላ አክሱም ከተማ መካከል ደብረ ማክዳ ላይ ደብተራ ኦሪት ሠርታ አስቀመጠቻት። ዛሬ በአክሱም የሚገኘው ዘመናዊው የአክሱም ጽዮን ገዳም ቅዳሴ ቤቱ ጥር ፴ ቀን ፲፱፻፵፯ ዓ.ም በታላላቅ የሀገር መሪዎችና እንግዶች ፊት ተከብሯል። ኅዳር ፳፩ ቀን በእመቤታችን በዓልነት የምናከብርበት ልዩ ምክንያቶች፡- በብሉይ ኪዳን ታቦቷ የፈጸመችውን ተአምራት ለማሰብ፣ ታቦተ ጽዮን አክሱም የደረሰችበት ዕለት በመሆኑ፣ በአብርሃ ወአጽብሃ ዘመን ክርስትና ብሔራዊ ሃይማኖት እንዲሆን አዋጅ የታወጀበት፣ ዘካርያስ፣ ሕዝቅኤልና ዕዝራ ያዩት ራእይ መፈጸሚያ፣ አብርሃና አጽብሃ የሠሩት ባለ ፲፪ ክፍል ቤተ መቅደስ ለመጀመሪያ ጊዜ የተቀደሰበት፣ እና በ፱ኛው መቶ ክፍለ ዘመን በዮዲት ጉዲት ምክንያት ወደ ዝዋይ ሐይቅ ተሰዳ የነበረችው ታቦት ወደ አክሱም የተመለሰችበት በመሆኑ ነው፡፡',
        'በእመቤታችን በቅድስት ድንግል ማርያም እና በቃል ኪዳኑ ታቦት መካከል ጥልቅ የሆነ ምስጢራዊ ትምህርት አለ (ዘፀ. ፳፭፥፱-፳)። የብሉይ ኪዳን ታቦት የእግዚአብሔር የክብር መገለጫ ሆና ሳለ፣ ሦርያዊው ሊቅ ቅዱስ ኤፍሬም “ታቦት በወርቅ ልቡጥ እምኩለሔ ዘግቡር እምፅ ዘኢይነቅዝ” እያለ በታቦቷና በእመቤታችን መካከል ያለውን ምስጢራዊ ንጽጽር አስተምሮናል። ታቦተ ጽዮን ከማይነቅዝ እንጨት ተቀርጻ በውስጥና በውጭ በወርቅ እንደተለበጠች፣ እመቤታችን ቅድስት ድንግል ማርያምም በንጽሐ ሥጋ፣ በንጽሐ ነፍስና በንጽሐ ልቡና ተሸልማለች፤ በኃጢአት ሳትለወጥ በንጽሕና ኖራለች። ጠቢቡ ሰሎሞንም “አልብኪ ነውር ወኢምንትኒ ላዕሌኪ” (ምክንያታዊ ነውር ኃጢአት የሌለብሽ፣ ንጽሕት በድንግልና አንቺ ነሽ - መኃ. ፬፥፯) ብሏታል። ታቦቷ የቃለ እግዚአብሔር ማደሪያ እንደነበረችው ሁሉ፣ እመቤታችንም ለፈጣሪ ማደሪያ በመሆን ሰማይና ምድር የማይወስኑትን በማኅፀኗ ዘጠኝ ወር ከቀን ተሸክማዋለችና እርሷ የእውነተኛው ቃል ኪዳን ታቦት ናት።'
      ],
      paragraphsEn: [
        'Throughout the Holy Scriptures, the word "Zion" is frequently proclaimed by the prophets, carrying deep theological and mystical meanings. The Tabernacle of Zion (Tabote Tsion), given by God through the Prophet Moses, was the source of blessing and reconciliation for Israel. However, during the priesthood of Eli, his sons Hophni and Phinehas sinned gravely before God by neglecting the holy lamp, taking sacrificial meats for themselves, and committing immorality. Because of their transgression, God allowed the Philistines to defeat Israel and capture the Ark of Zion. The Philistines placed the Ark in the temple of their idol Dagon, but the next morning, Dagon was found fallen and shattered before the Ark (1 Samuel 5:4). The Ethiopian scholar Abba Tsige Dingil, in his masterpiece "Seqoqawe Dingil" (Lamentation of the Virgin), beautifully compares the shattering of Dagon before the Ark to the falling of Egyptian idols when the Virgin Mary fled to Egypt with her divine Child. Plagued by tumors and devastation, the Philistines returned the Ark to Israel with great fear.',
        'The arrival of the Ark of Zion in Ethiopia is a momentous spiritual milestone. The prophets testified that Ethiopia is highly favored by God; King David prophesied: "Ethiopia shall stretch out her hands unto God" (Psalms 68:31), representing a nation devoted to continuous prayer, fasting, and charity. The journey of the Ark began with the historic relationship between the Queen of Sheba and King Solomon. Upon returning from Jerusalem, the Queen gave birth to Menelik I (Ebne Melek, meaning "Son of the King"). When Menelik reached 22, he traveled to Jerusalem to meet his father King Solomon, studied the Law of Moses, and returned to Ethiopia accompanied by twelve thousand firstborn Israelites, including Azarias, the son of the High Priest Zadok.',
        'Saddened to leave the Ark of Covenant behind, the young Israelites, by God\'s divine will and under the leadership of the Archangel Saint Michael, took the Ark of Zion from its sanctuary and brought it with them. They safely arrived in Aksum with the Ark of Zion on Hidar 21. Queen Sheba received them with immense joy and established the Tabernacle in Debre Makda in Axum. The modern Cathedral of Axum Tsion was consecrated on Tir 30, 1957 E.C. (February 7, 1965) in the presence of Emperor Haile Selassie and Queen Elizabeth II of Great Britain. The feast of Hidar 21 is celebrated for multiple historic reasons: commemorating the Old Testament miracles of the Ark, its arrival in Aksum, the 330 A.D. proclamation of Christianity as Ethiopia\'s state religion under Kings Abraha and Atsbeha, the fulfillment of the visions of Zechariah, Ezekiel, and Ezra, the consecration of the 12-section golden temple of Abraha and Atsbeha, and the safe return of the Ark to Axum in the 10th century after fleeing the persecutions of Queen Yodit Gudit.',
        'There is a profound theological comparison between the Ark of the Covenant and the Blessed Virgin Mary (Exodus 25:9-20). While the Old Testament Ark represented God\'s earthly glory, Saint Ephrem the Syrian taught: "The Ark covered with gold inside and out, made of incorruptible wood, prefigured the Virgin Mary." Just as the Ark was constructed from decay-resistant wood and overlaid with pure gold, the Virgin Mary was adorned with purity of body, soul, and heart, remaining stainless from sin. As King Solomon sang: "You are altogether beautiful, my love; there is no flaw in you" (Song of Songs 4:7). Furthermore, just as the Ark housed the stone tablets containing the Word of God, Mary became the living Tabernacle of the Incarnate Word of God, carrying the Creator whom the heavens and earth cannot contain. She is thus honored as the True Ark of the New Covenant.'
      ],
      blessingAm: 'የጽዮን ማርያም አማላጅነት፣ የቃል ኪዳኗ ረድኤትና የቅዱሳን ጻድቃን በረከት ሁላችንንም ይጠብቀን፣ አሜን።',
      blessingEn: 'May the intercession of Mary of Zion, the grace of her covenant, and the blessings of all the righteous protect us all, Amen.'
    }
  },
  {
    id: 'abune-aregawi-tikimt',
    category: 'feast',
    nameEn: 'Feast of Saint Abune Aregawi (Tikimt 14)',
    nameAm: 'ጥቅምት ፲፬ ቀን የጻድቁ አቡነ አረጋዊ በዓል',
    periodEn: 'Tikimt 14 (October 24 or 25 in leap years)',
    periodAm: 'ጥቅምት ፲፬ ቀን',
    durationEn: 'High Feast',
    durationAm: 'ታላቅ በዓል',
    theologyEn: 'Abune Aregawi (meaning "The Elder") is one of the most revered saints in Ethiopia. Born in the mid-4th century in Rome to a royal lineage, he was named Zemikael by his parents and Gebre Amlak during his ascetic life in Egypt under Saint Pachomius. He is one of the illustrious "Nine Saints" who migrated to Ethiopia in 451 A.D. after the Council of Chalcedon. Guided by Archangel Michael and carried to the summit of the sheer cliff of Debre Damo by a giant serpent (instead of a rope), he established the historic monastery of Debre Damo, translating books, preaching the Gospel, and organizing monasticism in Ethiopia.',
    theologyAm: 'ጻድቁ አቡነ አረጋዊ በ፬ኛው መቶ ክፍለ ዘመን አጋማሽ በሮም (ኢጣሊያ) ከነገሥታት ወገን የተወለዱ፣ በጥበብና በሃይማኖት የታነጹ፣ "ዘሚካኤል"፣ "ገብረ አምላክ" እና "አረጋዊ" በሚባሉ ስሞች የሚጠሩ ታላቅ ኢትዮጵያዊ ጻድቅ አባት ናቸው። ከሮምና ከመካከለኛው ምሥራቅ ወደ ኢትዮጵያ በ፬፻፶፩ ዓ.ም. (ከቃልኬዶን ጉባኤ በኋላ) ከፈለሱት ታዋቂዎቹ ዘጠኙ ቅዱሳን መካከል አንዱ ሲሆኑ፣ በደብረ ዳሞ ገዳም በሰማያዊ መሪነትና በቅዱስ ሚካኤል ተራዳኢነት በዘንዶ ጅራት ተንጠልጥለው ተራራውን በመውጣት በጾም፣ በጸሎትና በትኅርምት ተጋድለዋል። የእግዚአብሔርን ቃል በማስተማር፣ መጻሕፍትን በመተርጎምና ገዳማትን በመመሥረት ለኢትዮጵያ ታላቅ መንፈሳዊ ብርሃን ሆነዋል።',
    observanceEn: [
      'Commemorating the departure (mystical disappearance) of Abune Aregawi on Tikimt 14 (October 24) with vibrant liturgies, Yaredic chants (Mahlet), and holy feasts.',
      'Honoring the collective contributions of the Nine Saints in cementing the Orthodox faith, translating scriptures, establishing historical monasteries, and reinforcing the monastic lineage.',
      'Reflecting on the miraculous ascent of Debre Damo where, by the command of Archangel Michael, a 60-cubit serpent carried the saint to the summit of the plateau, prompting him to shout "Hallelujah!"',
      'Emulating his absolute devotion, extreme fasting, and constant prayer, while seeking the intercession promised in his everlasting divine covenant.'
    ],
    observanceAm: [
      'በየዓመቱ ጥቅምት ፲፬ ቀንን (የጻድቁን የመሰወሪያ ዕለት) በአክሱምና በደብረ ዳሞ ገዳማት እንዲሁም በየአብያተ ክርስቲያናቱ በታላቅ የሌሊት ማኅሌት፣ በዝማሬና በቅዳሴ ማክበር።',
      'ዘጠኙ ቅዱሳን (አባ አሌፍ፣ አባ አረጋዊ፣ አባ ጰንጠሌዎን፣ አባ ገሪማ፣ አባ ጽሕማ፣ አባ አፍጼ፣ አባ ሊቃኖስ፣ አባ ይምዓታ፣ አባ ጉባ) በኢትዮጵያ ላደረጉት ታላቅ ሐዋርያዊ አገልግሎት፣ መጻሕፍትን የመተርጎም፣ ገዳማትን የመመሥረትና ሥርዓተ ምንኩስናን የማደራጀት ውለታ ምስጋና ማቅረብ።',
      'ቅዱስ ሚካኤል ለጻድቁ የላከውን ስድሳ ክንድ የሚረዝም ዘንዶና ጻድቁ በዘንዶው ጅራት ተንጠልጥለው ተራራውን የወጡበትንና "ሃሌ ሉያ" ብለው ያመሰገኑበትን ድንቅ ተአምር መዘከር።',
      'ጻድቁ አቡነ አረጋዊ እንደ ኤልያስና ሄኖክ በ፺፱ ዓመታቸው የተሰወሩበትንና የተቀበሉትን የማይፈርስ የቃል ኪዳን በረከት በማሰብ በጾምና በጸሎት መጋደል።'
    ],
    narrative: {
      titleAm: 'የጻድቁ አቡነ አረጋዊ (ዘሚካኤል) እና የዘጠኙ ቅዱሳን ታሪክ፣ ተጋድሎና ምስጢረ መሰወር (ጥቅምት ፲፬)',
      titleEn: 'The Hagiography, Monastic Labors, and Mystical Disappearance of Saint Abune Aregawi and the Nine Saints (Tikimt 14)',
      paragraphsAm: [
        'ጥቅምት ፲፬ ቀን በኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን ዘንድ በታላቅ መንፈሳዊ ደስታና በዓል ከሚከበሩት ታላላቅ ጻድቃን መካከል የአቡነ አረጋዊ በዓል ዋነኛው ነው፡፡ አቡነ አረጋዊ በሀገራችን ስም አጠራራቸው ከከበረ ቅዱሳን አባቶች አንዱ ሲሆኑ የተወለዱት በአራተኛው መቶ ክፍለ ዘመን አጋማሽ አካባቢ በሮም (ኢጣሊያ) ነው፡፡ ወላጆቻቸው "ንጉሥ ይስሐቅ" እና "ቅድስት እድና" ይባላሉ። ወላጆቻቸው "ዘሚካኤል" ሲሏቸው በበርሃ "ገብረ አምላክ" ተብለዋል፤ በኢትዮጵያ ደግሞ "አረጋዊ" (ማለትም ሽማግሌ፣ ታላቅ) ይባላሉ። አቡነ አረጋዊ ምንም የንጉሥ ልጅ ቢሆኑም በልጅነታቸው ቅዱሳት መጻሕፍትን ጠንቅቀው ተምረው ስለነበር ዓለማዊውን ክብር ትተው ጠፍተው ገዳም ገቡ። በግብጽ ገዳመ ዳውናስ የታላቁ ቅዱስ ጳኩሚስ ደቀ መዝሙር ሆነው ከነአባ ቴዎድሮስ ጋር ሥርዓተ መነኮሳትንና በትኅርምት መኖርን ተምረዋል።',
        'ከመነኮሱ ከዓመታት በኋላም ወደ ሀገራቸው ሮም ተመልሰው ወንጌልን በማስተማር ሰባት ያህል የቤተ መንግሥት ሰዎችን ወደ ምናኔ ማርከዋል። "የት ልሒድ?" ብለው ሲያስቡም ቅዱስ መልአክ በክንፉ ጭኖ ወስዶ ኢትዮጵያን አሳያቸው። ተመልሰውም ለስምንት ባልንጀሮቻቸው "ሐዋርያ ሳይሰብክላት በሕጓና በሥርዓቷ ጸንታ የምትኖር ሀገር አሳየኋችሁ" ብለው፣ ከቃልኬዶን ጉባዔ (በ፬፻፶፩ ዓ.ም.) በኋላ የተፈጠረውን ስደትና ክህደት ሽሽት ከእነርሱ ጋር ወደ ኢትዮጵያ መጡ። ከሮምና ከመካከለኛው ምሥራቅ ወደ ሀገራችን ከፈለሱት ዘጠኙ ቅዱሳን መካከል አንዱ አቡነ አረጋዊ ናቸው። ዘጠኙ ቅዱሳን የተባሉትም፡ አባ አሌፍ፣ አባ አረጋዊ፣ አባ ጰንጠሌዎን፣ አባ ገሪማ፣ አባ ጽሕማ፣ አባ አፍጼ፣ አባ ሊቃኖስ፣ አባ ይምዓታ እና አባ ጉባ ይባላሉ። እነዚህ ቅዱሳን በኢትዮጵያ የክርስትና እምነት እንዲስፋፋ፣ ሥርዓተ ቤተ ክርስቲያን እንዲጸና፣ የተለያዩ ቅዱሳት መጻሕፍት እንዲተርጎሙ፣ ስብከተ ወንጌል እንዲዳረስና ገዳማት እንዲመሠረቱ ከፍተኛ አስተዋጽዖ አበርክተዋል።',
        'ጻድቁ አቡነ አረጋዊ እናታቸውን ቅድስት እድናን እና ደቀ መዝሙራቸውን አባ ማትያስን ይዘው ከሁሉም ርቀው ጸጥ ያለ በዓት ሲፈልጉ ደብረ ዳሞን መረጡ። ነገር ግን ወደ ተራራዋ መውጫ አላገኙም ነበር። በዚያም የእናት ማረፊያ የሚሆን የሴቶች ገዳም መሥርተው "ደብረ በአተልሞ" አሏት። ጻድቁ ከተራራው ሥር ሦስት መዓልትና ሦስት ሌሊት ሲጸልዩ ከቆዩ በኋላ ቅዱስ ሚካኤል ተገለጠላቸው። መልአኩም "አረጋዊ ሆይ! አይዞህ አትፍራ፤ በሐረጓ በስተቀኝ በኩል ተቀመጥ፤ ወደ ተራራው ጫፍ ያወጣህ ዘንድ በገመድ ፋንታ ቁመቱ ስድሳ ክንድ የሆነ ታላቅ ዘንዶ እግዚአብሔር ይልክልሃል" አላቸው። ጻድቁም ለ፲፬ ቀናት በጾምና በጸሎት ሱባኤ ይዘው ከተቀመጡ በኋላ ዘንዶው መጣ። በዘንዶው ጅራት ላይ ወጥተው በቅጽበት ከተቀደሰው ተራራ ጫፍ ላይ ደረሱ። እንደደረሱም ሦስት ጊዜ ሰግደው "ሃሌ ሉያ ለአብ፣ ሃሌ ሉያ ለወልድ፣ ሃሌ ሉያ ለመንፈስ ቅዱስ" እያሉ ፈጣሪያቸውን አመሰገኑ፤ ስለዚህም ቦታው ደብረ ሃሌ ሉያ (ደብረ ዳሞ) ተባለ።',
        'በደብረ ዳሞ ተራራ ላይ አባታችን መጠነኛ በአት ሠርተው ታቦት አስገብተው በጾም፣ በስግደትና በጸሎት ተጠምደው ኖሩ። በጸሎታቸው ኃይል ብዙ ተአምራትን አደረጉ፤ በሽተኞችን ፈወሱ፣ ያላመኑትን አስተማሩ። አፄ ካሌብም "አባቴ ሆይ በጸሎትህ አስበኝ" ብሎ በለመናቸው ጊዜ በጸሎታቸው ረድኤት የመን ሄዶ ጠላቶቹን ድል አድርጎ ተመለሰ። የአፄ ካሌብ ልጅ አፄ ገብረ መስቀልም በተራራው ላይ ውብ ቤተ ክርስቲያን አነጸላቸው። በመጨረሻም ጻድቁ አቡነ አረጋዊ በ፺፱ ዓመታቸው ጥቅምት ፲፬ ቀን ጌታችን ኢየሱስ ክርስቶስ ተገልጦ "እንደ ነቢያት ኤልያስና ሄኖክ ትሰወራለህ፤ የሞት ጥላ አያርፍብህም" የሚል ታላቅ የቃል ኪዳን በረከት ከሰጣቸው በኋላ ከደቀ መዝሙራቸው ከማትያስና ከወንድሞቻቸው ፊት ተሰውረዋል። የጻድቁ አባታችን ረድኤትና በረከት አይለየን።'
      ],
      paragraphsEn: [
        'Tikimt 14 (October 24) is a highly celebrated annual feast in the Ethiopian Orthodox Tewahedo Church, dedicated to the memory and translation of Saint Abune Aregawi, one of the most prominent fathers of Ethiopian monasticism. Born in the mid-4th century to the Roman King Isaac and Saint Edna, his birth name was Zemikael. Despite his royal heritage and the worldly wealth awaiting him, Zemikael sought a spiritual life of asceticism, fleeing his palace to enter the Monastery of Dawanis in Egypt under the guidance of Saint Pachomius, where he was named Gebre Amlak (Servant of God) and thoroughly mastered the monastic disciplines.',
        'Years later, after returning briefly to Rome and converting several royals to the monastic life, an angel of God carried him on his wings to show him the land of Ethiopia. Filled with wonder, he returned and told his spiritual companions of a blessed land that preserved the True Faith even before receiving apostolic teaching. Following the Council of Chalcedon in 451 A.D. and the subsequent persecutions, he migrated to Ethiopia alongside eight other eminent fathers, collectively known as the "Nine Saints": Abba Alef, Abba Aregawi, Abba Pentaleon, Abba Garima, Abba Tsehma, Abba Afse, Abba Liqanos, Abba Yemata, and Abba Guba. Welcomed warmly by King Al-Ameda, they settled in Aksum (Beza Kettin), translating holy scriptures into Ge\'ez, constructing monastic communities, and greatly expanding the reach of the Gospel across Ethiopia.',
        'Seeking a more isolated cell for deep meditation, Abune Aregawi, along with his mother Saint Edna and his disciple Abba Mathias, traveled to the majestic plateau of Debre Damo. Finding its flat summit unreachable due to its vertical 60-meter cliffs, Saint Edna remained at the base to lead a convent of female monastics, which they named Debre Beatelmo (My Mother\'s Resting Place). The saint prayed at the foot of the mountain for three days and nights. The Archangel Michael appeared to him, saying: "Aregawi, be not afraid. God has given you authority. Stand to the right of the ivy; for instead of a rope, God will send a giant serpent measuring sixty cubits to carry you to the summit." After completing a 14-day fasting vigil, the serpent arrived, and wrapping itself around his tail, safely carried the saint to the peak. Overjoyed, he bowed three times and sang: "Hallelujah to the Father, Hallelujah to the Son, Hallelujah to the Holy Spirit," which led the site to be named Debre Hallelujah.',
        'On the summit, Saint Aregawi constructed a small prayer cell, housed the holy tabot, and lived in rigorous asceticism, performing numerous miracles and healing the sick. Emperor Kaleb of Aksum sought his spiritual assistance, and through the saint\'s powerful prayers, successfully defeated his enemies in Yemen. Kaleb\'s successor, Emperor Gebre Mesqel, later built a magnificent church on the plateau in honor of the Virgin Mary, which remains one of Ethiopia\'s oldest and most treasured architectural wonders. On Tikimt 14, at the age of 99, our Lord Jesus Christ appeared to Saint Aregawi and promised: "I have come to take you from labor to rest. The shadow of death shall not touch you, nor shall the angel of death terrify you; you shall be mystically translated like the Prophets Elijah and Enoch." After imparting his final counsel to his disciple Abba Mathias, he vanished from their sight, leaving an everlasting covenant of mercy. May his intercession protect us all.'
      ],
      blessingAm: 'የጻድቁ አባታችን የአቡነ አረጋዊ ጸሎት፣ ረድኤትና በረከት ዘወትር ከሁላችን ጋር ይሁን፣ አሜን።',
      blessingEn: 'May the prayers, intercessions, and everlasting covenant of our righteous father Abune Aregawi be with us all, Amen.'
    }
  },
  {
    id: 'archangel-gabriel-tahsas',
    category: 'feast',
    nameEn: 'Feast of Archangel Saint Gabriel (Tahsas 19)',
    nameAm: 'ታኅሣሥ ፲፱ ቀን የቅዱስ ገብርኤል በዓል',
    periodEn: 'Tahsas 19 (December 28 or 29 in leap years)',
    periodAm: 'ታኅሣሥ ፲፱ ቀን',
    durationEn: 'High Feast',
    durationAm: 'ታላቅ በዓል',
    theologyEn: 'Archangel Saint Gabriel (meaning "Man of God" or "Strength of God") is celebrated on Tahsas 19 to commemorate his miraculous deliverance of the three holy youths—Ananias, Azarias, and Misael—from the seven-times heated fiery furnace of Babylon. During the Babylonian captivity, these children refused to defile themselves with the king\'s delicacies and rejected the idolatrous worship of King Nebuchadnezzar\'s giant golden image, placing their absolute trust in the Living God.',
    theologyAm: 'በባቢሎን ንጉሥ በናቡከደነፆር ዘመን ከአይሁድ ወገን የሆኑ አዛርያ፣ አናንያ እና ሚሳኤል የተባሉ ሦስት ሕፃናት ተማርከው በባርነት ሳሉ ለፈጣሪያቸው ታምነው ጥራጥሬና ውኃ ብቻ እየተመገቡ በሃይማኖት ጸንተዋል። ንጉሡ በሰዎች ቅናት ምክር ቁመቱ ስድሳ ወርዱ ስድስት ክንድ የሆነ የወርቅ ምስል አሠርቶ በዱራ ሜዳ አቆሞ ሁሉም እንዲሰግዱለት፣ ያልሰገደም በሚነድድ እሳት እቶን ውስጥ እንዲጣል አዋጅ አወጀ። ሦስቱ ሕፃናት ግን ለጣዖቱ አንሰግድም በማለታቸው እሳቱ ሰባት እጥፍ እንዲነድ ተደርጎ ወደ እቶኑ ተጣሉ። በዚህ ጊዜ የእግዚአብሔር መልአክ ቅዱስ ገብርኤል ወርዶ እሳቱን በበትረ መስቀል በመምታት ነበልባሉን እንደ ቀዝቃዛ ነፋስ ስላደረገው ሕፃናቱ ምንም ሳይነካቸው ድነዋል። ይህ በዓል ቅዱስ ገብርኤል ሕፃናቱን ከእሳት እቶን ያዳነበትን ዕለት ለማሰብ ታኅሣሥ ፲፱ ቀን በቤተ ክርስቲያናችን በታላቅ ክብር ይከበራል፡፡',
    observanceEn: [
      'Celebrating the annual feast of Archangel Saint Gabriel on Tahsas 19 (December 28) with grand liturgies, Yaredic hymns (Mahlet), and joyful spiritual gatherings.',
      'Honoring the miracle of the fiery furnace, where Saint Gabriel descended, struck the fire with his cross-staff, and transformed the roaring flames into a cool, refreshing dew.',
      'Reflecting on the unwavering faith and holy courage of the three youths, Ananias, Azarias, and Misael, who preferred death over bowing to the golden idol of Dura.',
      'Invoking Saint Gabriel\'s powerful intercession for deliverance from modern spiritual trials, persecutions, and the fires of eternal judgment.'
    ],
    observanceAm: [
      'በየዓመቱ ታኅሣሥ ፲፱ ቀንን (ቅዱስ ገብርኤል ሦስቱን ሕፃናት ከእሳት ያዳነበትን በዓል) በታላቅ የሌሊት ማኅሌት፣ በዝማሬና በቅዳሴ በታላቅ መንፈሳዊ ደስታ ማክበር።',
      'ቅዱስ ገብርኤል እሳቱን በበትረ መስቀል መትቶ እንደ ቀዝቃዛ ነፋስ በማድረግ አናንያን፣ አዛርያንና ሚሳኤልን ያዳነበትን ድንቅ ተአምር መዘከር።',
      'አማልክትህን አናመልክም፣ ላቆምከውም የወርቅ ምስል አንሰግድም በማለት በሃይማኖታቸው የጸኑትን የሦስቱ ሕፃናት የሃይማኖት ጽናትና እውነተኛ ምስክርነት በሕይወታችን ምሳሌ ማድረግ።',
      'መልአኩን ቅዱስ ገብርኤልን ከችግርና ከመከራ ሁሉ እንዲታደገን፣ ከዘለዓለማዊ እሳትም እንዲያወጣን መማጸን፣ በስሙ መመጽወትና በጎ ምግባርን መፈጸም።'
    ],
    narrative: {
      titleAm: 'የቅዱስ ገብርኤል ዓመታዊ በዓልና ሦስቱን ሕፃናት ከእሳት እቶን የማዳኑ ተአምር (ታኅሣሥ ፲፱)',
      titleEn: 'The Feast of Saint Gabriel the Archangel and the Miraculous Deliverance of the Three Holy Youths from the Fiery Furnace (Tahsas 19)',
      paragraphsAm: [
        'በንጉሥ ናቡከደነፆር ዘመነ መንግሥት እስራኤላውያን በባቢሎናውያን ቅኝ ግዛት ሥር በወደቁበት ጊዜ ከአይሁድ ወገን የሆኑ አዛርያ፣ አናንያ እና ሚሳኤል የተባሉ ሦስት ሕፃናትም ተማርከው በባርነት ወሰዱ። ንጉሡም መልካቸው ያመረ፣ የንጉሣዊና የመሳፍንት ልጆች የሆኑትን መርጦ ሥነ ጥበብ፣ የመንግሥት አስተዳደርና የባቢሎናውያን ቋንቋዎችን እንዲሠለጥኑ ለማድረግ በቤተ መንግሥቱ አስቀመጦ ይቀልባቸው ጀመር። ሦስቱ ሕፃናት ግን ፈጣሪያቸውን ከሚያስቆጣ የንጉሡ ማዕድ በመቆጠብ፣ የንጉሡ አገልጋይ ጥራጥሬና ውኃ ብቻ እንዲሰጣቸው በማድረግ ለፈጣሪያቸው ታምነው ለዐሥር ቀናት ቆዩ፤ በኋላም ሲታዩ ጮማ ከሚበሉትና ጠጅ ከሚጠጡት ይልቅ ያምሩ ነበር።',
        'ከአይሁድ ምርኮኞች መካከል የሦስቱ ሕፃናት ጥበብና ማስተዋል ከሌሎቹ እጅጉን በልጦ በመገኘቱ ንጉሡ በባቢሎን አውራጃዎች ላይ ሾማቸው። በዚህም ጊዜ ባቢሎናውያን በሕፃናቱ መመረጥና መሾም ከመቅናታቸው የተነሣ፣ ንጉሡ ወዳጅና ጠላቱን ይለይ ዘንድ ራሱን የሚመስል ምስል ሠርቶ እንዲያቆም መከሩት። እርሱም ምክራቸውን ተቀብሎ ቁመቱ ስድሳ ክንድ፣ ወርዱም ስድስት ክንድ የሆነ የወርቅ ምስል አሠራ፤ በባቢሎንም አውራጃ በዱራ ሜዳ አቆመው። ንጉሥ ናቡከደነፆርም ላቆመው ምስል ምረቃ መኳንንቱን፣ ሹሞቹንና አማካሪዎቹን ሁሉ ሰበሰበ።',
        'ዐዋጅ ነጋሪውም የመለከት፣ የመሰንቆ፣ የክራር፣ የበገናና የዋሽንትን ድምፅ በሰሙ ጊዜ ወድቀው ለወርቁ ምስል እንዲሰግዱ፣ የማይሰግድም በሚነድድ እሳት እቶን ውስጥ እንደሚጣል ተናገረ። ሆኖም ሦስቱ ሕፃናት የንጉሡን ትእዛዝ እንዳልተቀበሉ ንጉሡ ሲሰማ እጅግ ተቆጥቶ አስጠራቸውና ለወርቁ ምስል እንዲሰግዱ አስጠነቀቃቸው። ሕፃናቱም \'እኛ የምናመልከው አምላክ በሰማይ አለ፣ ከሚነድደው ከእሳት እቶንና ከእጅህ ያድነናል፤ ንጉሥ ሆይ! ይህም ባይሆን አማልክትህን እንዳናመልክ፣ ላቆምከውም ለወርቁ ምስል እንዳንሰግድለት ዕወቅ\' በማለት በቁርጠኝነት መለሱለት።',
        'ንጉሥ ናቡከደነፆርም እጅጉን ተቆጣ፤ የእቶኑን እሳት ይነድድ ከነበረው ሰባት እጥፍ የሚያቃጥል እንዲሆን ካደረገ በኋላ ሦስቱን ሕፃናት ወደ እሳቱ እንዲጥሏቸው አዘዘ። እነርሱም በነበልባሉ ውስጥ ሆነው ወደ እግዚአብሔር ሲጸልዩ፣ ወዲያውኑ የእግዚአብሔር መልአክ ቅዱስ ገብርኤል ወደ እቶኑ ወርዶ እሳቱን በበትረ መስቀል መታው፤ ነበልባሉንም እንደ ቀዝቃዛ ነፋስ አደረገው። አናንያ، አዛርያና ሚሳኤልም እሳቱ ምንም ሳይነካቸው የራስ ጠጉራቸው ሳይለበለብ ዳኑ፤ በእሳቱ ውስጥም \'የአባቶቻችን ፈጣሪ እግዚአብሔር ይክበር ይመስገን\' እያሉ አመሰገኑ። ንጉሡም መዳናቸውን አይቶ \'የተፈቱና በእሳት መካከል የሚመላለሱ አራት ሰዎችን አያለሁ፤ የአራተኛውም መልክ የእግዚአብሔርን ልጅ ይመስላል\' በማለት ተደነቀ፤ ሕፃናቱንም ከእሳት አውጥቶ ለእግዚአብሔር ሰገደ፣ ስሙንም አከበረ።'
      ],
      paragraphsEn: [
        'During the reign of King Nebuchadnezzar, when the Israelites fell under Babylonian captivity, three noble youths of Judah—Ananias, Azarias, and Misael—were taken into servitude. Chosen for their physical beauty and royal lineage, they were brought into the palace to study the arts, administration, and language of the Chaldeans. Resolute in keeping God\'s laws, the three children refused the king\'s rich foods and wine, requesting their overseer to provide them with only pulses and water. After ten days, their appearance was found to be fairer and healthier than all the youth who ate the king\'s delicacies.',
        'When the youths were presented before King Nebuchadnezzar, their wisdom and understanding were found to be ten times greater than all the magicians and astrologers in his realm. Impressed, the king appointed them over the affairs of the provinces of Babylon. However, this aroused intense jealousy among the Babylonians. To trap the youths and test the loyalty of his subjects, they advised the king to construct a massive golden statue representing himself, measuring sixty cubits high and six cubits wide, and set it up on the plain of Dura.',
        'The herald proclaimed that at the sound of the musical instruments—the cornet, flute, harp, sackbut, psaltery, and dulcimer—everyone must fall down and worship the golden image, and whoever did not worship would immediately be cast into the midst of a burning fiery furnace. When the three youths refused to bow, they were accused before the king. Nebuchadnezzar in furious rage summoned them. They courageously replied: \'O Nebuchadnezzar, our God whom we serve is able to deliver us from the burning fiery furnace, and He will deliver us out of your hand. But if not, let it be known to you, O king, that we will not serve your gods, nor worship the golden image which you have set up.\'',
        'Infuriated, the king commanded that the furnace be heated seven times hotter than usual and ordered his strongest soldiers to bind the three youths and cast them into the fire. As the flames consumed the soldiers, Ananias, Azarias, and Misael prayed and sang praises to God. Instantly, the Archangel Saint Gabriel descended into the furnace, struck the roaring flames with his cross-staff, and made the middle of the furnace like a cool, moist whistling wind. The fire did not touch them or singe a single hair of their heads. Nebuchadnezzar, seeing them walking freely with a fourth figure whose form was \'like the Son of God,\' blessed the God of Israel and promoted the youths.'
      ],
      blessingAm: 'የቅዱስ ገብርኤል ተራዳኢነት፣ የበትረ መስቀሉ ጥበቃና የመልአኩ ምልጃ ከሁላችን ጋር ይሁን፣ አሜን።',
      blessingEn: 'May the swift help, holy protection, and intercession of Archangel Saint Gabriel be with us all, Amen.'
    }
  },
  {
    id: 'astereyo-mariam-tir',
    category: 'feast',
    nameEn: 'Feast of Aster\'eyo Mariam (Tir 21)',
    nameAm: 'ጥር ፳፩ ቀን አስተርእዮ ማርያም (የእመቤታችን የዕረፍት በዓል)',
    periodEn: 'Tir 21 (January 29 or 30 in leap years)',
    periodAm: 'ጥር ፳፩ ቀን',
    durationEn: 'High Feast',
    durationAm: 'ታላቅ በዓል',
    theologyEn: 'Aster\'eyo means "manifestation" or "revelation". In the Ethiopian Orthodox Tewahedo Church, the season from Christmas until the end of Tir is known as the Season of Manifestation (Zemene Aster\'eyo) because our Lord Jesus Christ was revealed in the flesh and the Holy Trinity was manifested at His baptism. The feast of Aster\'eyo Mariam on Tir 21 commemorates the departure (Dormition) of the Holy Virgin Mary. In EOTC tradition, though she is the Mother of God, bodily death is the path of all flesh, and her death is described by Saint Yared as uniquely wondrous and astonishing compared to all other humans.',
    theologyAm: 'አስተርእዮ ማለት መታየት፣ መገለጥ ማለት ነው፡፡ ጌታችን መድኀኒታችን ኢየሱስ ክርስቶስ በሥጋ የተገለጠበት፣ አንድነት ሦስትነቱም በዮርዳኖስ የተገለጠበት ወቅት በመሆኑ ከልደት በዓል እስከ ጥር መጨረሻ በሙሉ ዘመነ አስተርእዮ ይባላል። በዚህ በዘመነ አስተርእዮ ውስጥ ጥር ፳፩ ቀን የእመቤታችን የቅድስት ድንግል ማርያም በዓለ ዕረፍት (ሞት) ስለሚከበር በዓሉ “አስተርእዮ ማርያም” ተብሏል። ምንም እንኳን የአምላክ እናት ብትሆንም ሞተ ሥጋ ለሰው ልጅ ሁሉ የሚገባ በመሆኑ ማረፏን አስመልክቶ ሊቁ ቅዱስ ያሬድ “ሞትሰ ለመዋቲ ይደሉ ሞታ ለማርያም የዐጽብ ለኲሉ፤ ሞት ለማንኛውም ሰው የተገባ ነው፣ የማርያም ሞት ግን ሁሉን ያስደንቃል” በማለት ገልጾታል።',
    observanceEn: [
      'Commemorating the holy dormition (departure) of the Blessed Virgin Mary on Tir 21 with midnight Yaredic chants (Mahlet) and divine liturgies.',
      'Reflecting on the mystery of her death, which was shown by Christ to be a ransom for the suffering souls in Sheol as she accepted it with absolute love and peace.',
      'Commemorating the Apostles gathering on clouds from their mission fields to honor and lay her body to rest, escaping the plots of hostile non-believers.',
      'Praising the Virgin Mary who, according to her covenant, stands as the crown of our salvation and our key advocate before the throne of her beloved Son.'
    ],
    observanceAm: [
      'በየዓመቱ ጥር ፳፩ ቀንን (የእመቤታችንን የዕረፍት በዓል) በመላው አብያተ ክርስቲያናት በታላቅ የሌሊት ማኅሌት፣ በዝማሬና በቅዳሴ በታላቅ ፍቅርና መንፈሳዊ ደስታ ማክበር።',
      '“ሞት ለማናቸውም ሰው ሁሉ የተገባ ነው የማርያም ሞት ግን ሁሉን ያስደንቃል” በማለት ቅዱስ ያሬድና ቅዱሳን አባቶች ያስተማሩትን ጥልቅ የነገረ ማርያም ምስጢርና ትምህርት መዘከር።',
      'ሐዋርያት የእመቤታችንን ቅድስት ሥጋ ለመቅበር በደመና ተጭነው ከደረሱበት ጊዜ ጀምሮ፣ አይሁድ ሥጋዋን ለማቃጠል ባደረጉት ሙከራ የታየውን ተአምርና ሥጋዋ በደመና ወደ ገነት መነጠቁን ማሰብ።',
      'የኃጥአንን ለቅሶና ሐዘን አይታ ስለ ሰው ልጆች ድኅነት ዕረፍቷን በሐሴት የተቀበለችውን የእመቤታችንን ምልጃ መማጸን፣ ልጅዋ በሰጣት ቃል ኪዳን በቀኙ እንዲያቆመን መጸለይ።'
    ],
    narrative: {
      titleAm: 'የእመቤታችን የቅድስት ድንግል ማርያም የዕረፍት በዓል (አስተርእዮ ማርያም) ታሪክና ትርጓሜ (ጥር ፳፩)',
      titleEn: 'The History, Theological Meaning, and Dormition of the Blessed Virgin Mary - Aster\'eyo Mariam (Tir 21)',
      paragraphsAm: [
        'አስተርእዮ ማለት መታየት፣ መገለጥ ማለት ነው፡፡ ቃሉ “አስተርአየ” (ታየ፣ ተገለጠ) ከሚለው የግዕዝ ግሥ የተገኘ ነው፡፡ ጌታችን መድኀኒታችን ኢየሱስ ክርስቶስ በገባው ቃል ኪዳን መሠረት በሥጋ የተገለጠበት፣ አንድነት ሦስትነቱም የተገለጠበት ወቅት በመሆኑ ከልደት በዓል እስከ ጥር መጨረሻ በሙሉ “ዘመነ አስተርእዮ” በመባል ይታወቃል፡፡ በዚህ በዘመነ አስተርእዮ ውስጥ እመቤታችን ቅድስት ድንግል ማርያም ያረፈችበት (የሞተችበት) ዕለት ስለሚከበር በዓሉ “አስተርእዮ ማርያም” ተብሎ ይጠራል፡፡',
        'ልቡናዋ በይኩነኒ (እንደ ቃልህ ይሁንልኝ) የጸና፣ ንጽሐ ሥጋን፣ ንጽሐ ነፍስና ንጽሐ ልቡናን አስተባብራ የያዘች ወላዲተ አምላክ ምንም እንኳን የአምላክ እናት ብትሆንም፣ ሞተ ሥጋ ለሰው ልጅ ሁሉ ዕጣ ፈንታ በመሆኑ ጌታችን “ተንሥኢ ወንዒ፤ የነፍሴ ደስታ የሆንሽ ውድ እናቴ ሆይ ተነሥተሽ ወደ እኔ ነዪ” (መኃ ፪፥፲) ብሏታል፡፡ የአምላክ እናት ማረፏ እጅግ የሚደንቅ በመሆኑ ታላቁ የቤተ ክርስቲያናችን ሊቅ ቅዱስ ያሬድ “ሞትሰ ለመዋቲ ይደሉ ሞታ ለማርያም የዐጽብ ለኲሉ፤ ሞት ለማናቸውም ሰው ሁሉ የተገባ ነው የማርያም ሞት ግን ሁሉን ያስደንቃል” በማለት ገልጾታል።',
        'የእመቤታችንን ዕረፍት አስመልክቶ በነገረ ማርያም አባቶች እንደሚያስተምሩት፣ እመቤታችን በዚህ ዓለም ፷፬ (ስድሳ አራት) ዓመት ኖራ በጥር ፳፩ ቀን በእሑድ ዕለት ጌታችን እልፍ አዕላፋት መላእክትን አስከትሎ መጥቶ “እናቴ ሆይ ከዚህ ዓለም ድካም ላሳርፍሽ መጣሁ” አላት። እመቤታችንም “ልጄ ሆይ! ሰማይና ምድር የማይወስኑህን በማኅፀኔ ዘጠኝ ወር ከቀን ተሸክሜ በድንግልና ወልጄህ እሞታለሁን?” ባለችው ጊዜ፣ በሲኦል የሚሰቃዩትን ነፍሳት አሳይቶ “እናቴ ሆይ! ሞትሽ ለእነዚህ ቤዛ ይሆንላቸዋል” አላት። እመቤታችንም “እነዚህን ከማርክልኝስ ይሁን” ብላ ፈቃዷን ገለጠች፡፡ ቅድስት ሥጋዋን ከቅዱስ ነፍሷ ለይቶ በቃለ አቅርንት በዝማሬ መላእክት አሳረጋት። ሐዋርያትንም በደመና ጠቅሶ ካለችበት አምጥቶ “የእመቤታችሁን ሥጋ በክብር አሳርፉ” አላቸው።',
        'ሐዋርያት የእመቤታችንን ሥጋ ወደ ጌቴሰማኒ ይዘው ሲሄዱ፣ አይሁድ “ቀድሞ ልጇን ተነሣ ዐረገ እያሉ አወኩን፣ አሁን ደግሞ እርሷን ተነሣች ዐረገች ሊሉን ነውን? በእሳት እናቃጥላታለን” ብለው ተነሡ። ታውፋንያ የተባለ አይሁዳዊ ተራምዶ አጎበሩን ጨበጠው፤ ወዲያው መልአክ በሰይፍ ሁለት እጆቹን ቀጣውና ከአጎበሩ ተንጠልጥለው ቀሩ። እርሱም “በድያለሁ ማሪኝ” ብሎ ሲማጸናት እጆቹ ተመልሰውለታል። ከዚህ በኋላ ዮሐንስን ጨምሮ በደመና ነጥቆ ወደ ገነት አግብቶ ከዕፀ ሕይወት ሥር አኖራት። ሐዋርያት የእመቤታችንን ሥጋ ለማየትና ለመቅበር በነሐሴ መባቻ ጾም ጀምረው በ፲፮ኛው ቀን ትንሣኤዋንና ዕርገቷን ለማየት በቅተዋል፤ ይህም በቤተ ክርስቲያናችን ዘወትር በጾመ ፍልሰታና በነሐሴ ፲፮ በታላቅ በዓልነት ይከበራል፡፡ እመቤታችን ሆይ! ልጅሽ በሰጠሽ ቃል ኪዳን በቀኙ እንቆም ዘንድ ለምኝልን፣ አሜን።'
      ],
      paragraphsEn: [
        'Aster\'eyo translates to "manifestation" or "revelation", derived from the Ge\'ez verb "Astereye" (to appear or be revealed). According to the Ethiopian Orthodox Tewahedo Church, the season from Christmas until the end of January (Tir) is called the "Season of Manifestation" (Zemene Aster\'eyo) because our Lord Jesus Christ was revealed in the flesh and His Divinity was manifested at His baptism. Since the departure (Dormition) of the Blessed Virgin Mary occurs within this holy season on Tir 21, her feast is famously called "Aster\'eyo Mariam" (The Manifestation of Mary).',
        'Though the Blessed Virgin Mary is the honored Mother of God, bodily death is the physical destination of all human flesh. In the Song of Songs, our Lord says to her: "Rise up, my love, my fair one, and come away" (Song of Songs 2:10). The departure of the Mother of God is a source of holy astonishment for believers. The great Ethiopian hymnologist Saint Yared beautifully sang: "Death is fitting for all mortal humans, but the death of Mary is astonishing and marvelous to all." This reflects the deep theological wonder of how the one who carried the Creator of Life tasted physical death.',
        'According to the traditional teachings of the Church Fathers (Negere Mariam), after living 64 years on earth, on Sunday, Tir 21, our Lord Jesus Christ descended with host of angels to take her. When Mary asked: "My Son, shall I, who carried You in my womb for nine months and five days and gave birth to You in virginity, taste death?" our Lord showed her the suffering souls in Sheol (Hades) and told her: "O My mother, your death will be a ransom and intercession for these souls." She replied: "If You will forgive them for my sake, then let it be so." Our Lord then separated her holy soul from her body, ascending it to heaven amidst angelic hymns, and gathered the Apostles on clouds to lay her body to rest.',
        'As the Apostles carried her holy body in a funeral procession to Gethsemane, hostile non-believers plotted to burn her body, saying: "Before, they troubled us saying her Son rose and ascended; now they will say she did too." A man named Tawfanya rushed forward to seize the bier, but an angel cut off his hands with a sword of fire. Repentant, Tawfanya begged Mary\'s mercy, and his hands were instantly restored. The Apostle John was then swept away on a cloud with her body and placed under the Tree of Life in Paradise. The Apostles then fasted in August (Filsata) until they witnessed her Resurrection and Ascension on August 16. O Holy Virgin Mary, pray for us that we may stand at the right hand of your Son! Amen.'
      ],
      blessingAm: 'የእመቤታችን የቅድስት ድንግል ማርያም (የአስተርእዮ ማርያም) አማላጅነትና በረከት ከሁላችን ጋር ይሁን፣ አሜን።',
      blessingEn: 'May the intercession, protection, and blessing of our Holy Mother Virgin Mary (Aster\'eyo Mariam) be with us all, Amen.'
    }
  },
  {
    id: 'adwa-victory-yekatit',
    category: 'feast',
    nameEn: 'Victory of Adwa Commemoration (Yekatit 23)',
    nameAm: 'የካቲት ፳፫ ቀን የዓድዋ ድል መታሰቢያ በዓል',
    periodEn: 'Yekatit 23 (March 2)',
    periodAm: 'የካቲት ፳፫ ቀን',
    durationEn: 'National & Commemorative Feast',
    durationAm: 'ታሪካዊና ብሔራዊ መታሰቢያ በዓል',
    theologyEn: 'The Victory of Adwa, won on March 1, 1896 (Yekatit 23, 1888 E.C.), is a monumental event where Ethiopian forces, under the leadership of Emperor Menelik II and Empress Taytu, defeated the invading Italian colonial army. This victory safeguarded Ethiopia\'s sovereignty and became a global symbol of black freedom, unity, and anti-colonial resistance. In the Ethiopian Orthodox Tewahedo Church, the victory is also spiritual, as the Ark of Saint George (Tabote Giyorgis) accompanied the army, and the battle was won on the feast of Saint George, demonstrating divine intervention and the power of united prayer and patriotism.',
    theologyAm: 'የካቲት ፳፫ ቀን ኢትዮጵያውያን የዓድዋን የድል በዓል የሚያከብሩበት ታሪካዊ ቀን ነው። እ.ኤ.አ መጋቢት ፩ ቀን ፲፰፱፮ (የካቲት ፳፫ ቀን ፲፰፷፰ ዓ.ም) በዳግማዊ አፄ ምኒልክ እና በእቴጌ ጣይቱ መሪነት የተሰለፈው የኢትዮጵያ ሠራዊት ወራሪውን የጣሊያን ጦር በአድዋ ጦርነት ላይ ሙሉ በሙሉ ድል አድርጓል። ይህ ድል የኢትዮጵያን ነፃነትና ሉዓላዊነት ያስከበረ ብቻ ሳይሆን፣ ለመላው ጥቁር ሕዝቦች የነፃነት፣ የአንድነትና የኩራት ተምሳሌት የሆነ ታላቅ ታሪክ ነው። በኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያንም የቅዱስ ጊዮርጊስ ታቦት ወደ ጦርነቱ አብሮ በመዝመቱና ድሉም በቅዱስ ጊዮርጊስ በዓል ዕለት በመገኘቱ፣ በዓሉ ሃይማኖታዊና ብሔራዊ የአንድነት መገለጫ ሆኖ በታላቅ ምስጋና ይበልጥ ደምቆ ይከበራል።',
    observanceEn: [
      'Commemorating the historic victory of Adwa on Yekatit 23 (March 2) with national ceremonies at Emperor Menelik II Square in Piazza, Addis Ababa, and across the nation.',
      'Honoring the bravery of the patriots, the tactical genius of Emperor Menelik II and Empress Taytu, and the unity of all Ethiopians who rose up to defend their motherland.',
      'Celebrating the spiritual victory under the patronage of Saint George, whose Ark (Tabot) accompanied the imperial forces and whose divine intercession is praised by the Church.',
      'Reflecting on Adwa as a timeless inspiration for Pan-Africanism, dignity, self-reliance, and the global struggle against oppression.'
    ],
    observanceAm: [
      'በየዓመቱ የካቲት ፳፲፫ ቀንን (የዓድዋ ድል መታሰቢያ) በአዲስ አበባ ፒያሳ በሚገኘው በዳግማዊ አፄ ምኒልክ አደባባይ እንዲሁም በመላው ሀገሪቱ በታላቅ ብሔራዊና ሃይማኖታዊ ሥርዓት ማክበር።',
      'ለሀገራቸው ነፃነትና ክብር ሲሉ ደማቸውንና አጥንታቸውን የገበሩትን ጀግኖች አርበኞች፣ የዳግማዊ አፄ ምኒልክንና የእቴጌ ጣይቱን መሪነት፣ እንዲሁም የሕዝቡን ፍጹም አንድነት በምስጋና ማሰብ።',
      'ከጦርነቱ ጋር አብሮ የዘመተውንና የድሉ ምልክት የሆነውን የቅዱስ ጊዮርጊስ ታቦትና በዕለቱ የተገለጠውን መለኮታዊ ተራዳኢነት በቤተ ክርስቲያን ምስጋናና ጸሎት መዘከር።',
      'ድሉ ለመላው አፍሪካውያንና ጥቁር ሕዝቦች ከቅኝ ግዛት ነፃ ለመውጣት ላደረጉት ትግል የፈጠረውን ትልቅ መነሳሳትና ብርሃን ማስተማር።'
    ],
    narrative: {
      titleAm: 'የዓድዋ ድል ታሪካዊ ዳራ፣ ብሔራዊ ፋይዳና መንፈሳዊ ትስስር (የካቲት ፳፫)',
      titleEn: 'The Historical Background, National Significance, and Spiritual Connection of the Victory of Adwa (Yekatit 23)',
      paragraphsAm: [
        'የካቲት ፳፫ ቀን ኢትዮጵያውያን የዓድዋን ድል የሚያከብሩበት ታሪካዊና ታላቅ ቀን ነው። ይህ ድል ኢትዮጵያውያን አውሮፓውያንን ወራሪዎች ድል አድርገው ነፃነታቸውን ያስከበሩበት እና ለመላው ጥቁር ሕዝቦች የነፃነትና የኩራት ተምሳሌት የሆነበት ታላቅ ታሪክ ነው። ታሪካዊ ዳራውን ስንመለከት፣ እ.ኤ.አ መጋቢት ፩ ቀን ፲፰፱፮ (የካቲት ፳፫ ቀን ፲፰፷፰ ዓ.ም) በዳግማዊ አፄ ምኒልክ እና በእቴጌ ጣይቱ መሪነት የተሰለፈው የኢትዮጵያ ሠራዊት ዘመናዊ መሣሪያ የታጠቀውን የጣሊያን ወራሪ ጦር በአድዋ ተራሮች ላይ ሙሉ በሙሉ ድል አድርጎታል።',
        'የዓድዋ ጦርነት መንስኤ ጣሊያን በውጫሌ ውል አንቀጽ ፲፯ ላይ በአማርኛውና በጣሊያንኛው ትርጉም መካከል የፈጠረችው የማታለል ሴራ ነበር። አማርኛው “ኢትዮጵያ ከሌሎች መንግሥታት ጋር ለምታደርገው ግንኙነት በጣሊያን በኩል መገናኘት ትችላለች” ሲል፣ ጣሊያንኛው ግን “የግድ በጣሊያን በኩል ማድረግ አለባት” በማለት ሀገሪቱን የጣሊያን ጥገኝት (ሞግዚትነት) ሥር ለማስገባት ይሞክር ነበር። ይህንን ያወቁት እቴጌ ጣይቱና አፄ ምኒልክ ውሉን ሙሉ በሙሉ ውድቅ በማድረግ “የሀገሬን ነፃነትና ክብር አሳልፌ አልሰጥም” በማለት ክቡር የሆነውን የነፃነት አዋጅ አወጁ። ለመላው የሀገሪቱ ሕዝብ “የሀገር ፍቅር ጥሪ” የተላለፈ ሲሆን፣ ከመላው የኢትዮጵያ ክፍሎች የተሰበሰበው ሕዝብ በአንድ ልብ ወደ ዓድዋ ዘመተ።',
        'በዚህ ጦርነት ወቅት ታላቅ መንፈሳዊና ሃይማኖታዊ ዝግጅትም ተደርጎ ነበር። በአፄ ምኒልክ ትእዛዝ የቅዱስ ጊዮርጊስ ታቦት ከሊቀ ካህናቱና ከካህናቱ ጋር አብሮ ወደ ጦር ግንባር ዘምቷል። መላው የኢትዮጵያ ሕዝብና ካህናት በጾምና በጸሎት፣ በምህላ ፈጣሪያቸውን እየለመኑ በጦርነቱ ላይ ተሳትፈዋል። የካቲት ፳፫ ቀን ቅዱስ ጊዮርጊስ በዓል ዕለት በመሆኑ፣ የጦርነቱ ፍልሚያ በተጀመረበት ጊዜ የሰማይ ሠራዊትና ቅዱስ ጊዮርጊስ በነጭ ፈረስ ላይ ሆኖ አርበኞቹን ሲረዳ የታየበት ድንቅ ተአምር እንደነበር በታሪክ ተመዝግቧል። ጦርነቱም በኢትዮጵያ ሠራዊት ታላቅ አሸናፊነት ተጠናቆ ወራሪው ጦር ተመትቶ ድል ሆነ።',
        'የዓድዋ ድል ትርጉም ለመላው ዓለም ጥቁር ሕዝቦች እጅግ የላቀ ነው። ድሉ የጥቁር ሕዝቦች አንድነት፣ የአርበኞች ጀግንነት እና የሀገር ፍቅር በተግባር የታየበት ታላቅ ክስተት ነው። እንዲሁም አፍሪካውያንና በዓለም ዙሪያ የሚገኙ ተጨቋኝ ሕዝቦች ከቅኝ ግዛትና ከጭቆና ቀንበር ለመውጣት ላደረጉት ታሪካዊ ትግል ትልቅ መነሳሳትና የብርሃን ችቦ ሆኖ ያገለገለ ሲሆን፣ በየዓመቱ ይህንን ታላቅ ድል በአዲስ አበባ ፒያሳ በሚገኘው በዳግማዊ አፄ ምኒልክ አደባባይ እንዲሁም በመላው ዓለም በታላቅ ክብርና ኩራት እናከብረዋለን።'
      ],
      paragraphsEn: [
        'Yekatit 23 (March 2) is a legendary historical day when Ethiopians celebrate the magnificent Victory of Adwa. This epic victory marks the occasion when Ethiopian forces defeated European colonial invaders to safeguard their ancient independence, standing as a timeless symbol of freedom, dignity, and pride for all black people globally. Historically, on March 1, 1896 (Yekatit 23, 1888 E.C.), under the supreme leadership of Emperor Menelik II and Empress Taytu, the united Ethiopian army decisively crushed the invading Italian Royal Army in the mountainous terrain of Adwa.',
        'The root cause of the Battle of Adwa lay in the deceptive discrepancy between the Amharic and Italian texts of Article 17 of the Treaty of Wuchale. The Amharic version stated that Ethiopia "could choose" to use Italy\'s diplomatic channels for foreign affairs, whereas the Italian text made it mandatory, effectively seeking to turn Ethiopia into an Italian protectorate. Upon discovering this treachery, Empress Taytu and Emperor Menelik II tore up the treaty, boldly proclaiming that they would never compromise Ethiopia\'s independence. A general mobilization decree called upon all citizens to defend their motherland, and patriots from every corner of the nation marched to Adwa as one unified force.',
        'A deep spiritual preparation accompanied this historic campaign. By imperial decree, the Tabot (Ark) of Saint George was carried to the war front by the High Priest and clergy, and the entire nation engaged in intense fasting, repentance, and prayers (Mihila) seeking divine intervention. The decisive battle took place on Yekatit 23, which coincides with the feast day of Saint George. According to historical traditions, Saint George was witnessed on a white horse guiding and protecting the Ethiopian patriots during the battle, striking fear into the hearts of the invaders and leading the Ethiopian forces to a spectacular victory.',
        'The global impact of the Victory of Adwa is profound and far-reaching. It demonstrated the power of black solidarity, patriotic devotion, and heroic courage against superior military technology. Adwa became the foundational beacon of Pan-Africanism, inspiring African nations and oppressed peoples worldwide to rise up and break the shackles of colonialism. Every year, this victory is celebrated with immense pride at Emperor Menelik II Square in Piazza, Addis Ababa, and by Africans and freedom-lovers around the world.'
      ],
      blessingAm: 'የጀግኖች አርበኞቻችን ክብርና አንድነት፣ የቅዱሳን አባቶቻችን ጸሎትና የቅዱስ ጊዮርጊስ ተራዳኢነት ሁልጊዜ ሀገራችንን ይጠብቅልን፣ አሜን።',
      blessingEn: 'May the courage and unity of our heroic patriots, the prayers of our holy fathers, and the protection of Saint George preserve our nation forever, Amen.'
    }
  },
  {
    id: 'lideta-mariam-ginbot',
    category: 'feast',
    nameEn: 'Feast of the Nativity of the Blessed Virgin Mary (Genbot 1)',
    nameAm: 'ግንቦት ፩ ቀን ልደታ ለማርያም',
    periodEn: 'Genbot 1 (May 9 or 10 in leap years)',
    periodAm: 'ግንቦት ፩ ቀን',
    durationEn: 'High Feast',
    durationAm: 'ታላቅ በዓል',
    theologyEn: 'The Feast of the Nativity of the Blessed Virgin Mary is celebrated on Genbot 1 to commemorate the miraculous birth of our Lady, who became the vessel of our salvation. Born to righteous Joachim and Hannah after decades of barrenness, her birth was heralded by an angel as a source of universal joy and redemption. According to Ethiopian Orthodox tradition, Mary\'s name means "Lady" or "Gift", and she remains the ultimate gift and mother of all believers.',
    theologyAm: 'በግንቦት አንድ ቀን አምላክን የወለደች እመቤታችን ቅድስት ድንግል ማርያም ተወለደች። እርሷም ለሰው ሁሉ ወገን ድኅነት የሆነባት ናት፡፡ ከወንዶች ወገን የከበረ አባቷም ስሙ ኢያቄም ከሴቶች ወገን የከበረች ሚስቱ ሐና ይባላሉ፡፡ ሁለቱም ልጅ በማጣት ሲያዝኑ ኖሩ። በዚያ ወራት የመካኖች መብዓ ካህናቱ አይቀበሉም ነበርና፡፡ እነርሱም ከሰው የሚደርስባቸውን ሽሙጥና ኅዘናቸውን ያርቅላቸው ዘንድ በቀንና በሌሊት ወደ እግዚአብሔር ፈጽሞ ይማልዱ ነበር፡፡ ሰውን የሚወድ እግዚአብሔርም ከዘራቸው ለዓለሙ ሁሉ መድኃኒት ይሆን ዘንድ መልካም የሆነ ሐሳባቸውን ተመለከተ፡፡ ክቡር ኢያቄምም አርባ ቀን እስኪፈጸም በተራራ ውስጥ ቁሞ ሲጸልይ ከእግዚአብሔር የታዘዘ መልአክ ተገለጸለትና ለዓለሙ ሁሉ ድኅነት የሚደረግባት ዘር እንደሚሰጠው አበሠረው። በፍጹም ልብ አምኖ ከተራራው ወረደ፤ ለተመሰገነች ሚስቱ ለሐናም ከእግዚአብሔር መልአክ የሰማውን ያንን ራእይ ነገራት። ቃሉ እውነት እንደሆነ እርሷም አመነች። ልዑል እግዚአብሔርንም አመሰገነች። የተመሰገነች ቅድስት ሐናም ከእርሷ የሚወለደውን በዘመኑ ሁሉ ለቤተ እግዚአብሔር አገልጋይ ታደርገው ዘንድ ለእግዚአብሔር ስለትን ተሳለች፡፡ ከዚህም በኋላ ይህችን የከበረች ሕፃን ፀንሳ ወለደች። ስሟንም ‹ማርያም› ብላ ሰየመቻት። ትርጓሜውም ‹እመቤት› ነው። ‹ደግሞም ሀብትና ስጦታ› ማለት ነው፡፡ በእውነት የዓለሙ ሁሉ እመቤት ሁላችን በአርሷ ሰማያዊ ሀብት ልጅነትን ያገኘንባት ናትና።',
    observanceEn: [
      'Commemorating the holy birth of the Virgin Mary on Genbot 1 with Yaredic chants (Mahlet) and celebratory divine liturgies.',
      'Reflecting on the steadfast prayers, fasting, and unwavering trust of Saint Joachim and Saint Hannah that led to this miraculous gift.',
      'Honoring Mary as the sacred vessel of the Incarnation, through whom humanity received the gift of adoptive divine sonship.',
      'Seeking her maternal protection and powerful intercession, praying that God might deliver us from trials and grant us eternal life.'
    ],
    observanceAm: [
      'በየዓመቱ ግንቦት ፩ ቀንን (የእመቤታችንን የልደታ በዓል) በመላው አብያተ ክርስቲያናት በታላቅ የሌሊት ማኅሌት፣ በዝማሬና በቅዳሴ በታላቅ ፍቅርና መንፈሳዊ ደስታ ማክበር።',
      'ቅዱሳን አባቶቻችን ኢያቄምና ሐና ያለ ልጅ ሲያዝኑና ሲጸልዩ ቆይተው፣ ፈጣሪ ጸሎታቸውን ሰምቶ ለዓለም ሁሉ ድኅነት የሆነችውን የተመሰገነች ልጅ የሰጣቸውን ተአምርና ታሪክ መዘከር።',
      'እመቤታችን ለቅዱሳን ወላጆቿ ለስእለት የተሰጠች በመሆኗ፣ እኛም እንደ ቅድስት ሐና ስእለትንና በጎ ምግባራትን በሕይወታችን በመፈጸም ለእግዚአብሔር መገዛት።',
      'የሥጋና የነፍስ መድኃኒት የሆነች የእመቤታችንን በረከትና ምልጃ መማጸን፣ በአማላጅነቷም ከችግሮች ሁሉ ድነን በልጇ ቃል ኪዳን መንግሥተ ሰማያትን እንድንወርስ መጸለይ።'
    ],
    narrative: {
      titleAm: 'የእመቤታችን የቅድስት ድንግል ማርያም የልደት በዓል ታሪክና ትርጓሜ (ግንቦት ፩)',
      titleEn: 'The History and Theological Significance of the Nativity of the Blessed Virgin Mary (Genbot 1)',
      paragraphsAm: [
        'በግንቦት አንድ ቀን አምላክን የወለደች እመቤታችን ቅድስት ድንግል ማርያም ተወለደች። እርሷም ለሰው ሁሉ ወገን ድኅነት የሆነባት ናት፡፡ ከወንዶች ወገን የከበረ አባቷም ስሙ ኢያቄም ከሴቶች ወገን የከበረች ሚስቱ ሐና ይባላሉ፡፡ ሁለቱም ልጅ በማጣት ሲያዝኑ ኖሩ። በዚያ ወራት የመካኖች መብዓ ካህናቱ አይቀበሉም ነበርና። እነርሱም ከሰው የሚደርስባቸውን ሽሙጥና ኅዘናቸውን ያርቅላቸው ዘንድ በቀንና በሌሊት ወደ እግዚአብሔር ፈጽሞ ይማልዱ ነበር፡፡ ሰውን የሚወድ እግዚአብሔርም ከዘራቸው ለዓለሙ ሁሉ መድኃኒት ይሆን ዘንድ መልካም የሆነ ሐሳባቸውን ተመለከተ።',
        'ክቡር ኢያቄምም አርባ ቀን እስኪፈጸም በተራራ ውስጥ ቁሞ ሲጸልይ ከእግዚአብሔር የታዘዘ መልአክ ተገለጸለትና ለዓለሙ ሁሉ ድኅነት የሚደረግባት ዘር እንደሚሰጠው አበሠረው። በፍጹም ልብ አምኖ ከተራራው ወረደ፤ ለተመሰገነች ሚስቱ ለሐናም ከእግዚአብሔር መልአክ የሰማውን ያንን ራእይ ነገራት። ቃሉ እውነት እንደሆነ እርሷም አመነች። ልዑል እግዚአብሔርንም አመሰገነች። የተመሰገነች ቅድስት ሐናም ከእርሷ የሚወለደውን በዘመኑ ሁሉ ለቤተ እግዚአብሔር አገልጋይ ታደርገው ዘንድ ለእግዚአብሔር ስለትን ተሳለች፡፡',
        'ከዚህም በኋላ ይህችን የከበረች ሕፃን ፀንሳ ወለደች። ስሟንም “ማርያም” ብላ ሰየመቻት። ትርጓሜውም “እመቤት” ማለት ነው፡፡ ደግሞም “ሀብትና ስጦታ” ማለት ነው፡፡ በእውነት የዓለሙ ሁሉ እመቤት ሁላችን በአርሷ ሰማያዊ ሀብት ልጅነትን ያገኘንባት ናትና።',
        'የሥጋና የነፍስ መድኃኒት የሆነች እርሷን እናቱን ለሰጠን ለእግዚአብሔር ምስጋና ይሁን፤ የእመቤታችን ቅድስት ድንግል ማርያም በረከቷም ከሁላችን የክርስቲያን ወገኖች ጋር ለዘለዓለሙ ይኑር። እኛም ከአማላጅነቷና ከበረከቷ እንዳንለይ ስሟን እየጠራን እንመጽውት፣ በጎ ምግባርንም አብዝተን እንፈጽም፣ አሜን።'
      ],
      paragraphsEn: [
        'On the first day of Genbot, the Blessed Virgin Mary, the Mother of God, was born into this world, bringing joy and the promise of salvation to all mankind. Her honored father was Joachim, and her blessed mother was Hannah. For decades, they lived in deep sorrow because they had no children. In those days, priests would not accept offerings from the barren, which amplified their pain and shame. Both Joachim and Hannah prayed day and night, begging God to remove their reproach.',
        'The merciful God looked upon their righteous hearts and their desire to have a child who would serve Him. Joachim went to a mountain and fasted and prayed for forty days. An angel of the Lord appeared to him, delivering the joyful message that God would grant them a blessed child through whom the salvation of the world would be realized. Believing the promise with all his heart, Joachim returned home and shared the vision with Hannah, who rejoiced and vowed to dedicate the child to the service of God\'s Temple all her life.',
        'Soon after, Hannah conceived and gave birth to this holy child. She named her "Mary", which translates to "Lady" or "Gift and Blessing". Mary is indeed the Lady of the entire universe, through whom humanity received the heavenly gift of adoption as children of the Living God. She is a source of spiritual and physical healing to all who seek her Son\'s mercy.',
        'Praise be to God who gave us His Mother to be our refuge and advocate. May the blessings and maternal protection of the Blessed Virgin Mary (Lideta LeMariam) be with all Christian souls forever and ever. Amen.'
      ],
      blessingAm: 'የእመቤታችን የቅድስት ድንግል ማርያም ረድኤት፣ በረከትና የልደቷ በዓል ሰላም ከሁላችን ጋር ይሁን፣ አሜን።',
      blessingEn: 'May the grace, blessings, and peace of the Nativity of our Holy Mother Virgin Mary be with us all, Amen.'
    }
  },
  {
    id: 'saint-michael-sene',
    category: 'feast',
    nameEn: 'Feast of Archangel Saint Michael (Sene 12)',
    nameAm: 'ሰኔ ፲፪ ቀን የቅዱስ ሚካኤል በዓል',
    periodEn: 'Sene 12 (June 19)',
    periodAm: 'ሰኔ ፲፪ ቀን',
    durationEn: 'High Feast',
    durationAm: 'ታላቅ በዓል',
    theologyEn: 'This feast commemorates the appointment of Archangel Saint Michael as the prince of all heavenly hosts, and his countless miracles, particularly the deliverance of Bahran from the plots of a ruthless rich man, and the protection of Saint Afomya from the deception of the devil. It also celebrates the conversion of a pagan temple of the bronze idol Zuhal in Alexandria into a glorious church dedicated to Saint Michael by Patriarch Alexander.',
    theologyAm: 'ሰኔ ፲፪ ቀን እግዚአብሔር የመላእክት አለቃ ቅዱስ ሚካኤልን በመላእክት ሁሉ ላይ በከፍተኛ ክብር የሾመበት ታላቅ ዕለት ነው፡፡ በዚህ ዕለት በእስክንድርያ የነበረው የዙሐል ጣዖት ቤተ መቅደስ ተሰብሮ በቅዱስ ሚካኤል ስም ቤተ ክርስቲያን የሆነበት ታላቅ ታሪካዊ በዓል ይከበራል፡፡ በተጨማሪም መልአኩ ቅዱስ ሚካኤል ባሕራን የተባለውን ሕፃን ከክፉው ባለጠጋ ሴራ እና ቅድስት አፎምያን ከሰይጣን ጥቃት ያዳነበት ድንቅ ተአምራት ይታሰባል።',
    observanceEn: [
      'Celebrating Archangel Saint Michael\'s appointment as the supreme prince of all heavenly hosts.',
      'Commemorating the dedication of the historic Church of Saint Michael in Alexandria, formerly a pagan temple of Zuhal.',
      'Remembering the miraculous deliverance of Bahran, whose death sentence was transformed by the Archangel into a letter of inheritance and blessing.',
      'Honoring the unwavering faith of Saint Afomya, who was defended by Saint Michael from the deceptions and physical attacks of the devil.',
      'Participating in divine liturgies, presenting alms to the poor, and singing Yaredic hymns of praise (Mahlet) in honor of the merciful archangel.'
    ],
    observanceAm: [
      'የመላእክት አለቃ ቅዱስ ሚካኤል በመላእክት ዘሮችና ነገዶች ሁሉ ላይ በታላቅ ክብር መሾሙን በምስጋና ማሰብ።',
      'በእስክንድርያ ከተማ የነበረው የዙሐል ጣዖት መቅደስ በአባ እለእስክንድሮስ ተባርኮ በቅዱስ ሚካኤል ስም ቤተ ክርስቲያን መደረጉንና በዓሉ እስከ ዛሬ መጽናቱን መዘከር።',
      'መልአኩ ቅዱስ ሚካኤል ባሕራን የተባለውን ሕፃን ከባለጠጋው የሞት ሴራ በማዳን፣ ደብዳቤውን ወደ ውርስና በረከት ደብዳቤ በመለወጥ ያደረገውን ድንቅ ተአምር ማሰብ።',
      'ቅድስት አፎምያ በሃይማኖቷ ጸንታ በመቆሟ ሰይጣን ብርሃናዊ መልአክ መስሎ ሊያስታትና ሊያንቃት ሲሞክር ቅዱስ ሚካኤል ፈጥኖ የደረሰላትን ረድኤት መመስከር።',
      'በቅዱስ ሚካኤል ስም ለድሆችና ለችግረኞች ምጽዋት መስጠት፣ በጎ ምግባራትን ማብዛትና በታላቅ ምስጋና ማኅሌቱንና ቅዳሴውን መሳተፍ።'
    ],
    narrative: {
      titleAm: 'የመላእክት አለቃ ቅዱስ ሚካኤል ዓመታዊ በዓልና ድንቅ ተአምራቱ (ሰኔ ፲፪)',
      titleEn: 'The Feast of Archangel Saint Michael, His Heavenly Appointment, and Miraculous Deliverance (Sene 12)',
      paragraphsAm: [
        'እስክንድርያ በምትባል ከተማ አክላወበጥራ የተባለች ንግሥት የንጉሥ በጥሊሞስ ልጅ ዙሐል በሚባል ኮከብ ስም ያሠራችው ታላቅ ምኵራብ ነበረና በየዓመቱ ሰኔ በባተ በዐሥራ ሁለት ቀን በዚያ ምኵራብ ሕዝቡ ተሰብስቦ ታላቅ በዓል ያደርጉ ነበር፡፡ በዚያም ምኵራብ ውስጥ ዙሐል የሚሉት ታላቅ የነሐስ ጣዖት ነበረና በዓሉ በሚከበርበት ዕለት ብዙ ፍሪዳዎችን ያርዱለት ነበር፡፡ አባ እለእስክንድሮስ ሊቀ ጵጵስና በተሾመ ጊዜ፣ ጻድቅ ቆስጠንጢኖስም በነገሠ ጊዜ የክርስትና ሃይማኖት ስለ ተስፋፋች ያን ጣዖት ሊሠብረው ወድዶ ሳለ ሰዎች ከለከሉት፡፡ እርሱ ግን አስተምሮ ጣዖቱ የማይጠቅም መሆኑን ገለጸላቸው። ምክሩን ተቀብለው ጣዖቱን ሰብረው፣ ምኵራቡንም ባርከው በቅዱስ ሚካኤል ስም ቤተ ክርስቲያን አደረጉት፡፡ የታረዱት ፍሪዳዎች ሁሉ ለድሆችና ለችግረኞች ምግብ እንዲሆኑ አደረገ። ይህ በዓል እስከ ዛሬ ጸንቶ ይኖራል። ዳግመኛም በዚች ዕለት እግዚአብሔር ቅዱስ ሚካኤልን በመላእክት ዅሉ ላይ በከፍተኛ ክብር ሾመው፡፡',
        'የቅዱስ ሚካኤል ተአምራት እጅግ ብዙ ሲሆኑ ከእነርሱም አንዱ የባሕራን ታሪክ ነው፡፡ እግዚአብሔርን የሚፈራና የቅዱስ ሚካኤልን በዓል በየወሩ የሚያከብር አንድ ደሃ ሰው ነበረ፡፡ ጎረቤቱ ግን ርኅራኄ የሌለው ባለጠጋ ነበርና በዓሉን የሚያከብረውን ሰው ይዘባበትበት ነበር። ያ ደሃ ሰው ሊሞት ሲል ሚስቱን የበዓሉን መታሰቢያ እንድታደርግና እንድትመጸውት አዘዛት። ሚስቱም ፀንሳ ነበርና ምጥ ሲይዛት ወደ ቅዱስ ሚካኤል ጮኸች፤ ወዲያው ብርሃን በራና ውብ ልጅ ወለደች። ቅዱስ ሚካኤልም ወርዶ “ርኅራኄ የሌለውን የዚህን ባለጠጋ ሀብትና ንብረት ይህ ሕፃን እንዲወርስ እግዚአብሔር አዝዟል” ብሎ ባረከው። ይህንን ሰምቶ በቅናት የተሞላው ባለጠጋ ሕፃኑን ለመግደል አቅዶ ከእናቱ በሃያ ወቄት ወርቅ ገዛው። ከዚያም በልጁ ልክ ሣጥን አሠርቶ ሕፃኑን አስገብቶ ወደ ባህር ጣለው። ነገር ግን በእግዚአብሔር ፈቃድ ሣጥኑ ሳይሰጥም ተንሳፎ ሃያ ቀን ጎዳና ርቆ ወደሚገኝ አገር ወደብ ደረሰ፤ በአንድ በግ ጠባቂ ተገኝቶ “ባሕራን” ተብሎ ተሰይሞ አደገ።',
        'ከሃያ ዓመታት በኋላ ያ ባለጠጋ ወደ በግ ጠባቂው ቤት በእንግድነት መጥቶ ባሕራን ወደ ባህር የጣለው ሕፃን መሆኑን አወቀ። አሁንም ሊገድለው አቅዶ “ወደ ቤቴ የረሳሁት ጉዳይ ስላለ ይህንን ደብዳቤ ውሰድልኝ” ብሎ ባሕራንን ላከው። ደብዳቤው “ይህንን ደብዳቤ ይዞ የመጣውን ባሕራንን ገድለህ ጉድጓድ ውስጥ ጣለው” የሚል ነበር። ባሕራን በመንገድ ሲጓዝ የመላእክት አለቃ ቅዱስ ሚካኤል በንጉሥ ጭፍራ አምሳል በነጭ ፈረስ ተገልጦ ደብዳቤዋን ተቀበለውና የሞቱን መልእክት ደመሰሰው። በእርሱ ፈንታም “ይህን ደብዳቤ ይዞ ለመጣው ባሕራን ለተባለው ሰው ልጄን አጋቡት፣ ንብረቴንና ጥሪቴንም ሁሉ አውርሼዋለሁና የፈለገውን ያድርግ” የሚል ደብዳቤ ጽፎ አሸገው። ባሕራንም ደብዳቤውን ለባለጠጋው ሹም በሰጠው ጊዜ በተጻፈው መሠረት ከባለጠጋው ልጅ ጋር በቤተ ክርስቲያን ሥርዓት ተክሊል አጋቡት። ባለጠጋውም ሲመለስ የሠርግ ድምፅ ሰምቶ ነገሩን ሁሉ ሲረዳ በድንጋጤ ከፈረሱ ላይ ወድቆ በድንገት ሞተ። ባሕራንም የቅዱስ ሚካኤልን ተአምር ተረድቶ ቤተ ክርስቲያን ሠራለት፣ እስከ ሞቱም በታማኝነት አገለገለ።',
        'በተጨማሪም በዚህች ዕለት እግዚአብሔርን የሚፈራ አስተራኒቆስ ካረፈ በኋላ በየወሩ የጌታችንን፣ የእመቤታችንንና የቅዱስ ሚካኤልን በዓል በታማኝነት የምታከብር የቅድስት አፎምያ ዕረፍት መታሰቢያ ነው፡፡ ሰይጣን በባልነት ሊያገባት በቅናት ተነስቶ መነኩሲትና ብርሃናዊ መልአክ መስሎ ሊያስታት በተደጋጋሚ ሞከረ። በመጨረሻም የቅዱስ ሚካኤልን ሥዕል ይዛ ስታባርረው ሊያንቃት ሲሞክር ቅዱስ ሚካኤል ደርሶ ሰይጣኑን ቀጣውና አዳናት። ቅዱስ ሚካኤልም የአፎምያን ዕረፍት አብስሯት በሰላም አረፈች። ይህ ድንቅ ተራዳኢ መልአክ ቅዱስ ሚካኤል ከሰይጣን ወጥመድ እንዲያድነን፣ መከራችንን እንዲያርቅልን፣ የምድራችንን ፍሬ እንዲባርክልንና በቀናች ሃይማኖት እንዲያጸናን በፊቱ እንማጸነው።'
      ],
      paragraphsEn: [
        'In the city of Alexandria, there was a great temple built by Queen Aklawebtra (daughter of King Ptolemy) in the name of a star-god called Zuhal (Saturn). Every year on Sene 12, people gathered in this temple to sacrifice many oxen to a massive bronze idol. This pagan worship continued until the 4th century when Abba Alexander was consecrated as Patriarch of Alexandria. Wishing to destroy the idol, he was met with resistance from people accustomed to the festival. He wisely taught them that the idol was useless and proposed instead to dedicate the temple as a church in the name of the glorious Archangel Saint Michael, using the sacrificed animals to feed the poor. The people agreed, and this great feast remains celebrated to this day. On Sene 12, God also appointed Saint Michael as the chief of all heavenly hosts.',
        'Among the countless miracles of Saint Michael is the story of Bahran. A pious, poor man who faithfully celebrated Saint Michael\'s feast died and instructed his pregnant wife to continue the practice. When she went into labor in great pain, she cried out to Saint Michael, and a great light shone as she gave birth to a beautiful son. Archangel Michael descended and prophesied: "God has decreed that this child shall inherit all the wealth of the merciless rich neighbor." The greedy neighbor overheard this and, filled with envy, bought the child from his mother for twenty ounces of gold. He placed the baby in a chest and threw it into the sea. By divine will, the chest floated safely to a shore twenty days away, where a shepherd rescued the child and named him Bahran.',
        'Twenty years later, the rich man visited the shepherd and realized Bahran was the boy he tried to drown. Seeking again to destroy him, he sent Bahran to his steward with a sealed letter that read: "Kill the bearer of this letter immediately." Along the way, Saint Michael appeared on a white horse disguised as a royal soldier, took the death warrant, and replaced it with a letter reading: "Upon receiving this letter, marry my daughter to Bahran and hand over all my possessions and inheritance to him." When Bahran delivered the letter, the steward immediately arranged a holy church wedding. When the rich man returned and discovered Bahran had married his daughter and inherited his estate, he fell from his horse in sheer shock and died instantly. Bahran built a magnificent church to Saint Michael and served there faithfully as a priest.',
        'Sene 12 also commemorates the dormition of the righteous Saint Afomya, wife of the pious Asteranicos. Following her husband\'s death, she continued their tradition of celebrating monthly feasts. The devil, filled with jealousy, repeatedly disguised himself—first as a nun and later as a radiant angel—to deceive her into breaking her vows and remarrying. When she demanded to see the sign of the holy cross, the devil transformed into a terrifying beast and attempted to strangle her. She cried out to Saint Michael, who instantly appeared, punished the devil, and delivered her. Revealing her imminent departure, the archangel blessed her, and she peacefully rested in the Lord after donating all her wealth to the poor. May the swift intercession and protection of Saint Michael be with us all!'
      ],
      blessingAm: 'የቅዱስ ሚካኤል ጥበቃ፣ ምልጃና በረከት ከሁላችን የክርስቲያን ወገኖች ጋር ይሁን፣ አሜን።',
      blessingEn: 'May the powerful protection, intercession, and blessing of Archangel Saint Michael be with us all, Amen.'
    }
  },
  {
    id: 'saint-arsema-meskerem',
    category: 'feast',
    nameEn: 'Feast of Saint Arsema (Meskerem 29)',
    nameAm: 'መስከረም ፳፱ ቀን የቅድስት አርሴማ ዓመታዊ ክብረ በዓል',
    periodEn: 'Meskerem 29 (October 9 or 10 in leap years)',
    periodAm: 'መስከረም ፳፱ ቀን',
    durationEn: 'Annual Major Feast',
    durationAm: 'ዓመታዊ ታላቅ በዓል',
    theologyEn: 'This feast commemorates the martyrdom of Saint Arsema (Hripsime) and her companion virgins under King Tiridates of Armenia, following their flight from the Roman Emperor Diocletian. Renowned for her extraordinary beauty and spiritual fortitude, Saint Arsema chose heavenly betrothal to Jesus Christ over earthly power, physically overcoming King Tiridates when he attempted to force her. Along with 75 men and 39 women, she received the crown of martyrdom, leading to the eventual healing and conversion of King Tiridates by Saint Gregory the Illuminator.',
    theologyAm: 'በመስከረም ፳፱ ቀን ከሮማዊው አውራሪ ድዮቅልጥያኖስ በመሸሽ ወደ አርማንያ ከተሰደዱት ደናግል መካከል ውበቷና መንፈሳዊ ጽናቷ ልዩ የሆነው የቅድስት አርሴማ ሰማዕትነት ይዘከራል። ለሰማያዊ ሙሽርነቷ የታመነችው ቅድስት አርሴማ፣ ምድራዊውን ኃይልና የንጉሥ ድርጣድስን ማባበያ ፈጽማ በመቃወም በታላቅ ተጋድሎና ጥብዓት አንገቷን በመሰየፍ የሰማዕትነትን አክሊል ተቀዳጅታለች። ይህ በዓል የእርሷንና የማኅበሯን ሰማዕታት አሸናፊነትና ተጋድሎ ያበስራል።',
    observanceEn: [
      'Commemorating the martyrdom and spiritual victory of Saint Arsema and her companion virgins on Meskerem 29.',
      'Reflecting on her absolute dedication as a "Bride of Christ" and her unwavering refusal to submit to Diocletian or Tiridates.',
      'Remembering the physical and spiritual strength given to her by the Holy Spirit, which enabled her to throw down the powerful king.',
      'Honoring the endurance of the holy virgins who willingly accepted death before her eyes while she encouraged them to secure their heavenly crowns.',
      'Celebrating the ultimate conversion of Armenia to Christianity, sparked by the subsequent healing of King Tiridates through Saint Gregory.'
    ],
    observanceAm: [
      'በየዓመቱ መስከረም ፳፱ ቀን የቅድስት አርሴማንና የቅዱሳን ደናግልን የሰማዕትነት የድል አክሊል በታላቅ መንፈሳዊ ደስታ ማክበር።',
      'እራሷን ለሰማያዊው ሙሽራ ለኢየሱስ ክርስቶስ በመስጠት በቅድስናና በንጽሕና ለመኖር ያደረገችውን ፍጹም ተጋድሎ መዘከር።',
      'ንጉሥ ድርጣድስ በግድ ሊወስዳት ሲሞክር በመንፈስ ቅዱስ ኃይል የጦር ጀግና የሆነውን ንጉሥ ከመሬት የፈጠፈጠችበትን መለኮታዊ ኃይልና ድፍረት ማድነቅ።',
      'ደናግሉ እህቶቿ በፊቷ አንገታቸውን ሲቆረጡ "አይዟችሁ!" እያለች ያሳየችውን መንፈሳዊ ጥብዓትና ያገኘችውን የብርሃን ዐይኖች ተአምር መመስከር።',
      'በቅድስት አርሴማ ስም በተሰሩ አብያተ ክርስቲያናት በመገኘት በጸሎትና በምስጋና መሳተፍ፣ ለድሆችም ምጽዋት በመስጠት በረከቷን መካፈል።'
    ],
    narrative: {
      titleAm: 'የቅድስት አርሴማ ሰማዕትነትና ዓመታዊ ክብረ በዓል ታሪክ (መስከረም ፳፱)',
      titleEn: 'The Martyrdom and Triumphant Coronation of Saint Arsema and the Holy Virgins (Meskerem 29)',
      paragraphsAm: [
        'በከሀዲው ዲዮቅልጥያኖስ ዘመነ መንግሥት ንጉሡ መልኳ (ሥነ ላህይዋ) ውብ የሆነች ብላቴና ሊያገባ ወዶ መልእክተኞችን መርጠው ያመጡለት ዘንድ ላከ። እነርሱም መላ ሀገሪቱን ሲያስሱ ከቆዩ በኋላ ንጽሕት ቅድስት አርሴማ እናታችንን በአንድ በሮሜ ባለ ገዳም ውስጥ ከሌሎች ደናግል ጋር አገኟትና ሥዕሏን ስለው ለንጉሡ ላኩለት። ንጉሡም ይህን ሥዕል እንዳየ በልቡ በእጅጉ ፈቀዳ፤ እንዲያመጡለትም አዘዘ። ይህን እንደሰሙ እኒያ ደናግልና ቅድስት አርሴማ የገዳሙም እመምኔት የሆነችው ቅድስት አጋታ ሸሽተው ወደ አርማንያ ሄዱ። በዚያም ሳሉ ንጉሥ ድርጣድስ የሚገዛው ግዛቱ ነበርና ከንጉሡ ድዮቅልጥያኖስ መልእክት ደርሶት ሲያስፈልጋት ከደናግሉ ጋራ አገኛቸው። እርሱም በመልከ መልካምነቷ በእጅጉ ተስቦ ለንጉሡ ድዮቅልጥያኖስ መሥጠቱን ትቶ ለራሱ እዚያው አኖራት።',
        'ከደናግሉም ጋራ ካሠራቸው በኋላ ቅድስት እናታችንን ብዙ ሊያታልላት ሞከረ። እርሷ ግን በመንፈሳዊ ሕይወቷ ፍጹም ጥብዓት ያለባት ራሷንም ለቸሩ አምላካችን ለኢየሱስ ክርስቶስ ሙሽራ ያደረገች ናትና ለሰማያዊ ሙሽርነቷ የታመነች ሆነች። ንጉሡም ደጋግሞ ቢሞክር አልሆንለት አለ። በኋላም እመ ምኔቷን እንድታባብላት ላካት፤ እመ ምኔቷ ግን ይበልጡኑ አጽናናቻት፤ “አይዞሽ! እንዲ ላለው ምድራዊ ኃላፊ ነገር እንዳትታለይ፤ ሰማያዊ ሙሽርነትሽንና ንጽሕናሽን አጽኚ” ብላ እንዲያውም ይበልጥ አስጨከነቻት። በኋላም ንጉሡ በግድ ይዞ ሊሄድ ቢል ኃይለ መንፈስ ቅዱስ አድሮባት ነበርና ያንን በጦር የጎለመሰ ሰውነት ያለውን ብርቱ ንጉሥ ከመሬት ፈጠፈጠችው። ንጉሡም አንዲት ትንሽ ወጣት እንደምን ጣለችኝ ብሎ እጅግ አፈረና ተቆጣ።',
        'ንጉሡም በዚህ ሁሉ ተቆጥቶ ቅድስት አርሴማን ሥቃይዋን ሊያበዛባት ወዶ እኒያን ደናግል እርሷን ፊት ለፊታቸው አሠራትና አንድ በአንድ አንገታቸውን ቀላቸው። እርሷ ግን “አይዟችሁ!” እያለች ታጽናናቸው ነበር። የሚደንቀው ትሰቀቃለች ብሎ ያደረገላት ነገር እንዲያውም ቅዱሳኑ ሰማያዊ አክሊልን ሲቀበሉ ትመለከትበት ነበር። በኋላም “አንቺንስ እንደሌሎቹ ቶሎ አልገድልሽም” ብሎ እጅግ ብዙ ሥቃያትን አሠቃያት። ከእነዚህም አንደኛው ሁለቱን ድንግል ጡቶቿን ቆረጠ፤ ይህም አልበቃ ብሎት ሁለቱን ዐይኖቿን አወጣ፤ እርሷም እንዲህ ሳለች እመቤታችን ንጽሕት ድንግል ማርያም የብርሃን ልዩ ዐይኖችን ሰጠቻት። በመጨረሻም ማሠቃየትን በሰለቸ ጊዜ ከእኒያ ከቀሩት ደናግል ጋራ በመስከረም ሃያ ዘጠኝ ቀን አንገቷን ሰየፈና ሁላቸውም የሰማዕትነትን የድል አክሊል ተቀዳጁ። እኒህም ቁጥራቸው ሰባ አምስት ወንዶችና ሠላሳ ዘጠኝ ሴቶች ነበሩ።',
        'ቅድስት አርሴማ ከሃያ ሰባቱ ደናግል ጋራ ሰማዕትነት ከተቀበለች በኋላ ንጉሡ ድርጣድስ ፈጽሞ ታመመ ታወከ። ቅዱስ ጎርጎርዮስም ሊቀ ጳጳሳትን አስቀድሞ አሥሮት ነበር (ይኸውም በትውፊት ታላቅ ወንድሟ እንደኾነ ይነገራል)። በኋላም ቅዱስ ጎርጎርዮስን ፈታውና ከደዌው ዳነ፤ የቅዱሳን ደናግል እና የቅድስት አርሴማንም የቅዱሳን ሰማዕታቱን ዕፅም ፍልሠታቸው በዚህ በቅዱስ ጎርጎርዮስ እንዲደረግ ሆነ፤ ይህም ታኅሣሥ ስድስት ቀን ነው፡፡ እንዲሁ ደግሞ የእርሷ ማኅበርተኞች የሚባሉ የመቶ ዐሥራ ዘጠኝ ሰማዕታት ዝክራቸው ነው። ከዚያም በስሟ ያማረ ቤተ ክርስቲያን ሠርተው እንዲሁ ያከበሩበት ነውና እናከብረው ዘንድ ይገባናል። ለእግዚአብሔር አምላካችን በዚህች ድንቅ የክርስቶስ ሙሽራ ቅድስት አርሴማ እና በደናግሉም ሁሉ ጸሎት ይማረን፤ ለዘላለሙ አሜን።'
      ],
      paragraphsEn: [
        'During the reign of the pagan Emperor Diocletian, the emperor desired to marry an exceptionally beautiful maiden. He sent messengers to search throughout the land. After an extensive search, they found Saint Arsema in a Roman convent living with other holy virgins under the guidance of Mother Superior Saint Agatha. The messengers drew a portrait of Arsema and sent it to the emperor. Upon seeing the portrait, the emperor\'s heart burned with desire, and he ordered her to be brought to him immediately. Learning of this, Saint Arsema, Saint Agatha, and the companion virgins fled Roman territory and sought refuge in Armenia.',
        'Armenia was ruled by King Tiridates (Trdat), who received a warning letter from Emperor Diocletian. Tiridates tracked down the virgins and arrested them. However, when Tiridates saw Saint Arsema\'s extraordinary beauty, he decided to keep her for himself rather than send her to Diocletian. He tried to win her over with flattery and luxury, but Arsema, possessing immense spiritual fortitude, declared herself a Bride of Christ and refused to break her vow of perpetual virginity. Tiridates sent the Mother Superior Saint Agatha to persuade her, but instead, Agatha encouraged her, saying, "Be strong, my child! Do not be deceived by fleeting earthly glory; preserve your heavenly betrothal and purity."',
        'Enraged, Tiridates tried to take Saint Arsema by force. Filled with the power of the Holy Spirit, Arsema physically overpowered the battle-hardened king, throwing him to the ground. Extremely humiliated that a young girl had defeated him, the king ordered her companion virgins to be bound and executed one by one before her eyes to break her spirit. Instead of weeping, Saint Arsema encouraged her sisters, watching them ascend with their heavenly crowns. Tiridates then subjected Arsema to extreme tortures, including cutting off her breasts and gouging out her eyes. In her agony, our Lady the Virgin Mary appeared and blessed her with radiant eyes of light. Finally, on Meskerem 29, she was beheaded alongside the remaining virgins (75 men and 39 women in total), crowning their triumph.',
        'Following their martyrdom, King Tiridates was struck with a severe illness and madness. He was eventually healed through the prayers of Saint Gregory the Illuminator, whom Tiridates had previously imprisoned (and who, by tradition, is said to be Saint Arsema\'s elder brother). Tiridates and the entire nation of Armenia then embraced Christianity. Saint Gregory later translated the holy relics of Saint Arsema and the companion virgins, an event commemorated on Tahsas 6. A beautiful church was built in her honor, where countless miracles continue to occur. May the intercession, prayers, and blessings of the triumphant Bride of Christ, Saint Arsema, and all her companion martyrs be with us for ever and ever. Amen.'
      ],
      blessingAm: 'የቅድስት አርሴማ እምነት፣ ጽናት፣ በረከትና ረድኤት ከሁላችን ጋር ይሁን፣ አሜን።',
      blessingEn: 'May the faith, endurance, blessings, and intercession of Saint Arsema be with us all, Amen.'
    }
  },
  {
    id: 'holy-trinity-tir',
    category: 'feast',
    nameEn: 'Feast of the Holy Trinity (Tir 7)',
    nameAm: 'ጥር ፯ ቀን የሥላሴ ዓመታዊ ክብረ በዓል',
    periodEn: 'Tir 7 (January 15)',
    periodAm: 'ጥር ፯ ቀን',
    durationEn: 'Annual Major Feast',
    durationAm: 'ዓመታዊ ታላቅ በዓል',
    theologyEn: 'The word "Sillase" (Trinity) is derived from the Ge\'ez root meaning "to make three," denoting the Triune nature of God. We believe in one God in three Persons: Father (Ab), Son (Wold), and Holy Spirit (Menfes Qidus)—unified in essence, divinity, will, and power, yet distinct in Name, Person (Akhal), and Property (Gibr). The Father begets and spirates; the Son is begotten; the Holy Spirit proceeds. This mystery is revealed throughout the Old Testament, such as the creation of man, the visitation of Abraham at Mamre, and in the New Testament at the Baptism of Jesus Christ in the Jordan and the Transfiguration on Mount Tabor. This annual feast on Tir 7 commemorates the miraculous deeds of the Holy Trinity, particularly the confounding of the prideful tower of Babel, reminding all believers of God\'s absolute sovereignty.',
    theologyAm: 'ሥላሴ የሚለው ቃል «ሠለሰ» ሦስት አደረገ ከሚለው የግዕዝ ሥርወ ቃል የተገኘ ሲሆን ይህም ልዩ ሦስትነት ማለት ነው፡፡ በሃይማኖታችን እግዚአብሔርን በአንድነትና በሦስትነት እናምናለን። የሥላሴ አንድነት በባሕርይ፣ በህልውና፣ በፈቃድ ሲሆን፤ ሦስትነት ደግሞ በስም (አብ፣ ወልድ፣ መንፈስ ቅዱስ)፣ በአካል (ለእያንዳንዳቸው ፍጹም ገጽና ረቂቅ አካል አላቸው)፣ በግብር (አብ ወላዲና አሥራጺ፣ ወልድ ተወላዲ፣ መንፈስ ቅዱስ ሠራጺ) ነው። ይህ ምሥጢረ ሥላሴ በብሉይና በአዲስ ኪዳን የተገለጠ ታላቅ መሠረት ነው። ጥር ፯ ቀን የሚከበረው የሥላሴ ዓመታዊ በዓል ከጥፋት ውኃ በኋላ የሰው ልጆች በትዕቢት ያነጹትን የባቢሎንን ግንብ ቋንቋቸውን በመለየት ያፈረሰበትን ታላቅ መለኮታዊ ሥልጣንና ድንቅ ተአምር የምናስብበት ዕለት ነው።',
    observanceEn: [
      'Commemorating the infinite majesty and absolute sovereignty of the Holy Trinity on Tir 7.',
      'Reflecting on the mystery of the Triune God—One in Essence (Divine Nature) and Three in Person (Father, Son, and Holy Spirit).',
      'Remembering the historical event at the Tower of Babel, where the Holy Trinity descended to humble human pride and diversify languages.',
      'Honoring the Trinity as revealed to Abraham under the Oaks of Mamre and in the Holy Gospels at the Jordan River.',
      'Participating in celebratory Divine Liturgies and presenting alms to the poor in the name of the Holy Trinity.'
    ],
    observanceAm: [
      'በየዓመቱ ጥር ፯ ቀን የእግዚአብሔርን ፍጹም መለኮታዊ ሥልጣንና ቸርነት በታላቅ በዓል ማክበር።',
      'የሥላሴን አንድነትና ሦስትነት በስም፣ በአካል፣ በግብር በአስተምህሮ ማሰላሰልና ማመስገን።',
      'በዕለቱ የተፈጸመውን የባቢሎንን ግንብ በትዕቢት ያነጹትን ቋንቋቸውን በመለየት በእግዚአብሔር ፈቃድ የመበተናቸውን ታሪክ ማስተማር።',
      'በስመ ሥላሴ የተጠመቅንባትን ልጅነት በንስሐና በበጎ ምግባር በመጠበቅ ቅዱስ መንፈስን አለማሳዘን።',
      'በቅድስት ሥላሴ ስም ለነዳያንና ለችግረኞች ምጽዋት መስጠት፣ በዓለ ንግሡንም በታላቅ የሌሊት ማኅሌትና በቅዳሴ መሳተፍ።'
    ],
    narrative: {
      titleAm: 'የቅድስት ሥላሴ ዓመታዊ በዓልና የምሥጢረ ሥላሴ አስተምህሮ (ጥር ፯)',
      titleEn: 'The Feast of the Holy Trinity and the Theological Doctrine of the Triune God (Tir 7)',
      paragraphsAm: [
        'ሥላሴ የሚለው ቃል ‹‹ሠለሰ›› ሦስት አደረገ ከሚለው የግዕዝ ሥርወ ቃል የተገኝ ሲሆን ይህም ልዩ ሦስትነት ማለት ነው፡፡ ምሥጢረ ሥላሴ ብለን ስለነገረ ሃይማኖት ስንናነገር ግን አንድም ሦስትም ተብሎ ይተረጎማል፡፡ በዚህም መሠረት እግዚአብሔርን አንድም ሦስትም ብለን ማመናችንን የምንገልፅበት የሃይማኖት ዶግማ ነው፡፡ እንደሚታወቀው የሥላሴ አንድነት ስንል በባህርይ በህልውና በፈቃድ አንድ አምላክ ማለታችን ሲሆን ሦስትነት ስንል ደግሞ በስም፣ በአካል፣ በግብር ነው፡፡ የሥላሴ አንድነትና ሦስትነትን ከሚገልጹ ማስረጃዎች ለአብነት፦ «እግዚአብሔርም አለ ሰውን በመልካችን እንደ ምሳሌያችን እንፍጠር» (ዘፍ. ፩፥፳፮) «እግዚአብሔርም አለ» ብሎ አንድነቱን «ሰውን በመልካችን እንፍጠር» ብሎ ሦስትነትን ይገልጻል፡፡ እንደዚሁም «እነሆ አዳም መልካምንና ክፉን ለማወቅ ከእኛ እንደ አንዱ ሆነ» (ዘፍ. ፫፥፳፪) የሚለው «ከእኛ» እና «እንደ አንዱ» የሦስትነትን ምሥጢር ይጠቁማል። በኦሪት የሥላሴ ምሥጢር ለአብርሃም በመምሬ ዛፍ ሥር ተገለጠ። (ዘፍ. ፲፰) ሦስት ሰዎች አብርሃም አይቶ ሲሰግድ «አቤቱ በፊትህ ሞገስን አግኝቼ እንደሆነ» ብሎ በአንድ ቁጥር ሲናገር፣ ቀጥሎም «ጥቂት ውኃ ይምጣላችሁ» ብሎ በአካል ሦስት መሆናቸውን በመግለጽ የአንድነትና የሦስትነት ነገር እናስተውልበታለን።',
        'የሥላሴ ሦስትነት ስንል፦ በስም አብ፣ ወልድ፣ መንፈስ ቅዱስ ማለታችን ሲሆን፣ በአካል ደግሞ ለአብ ፍጹም ገጽ፣ ፍጹም መልክ፣ ፍጹም አካል አለው፤ ለወልድ ፍጹም ገጽ፣ ፍጹም አካል አለው፤ ለመንፈስ ቅዱስ ፍጹም ገጽ፣ ፍጹም መልክ፣ ፍጹም አካል አለው ብለን ማመናችን ነው፤ ይህም የማይወሰን የማይለካ ረቂቅ አካል ነው፡፡ በግብር ሦስትነት ስንል የአብ ግብሩ መውለድና ማሥረጽ (አብ ወላዲ)፣ የወልድ ግብሩ መወለድ (ወልድ ተወላዲ)፣ የመንፈስ ቅዱስ ግብሩ መሥረጽ (መንፈስ ቅዱስ ሠራጺ) ማለታችን ነው። በቅዱስ ወንጌል በዮርዳኖስና በደብረ ታቦር የሥላሴ ምሥጢር ገሀድ ሆኗል። መድኃኒታችን ኢየሱስ ክርስቶስ «እኔና አብ አንድ ነን» ማለቱና «እኔን ያየ አብን አየ» ማስተማሩ ነገረ ሥላሴን ያስረዳል። በምሳሌም ለመረዳት፦ ፀሐይ ከበብ፣ ብርሃን، ሙቀት፤ ወይም እሳት ነበልባል፣ ፍሕም፣ ሙቀት ሲኖራቸው ሦስት ፀሐይ ወይም ሦስት እሳት እንደማይባል ሁሉ፣ ሥላሴም በስም በአካል በግብር ሦስት ቢባሉም አንድ አምላክ እንጂ ሦስት አማልክት አይባሉም። የቤተክርስቲያናችን ጸሎት፣ ጥምቀት፣ ቡራኬ ሁሉ በስመ ሥላሴ ነው፡፡',
        'ይህም እንዳለ ሆኖ ነገረ ሥላሴን በበዓል ለመመስከርና የቸርነቱ የምሕረቱ ተካፋይ ለመሆን በዓለ ንግሥ ይከናወናል። በይበልጥም ሐምሌ ፯ ቀን ለአብርሃም በድንኳን ደጃፍ መገለጡንና ጥር ፯ በባቢሎን በሰናዖር የተፈጸመውን ተአምር በማሰብ እናከብራለን፡፡ ከጥፋት ውኃ በኋላ የኖኅ ልጆች በባቢሎን ሰናዖር ሜዳ «ሳንሞት ስም ማስጠሪያ ግንብ እንገንባ» ብለው ታላቅ ግንብ ገነቡ። አለቃቸው ናምሩድ «ሞትን የሚያመጡብን ሥላሴ ናቸውና እነርሱን ወግተን ሞትን እናርቅ» አላቸው። ከዚያም ሆነው ጦር ይወረውሩ ጀመር፤ ሰይጣንም ከደመና ደም እየቀባ ይልክላቸው ስለነበር «አሁን አብን ወጋነው፣ አሁን ወልድን ወጋነው…» ይሉ ጀመር። ቅድስት ሥላሴ ምንም እንኳ ምሕረታቸው የበዛ ቢሆንም ዲያብሎስ ስለሰለጠነባቸውና ለሌሎች ከሀድያን ትምህርት ይሆን ዘንድ «ንዑ ንረድ ወንክዐው ነገሮሙ (ኑ እንውረድ ቋንቋቸውንም እንቀላቅለው)» በማለት ቋንቋቸውን ለያዩባቸው። የማይግባቡና የማይደማመጡ ሆነው ተበታተኑ፤ የዓመፃ ሕንጻቸውም በነፋስ ጠራርጎ ጠፋ። ይህን ያደረጉ ሥላሴ በመሆናቸው በዓሉ ጥር ፯ ይከበራል።',
        'የዚህ በዓል መልእክት ሥልጣን ሁሉ የእግዚአብሔር መሆኑን እና በራስ ደካማ አመለካከት በመታበይ በእግዚአብሔር ሥራ መግባት ወይም መጠራጠር እንደሚጎዳ ያስገነዝበናል። በጽኑ እምነት መኖርና በሥላሴ ስም የተጠመቅንበትን የልጅነት ክብር በኃጢአት ሳናሳድፍ፣ በንስሐ ታጥበንና በምግባር ጸንተን መጠበቅ እንደሚገባን ያስተምረናል። ሐዋርያው ቅዱስ ጳውሎስ «የታተማችሁበትን ቅዱሱን የእግዚአብሔርን መንፈስ አታሳዝኑ» እንዳለ (ኤፌ. ፬፥፴) እኛም መንፈስ ቅዱስን ሳናሳዝን በእምነት እንኑር። ለእግዚአብሔር ምስጋና ይሁን፤ እኛንም በቸርነቱ ይጠብቀን፤ አሜን።'
      ],
      paragraphsEn: [
        'The word "Sillase" (Trinity) is derived from the Ge\'ez root "Selese," meaning "to make three," which signifies the Holy Trinity. In the Orthodox doctrine, we believe in one God in Trinity—a unity in essence, existence, and will, and a trinity in Name, Person (Akhal), and Property (Gibr). Biblical proofs of this unity and trinity abound. In Genesis 1:26, "And God said [Unity], Let Us make man in Our image, after Our likeness [Trinity]." Similarly, in Genesis 3:22, the phrase "from Us" and "like one" points to the mystery of the Trinity. In the Old Testament, the Trinity was revealed to Abraham under the Oak of Mamre (Gen. 18), where he saw three men and bowed down, addressing them as "My Lord" in the singular, yet offering hospitality in the plural ("let a little water be brought"), beautifully demonstrating this mystery.',
        'By Trinity we mean: In Name—Father (Ab), Son (Wold), and Holy Spirit (Menfes Qidus); In Person—each possesses a perfect appearance, form, and infinite spiritual personhood; In Property—the Father is the Begetter and Spirator (Ab Weladi / Aseratsi), the Son is the Begotten (Wold Teweladi), and the Holy Spirit proceeds (Menfes Qidus Seratsi). The mystery of the Trinity was fully manifested in the New Testament during the Baptism of Jesus Christ in the Jordan River and at His Transfiguration on Mount Tabor. Our Savior taught, "I and the Father are one" (John 10:30) and "He who has seen Me has seen the Father." To understand this through analogy: just as the sun is composed of a circular shape, light, and heat, or fire consists of flame, coal, and heat, yet we do not speak of three suns or three fires, likewise, the Holy Trinity is three in Name, Person, and Property, but is one God, not three gods. All prayers, baptisms, and blessings of our Church are performed in the Name of the Trinity.',
        'To celebrate this mystery and partake of His grace, special feasts are observed. Particularly, Hamle 7 commemorates the visitation of Abraham, and Tir 7 commemorates the miraculous intervention at the Tower of Babel (Gen. 11:1-9). After the great flood, Noah\'s descendants gathered in Shinar and pridefully decided to build a massive tower to make a name for themselves. Their leader, Nimrod, falsely claiming that God (the Trinity) brought death upon them, incited them to shoot spears into the sky to fight God. Satan, using illusions, smeared the spears with blood and sent them back, leading the prideful builders to boast, "We have pierced the Father, we have pierced the Son..." Although God is slow to anger, because of their extreme rebellion, He said, "Come, let Us go down and confound their language." They instantly lost mutual understanding, dispersed across the earth, and the wind destroyed their vain tower. Thus, the annual feast on Tir 7 marks this event.',
        'The ultimate message of the Feast of the Holy Trinity is that all sovereignty belongs to God. Presuming to challenge or doubt God\'s wisdom through human pride leads to destruction. It teaches us to live in deep faith, safeguarding the grace of adoptive divine sonship we received through our Holy Baptism in the Name of the Father, Son, and Holy Spirit. We must not stain this grace with sin but preserve it through repentance and righteous deeds. As Saint Paul wrote, "And do not grieve the Holy Spirit of God, by whom you were sealed" (Eph. 4:30). Praise be to God, to His Virgin Mother, and to His Holy Cross. Amen.'
      ],
      blessingAm: 'የቅድስት ሥላሴ አንድነትና ሦስትነት በረከት፣ ቸርነትና ሰላም ከሁላችን ጋር ይሁን፣ አሜን።',
      blessingEn: 'May the blessing, mercy, and peace of the Holy Trinity be with us all, Amen.'
    }
  },
  {
    id: 'saint-george-miyazia',
    category: 'feast',
    nameEn: 'Feast of Saint George the Martyr (Miyazia 23)',
    nameAm: 'ሚያዝያ ፳፫ ቀን የሰማዕቱ ቅዱስ ጊዮርጊስ ዓመታዊ ክብረ በዓል',
    periodEn: 'Miyazia 23 (May 1)',
    periodAm: 'ሚያዝያ ፳፫ ቀን',
    durationEn: 'Annual Major Feast',
    durationAm: 'ዓመታዊ ታላቅ በዓል',
    theologyEn: 'Saint George is one of the most revered martyrs in Christendom, recognized as the "Star of the East" and the "Triumphant Martyr" (Meqabiy). Born in Cappadocia to the nobleman Anastasius and the Palestinian noblewoman Theobesta, he rose to become a high-ranking military commander. Refusing fleeting earthly matches and honors, he chose to distribute his wealth to the poor, liberate his servants, and confess Christ before King Dudianos and seventy pagan kings. Over seven years, he endured unspeakable and horrific tortures, dying and being resurrected by Christ three times. Christ covenanted with Saint George, promising that anyone who celebrates his memory or calls upon his name in distress (by land, sea, or sickness) will be swiftly delivered, and their sins will be blotted out.',
    theologyAm: 'ሰማዕቱ ቅዱስ ጊዮርጊስ በኦርቶዶክሳዊት ተዋሕዶ ቤተ ክርስቲያን ዘንድ እጅግ ከሚከበሩና ከሚወደዱ ታላላቅ ቅዱሳን አንዱ ነው። በታላቅ ተጋድሎውና በትዕግሥቱ የሰማዕታት አለቃ ተብሏል። አባቱ አንስጣስዮስ የተባለ የቀጰዶቅያ መስፍን ሲሆን፣ እናቱ ቴዎብስታ የተባለች ፍልስጥዔማዊት ናት። ቅዱስ ጊዮርጊስ በ፳ ዓመቱ የአባቱን ሹመት ለመቀበል ወደ ንጉሥ ዱድያኖስ ቢሄድም ንጉሡና ፸ው ነገሥታት ሕዝቡ ጣዖት እንዲያመልኩ ሲያስገድዱ ባየ ጊዜ፣ ሀብቱን ሁሉ ለነዳያን በትኖ፣ ባሮቹን ነፃ አውጥቶ በክርስቶስ ስም መሰከረ። ሰባት ዓመት ሙሉ ታላቅ መከራና ሰባት ዓይነት መሞትንና መነሣትን ተቀብሎ በድል አክሊል አሸንፏል። እግዚአብሔርም በስሙ ለሚማጸኑት ታላቅ ቃል ኪዳን ሰጥቶታል።',
    observanceEn: [
      'Celebrating the annual feast of Saint George the Martyr on Miyazia 23 with triumphant liturgy and processions.',
      'Commemorating his victory over the dragon of Beirut, saving the maiden and bringing the population to Christ.',
      'Reflecting on his seven-year endurance of extreme tortures, including being roasted on an iron griddle and ground into ashes, yet repeatedly raised by Christ.',
      'Remembering the faith of Queen Alexandra, who believed through Saint George\'s preaching and was crowned with martyrdom.',
      'Seeking his intercession based on the covenant given to him by Jesus Christ, which promises deliverance from trouble.'
    ],
    observanceAm: [
      'በየዓመቱ ሚያዝያ ፳፫ ቀን የቅዱስ ጊዮርጊስን ታላቅ የሰማዕትነት የድል አክሊል በታላቅ ምስጋናና በዓለ ንግሥ ማክበር።',
      'በቤሩት ከተማ ደራጎኑን በኃይለ መስቀል ድል ነሥቶ ድንግሊቱን ካዳነበትና አሕዛቡን ወደ ክርስትና ከመለሰበት ታሪክ በረከትን መካፈል።',
      'በንጉሥ ዱድያኖስና በ፸ ነገሥታት ፊት ያሳየውን ፍጹም ትዕግሥትና እምነት፣ በምጣድ ውስጥ መብሰሉንና አመድ ሆኖ መነሣቱን እያሰቡ እምነትን ማጽናት።',
      'ስሙን ለሚጠሩትና መታሰቢያውን ለሚያደርጉት በጸሎትና በምጽዋት መሳተፍ፣ በታላቁ ቃል ኪዳኑም ምሕረትንና ረድኤትን ማግኘት።',
      'እንደ ንግሥት እለስክንድርያና ሥራየኛው አትናስዮስ ባሉ ብዙዎች ነፍሳት ላይ የተገለጠውን የእግዚአብሔርን ተአምርና የቅዱሱን ጥብዓት ማድነቅ።'
    ],
    narrative: {
      titleAm: 'የሰማዕቱ የቅዱስ ጊዮርጊስ ተጋድሎና ዓመታዊ ክብረ በዓል ታሪክ (ሚያዝያ ፳፫)',
      titleEn: 'The Martyrdom, Miracles, and Triumphant Coronation of Saint George (Miyazia 23)',
      paragraphsAm: [
        'የሰማዕቱ የቅዱስ ጊዮርጊስ አባት ቀጰዶቅያ አገር ይኖር የነበረ አንስጣስዮስ የተባለ መስፍን ነው፡፡ እናቱም ቴዎብስታ የተባለች ፍልስጥዔማዊት ነበረች፤ የዚህ ቅዱስ አባትም የሞተው በልጅነቱ ስለነበረ ሌላ ደግ ክርስቲያናዊ መስፍን ወስዶ በጦር ኃይል አሰለጠነው፡፡ ሃያ ዓመትም በሞላው ጊዜ መስፍኑ የ፲፭ ዓመት ልጁን ሊያጋባውና ሀብቱን ሊያወርሰው ድግስ ቢደግስም፣ ጌታችን መድኃኒታችን ኢየሱስ ክርስቶስ ግን ቅዱስ ጊዮርጊስን ለዚህ አልመረጠውምና የመስፍኑን ነፍስ ወሰደ፡፡ ቅዱስ ጊዮርጊስም ኀዘኑን ከጨረሰ በኋላ ወደ ቤሩት ሀገር ሄደ፡፡ በዚያም ደራጎንን ያመልኩና ሴት ልጆቻቸውን ይገብሩለት ነበር፤ ሰማዕቱም ደራጎኑን በኃይለ መስቀል ድል ነሥቶት ገድሎታል፤ ሕዝቡንም ወደ አምልኮተ እግዚአብሔር መልሷቸዋል፡፡',
        'ዕድሜው ሃያ ዓመት በሞላ ጊዜም ወደ ንጉሥ ዱድያኖስ ዘንድ የአባቱን ሹመት ሊቀበል ሄደ፤ ነገር ግን በዚያን ጊዜ ንጉሡ ሕዝቡ ጣዖትን እንዲያመልኩ ያስገድዳቸው ነበር። ስለዚህም ቅዱስ ጊዮርጊስ እጅግ በማዘኑ ገንዘቡን በሙሉ ለድኆችና ለምስኪኖች በመስጠት ባሮቹንም ነፃ አወጣቸው፡፡ ከንጉሡ ዘንድ በመሄድ በፊቱ ቆሞ በክብር ባለቤት በጌታችን ኢየሱስ ክርስቶስ ታመነ፡፡ ንጉሡ ግን በማባበልና ቃል ኪዳንም በመግባት አምላኩን ክዶ ለጣዖታት እንዲሠዋ ለማድረግ ቢሞክርም አልተሳካለትም። በመሆኑም ብዙ አስጨናቂ ሥቃይንም አሠቃየው፤ ጌታችን መድኃኒታችን ኢየሱስ ክርስቶስ ግን ያጸናው ቍስሉንም ያድነው ነበር፤ ለሦስት ጊዜም እንደሚሞት እርሱም እንደሚአስነሣው በአራተኛውም የምስክርን አክሊልን እንደሚቀበል ነገረው። ለሰባት ዓመትም በጽኑዕ መከራና በሥቃይም እንዲሁም በተጋድሎ እንደሚኖር በዚያም ስሙ በዓለሙ ሁሉ የተገለጠ እንደሚሆን መላእክትም እንደሚያገለግሉትም ነገረው፡፡',
        'ቅዱስ ጊዮርጊስ ትእዛዙን ባለመቀበሉ ንጉሥ ዱድያኖስ እጅግ አዝኖ አትናስዮስ የሚባል ታላቅ ሥራየኛ ካስመጣ በኋላ መርዝን ቀምሞ በጽዋ መልቶ ለቅዱስ ጊዮርጊስ እንዲጠጣው ሰጠው፡፡ ቅዱሱ ግን ያንን ጽዋ ቢጠጣውም በእግዚአብሔር ድንቅ ሥራ ምንም ጉዳት ሳይደርስበት ቀረ፡፡ ይህን ተአምር አይቶ ያ መሠርይ በክብር ባለቤት በጌታ በኢየሱስ አምኖ በሰማዕትነት ሞተ። ቁጥራቸውም ሠላሳ ሺህ ሰባት መቶ ነፍስ የሚሆኑ ሌሎች ብዙዎች ሰዎች ከእርሱ ጋር በሰማዕትነት ሞተው የሕይወት አክሊልን ተቀዳጁ፡፡ ከዚህ በኋላ ነገሥታቱ የተቀመጡባቸው የዕንጨት ወንበሮች እንዲበቅሉ፣ እንዲያብቡና እንዲያፈሩ በጠየቁት ጊዜ ቅዱስ ጊዮርጊስ ወደ እግዚአብሔር ጸሎት አድርጎ ወንበሮቹን እንዳሉት አደረጋቸው፤ አሕዛብም በጌታችን አመኑ። ነገሥታቱ ግን በጐድጓዳ ብረት ምጣድ ውስጥ አበሰሉት፤ ሥጋውንና ዐጥንቱን ፈጭተውና አመድ ካደረጉ በኋላ ከረጅም ተራራ ላይ በተኑት፤ ሆኖም ጌታችን ኢየሱስ ነፍሱን ወደ ሥጋው መልሶ አስነሣው፡፡',
        'ነገሥታቱ ዳግመኛ ሊፈትኑት «ሙታኖችን ብታሥነሣ እናምናለን» ባሉት ጊዜ ቅዱሱ ወደ አምላክ በመጸለይ ከጒድጓድ ውስጥ ወንዶችና ሴቶችን ጐልማሶችንም አስነሣላቸው፤ እነርሱም በጌታችን ስም አስተማሩ። ከሀድያን ነገሥታት ግን «የረቀቁ ሰይጣናትን አሳየህ እንጂ» ብለው ተከራከሩ። ከዚያም በአንዲት ድኃ ሴት ቤት እንዲጠበቅ አደረጉ፤ በዚያም የቤት ምሰሶ ላይ ቅርንጫፍ አብቅሎ ታላቅ ዛፍ ሆነ፡፡ ሴቲቱም ቤቷ የተደረገውን ተአምር አይታ አመነች፤ «ዕውር፣ ደንቆሮ፣ ዲዳ፣ ጐባጣ የሆነ ልጅ አለኝና ታድንልኝ ዘንድ እለምንሃለሁ» ባለችው ጊዜ በመስቀል ምልክት አትቦ አይኑ ማየት ቻለ። በኋላም ንጉሡ ከመበለቲቱ ቤት ላይ የበቀለውን ዛፍ አይቶ ተቆጥቶ ከዚያ ወስዶ አስገረፈው፤ በመንኰራኵርም እንዲያበራዩት ሲያደርግ ቅዱሱ ስለሞተ ከከተማ ውጭ ጣሉት፤ ለሦስተኛ ጊዜም ጌታችን ከሞት አስነሣው፡፡',
        'ንጉሡ ዳግመኛ በመሸንገል በመንግሥቱ ላይ ምክትል እንደሚያደርገው ቃል ገባለት፤ ቅዱሱ ግን እየዘበተበት «ነገ ለአማልክቶችህ መሥዋዕትን አቀርባለሁ» አለው። ንጉሡም ተደስቶ ወደ ቤተ መንግሥቱ አስገብቶ አሳደረው። በዚያም ቅዱስ ጊዮርጊስ ለጸሎት ተነሥቶ የዳዊትን መዝሙር ሲያነብ የንጉሡ ሚስት ንግሥት እለስክንድርያ ሰምታ ቃሉ ደስ ስላሰኛት አስተማራት፤ ንግሥቷም በጌታችን አመነች። በማግሥቱም ለአማልክት የሚሠዋ መስሏቸው ሕዝቡ በተሰበሰቡበት ቅዱሱ መበለቲቱ ያን ልጇን በምድር ላይ እንዲታኖረው ካደረገ በኋላ፣ ልጁ ወደ አጵሎን ሄዶ እንዲጠራው አዘዘው። በጣዖቱ ያደረ ያ ርኵስ መንፈስም መጥቶ «እኔ ሰውን የማስት እንጂ አምላክ አይደለሁም» ብሎ አመነ። ቅዱሱም ምድር እንድትውጠው አዘዛትና ወዲያውኑ ዋጠችው፤ ጣዖታቱንም አጠፋቸው።',
        'ንጉሡም ተቆጥቶ ቅዱስ ጊዮርጊስ ሚስቱን ወደ ክርስቲያን እንደቀየራት አውቆ ከከተማ ውጭ በመጋዝ እንዲሰነጥቋት አዘዘ፤ እርሷም የሰማዕትነት አክሊልን ተቀበለች፡፡ ነገሥታቱም አፍረው ራሱን በሰይፍ እንዲያቆርጡት መከሩት፡፡ ቅዱስ እጅግ ደስ አለው፤ ጌታችንም እሳት ከሰማይ አውርዶ ሰባውን ነገሥት ከሠራዊታቸው ጋር አቃጠላቸው። በዚያም ጊዜ ጌታችን ኢየሱስ ክርስቶስ ለቅዱስ ጊዮርጊስ ተገልጦለት ታላቅ ቃል ኪዳን ሰጠው፦ «በምድር መታሰቢያህን ለሚያደርግ ሁሉ እኔ ኃጢአቱን ሁሉ እደመስሳለሁ፤ በመከራም ውስጥ ሁኖ በባሕርም ሆነ በየብስ ወይም በደዌ በስምህ የሚለምነኝን እኔ ፈጥኜ ከመከራው አድነዋለሁ።» ከዚያም ቅዱሱ ራሱን ዘንበል አደረገ፤ በሰይፍም ቆረጡት፤ በመንግሥተ ሰማያት አክሊላትን ተቀበለ። ክርስቲያኖቹም ሥጋውን ወስደው በልዳ ቤተ ክርስቲያን ሠርተው በውስጥዋ አኖሩት፤ ከእርሱም ቁጥር የሌላቸው ድንቆችና ተአምራቶች ተገለጡ።'
      ],
      paragraphsEn: [
        'Saint George (Qidus Giorgis) was born to Anastasius, a nobleman of Cappadocia, and Theobesta, a noblewoman of Palestine. His father died when George was a child, and he was raised by another pious Christian ruler who trained him in military arts. When he turned twenty, the ruler planned a grand feast to marry George to his fifteen-year-old daughter and bequeath his fortune to him. However, Christ had chosen George for a greater calling and took the ruler\'s soul before the wedding. After his mourning period, Saint George traveled to Beirut, where the citizens worshipped a fearsome dragon and sacrificed their daughters to it. Armed with the power of the Holy Cross, the holy martyr slew the dragon, delivered the final maiden, and converted the entire population to the worship of God.',
        'At the age of twenty, Saint George traveled to the court of King Dudianos (often associated with Diocletian) to claim his father\'s rank. Upon arrival, he witnessed the pagan king and seventy other rulers forcing Christians to sacrifice to idols. Filled with grief and indignation, George distributed his vast inheritance to the poor, freed his servants, and openly confessed his faith in Jesus Christ before the court. The king tried to persuade him with bribes, honors, and promises, but the saint steadfastly refused to worship idols. Consequently, he was subjected to horrific and unspeakable tortures for seven years. Christ repeatedly appeared to comfort and heal him, promising that he would die and be resurrected three times, and receive the crown of martyrdom upon his fourth death.',
        'Infuriated by his resistance, King Dudianos summoned a famous sorcerer named Athanasius (Atnasios) to concoct a lethal poison. Saint George drank the deadly cup but was protected by divine power and remained entirely unharmed. Seeing this extraordinary miracle, the sorcerer Athanasius immediately confessed Christ and was martyred along with 30,700 other souls. Later, the rulers challenged George to make their wooden chairs grow, bloom, and bear fruit. George prayed, and the chairs instantly transformed into green, fruit-bearing trees. Unmoved by this sign, the rulers roasted him on a deep iron griddle, ground his flesh and bones to dust, and scattered his ashes from a high mountain. Yet, the Lord restored his soul to his body and raised him to life, after which George returned to preach Christ\'s name before the court.',
        'Determined to test him further, the rulers demanded: \'If you raise the dead from their tombs, we will believe in your God.\' Saint George prayed, and men, women, and youths arose from their graves, testifying to the reality of heaven and hell before receiving baptism and resting in peace. The pagan rulers claimed it was a demonic illusion and had George imprisoned in the house of a poor widow. While she went out to beg bread, an angel of the Lord provided a grand feast, and the wooden pillar of her house grew into a magnificent tree. Witnessing this, the widow wept and believed. She begged him to heal her blind, deaf, mute, and crippled son. George signed the child with the cross, immediately restoring his sight. The king, seeing the massive tree, had George beaten and broken on a wheel of torture, but Christ resurrected him a third time.',
        'Dudianos then tried to bribe him again, offering to make him second in command if he would only make a nominal sacrifice to the idols. Saint George, mockingly pretending to agree, told the king to assemble the entire city. That night, George prayed and read the Psalms of David. Queen Alexandra (Eleskindria) listened to his sweet voice and asked him to translate the scriptures. He taught her from the Creation of the world to the Incarnation of Christ, and she embraced the Christian faith. The next morning, as the crowd gathered, Saint George called upon the widow\'s son to go and command the idol Apollo to come forward. The demon dwelling within Apollo emerged, confessed before all that he was a deceiving spirit and not a god, and George ordered the earth to swallow him up, destroying all the city\'s idols.',
        'Enraged and humiliated, Dudianos discovered that George had converted Queen Alexandra. He ordered her to be dragged outside the city and sawn in half; she met her death joyfully and received her crown. The rulers then advised the king to behead George before he caused any more shame. George prayed that fire descend from heaven to consume the seventy kings and their armies, and a divine fire instantly destroyed them. Christ then appeared in glory and gave George a great covenant: \'To everyone who commemorates your name or feast, I will blot out their sins. Whoever cries out to Me in your name in distress, by sea, land, or sickness, I will swiftly deliver.\' Saint George then bowed his neck to the sword and was beheaded, receiving his crown in heaven. Pious Christians brought his holy body to Lydda (Lida), built a beautiful church in his honor, where countless miracles continue to occur. Amen.'
      ],
      blessingAm: 'የሰማዕቱ ቅዱስ ጊዮርጊስ ተራዳኢነት፣ በረከትና አማላጅነት ከሁላችን የክርስቲያን ወገኖች ጋር ይሁን፣ አሜን።',
      blessingEn: 'May the powerful intercession, blessing, and protection of the holy martyr Saint George be with us all, Amen.'
    }
  }
];

export default function LiturgicalGuideModal({ isOpen, onClose }: LiturgicalGuideModalProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'fasting' | 'feast' | 'literature'>('all');
  const [activeChapter, setActiveChapter] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [lang, setLang] = useState<'am' | 'en' | 'bilingual'>('bilingual');
  const [expandedNarrativeId, setExpandedNarrativeId] = useState<string | null>(null);

  // Filter items based on active tab and search query
  const filteredItems = useMemo(() => {
    if (activeTab === 'literature') return [];
    return GUIDE_ITEMS.filter((item) => {
      // Tab filter
      if (activeTab !== 'all' && item.category !== activeTab) return false;

      // Search query filter
      if (!searchQuery.trim()) return true;

      const query = searchQuery.toLowerCase();
      const matchEn =
        item.nameEn.toLowerCase().includes(query) ||
        item.periodEn.toLowerCase().includes(query) ||
        item.theologyEn.toLowerCase().includes(query);
      const matchAm =
        item.nameAm.includes(query) ||
        item.periodAm.includes(query) ||
        item.theologyAm.includes(query);

      return matchEn || matchAm;
    });
  }, [activeTab, searchQuery]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 select-none" 
          id="liturgical-guide-modal-overlay"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-dark/60 backdrop-blur-sm cursor-pointer"
            id="liturgical-modal-backdrop"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative bg-[#FAFAFA] border border-brand-dark/20 w-full h-full sm:h-[85vh] sm:max-w-4xl shadow-2xl flex flex-col overflow-hidden sm:rounded-md z-10"
            id="liturgical-guide-modal-container"
          >
            {/* Elegant Ethiopian Flag Color Top Border */}
            <div className="h-[4px] flex overflow-hidden w-full shrink-0">
              <div className="flex-1 bg-[#006732]" />
              <div className="flex-1 bg-[#D1A110]" />
              <div className="flex-1 bg-[#EF3340]" />
            </div>

            {/* Header */}
            <div className="px-6 py-4 border-b border-brand-dark/10 bg-white flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#006732]/10 text-[#006732] rounded-sm">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-serif font-black text-brand-dark flex items-center gap-1.5 leading-none">
                    EOTC Liturgical & Historical Guide
                  </h2>
                  <span className="text-[10px] font-sans font-extrabold text-brand-dark/50 uppercase tracking-widest mt-1 block">
                    የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን የአጽዋማትና በዓላት መመሪያ
                  </span>
                </div>
              </div>
              <button
                id="close-liturgical-guide-modal"
                onClick={onClose}
                className="p-1.5 hover:bg-brand-bg text-brand-dark/50 hover:text-brand-dark border border-transparent hover:border-brand-dark/15 rounded-sm transition-all cursor-pointer"
                title="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Toolbar: Search, Language Switch, and Tab Filters */}
            <div className="px-6 py-4 bg-white border-b border-brand-dark/5 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
              {/* Left: Tabs */}
              <div className="flex items-center bg-brand-bg/60 p-1 border border-brand-dark/10 rounded-sm overflow-x-auto max-w-full shrink-0 custom-scrollbar" id="modal-tab-container">
                <button
                  id="modal-tab-all"
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 text-[10px] font-sans font-black uppercase tracking-wider rounded-sm transition-all cursor-pointer inline-flex items-center gap-1 shrink-0
                    ${activeTab === 'all'
                      ? 'bg-[#006732] text-white shadow-sm'
                      : 'text-brand-dark/50 hover:text-brand-dark'}
                  `}
                >
                  <Globe className="w-3 h-3" /> All (ሁሉንም)
                </button>
                <button
                  id="modal-tab-fasting"
                  onClick={() => setActiveTab('fasting')}
                  className={`px-3 py-1.5 text-[10px] font-sans font-black uppercase tracking-wider rounded-sm transition-all cursor-pointer inline-flex items-center gap-1 shrink-0
                    ${activeTab === 'fasting'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-brand-dark/50 hover:text-brand-dark'}
                  `}
                >
                  <Clock className="w-3 h-3" /> Fasts (አጽዋማት)
                </button>
                <button
                  id="modal-tab-feast"
                  onClick={() => setActiveTab('feast')}
                  className={`px-3 py-1.5 text-[10px] font-sans font-black uppercase tracking-wider rounded-sm transition-all cursor-pointer inline-flex items-center gap-1 shrink-0
                    ${activeTab === 'feast'
                      ? 'bg-[#D1A110] text-brand-dark shadow-sm'
                      : 'text-brand-dark/50 hover:text-brand-dark'}
                  `}
                >
                  <Sparkles className="w-3 h-3" /> Feasts (በዓላት)
                </button>
                <button
                  id="modal-tab-literature"
                  onClick={() => setActiveTab('literature')}
                  className={`px-3 py-1.5 text-[10px] font-sans font-black uppercase tracking-wider rounded-sm transition-all cursor-pointer inline-flex items-center gap-1 shrink-0
                    ${activeTab === 'literature'
                      ? 'bg-amber-800 text-white shadow-sm'
                      : 'text-brand-dark/50 hover:text-brand-dark'}
                  `}
                >
                  <BookOpen className="w-3 h-3" /> Liturgy (ሥርዓተ በዓላት)
                </button>
              </div>

              {/* Right: Search & Language */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Search */}
                <div className="relative flex-1 min-w-[180px]">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-dark/40" />
                  <input
                    id="modal-search-input"
                    type="text"
                    placeholder="Search / ፈልግ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-brand-bg border border-brand-dark/15 text-brand-dark text-xs font-sans pl-8 pr-3 py-1.5 rounded-sm focus:outline-none focus:border-[#006732]/30"
                  />
                </div>

                {/* Language Select */}
                <div className="flex bg-brand-bg/60 p-1 border border-brand-dark/10 rounded-sm" id="modal-lang-selector">
                  <button
                    id="modal-lang-am"
                    onClick={() => setLang('am')}
                    className={`px-2.5 py-1 text-[9px] font-sans font-black uppercase tracking-wider rounded-sm transition-all cursor-pointer
                      ${lang === 'am' ? 'bg-[#006732] text-white' : 'text-brand-dark/50 hover:text-brand-dark'}
                    `}
                  >
                    አማርኛ
                  </button>
                  <button
                    id="modal-lang-bilingual"
                    onClick={() => setLang('bilingual')}
                    className={`px-2.5 py-1 text-[9px] font-sans font-black uppercase tracking-wider rounded-sm transition-all cursor-pointer
                      ${lang === 'bilingual' ? 'bg-[#006732] text-white' : 'text-brand-dark/50 hover:text-brand-dark'}
                    `}
                  >
                    Bilingual
                  </button>
                  <button
                    id="modal-lang-en"
                    onClick={() => setLang('en')}
                    className={`px-2.5 py-1 text-[9px] font-sans font-black uppercase tracking-wider rounded-sm transition-all cursor-pointer
                      ${lang === 'en' ? 'bg-[#006732] text-white' : 'text-brand-dark/50 hover:text-brand-dark'}
                    `}
                  >
                    English
                  </button>
                </div>
              </div>
            </div>

            {/* List Container */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6" id="modal-guide-items-list-container">
              {activeTab === 'literature' ? (
                <div className="flex flex-col md:flex-row gap-5 h-full min-h-[350px] text-brand-dark" id="literature-tab-layout">
                  {/* Sidebar/Chapters menu */}
                  <div className="flex md:flex-col gap-1.5 md:w-56 shrink-0 overflow-x-auto md:overflow-x-visible pb-2.5 md:pb-0 border-b md:border-b-0 md:border-r border-brand-dark/15 pr-0 md:pr-4 custom-scrollbar" id="literature-chapters-menu">
                    {[
                      { id: 1, titleAm: 'የቀን አቆጣጠርና ዘመናት', titleEn: '1. Liturgical Year & Calendar' },
                      { id: 2, titleAm: 'የቤተ ክርስቲያን በዓላት', titleEn: '2. Festivals & Feasts' },
                      { id: 3, titleAm: 'የአጽዋማት ሥርዓት', titleEn: '3. Fasting & Abstinence' },
                      { id: 4, titleAm: 'በዓለ ልደት (ገና)', titleEn: '4. Advent & Christmas' },
                      { id: 5, titleAm: 'ዐቢይ ጾምና ሕማማት', titleEn: '5. Lent & Holy Week' },
                    ].map((chap) => (
                      <button
                        key={chap.id}
                        onClick={() => setActiveChapter(chap.id)}
                        className={`text-left px-3 py-2 rounded-sm font-sans text-xs flex flex-col gap-0.5 transition-all shrink-0 md:shrink cursor-pointer border
                          ${activeChapter === chap.id
                            ? 'bg-[#006732] text-white border-[#006732] shadow-sm font-black'
                            : 'bg-white hover:bg-brand-bg text-brand-dark/70 hover:text-brand-dark border-brand-dark/10'}`}
                        id={`chapter-tab-btn-${chap.id}`}
                      >
                        <span className="font-serif font-black tracking-wide leading-tight">{chap.titleAm}</span>
                        <span className="text-[9px] font-extrabold opacity-75 leading-none">{chap.titleEn}</span>
                      </button>
                    ))}
                  </div>

                  {/* Document Reader Area */}
                  <div className="flex-1 bg-white border border-brand-dark/10 p-4 sm:p-5 shadow-sm rounded-sm overflow-y-auto max-h-[460px] custom-scrollbar" id="literature-document-reader">
                    {activeChapter === 1 && (
                      <div className="flex flex-col gap-4 font-sans text-xs sm:text-[13px] leading-relaxed text-brand-dark/90" id="literature-chapter-1">
                        <div className="border-b border-[#006732]/25 pb-2.5 mb-2">
                          <h3 className="font-serif font-black text-sm sm:text-base text-[#006732]">ምዕራፍ ፩፡ የቀን አቆጣጠርና ዘመናት</h3>
                          <span className="text-[10px] font-bold text-brand-dark/50 uppercase tracking-widest block mt-0.5">Chapter 1: The Liturgical Year & Calendar</span>
                        </div>
                        
                        <p className="font-serif font-black text-brand-dark leading-snug text-xs sm:text-[13px]">
                          ፩. የቀን አቆጣጠር (The Calendar)
                        </p>
                        <p className="text-justify">
                          The calendar of the Ethiopian Church came from Egypt and as to methods and dates agrees with the calendar of the Coptic Church. But the two calendars differ with regard to the saints’ days and the time of observing them. The year of the Ethiopian calendar contains 365 days to which is added every fourth year an extra day. Each year in this four-year period is dedicated to one of the four Evangelists who come in the following order: Mathew, Mark, Luke and John. The year of Luke is the Ethiopian Leap year and is the year which precedes the western leap year.
                        </p>
                        <p className="text-justify">
                          Each year is divided into 12 months of 30 days. The extra 5 days are placed at the end of the year and known as <strong>Pagumen</strong>. In the leap year the extra day is added to these five days making the Pagumen of this year a period of 6 days.
                        </p>

                        <div className="bg-brand-bg/50 border border-brand-dark/15 p-4 rounded-sm flex flex-col gap-3 my-1">
                          <span className="text-[11px] font-sans font-black text-[#006732] uppercase tracking-wider block border-b border-[#006732]/15 pb-1">
                            የአራቱ ወንጌላውያን ዑደትና ስሌት / The 4-Year Evangelist Cycle
                          </span>
                          <p className="text-justify text-xs">
                            የኢትዮጵያ ዘመን አቆጣጠር አራት ዓመታት ዑደት ያላቸው ሲሆን፣ ዓመታቱ በአራቱ ወንጌላውያን (በማቴዎስ፣ በማርቆስ፣ በሉቃስ እና በዮሐንስ) ይሰየማሉ። የየትኛውንም ዓመት ወንጌላዊ ለማወቅ የአመተ ምህረቱን ቁጥር ለ 4 በማካፈል ቀሪውን ማየት ይቻላል፡
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-xs font-semibold pl-2">
                            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-600"></span>ቀሪው 1 ከሆነ = ዘመነ ማቴዎስ (Matthew)</div>
                            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-600"></span>ቀሪው 2 ከሆነ = ዘመነ ማርቆስ (Mark)</div>
                            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-600"></span>ቀሪው 3 ከሆነ = ዘመነ ሉቃስ (Luke - Leap Year)</div>
                            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-600"></span>ቀሪው 0 ከሆነ = ዘመነ ዮሐንስ (John)</div>
                          </div>
                          
                          <div className="border-t border-brand-dark/10 pt-2.5 mt-1 flex flex-col gap-1 text-xs">
                            <span className="font-bold text-brand-dark">የ2018 ዓ.ም. ስሌት (Example Calculation for 2018 E.C.):</span>
                            <span className="font-mono bg-white border border-brand-dark/10 px-2.5 py-1 rounded-sm w-fit inline-block">
                              2018 ÷ 4 = 504 ቀሪ (Remainder) 2 ➔ ዘመነ ማርቆስ (Year of Mark)
                            </span>
                            <p className="text-justify mt-1 text-brand-dark/80">
                              <strong>የዘመነ ማርቆስ ትርጉም (Meaning of Year of Mark):</strong> በኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን የባሕረ ሐሳብ ትምህርት መሰረት፣ እያንዳንዱ ወንጌላዊ የየራሱ የሆነ የዓመቱ መገለጫ (ባሕሪ) አለው። ዘመነ ማርቆስ ጾም እና ጸሎት የሚበዛበት፣ አብዛኛውን ጊዜ ደግሞ የበልግ ወቅት ዝናብ ጥሩ እንደሚሆን የሚታመንበት የልምላሜና የጸጋ ዘመን ተደርጎ ይወሰዳል።
                            </p>
                            <p className="text-justify text-xs text-brand-dark/70 italic">
                              * In the EOTC computus, each Evangelist cycle influences the year's characteristic. The Year of Mark is dedicated to deeper prayer, fasting, and traditionally forecasts a fertile spring (Belg) season with nourishing rains, making it a year of growth and grace.
                            </p>
                          </div>
                        </div>

                        <div className="bg-brand-bg/40 border border-brand-dark/10 p-3.5 rounded-sm flex flex-col gap-2 my-1">
                          <span className="text-[10px] font-bold text-[#006732] uppercase tracking-wider block">የአሥራ ሁለቱ ወራት ስሞች / Names of the 12 Months:</span>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-medium">
                            <div>1. Meskerem (Sept-Oct)</div>
                            <div>7. Megabit (Mar-Apr)</div>
                            <div>2. Teqemt (Oct-Nov)</div>
                            <div>8. Miyazia (Apr-May)</div>
                            <div>3. Hedar (Nov-Dec)</div>
                            <div>9. Ginbot (May-June)</div>
                            <div>4. Tahsas (Dec-Jan)</div>
                            <div>10. Sene (June-July)</div>
                            <div>5. Ter (Jan-Feb)</div>
                            <div>11. Hamle (July-Aug)</div>
                            <div>6. Yekatit (Feb-Mar)</div>
                            <div>12. Nehase (Aug-Sept)</div>
                          </div>
                          <span className="text-[9px] font-sans text-brand-dark/50 italic mt-1 block border-t border-brand-dark/5 pt-1">
                            * Note: Pagumen is the 13th month of 5 days (6 in leap years) observed in early September.
                          </span>
                        </div>

                        <p className="font-serif font-black text-brand-dark leading-snug text-xs sm:text-[13px] mt-2">
                          ፪. የሳምንቱ ቀናት (Days of the Week)
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs bg-brand-bg/30 p-3 rounded-sm border border-brand-dark/8">
                          <div><strong>Sunday:</strong> Ehud, Senbete Krestian</div>
                          <div><strong>Thursday:</strong> Hamus</div>
                          <div><strong>Monday:</strong> Sagno</div>
                          <div><strong>Friday:</strong> Sadus, Arb</div>
                          <div><strong>Tuesday:</strong> Maksagno</div>
                          <div><strong>Saturday:</strong> Qadamit Sanbat</div>
                          <div className="col-span-2"><strong>Wednesday:</strong> Rabue</div>
                        </div>

                        <p className="font-serif font-black text-brand-dark leading-snug text-xs sm:text-[13px] mt-2">
                          ፫. የዘመን አቆጣጠር (The Chronology & Era)
                        </p>
                        <p className="text-justify">
                          The chronology of the Ethiopian Church follows the Era of Incarnation, that is, it dates from our Lord’s birth; there is a difference of 7 or 8 years between the western and Ethiopian systems. Because the Ethiopian Church holds that our Lord was born 5500 years after the creation of the world, this gives the 7 or 8 years difference between the Gregorian and Ethiopian Chronologies.
                        </p>
                        <div className="bg-brand-bg/40 border border-brand-dark/10 p-3.5 rounded-sm flex flex-col gap-2 my-2 text-xs">
                          <span className="font-bold text-[#006732] uppercase tracking-wider block">የዓመተ ዓለም (ዓመተ ኩነኔ) አቆጣጠር ስሌት / Era of the World:</span>
                          <p className="text-justify">
                            በቤተክርስቲያኑ አቆጣጠር ዓመተ ዓለምን (ከፍጥረት ጀምሮ ያለውን ዘመን) ለማወቅ የዘመነ ምህረቱን ቁጥር ከፍጥረት ጀምሮ ካለው የ 5500 ዓመታት ልዩነት ጋር ይደመራል።
                          </p>
                          <span className="font-bold text-brand-dark font-sans text-[11px] block mt-1">ቀመር (Formula):</span>
                          <span className="font-mono bg-white border border-brand-dark/10 px-2.5 py-1 rounded-sm w-fit inline-block font-bold">
                            ዓመተ ዓለም = ዓመተ ምህረት + 5500
                          </span>
                          <span className="font-bold text-brand-dark font-sans text-[11px] block mt-1">የ2018 ዓ.ም. ምሳሌ (2018 E.C. Example):</span>
                          <span className="font-mono bg-white border border-brand-dark/10 px-2.5 py-1 rounded-sm w-fit inline-block">
                            2018 + 5500 = 7518 ዓመተ ዓለም
                          </span>
                        </div>
                        <p className="text-justify">
                          The church also uses other systems of chronology. There is the Era of the World which dates from 5493 B.C, which also differs from the western chronology by 7 or 8 years. Then there is a system of chronology called “the years of Mercy or Grace (አውደ ዓመት),” a system which follows the great lunar cycle of 532 years.
                        </p>

                        <p className="font-serif font-black text-brand-dark leading-snug text-xs sm:text-[13px] mt-2">
                          ፬. ተንቀሳቃሽ በዓላት (The Movable Feasts)
                        </p>
                        <p className="text-justify">
                          The movable feasts are those of Easter and the days which depend upon it. The reckoning of Easter is based upon the system of Ammonius (Bahra Hasab). The dates of Easter and the feasts which depend upon it are determined by the Fast of Nineveh which precedes the Easter Lent. Once the date of the Fast of Nineveh has been found according to the given principles, the date of Easter and the dates of the movable feasts can easily be calculated.
                        </p>
                        <p className="text-justify">
                          The Easter Lent always begins on a Monday and cannot come before the 1st of Yekatit nor after the 5th of Megabit. The festival of the Mount of Olives (Debre Zeit) always begins upon Sunday and cannot come before the 28th of Yekatit nor after the 2nd of Miyazia.
                        </p>
                        <p className="text-justify">
                          Palm Sunday (Hosanna) cannot come before the 19th of Megabit nor after the 23rd of Miyazia. Easter (Fasika) is on a Sunday and cannot come before the 26th of Megabit nor after 30th of Miyazia. The Congress of Priests (Rekebe Kahnat) always begins on Wednesday and cannot come before the 20th of Miyazia nor after the 24th of Ginbot. Ascension (Erget) always begins on Thursday and cannot come before the 5th of Ginbot nor after the 9th of Sene. The Feast of Pentecost (Paracletus) always begins on Sunday and cannot come before the 15th of Ginbot nor after the 19th of Sene.
                        </p>
                      </div>
                    )}

                    {activeChapter === 2 && (
                      <div className="flex flex-col gap-4 font-sans text-xs sm:text-[13px] leading-relaxed text-brand-dark/90" id="literature-chapter-2">
                        <div className="border-b border-[#006732]/25 pb-2.5 mb-2">
                          <h3 className="font-serif font-black text-sm sm:text-base text-[#006732]">ምዕራፍ ፪፡ የቤተ ክርስቲያን በዓላት</h3>
                          <span className="text-[10px] font-bold text-brand-dark/50 uppercase tracking-widest block mt-0.5">Chapter 2: Festivals & Feasts</span>
                        </div>
                        
                        <p className="text-justify">
                          Saints’ days and other festivals have not been imposed by any law of God; they were established by the Church herself. Some go back to apostolic times and others are of later origin. There is a prodigious number of feasts in the Ethiopian Church. The principal feasts of the church are nine major and nine minor feasts of the Lord, thirty-three feasts of our Lady Mary, the feasts of the Apostles, Sundays, Saturdays, the feasts of the Angels, the righteous (saints), and the martyrs.
                        </p>

                        <p className="font-serif font-black text-[#006732] leading-snug text-xs sm:text-[13px] mt-2 border-b border-brand-dark/5 pb-1">
                          ፩. ዘጠኙ የጌታ ታላላቅ በዓላት (The 9 Major Feasts of Our Lord)
                        </p>
                        <ol className="list-decimal pl-5 flex flex-col gap-1 text-xs">
                          <li><strong>Tnsae (Easter):</strong> Resurrection of Christ</li>
                          <li><strong>Erget (Ascension):</strong> Christ ascending into Heaven</li>
                          <li><strong>Paracletus (Pentecost):</strong> Descent of the Holy Spirit</li>
                          <li><strong>Liddet / Gena (Christmas):</strong> Nativity of our Saviour</li>
                          <li><strong>Epiphany / Timkat:</strong> Baptism of Christ in Jordan River</li>
                          <li><strong>Hosanna (Palm Sunday):</strong> Triumphal Entry into Jerusalem</li>
                          <li><strong>Good Friday (Siklet):</strong> Crucifixion and Death of Christ</li>
                          <li><strong>Debre Tabor (Transfiguration):</strong> Revelation of divine glory on Mt. Tabor</li>
                          <li><strong>Tsnset (Conception):</strong> The annunciation of our Lord’s conception</li>
                        </ol>

                        <p className="font-serif font-black text-[#006732] leading-snug text-xs sm:text-[13px] mt-2 border-b border-brand-dark/5 pb-1">
                          ፪. ዘጠኙ የጌታ ታናናሽ በዓላት (The 9 Minor Feasts of Our Lord)
                        </p>
                        <ol className="list-decimal pl-5 flex flex-col gap-2 text-xs text-justify">
                          <li><strong>Sibket:</strong> Commemorates the preaching of the prophets that the Messiah will come to redeem His people.</li>
                          <li><strong>Birhan:</strong> Commemorates the fact of our Lord having come into the world for its spiritual enlightenment.</li>
                          <li><strong>Nolwae:</strong> The feast of our Lord as the "Good Shepherd".</li>
                          <li><strong>Gena:</strong> The feast to commemorate the reality that our Lord was actually born, not a mythical phenomenon.</li>
                          <li><strong>Gizret (Circumcision):</strong> Circumcision of Jesus Christ on the eighth day.</li>
                          <li><strong>Kana ze Galilee:</strong> The feast of the wedding of Cana of Galilee, where the Lord turned water into wine.</li>
                          <li><strong>Debra Zeit (Mount of Olives):</strong> Re-living the teachings of the Second Advent on the Mount of Olives.</li>
                          <li><strong>Megabit Meskel:</strong> Commemoration of the Holy Cross on Megabit 10.</li>
                          <li><strong>Ledete Simon:</strong> Commemorates the event when Mary Magdalene washed the feet of the Lord with her tears and anointed them.</li>
                        </ol>

                        <p className="font-serif font-black text-[#006732] leading-snug text-xs sm:text-[13px] mt-2 border-b border-brand-dark/5 pb-1">
                          ፫. ሰላሳ ሦስቱ የእመቤታችን በዓላት (The 33 Feasts of the Blessed Virgin Mary)
                        </p>
                        <p className="text-justify">
                          The Ethiopian Church highly honours the Virgin Mary with 33 specific feasts throughout the year:
                        </p>
                        <ul className="list-disc pl-5 flex flex-col gap-1 text-xs">
                          <li>The day on which she was conceived (Nehase 7) and her Nativity (Ginbot 1).</li>
                          <li>Her Presentation to the Temple (Tahsas 3).</li>
                          <li>Annunciation on which she conceived Christ (Megabit 29).</li>
                          <li>The Flight to Egypt (commemorating the Holy Family's exile).</li>
                          <li>The day she was thirsty, and her Son commanded the rock and water gushed out to quench her thirst.</li>
                          <li>The Day of Promise (Kidane Mehret - Yekatit 16) on which her Son assured her He would have mercy on sinners for her sake.</li>
                          <li>Asterio Mariam (The sleeping of Mary - Ter 21).</li>
                          <li>Filseta (Assumption) celebrated for 16 separate days in August, each counted as a feast.</li>
                          <li>Five miraculous appearances to believers.</li>
                          <li>The 12 monthly commemorations on the 21st day of each Ethiopian month dedicated to her.</li>
                          <li>The miracle of the bleeding icon of Mary when hit by an infidel.</li>
                          <li>The Purification of the Blessed Virgin Mary.</li>
                        </ul>

                        <p className="font-serif font-black text-brand-dark leading-snug text-xs sm:text-[13px] mt-2">
                          ፬. በየወሩ የሚታሰቡ ዋና ዋና በዓላት (Principal Monthly Feasts)
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs bg-brand-bg/30 p-3 rounded-sm border border-brand-dark/8">
                          <div><strong>7th of each month:</strong> Holy Trinity (ሥላሴ)</div>
                          <div><strong>12th of each month:</strong> St. Michael the Archangel</div>
                          <div><strong>16th of each month:</strong> Kidane Mehret (Covenant of Mercy)</div>
                          <div><strong>21st of each month:</strong> St. Mary (ሕንጸተ ማርያም / አስተርዮ)</div>
                          <div><strong>27th of each month:</strong> Death of Our Lord (መድኃኔዓለም)</div>
                          <div><strong>29th of each month:</strong> Birth of Christ (በዓለ ወልድ)</div>
                        </div>
                      </div>
                    )}

                    {activeChapter === 3 && (
                      <div className="flex flex-col gap-4 font-sans text-xs sm:text-[13px] leading-relaxed text-brand-dark/90" id="literature-chapter-3">
                        <div className="border-b border-[#006732]/25 pb-2.5 mb-2">
                          <h3 className="font-serif font-black text-sm sm:text-base text-[#006732]">ምዕራፍ ፫፡ የአጽዋማት ሥርዓት</h3>
                          <span className="text-[10px] font-bold text-brand-dark/50 uppercase tracking-widest block mt-0.5">Chapter 3: Fasting & Abstinence</span>
                        </div>
                        
                        <p className="text-justify">
                          The Church, in her earliest days, recognized the necessity for her children to "chastise the body and bring it under subjection", as St. Paul advises. The body is ever striving for mastery over the spirit; this is the spiritual reason for mortification. Sincere self-denial in lawful things enables us to turn with greater earnestness and purity to spiritual things. It is on these grounds that the Ethiopian Church has strictly adhered to the injunctions of the <em>Didascalia</em> and enjoys the longest and most austere fasts in the world.
                        </p>
                        <p className="text-justify">
                          <strong>Fasting</strong> implies absolute abstention from food and drink for a specified duration, followed by a vegan diet. Special days and seasons are appointed for fasting. Every Wednesday and Friday are days of fasting because on Wednesday the Jews held a council in which they rejected and condemned our Lord, and on Friday they crucified Him.
                        </p>

                        <p className="font-serif font-black text-[#006732] leading-snug text-xs sm:text-[13px] mt-2 border-b border-brand-dark/5 pb-1">
                          በፍትሐ ነገሥት የታዘዙት ሰባቱ አጽዋማት (The 7 Ordained Fasts of Fetha Negest)
                        </p>
                        <ol className="list-decimal pl-5 flex flex-col gap-2.5 text-xs text-justify">
                          <li><strong>Abiye Tsome / Hudadi (The Great Lent):</strong> 56 days of deep penitence and strict fasting before Easter.</li>
                          <li><strong>Tsome Hawariat (Fast of the Apostles):</strong> Observed after Pentecost, varying from 10 to 40 days, commemorating the Apostles' fast before their mission.</li>
                          <li><strong>Tsome Filseta (Fast of Assumption):</strong> 16 days in August (Nehase 1-16) commemorating the bodily assumption of St. Mary.</li>
                          <li><strong>The Gahad of Christmas (Liddet):</strong> Fast on Christmas Eve.</li>
                          <li><strong>Tsome Nebiyat (Fast of the Prophets / Advent):</strong> 40 days of fasting preceding Christmas, starting on Hedar 15 and ending on Christmas Eve.</li>
                          <li><strong>Tsome Nineveh (Fast of Nineveh):</strong> 3 days of rigorous fasting commencing on the Monday of the third week before Lent, remembering Jonah's preaching.</li>
                          <li><strong>The Gahad of Epiphany (Timkat):</strong> Fast on Epiphany Eve.</li>
                        </ol>

                        <p className="font-serif font-black text-brand-dark leading-snug text-xs sm:text-[13px] mt-2">
                          የጾም ደንቦችና መመሪያዎች (Fasting Guidelines & Rules)
                        </p>
                        <ul className="list-disc pl-5 flex flex-col gap-1.5 text-xs text-justify">
                          <li><strong>Meal Times:</strong> Fasting generally implies eating only one meal a day, taken in the afternoon (either after 2:45 p.m. or in the evening).</li>
                          <li><strong>Dietary Restrictions:</strong> Complete abstention from meat, animal fats, butter, milk, cheese, eggs, and dairy products. Only grains, oilseeds, legumes, vegetables, and fruit are consumed.</li>
                          <li><strong>Saturdays and Sundays:</strong> On Saturdays and Sundays, believers are exempt from fasting until 3:00 PM; they may take breakfast early in the morning (around 9:00 a.m. or 9:30 a.m.), but the diet remains strictly vegan (no meat or dairy).</li>
                          <li><strong>Exemptions & Dispensations:</strong> Children under 13, pregnant women, nursing mothers, and the severely sick are granted dispensations according to priestly counsel.</li>
                          <li><strong>Exemption Seasons:</strong> There is no fasting during the fifty days of Pentecost (from Easter Sunday to Pentecost Sunday). If Christmas or Epiphany falls on Wednesday or Friday, fasting is fully suspended on those days.</li>
                        </ul>
                      </div>
                    )}

                    {activeChapter === 4 && (
                      <div className="flex flex-col gap-4 font-sans text-xs sm:text-[13px] leading-relaxed text-brand-dark/90" id="literature-chapter-4">
                        <div className="border-b border-[#006732]/25 pb-2.5 mb-2">
                          <h3 className="font-serif font-black text-sm sm:text-base text-[#006732]">ምዕራፍ ፬፡ በዓለ ልደት (ገና)</h3>
                          <span className="text-[10px] font-bold text-brand-dark/50 uppercase tracking-widest block mt-0.5">Chapter 4: Advent & Christmas</span>
                        </div>
                        
                        <p className="text-justify">
                          Year after year, the Christmas season brings to the minds of all Christians the beautiful story of the Child in the manger, the shepherds on the Judean hills, the celestial songs of the angels singing "Glory to God in the highest," and the message of peace telling that the long-expected Messiah had come.
                        </p>

                        <p className="font-serif font-black text-brand-dark leading-snug text-xs sm:text-[13px] mt-2">
                          ፩. ጾመ ነቢያት / ስብከት (Advent)
                        </p>
                        <p className="text-justify">
                          The aim of the Church is to cause her children to reflect. During the liturgical year, she sets apart two major seasons in which she imbues the faithful with a spirit of penitential fervor. One of these seasons, which is called <strong>Advent</strong>, or <em>Sibket</em> (ስብከት - arrival/preaching), embraces the preparation for the Nativity. It is a time for devout and penitential preparation of the soul for the proper and worthy celebration of the great feast of Christmas.
                        </p>
                        <p className="text-justify">
                          The Christmas fast of 40 days begins on Hedar 15 (November 24) and ends on Christmas Eve with the Feast of Gena on the 28th of Tahsas (January 6).
                        </p>

                        <p className="font-serif font-black text-brand-dark leading-snug text-xs sm:text-[13px] mt-2">
                          ፪. በዓለ ልደት / ገና (Christmas - Liddet)
                        </p>
                        <p className="text-justify">
                          <strong>Liddet</strong> (ልደት) or <strong>Gena</strong> (ገና) is the Ethiopian name for Christmas, which is marked by exquisite, deep ceremonies. It is celebrated on January 7th (Tahsas 29 E.C.), preceded by the 40 days fast of the Prophets. The difference of date is due to a calendar discrepancy, since the Ethiopian calendar is based on the Year of Grace, placing its timeline 7 or 8 years behind the Gregorian Anno Domini system. The Ethiopian Christmas coincides with the date observed in the broader Eastern Orthodox dispensation.
                        </p>
                        <p className="text-justify">
                          <strong>Qiddus Bale Wold</strong> (በዓለ ወልድ) is another traditional name for Christmas in addition to Liddet or Gena. <em>Gena</em> is also the name of a unique, vibrant Christmas sport played by boys and grown-up men (similar to traditional field hockey) with a curved wooden stick and a leather ball, played traditionally on Christmas day.
                        </p>
                      </div>
                    )}

                    {activeChapter === 5 && (
                      <div className="flex flex-col gap-4 font-sans text-xs sm:text-[13px] leading-relaxed text-brand-dark/90" id="literature-chapter-5">
                        <div className="border-b border-[#006732]/25 pb-2.5 mb-2">
                          <h3 className="font-serif font-black text-sm sm:text-base text-[#006732]">ምዕራፍ ፭፡ ዐቢይ ጾምና ሰሙነ ሕማማት</h3>
                          <span className="text-[10px] font-bold text-brand-dark/50 uppercase tracking-widest block mt-0.5">Chapter 5: Lent & Holy Week</span>
                        </div>
                        
                        <p className="text-justify">
                          The Church has always taught the spiritual necessity of penance and mortification for justification. She has instituted Lent as a solemn remembrance of the forty days fast of our Blessed Lord in the desert and as an indispensable means of sanctification for her children.
                        </p>
                        <p className="text-justify">
                          To the Ethiopian Orthodox Church, Lent (<strong>Hudadi</strong> or <strong>Abiye Tsome</strong>) means a period of rigorous fasting when the faithful undergo a deep schedule of continuous prayers and penitence. This fast is observed with greater rigor than any other and is a test of one’s Christianity. It consists of 56 days. All kinds of meat, animal fat, fish, and dairy products are strictly forbidden. Only one vegan meal is allowed, taken after 3:00 p.m. or in the evening.
                        </p>
                        <p className="text-justify">
                          <strong>Qibela</strong> is the Sunday before the opening of Lent, during which the faithful physically prepare themselves before entering the rigorous fast.
                        </p>

                        <p className="font-serif font-black text-brand-dark leading-snug text-xs sm:text-[13px] mt-2">
                          ፩. ሰሙነ ሕማማት (Holy Week - Himamat)
                        </p>
                        <p className="text-justify">
                          The last week of Lent is <strong>Himamat</strong> (ሕማማት - Week of Pains), where all the faithful re-live and receive graces from the fundamental mysteries of redemption.
                        </p>
                        <ul className="list-disc pl-5 flex flex-col gap-2 text-xs text-justify">
                          <li><strong>Palm Sunday (Hosanna):</strong> Celebrated with palm processions, olive branch headbands, and special services remembering Christ's entry into Jerusalem.</li>
                          <li><strong>Qanona (Strict Abstinence):</strong> For the devout, from Thursday afternoon until Easter morning, no food or water enters the mouth. Priests remain in the churches singing and praying incessantly. No absolution is given until the Resurrection.</li>
                          <li><strong>Maundy Thursday (Tselote Hamus):</strong> A special day on which unleavened bread is eaten. A solemn Mass is celebrated, and the <strong>washing of the feet</strong> ceremony is conducted by the priests, mimicking what our Lord did to His Apostles at the Last Supper.</li>
                          <li><strong>Good Friday (Siklet):</strong> Thousands of believers attend the solemn Good Friday service, characterized by a profound sense of sorrow and desolation. All symbols of the Passion are exhibited. Believers prostrate themselves repeatedly from early morning until 3:00 p.m. (the hour of Christ's death) and confess their sins.</li>
                          <li><strong>Holy Saturday (Qidame Shur):</strong> Known as the day of "good news". Believers spend the day and night in expectation, holding green reeds (Qetema) symbolizing life and hope.</li>
                          <li><strong>Easter Sunday (Fasika):</strong> The Feast of Feasts! Celebrated with glorious solemnity at midnight. The church is filled with incense and myriad lights. Clergy wear their finest vestments, drums beat, hands clap, and believers embrace saying: <em>"Resurrection has come! Christ is Risen!"</em></li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center" id="modal-empty-state">
                  <Filter className="w-8 h-8 text-brand-dark/20 mb-3" />
                  <p className="text-xs font-sans font-bold text-brand-dark/50 uppercase tracking-widest">
                    No results match your search query
                  </p>
                  <p className="text-[11px] font-sans text-brand-dark/40 mt-1">
                    ያቀረቡት ቃል ምንም ውጤት አላስገኘም፤ እባክዎ እንደገና ይሞክሩ።
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="modal-cards-grid">
                  {filteredItems.map((item) => {
                    const isFasting = item.category === 'fasting';
                    const showAm = lang === 'am' || lang === 'bilingual';
                    const showEn = lang === 'en' || lang === 'bilingual';

                    return (
                      <div
                        key={item.id}
                        className="bg-white border border-brand-dark/12 hover:border-[#D1A110]/30 rounded-sm p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 relative group"
                        id={`modal-card-${item.id}`}
                      >
                        {/* Elegant Left Accent Stripe */}
                        <div
                          className={`absolute top-0 left-0 bottom-0 w-[4px] 
                            ${isFasting ? 'bg-amber-600' : 'bg-[#D1A110]'}`}
                        />

                        {/* Title & Metadata */}
                        <div className="flex flex-col gap-1.5 pl-2">
                          <div className="flex items-center justify-between gap-2">
                            <span 
                              className={`text-[8.5px] font-sans font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-sm border
                                ${isFasting 
                                  ? 'bg-amber-500/8 text-amber-800 border-amber-500/15' 
                                  : 'bg-[#D1A110]/8 text-amber-950 border-[#D1A110]/15'}`}
                            >
                              {isFasting ? 'Fast / ጾም' : 'Feast / በዓል'}
                            </span>
                            <div className="text-[9.5px] font-sans font-bold text-brand-dark/40 flex items-center gap-1">
                              <Landmark className="w-3 h-3 shrink-0" />
                              {isFasting ? (lang === 'am' ? item.durationAm : item.durationEn) : 'High Feast'}
                            </div>
                          </div>

                          {/* Dynamic Name */}
                          <div className="flex flex-col gap-1 mt-1">
                            {showAm && (
                              <h3 className="font-serif font-black text-sm text-brand-dark leading-tight">
                                {item.nameAm}
                              </h3>
                            )}
                            {showEn && (
                              <h4 className="font-serif font-medium text-xs text-brand-dark/85 leading-tight">
                                {item.nameEn}
                              </h4>
                            )}
                          </div>

                          {/* Dynamic Period Information */}
                          <div className="flex items-center gap-1.5 mt-2.5 text-[10px] font-sans font-bold text-brand-dark/50 uppercase tracking-wide">
                            <Calendar className="w-3.5 h-3.5 text-brand-dark/35 shrink-0" />
                            <span>
                              {lang === 'am' ? item.periodAm : item.periodEn}
                            </span>
                          </div>
                        </div>

                        {/* Theology Section */}
                        <div className="bg-brand-bg/50 border border-brand-dark/5 p-3.5 rounded-sm text-[11.5px] leading-relaxed text-brand-dark/80 pl-4">
                          <div className="font-serif font-bold text-brand-dark text-[10.5px] uppercase tracking-wider mb-1 flex items-center gap-1 opacity-75">
                            ✦ Theological Context / ትርጉምና ምስጢር
                          </div>
                          {showAm && (
                            <p className="font-sans text-brand-dark/85 mb-2 last:mb-0">
                              {item.theologyAm}
                            </p>
                          )}
                          {showEn && (
                            <p className="font-sans text-brand-dark/75 italic leading-tight">
                              {item.theologyEn}
                            </p>
                          )}
                        </div>

                        {/* Observance and Liturgical Practices */}
                        <div className="flex flex-col gap-2.5 pl-2 flex-1">
                          <div className="font-serif font-black text-brand-dark text-[10.5px] uppercase tracking-wider flex items-center gap-1 opacity-75">
                            ✥ Spiritual Observances / መንፈሳዊ ሥርዓቶች
                          </div>

                          {showAm && (
                            <div className="flex flex-col gap-1.5">
                              {lang === 'bilingual' && (
                                <span className="text-[8px] uppercase font-sans font-black text-brand-green/75 tracking-widest block">
                                  አማርኛ ሥርዓቶች
                                </span>
                              )}
                              <ul className="list-disc list-outside pl-4 space-y-1 text-brand-dark/80 text-[11px] font-sans">
                                {item.observanceAm.map((obs, idx) => (
                                  <li key={idx}>{obs}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {showEn && (
                            <div className="flex flex-col gap-1.5 mt-1">
                              {lang === 'bilingual' && (
                                <span className="text-[8px] uppercase font-sans font-black text-brand-blue/75 tracking-widest block">
                                  English Observances
                                </span>
                              )}
                              <ul className="list-disc list-outside pl-4 space-y-1 text-brand-dark/70 text-[10.5px] font-sans leading-tight">
                                {item.observanceEn.map((obs, idx) => (
                                  <li key={idx}>{obs}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Collapsible Miracle Narrative (e.g. Saint Gabriel) */}
                        {item.narrative && (
                          <div className="mt-2 border-t border-brand-dark/10 pt-4 flex flex-col gap-3">
                            <button
                              onClick={() => setExpandedNarrativeId(expandedNarrativeId === item.id ? null : item.id)}
                              className="w-full py-2 px-3.5 bg-[#006732]/10 hover:bg-[#006732]/15 text-[#006732] hover:text-[#005227] text-[10px] font-sans font-black uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 transition-all cursor-pointer border border-[#006732]/15"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              {expandedNarrativeId === item.id 
                                ? 'Hide Miracle Narrative / ታሪኩን ደብቅ' 
                                : 'Read Miracle Narrative / ሙሉ የገድል ታሪክ አንብብ'}
                            </button>
                            
                            {expandedNarrativeId === item.id && (
                              <div
                                className="bg-amber-50/40 border border-amber-900/10 p-4 rounded-sm flex flex-col gap-3 max-h-[350px] overflow-y-auto"
                              >
                                <div className="flex flex-col gap-0.5 border-b border-amber-900/10 pb-2">
                                  {showAm && (
                                    <h5 className="font-serif font-black text-xs text-[#006732] leading-tight">
                                      {item.narrative.titleAm}
                                    </h5>
                                  )}
                                  {showEn && (
                                    <span className="text-[9px] font-sans font-bold text-brand-dark/40 uppercase tracking-widest block">
                                      {item.narrative.titleEn}
                                    </span>
                                  )}
                                </div>

                                {showAm && (item.narrative.paragraphsAm || item.narrative.paragraphs) && (
                                  <div className="flex flex-col gap-2.5 text-[11px] font-sans text-brand-dark/85 leading-relaxed font-normal">
                                    {(item.narrative.paragraphsAm || item.narrative.paragraphs || []).map((p, pIdx) => (
                                      <p key={pIdx} className="text-justify whitespace-pre-wrap">
                                        {p}
                                      </p>
                                    ))}
                                  </div>
                                )}

                                {showEn && item.narrative.paragraphsEn && (
                                  <div className="flex flex-col gap-2.5 text-[10.5px] font-sans text-brand-dark/75 leading-normal font-normal italic border-t border-amber-900/5 pt-2 mt-2">
                                    {item.narrative.paragraphsEn.map((p, pIdx) => (
                                      <p key={pIdx} className="text-justify whitespace-pre-wrap">
                                        {p}
                                      </p>
                                    ))}
                                  </div>
                                )}

                                <div className="border-t border-amber-900/5 pt-2 mt-1 text-center">
                                  {showAm && (
                                    <span className="text-[10px] font-serif font-black text-[#D1A110] tracking-wider block">
                                      {item.narrative.blessingAm || 'የቅዱሱ በረከትና አማላጅነት አይለየን፣ አሜን።'}
                                    </span>
                                  )}
                                  {showEn && (
                                    <span className="text-[9px] font-sans font-bold text-[#006732] tracking-wider block mt-0.5">
                                      {item.narrative.blessingEn || 'May the blessing and intercession of the Saint be with us, Amen.'}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer with Metadata and Credits */}
            <div className="px-6 py-4 border-t border-brand-dark/10 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10px] font-sans font-bold text-brand-dark/50 uppercase tracking-wider shrink-0">
              <div className="flex items-center gap-1">
                <span>Liturgical Guide Applet</span>
                <span className="opacity-60">•</span>
                <span>Powered by @google/genai SDK</span>
              </div>
              <div className="text-[10px] font-sans font-extrabold text-[#006732]">
                Prepared by: Kedus habt Belachew (ቅዱስ ሃብት በላቸው)
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
