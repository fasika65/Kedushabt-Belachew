import React, { useState, useEffect } from 'react';
import { CalendarDay } from '../types';
import { getDailyDevotionalForDay, DailyDevotionalData } from '../utils/lectionaryData';
import { ETHIOPIAN_MONTHS, GREGORIAN_MONTHS } from '../utils/calendar';
import {
  BookOpen,
  Sparkles,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Flame,
  Heart,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Share2,
  Scroll,
  Quote,
  Feather,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DailyDevotionalProps {
  selectedDay: CalendarDay | null;
}

type DevotionalTab = 'gospel' | 'prayer' | 'gitsawe' | 'reflection';

export default function DailyDevotional({ selectedDay }: DailyDevotionalProps) {
  const [activeTab, setActiveTab] = useState<DevotionalTab>('gospel');
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiReflection, setAiReflection] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  // Compute lectionary data for the currently selected day
  const ethDay = selectedDay ? selectedDay.ethiopianDay : 1;
  const saintName = selectedDay?.monthlyCommemoration?.name || (selectedDay?.holidays?.[0]?.name);
  const devotional: DailyDevotionalData = getDailyDevotionalForDay(ethDay, saintName);

  // Stop speech if day changes
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setAiReflection(null);
  }, [selectedDay?.ethiopianDay, selectedDay?.ethiopianMonth, selectedDay?.ethiopianYear]);

  // Audio Speech Synthesis for reading aloud
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = `${devotional.amharicTitle}. ${devotional.gospel.book}. ${devotional.gospel.keyVerseAmharic}. ${devotional.dailyPrayer.amharicPrayer}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Copy formatted devotional text to clipboard
  const handleCopy = () => {
    const text = `✝ ${devotional.amharicTitle} (${devotional.liturgicalTitle})
━━━━━━━━━━━━━━━━━━━━
📖 የዕለቱ ወንጌል: ${devotional.gospel.book} ${devotional.gospel.chapterVerse}
«${devotional.gospel.keyVerseAmharic}»

📜 ምስባክ (መዝ ${devotional.misbak.psalm}:${devotional.misbak.verses})
${devotional.misbak.geezVerse1}
${devotional.misbak.geezVerse2}
${devotional.misbak.geezVerse3}

🕊️ የዕለቱ ጸሎት:
${devotional.dailyPrayer.amharicPrayer}

