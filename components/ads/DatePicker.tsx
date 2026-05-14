"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

export function CustomDatePicker() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(13);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  // mock days for January 2022 (starts on Saturday)
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const blanks = Array.from({ length: 5 }, (_, i) => i); 
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between border-2 border-blue-500 rounded-[1rem] px-4 py-2.5 bg-white dark:bg-black/40 cursor-pointer w-[280px] hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all shadow-sm"
      >
        <span className="text-[13px] font-bold text-foreground">20 Jan, 2022 - 20 Feb, 2022</span>
        <Calendar className="w-4 h-4 text-foreground/50" />
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+0.5rem)] left-0 bg-white dark:bg-secondary rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-border/50 p-5 w-[320px] z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-5">
            <button className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors"><ChevronLeft className="w-4 h-4" /></button>
            <span className="font-bold text-[15px]">January 2022</span>
            <button className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors"><ChevronRight className="w-4 h-4" /></button>
          </div>
          
          <div className="flex items-center gap-3 mb-5">
            <input 
              type="text" 
              value="Jan 6, 2022" 
              readOnly
              className="flex-1 bg-transparent border border-border/50 rounded-xl px-3 py-2 text-[13px] font-bold focus:outline-none focus:border-blue-500 transition-colors" 
            />
            <button className="px-4 py-2 border border-border/50 rounded-xl text-[13px] font-bold hover:bg-black/5 dark:hover:bg-white/10 transition-colors">Today</button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-3">
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sat', 'Su'].map(d => (
              <div key={d} className="text-xs font-bold text-foreground/40 py-1">{d}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center text-[13px] font-bold">
            {blanks.map((_, i) => <div key={`blank-${i}`} />)}
            {days.map(d => (
              <div 
                key={d} 
                onClick={() => setSelectedDate(d)}
                className={`py-1 cursor-pointer rounded-full transition-all flex items-center justify-center w-8 h-8 mx-auto
                  ${selectedDate === d ? 'bg-blue-600 text-white shadow-md scale-110' : 'hover:bg-black/5 dark:hover:bg-white/10 text-foreground/80'}`}
              >
                {d}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
            <button onClick={() => setIsOpen(false)} className="px-6 py-2 border border-border/50 rounded-xl text-[13px] font-bold hover:bg-black/5 dark:hover:bg-white/10 transition-colors">Cancel</button>
            <button onClick={() => setIsOpen(false)} className="px-6 py-2 bg-blue-600 text-white rounded-xl text-[13px] font-bold hover:bg-blue-700 shadow-[0_5px_15px_rgba(37,99,235,0.4)] transition-all active:scale-95">Apply</button>
          </div>
        </div>
      )}
    </div>
  );
}
