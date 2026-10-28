import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, X, Sparkles, Calendar, ArrowRight, CornerDownLeft, Flame, Clock } from 'lucide-react';
import { buildSearchIndex, searchEvents, SearchEventItem } from '../utils/searchIndex';
import { ETHIOPIAN_MONTHS, GREGORIAN_MONTHS } from '../utils/calendar';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderSearchBarProps {
  currentEthYear: number;
  currentEthMonth: number;
  ausState: string;
  onJumpToEthDate: (ey: number, em: number, ed: number) => void;
  onJumpToGregDate: (date: Date) => void;
}

const POPULAR_QUICK_SEARCHES = [
  { label: 'Fasika / ትንሣኤ', query: 'Fasika' },
  { label: 'Mariam / ማርያም (Day 21)', query: 'Mariam' },
  { label: 'Michael / ሚካኤል (Day 12)', query: 'Michael' },
  { label: 'Gabriel / ገብርኤል (Day 19)', query: 'Gabriel' },
  { label: 'Meskel / መስቀል', query: 'Meskel' },
  { label: 'Timkat / ጥምቀት', query: 'Timkat' },
  { label: 'Tekle Haymanot / ተክለ ሃይማኖት', query: 'Tekle Haymanot' },
  { label: 'Abo / ገብረ መንፈስ ቅዱስ', query: 'Abo' },
];