✨ የዕለቱ ተግባር: ${devotional.spiritualPractice.virtue} — ${devotional.spiritualPractice.action}
━━━━━━━━━━━━━━━━━━━━
የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን የዕለት ተዕለት መንፈሳዊ ንባብ`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Request AI Deep Spiritual Reflection via Server
  const handleGenerateAiReflection = async () => {
    if (!selectedDay) return;
    setIsAiLoading(true);
    try {
      const mInfo = ETHIOPIAN_MONTHS[selectedDay.ethiopianMonth - 1];
      const gMonthName = GREGORIAN_MONTHS[selectedDay.gregorianMonth];
      const ethDateStr = `${mInfo?.name || ''} ${selectedDay.ethiopianDay}, ${selectedDay.ethiopianYear} E.C.`;
      const gregDateStr = `${gMonthName} ${selectedDay.gregorianDay}, ${selectedDay.gregorianYear} G.C.`;

      const response = await fetch('/api/devotional/reflection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          saintOrFeast: devotional.saintOrFeast,
          ethiopianDateStr: ethDateStr,
          gregorianDateStr: gregDateStr,
          gospelBook: `${devotional.gospel.book} (${devotional.gospel.chapterVerse})`,
          gospelKeyVerse: devotional.gospel.keyVerseAmharic,
          misbakAmharic: devotional.misbak.amharicText,
          fastingPeriod: selectedDay.fasting ? `${selectedDay.fasting.name} (${selectedDay.fasting.amharicName})` : 'Regular liturgical day',
        }),
      });

      const data = await response.json();
      if (data.success && data.reflection) {
        setAiReflection(data.reflection);
        setActiveTab('reflection');
      } else {
        // Use rich built-in patristic teaching as fallback
        setAiReflection(devotional.synaxariumReflection.patristicTeaching);
        setActiveTab('reflection');
      }
    } catch (err) {
      console.error('Failed to fetch reflection:', err);
      setAiReflection(devotional.synaxariumReflection.patristicTeaching);
      setActiveTab('reflection');
    } finally {
      setIsAiLoading(false);
    }
  };

  if (!selectedDay) return null;

  const mName = ETHIOPIAN_MONTHS[selectedDay.ethiopianMonth - 1]?.amharicName;
  const mNameEng = ETHIOPIAN_MONTHS[selectedDay.ethiopianMonth - 1]?.name;
  const gMonth = GREGORIAN_MONTHS[selectedDay.gregorianMonth];

  return (
    <div
      className="bg-white border border-brand-dark/15 rounded-sm shadow-sm overflow-hidden transition-all"
      id="daily-devotional-container"
    >
      {/* Top Title Banner */}
      <div className="bg-gradient-to-r from-[#006732]/10 via-[#D1A110]/15 to-brand-bg px-4 py-3 border-b border-brand-dark/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-sm bg-[#006732] text-white flex items-center justify-center font-bold text-sm shadow-2xs shrink-0">
            ✝
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[9px] font-sans font-black uppercase tracking-wider bg-[#006732] text-white px-1.5 py-0.2 rounded-2xs">
                Tselot & Gitsawe • ዕለታዊ ጸሎትና ግጻዌ
              </span>
              <span className="text-[10px] text-brand-dark/50 font-bold hidden sm:inline">
                {mNameEng} {selectedDay.ethiopianDay} ({mName} {selectedDay.ethiopianDay})
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-serif font-black text-brand-dark truncate">
              {devotional.amharicTitle}
            </h3>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleToggleSpeech}
            className={`p-1.5 rounded-xs border transition-colors cursor-pointer text-brand-dark ${
              isSpeaking
                ? 'bg-[#EF3340] text-white border-[#EF3340]'
                : 'bg-white hover:bg-brand-bg border-brand-dark/15'
            }`}
            title={isSpeaking ? 'Stop Audio' : 'Listen / በድምፅ አድምጥ'}
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-xs bg-white hover:bg-brand-bg border border-brand-dark/15 text-brand-dark transition-colors cursor-pointer"
            title="Copy Daily Devotional / ቅዳ"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-[#006732]" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-xs bg-white hover:bg-brand-bg border border-brand-dark/15 text-brand-dark transition-colors cursor-pointer"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Quick Navigation Tabs */}
            <div className="flex border-b border-brand-dark/10 bg-brand-bg/40 text-[10.5px] font-sans font-bold overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('gospel')}
                className={`px-3.5 py-2 whitespace-nowrap flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'gospel'
                    ? 'border-[#006732] text-[#006732] bg-white'
                    : 'border-transparent text-brand-dark/60 hover:text-brand-dark'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-[#006732]" />
                <span>ወንጌልና ምስባክ (Gospel)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('prayer')}
                className={`px-3.5 py-2 whitespace-nowrap flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'prayer'
                    ? 'border-[#006732] text-[#006732] bg-white'
                    : 'border-transparent text-brand-dark/60 hover:text-brand-dark'
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-[#EF3340]" />
                <span>የዕለቱ ጸሎት (Daily Prayer)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('gitsawe')}
                className={`px-3.5 py-2 whitespace-nowrap flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'gitsawe'
                    ? 'border-[#006732] text-[#006732] bg-white'
                    : 'border-transparent text-brand-dark/60 hover:text-brand-dark'
                }`}
              >
                <Scroll className="w-3.5 h-3.5 text-[#D1A110]" />
                <span>ሙሉ ግጻዌ (All Readings)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('reflection')}
                className={`px-3.5 py-2 whitespace-nowrap flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'reflection'
                    ? 'border-[#006732] text-[#006732] bg-white'
                    : 'border-transparent text-brand-dark/60 hover:text-brand-dark'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D1A110]" />
                <span>አስተንትኖና ስንክሳር (Reflection)</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-3.5 sm:p-5">
              {/* TAB 1: GOSPEL & MISBAK */}
              {activeTab === 'gospel' && (
                <div className="space-y-4">
                  {/* Gospel Main Card */}
                  <div className="bg-[#006732]/5 border border-[#006732]/20 rounded-sm p-3.5 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-sans font-black uppercase tracking-wider text-[#006732] flex items-center gap-1">
                        <BookOpen className="w-3 h-3" /> የዕለቱ ቅዱስ ወንጌል • Holy Gospel
                      </span>
                      <span className="text-[11px] font-bold text-brand-dark/70 font-mono bg-white px-2 py-0.5 rounded border border-brand-dark/10">
                        {devotional.gospel.book} ({devotional.gospel.chapterVerse})
                      </span>
                    </div>

                    <blockquote className="text-xs sm:text-sm font-serif font-bold text-brand-dark leading-relaxed pl-3 border-l-3 border-[#006732] my-2">
                      {devotional.gospel.keyVerseAmharic}
                    </blockquote>

                    <p className="text-[11px] text-brand-dark/60 italic mt-1 font-serif">
                      {devotional.gospel.keyVerseEnglish}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-[#006732]/10 text-[11px] text-brand-dark/75 leading-normal">
                      <span className="font-bold text-[#006732]">የንባቡ ማብራሪያ: </span>
                      {devotional.gospel.passageAmharic}
                    </div>
                  </div>

                  {/* Misbak Section (Ge'ez Chant Verses) */}
                  <div className="bg-brand-bg/60 border border-brand-dark/10 rounded-sm p-3.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-sans font-black uppercase text-[#D1A110] flex items-center gap-1">
                        <Feather className="w-3 h-3" /> የዕለቱ ምስባክ (Ge'ez Liturgical Chant)
                      </span>
                      <span className="text-[10.5px] font-bold text-brand-dark/60">
                        መዝሙረ ዳዊት (Psalm {devotional.misbak.psalm}:{devotional.misbak.verses})
                      </span>
                    </div>

                    <div className="bg-white p-2.5 rounded-xs border border-brand-dark/10 space-y-1 font-serif text-xs font-bold text-[#006732] text-center sm:text-left">
                      <p>፩. «{devotional.misbak.geezVerse1}»</p>
                      <p>፪. «{devotional.misbak.geezVerse2}»</p>
                      <p>፫. «{devotional.misbak.geezVerse3}»</p>
                    </div>

                    <p className="text-[10.5px] text-brand-dark/70 mt-2 font-sans">
                      <span className="font-bold text-brand-dark">ትርጉም: </span>
                      {devotional.misbak.amharicText}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: DAILY PRAYER & VIRTUE */}
              {activeTab === 'prayer' && (
                <div className="space-y-4">
                  {/* Daily Prayer Card */}
                  <div className="bg-[#EF3340]/5 border border-[#EF3340]/20 rounded-sm p-3.5 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-sans font-black uppercase tracking-wider text-[#EF3340] flex items-center gap-1">
                        <Heart className="w-3 h-3" /> {devotional.dailyPrayer.title}
                      </span>
                      <span className="text-[10px] font-bold text-brand-dark/50">
                        የኢትዮጵያ ኦርቶዶክስ ጸሎት
                      </span>
                    </div>

                    <div className="text-xs sm:text-[13px] font-serif font-bold text-brand-dark leading-relaxed pl-3 border-l-3 border-[#EF3340] my-2 bg-white/70 p-3 rounded-r-sm">
                      {devotional.dailyPrayer.amharicPrayer}
                    </div>

                    <p className="text-[11px] text-brand-dark/65 italic font-sans mt-2">
                      {devotional.dailyPrayer.englishPrayer}
                    </p>
                  </div>

                  {/* Spiritual Action / Practice Card */}
                  <div className="bg-white border border-brand-dark/15 rounded-sm p-3.5 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#D1A110]/15 text-[#D1A110] flex items-center justify-center shrink-0 font-black text-sm">
                      ★
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-sans font-black uppercase text-brand-dark/50">
                        የዕለቱ መንፈሳዊ ተግባርና ምግባር • Daily Virtue
                      </span>
                      <h4 className="text-xs font-bold text-brand-dark mt-0.5">
                        {devotional.spiritualPractice.virtue}
                      </h4>
                      <p className="text-[11px] text-brand-dark/75 mt-1 leading-normal">
                        {devotional.spiritualPractice.action}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: FULL GITSAWE READINGS */}
              {activeTab === 'gitsawe' && (
                <div className="space-y-3">
                  <div className="text-[11px] text-brand-dark/70 font-sans mb-1 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-[#006732]" />
                    በቅዳሴ ጊዜ የሚነበቡ የዕለቱ ሐዋርያት መልእክታትና ግብረ ሐዋርያት፦
                  </div>

                  {/* Pauline Epistle */}
                  <div className="bg-brand-bg/60 border border-brand-dark/10 rounded-sm p-3">
                    <div className="flex items-center justify-between text-xs font-bold text-brand-dark mb-1">
                      <span className="text-[#006732] font-serif">
                        ፩. መልእክተ ጳውሎስ (Pauline Epistle)
                      </span>
                      <span className="text-[10px] font-mono bg-white px-1.5 py-0.2 rounded border border-brand-dark/10">
                        {devotional.paulineEpistle.book} {devotional.paulineEpistle.chapterVerse}
                      </span>
                    </div>
                    <p className="text-[11px] text-brand-dark/80 font-serif leading-relaxed">
                      {devotional.paulineEpistle.amharicText}
                    </p>
                  </div>

                  {/* Catholic Epistle */}
                  <div className="bg-brand-bg/60 border border-brand-dark/10 rounded-sm p-3">
                    <div className="flex items-center justify-between text-xs font-bold text-brand-dark mb-1">
                      <span className="text-[#006732] font-serif">
                        ፪. መልእክተ ሐዋርያት (Catholic Epistle)
                      </span>
                      <span className="text-[10px] font-mono bg-white px-1.5 py-0.2 rounded border border-brand-dark/10">
                        {devotional.catholicEpistle.book} {devotional.catholicEpistle.chapterVerse}
                      </span>
                    </div>
                    <p className="text-[11px] text-brand-dark/80 font-serif leading-relaxed">
                      {devotional.catholicEpistle.amharicText}
                    </p>
                  </div>

                  {/* Acts of the Apostles */}
                  <div className="bg-brand-bg/60 border border-brand-dark/10 rounded-sm p-3">
                    <div className="flex items-center justify-between text-xs font-bold text-brand-dark mb-1">
                      <span className="text-[#006732] font-serif">
                        ፫. ግብረ ሐዋርያት (Acts of the Apostles)
                      </span>
                      <span className="text-[10px] font-mono bg-white px-1.5 py-0.2 rounded border border-brand-dark/10">
                        {devotional.actsReading.book} {devotional.actsReading.chapterVerse}
                      </span>
                    </div>
                    <p className="text-[11px] text-brand-dark/80 font-serif leading-relaxed">
                      {devotional.actsReading.amharicText}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 4: REFLECTION & SYNAXARIUM */}
              {activeTab === 'reflection' && (
                <div className="space-y-4">
                  {/* Synaxarium Summary */}
                  <div className="bg-white border border-brand-dark/15 rounded-sm p-3.5">
                    <div className="flex items-center gap-1.5 text-xs font-serif font-black text-brand-dark mb-1.5">
                      <Quote className="w-3.5 h-3.5 text-[#006732]" />
                      <span>የዕለቱ ስንክሳርና የአበው ትምህርት</span>
                    </div>
                    <p className="text-[11.5px] text-brand-dark/80 leading-relaxed font-sans">
                      {devotional.synaxariumReflection.summary}
                    </p>

                    <div className="mt-3 p-2.5 bg-brand-bg/80 border-l-2 border-[#D1A110] rounded-r-xs">
                      <p className="text-xs font-serif font-bold text-brand-dark">
                        {devotional.synaxariumReflection.quote}
                      </p>
                      <span className="text-[9.5px] text-brand-dark/50 font-sans block mt-1">
                        — {devotional.synaxariumReflection.authorOrSource}
                      </span>
                    </div>
                  </div>

                  {/* AI-Powered Deeper Reflection Section */}
                  <div className="bg-gradient-to-br from-[#006732]/5 to-[#D1A110]/10 border border-brand-dark/15 rounded-sm p-3.5">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#D1A110]" />
                        <span className="text-xs font-bold text-brand-dark">
                          ተጨማሪ መንፈሳዊ ተመስጦና ትንታኔ (Spiritual Contemplation)
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handleGenerateAiReflection}
                        disabled={isAiLoading}
                        className="px-2.5 py-1 text-[10px] font-sans font-bold bg-[#006732] text-white hover:bg-[#006732]/90 rounded-xs shadow-2xs transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        {isAiLoading ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            <span>እያሰላሰለ ነው...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3 text-[#D1A110]" />
                            <span>አመንጭ / Refresh</span>
                          </>
                        )}
                      </button>
                    </div>

                    {aiReflection ? (
                      <div className="bg-white p-3 rounded-xs border border-brand-dark/10 text-xs font-serif text-brand-dark/90 leading-relaxed whitespace-pre-line">
                        {aiReflection}
                      </div>
                    ) : (
                      <div className="text-[11px] text-brand-dark/60 italic bg-white/60 p-2.5 rounded-xs border border-dashed border-brand-dark/15 text-center">
                        የዕለቱን ወንጌልና ስንክሳር መሠረት ያደረገ ጥልቅ መንፈሳዊ ትንታኔ ለማመንጨት «አመንጭ» የሚለውን ይጫኑ።
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Footer Note */}
            <div className="px-4 py-2 bg-brand-bg/80 border-t border-brand-dark/10 flex items-center justify-between text-[9.5px] text-brand-dark/60 font-sans">
              <span className="flex items-center gap-1">
                <Flame className="w-3 h-3 text-[#EF3340]" />
                የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን ሥርዓተ ጸሎትና ንባብ
              </span>
              <span>የቀን አቆጣጠር ({selectedDay.ethiopianYear} ዓ.ም.)</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