export default function HeaderSearchBar({
  currentEthYear,
  currentEthMonth,
  ausState,
  onJumpToEthDate,
}: HeaderSearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Build the live search index for the active year and month
  const searchIndex = useMemo(() => {
    return buildSearchIndex(currentEthYear, currentEthMonth, ausState);
  }, [currentEthYear, currentEthMonth, ausState]);

  // Compute live search results based on query
  const results = useMemo(() => {
    return searchEvents(searchIndex, query);
  }, [searchIndex, query]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Global Keyboard Shortcut: '/' or 'Cmd/Ctrl + K' focuses search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' && document.activeElement !== inputRef.current && !(document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement)) ||
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle clicking outside to dismiss dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectEvent = (item: SearchEventItem) => {
    onJumpToEthDate(item.ethYear, item.ethMonth, item.ethDay);
    setIsOpen(false);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setIsOpen(true);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (results.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % results.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (results.length > 0) {
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results.length > 0 && results[selectedIndex]) {
        handleSelectEvent(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative w-full max-w-lg" id="header-search-bar-wrapper">
      {/* Search Input Container */}
      <div
        className={`relative flex items-center bg-brand-bg/80 border transition-all duration-200 rounded-sm shadow-2xs ${
          isOpen
            ? 'border-[#006732] ring-2 ring-[#006732]/15 bg-white'
            : 'border-brand-dark/15 hover:border-brand-dark/30'
        }`}
      >
        <div className="pl-3 pr-2 flex items-center pointer-events-none text-brand-dark/50">
          <Search className="w-4 h-4 text-[#006732]" />
        </div>

        <input
          ref={inputRef}
          id="header-saint-search-input"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search saint days, feasts (e.g. Mary, Michael, Fasika, ገብርኤል)..."
          className="w-full py-1.5 sm:py-2 text-[11px] sm:text-xs font-sans text-brand-dark placeholder:text-brand-dark/45 bg-transparent focus:outline-none"
          autoComplete="off"
          spellCheck="false"
        />

        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="p-1.5 mr-1 text-brand-dark/40 hover:text-brand-dark rounded-xs cursor-pointer"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div className="hidden sm:flex items-center gap-0.5 mr-2 px-1.5 py-0.5 border border-brand-dark/15 rounded text-[9px] font-mono text-brand-dark/40 bg-white/60 pointer-events-none">
            <span>⌘K</span>
          </div>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            id="header-search-results-dropdown"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-brand-dark/15 rounded-sm shadow-xl z-50 max-h-[80vh] sm:max-h-[460px] flex flex-col overflow-hidden"
          >
            {/* Header info / count */}
            <div className="px-3 py-2 bg-brand-bg/70 border-b border-brand-dark/10 flex items-center justify-between text-[10px] font-sans font-bold text-brand-dark/60">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#D1A110]" />
                {query.trim() ? (
                  <span>
                    Found {results.length} result{results.length !== 1 ? 's' : ''}
                  </span>
                ) : (
                  <span>Popular & Upcoming Saint Days • ፈጣን ፍለጋ</span>
                )}
              </span>
              <span className="text-[9px] text-brand-dark/40 hidden sm:inline">
                Use ↑↓ to navigate, ↵ to jump
              </span>
            </div>

            {/* Content area */}
            <div className="overflow-y-auto p-1.5 divide-y divide-brand-dark/5 space-y-1">
              {query.trim() === '' ? (
                // Quick suggestions when search is empty
                <div className="p-2 flex flex-col gap-2.5">
                  <div className="text-[10px] font-sans font-extrabold uppercase text-brand-dark/50 tracking-wider flex items-center gap-1">
                    <Flame className="w-3 h-3 text-[#EF3340]" /> Quick Saint & Feast Suggestions:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_QUICK_SEARCHES.map((item) => (
                      <button
                        key={item.query}
                        type="button"
                        onClick={() => {
                          setQuery(item.query);
                          inputRef.current?.focus();
                        }}
                        className="px-2 py-1 text-[10.5px] font-sans font-semibold bg-brand-bg hover:bg-[#006732] hover:text-white border border-brand-dark/15 text-brand-dark rounded-xs transition-colors cursor-pointer text-left"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-brand-dark/10">
                    <div className="text-[10px] font-sans font-extrabold uppercase text-brand-dark/50 tracking-wider mb-1.5 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#006732]" /> Major Feasts in Active Year ({currentEthYear} E.C.):
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {searchIndex
                        .filter((i) => i.category === 'major_feast')
                        .slice(0, 6)
                        .map((feast) => (
                          <div
                            key={feast.id}
                            onClick={() => handleSelectEvent(feast)}
                            className="p-2 rounded-xs border border-brand-dark/10 hover:border-[#006732] hover:bg-[#006732]/5 cursor-pointer transition-all flex items-center justify-between gap-2"
                          >
                            <div className="flex flex-col min-w-0">
                              <span className="text-[11px] font-bold text-brand-dark truncate">
                                {feast.title}
                              </span>
                              <span className="text-[9.5px] text-[#006732] font-semibold">
                                {ETHIOPIAN_MONTHS[feast.ethMonth - 1]?.name} {feast.ethDay} ({ETHIOPIAN_MONTHS[feast.ethMonth - 1]?.amharicName} {feast.ethDay})
                              </span>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-brand-dark/40 shrink-0" />
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ) : results.length === 0 ? (
                // No results state
                <div className="py-8 px-4 text-center flex flex-col items-center justify-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-bg flex items-center justify-center text-brand-dark/40">
                    <Search className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-brand-dark/70">
                    No matching saint days or feasts found for "{query}"
                  </p>
                  <p className="text-[10.5px] text-brand-dark/50 max-w-xs">
                    Try typing saint names in English (e.g. "Michael", "Mary", "George") or Amharic (e.g. "ማርያም", "ሚካኤል", "ፋሲካ").
                  </p>
                </div>
              ) : (
                // Results list
                results.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  const mInfo = ETHIOPIAN_MONTHS[item.ethMonth - 1];
                  const gMonthName = GREGORIAN_MONTHS[item.gregDate.getMonth()];
                  const gDay = item.gregDate.getDate();
                  const gYear = item.gregDate.getFullYear();

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectEvent(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`p-2.5 sm:p-3 rounded-xs cursor-pointer transition-all flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#006732]/10 border-l-4 border-l-[#006732] pl-2'
                          : 'hover:bg-brand-bg/80'
                      }`}
                    >
                      <div className="flex flex-col gap-1 min-w-0 flex-1">
                        {/* Title & Category Badge */}
                        <div className="flex items-center flex-wrap gap-1.5">
                          <span
                            className={`text-[8.5px] font-sans font-black uppercase px-1.5 py-0.5 rounded-2xs ${item.categoryColor}`}
                          >
                            {item.categoryLabel}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-brand-dark leading-snug">
                            {item.title}
                          </h4>
                          {item.amharicTitle && (
                            <span className="text-[11px] font-serif font-black text-[#006732]">
                              • {item.amharicTitle}
                            </span>
                          )}
                        </div>

                        {/* Date Badges (Ethiopian & Gregorian) */}
                        <div className="flex items-center flex-wrap gap-2 text-[10px] text-brand-dark/80 mt-0.5">
                          <span className="inline-flex items-center gap-1 font-bold text-brand-dark bg-[#D1A110]/15 px-1.5 py-0.5 rounded-2xs border border-[#D1A110]/30">
                            <Calendar className="w-3 h-3 text-[#D1A110]" />
                            {mInfo?.name} {item.ethDay}, {item.ethYear} E.C. ({mInfo?.amharicName} {item.ethDay})
                          </span>
                          <span className="text-brand-dark/60 font-medium">
                            Equivalent: {gMonthName} {gDay}, {gYear} G.C.
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-[10px] text-brand-dark/65 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Jump Action Button */}
                      <div className="flex flex-col items-end justify-center shrink-0 self-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectEvent(item);
                          }}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-sans font-black rounded-xs transition-all uppercase ${
                            isSelected
                              ? 'bg-[#006732] text-white shadow-sm'
                              : 'bg-brand-bg text-brand-dark/70 hover:bg-[#006732] hover:text-white'
                          }`}
                        >
                          <span>Jump</span>
                          <CornerDownLeft className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer info */}
            <div className="px-3 py-1.5 bg-brand-bg/90 border-t border-brand-dark/10 flex items-center justify-between text-[9px] text-brand-dark/50 font-sans">
              <span>Ethiopian Orthodox Liturgical Calendar Search</span>
              <span>Press ESC to close</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
