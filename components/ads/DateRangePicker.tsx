"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

export function DateRangePicker() {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  // Date states. Using "YYYY-MM-DD" format.
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [activeLink, setActiveLink] = useState<string | null>(null);
  
  // Current month displayed on the left side
  const [currentDate, setCurrentDate] = useState(new Date()); 
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = (today.getMonth() + 1).toString().padStart(2, '0');
  const dd = today.getDate().toString().padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  const quickLinks = [
    { label: "Aujourd'hui", start: todayStr, end: todayStr },
    { label: "Les 7 derniers jours", start: "2026-05-07", end: "2026-05-13" },
    { label: "Les 30 derniers jours", start: "2026-04-14", end: "2026-05-13" },
    { label: "Ce mois-ci", start: "2026-05-01", end: "2026-05-31" },
    { label: "Le mois dernier", start: "2026-04-01", end: "2026-04-30" }
  ];

  const getMonthData = (year: number, month: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
    return { days: daysInMonth, startDay: firstDay };
  };

  const formatMonthYear = (date: Date) => {
    const months = ['JANVIER', 'FÉVRIER', 'MARS', 'AVRIL', 'MAI', 'JUIN', 'JUILLET', 'AOÛT', 'SEPTEMBRE', 'OCTOBRE', 'NOVEMBRE', 'DÉCEMBRE'];
    return { month: months[date.getMonth()], year: date.getFullYear() };
  };

  const leftMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const rightMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const leftData = getMonthData(leftMonth.getFullYear(), leftMonth.getMonth());
  const rightData = getMonthData(rightMonth.getFullYear(), rightMonth.getMonth());
  
  const leftDays = Array.from({ length: leftData.days }, (_, i) => i + 1);
  const leftBlanks = Array.from({ length: leftData.startDay }, (_, i) => i);
  const prevMonthDays = new Date(leftMonth.getFullYear(), leftMonth.getMonth(), 0).getDate();
  
  const rightDays = Array.from({ length: rightData.days }, (_, i) => i + 1);
  const rightBlanks = Array.from({ length: rightData.startDay }, (_, i) => i);

  const handleDayClick = (date: Date) => {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;
    setActiveLink(null);

    if (!startDate || (startDate && endDate)) {
      setStartDate(dateStr);
      setEndDate(null);
    } else {
      if (dateStr < startDate) {
        setEndDate(startDate);
        setStartDate(dateStr);
      } else {
        setEndDate(dateStr);
      }
    }
  };

  const isSelected = (dateStr: string) => {
    return dateStr === startDate || dateStr === endDate;
  };

  const isInRange = (dateStr: string) => {
    if (!startDate || !endDate) return false;
    return dateStr > startDate && dateStr < endDate;
  };

  const getButtonText = () => {
    if (activeLink) return activeLink;
    if (startDate && endDate) {
      if (startDate === endDate) return startDate;
      return `${startDate} au ${endDate}`;
    }
    if (startDate) return `${startDate} - ...`;
    return "Période d'activité";
  };

  const renderDay = (date: Date) => {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;
    
    const selected = isSelected(dateStr);
    const inRange = isInRange(dateStr);
    
    let className = "py-1.5 cursor-pointer text-[13px] font-bold transition-colors relative z-10 w-8 h-8 flex items-center justify-center mx-auto rounded-full ";
    
    if (selected) {
      className += "bg-blue-600 text-white shadow-md";
    } else if (inRange) {
      className += "text-blue-700 font-bold";
    } else {
      className += "hover:bg-gray-100 text-gray-700";
    }

    return (
      <div key={dateStr} className="relative">
        {(selected || inRange) && startDate !== endDate && endDate && (
           <div className={`absolute top-0 bottom-0 z-0 bg-blue-50 ${
             isSelected(dateStr) && dateStr === startDate ? 'left-1/2 right-0' :
             isSelected(dateStr) && dateStr === endDate ? 'left-0 right-1/2' :
             'left-0 right-0'
           }`} />
        )}
        <div onClick={() => handleDayClick(date)} className={className}>
          {date.getDate()}
        </div>
      </div>
    );
  };

  const renderBlanks = (count: number, prevMonthDaysCount: number) => {
    return Array.from({ length: count }, (_, i) => {
      const dayNum = prevMonthDaysCount - count + i + 1;
      return (
        <div key={`blank-${i}`} className="py-1.5 text-sm font-medium text-gray-300">
          {dayNum}
        </div>
      );
    });
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-5 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors shadow-sm min-w-[140px] justify-between"
      >
        <span className="text-[13px] font-bold text-gray-700">{getButtonText()}</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+0.5rem)] left-0 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 flex z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
          
          {/* Quick Links */}
          <div className="w-[200px] border-r border-gray-100 py-4 flex flex-col">
            {quickLinks.map((link) => (
              <button 
                key={link.label}
                onClick={() => {
                  setStartDate(link.start);
                  setEndDate(link.end);
                  setActiveLink(link.label);
                  setIsOpen(false);
                }}
                className={`text-left px-6 py-2.5 text-[13px] font-bold transition-colors ${activeLink === link.label ? 'text-blue-600 bg-blue-50/50 border-r-2 border-blue-600' : 'text-blue-600 hover:bg-blue-50'}`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="p-4 flex gap-6">
            {/* Left Calendar */}
            <div className="w-[260px]">
              <div className="flex items-center justify-between mb-4 border border-gray-200 rounded-md p-1">
                <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded text-gray-600"><ChevronLeft className="w-5 h-5" /></button>
                <span className="font-bold text-[13px] text-gray-800 tracking-wider">
                  {formatMonthYear(leftMonth).month} <span className="ml-2 text-gray-500 font-medium">{formatMonthYear(leftMonth).year}</span>
                </span>
                <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded text-gray-600"><ChevronRight className="w-5 h-5" /></button>
              </div>
              <div className="grid grid-cols-7 text-center mb-2 border-b border-gray-100 pb-2">
                {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(d => (
                  <div key={d} className="text-[11px] font-black text-gray-400 uppercase">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-y-1 text-center">
                {renderBlanks(leftBlanks.length, prevMonthDays)}
                {leftDays.map(d => renderDay(new Date(leftMonth.getFullYear(), leftMonth.getMonth(), d)))}
              </div>
            </div>

            {/* Right Calendar */}
            <div className="w-[260px]">
              <div className="flex items-center justify-between mb-4 border border-gray-200 rounded-md p-1">
                <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded text-gray-600"><ChevronLeft className="w-5 h-5" /></button>
                <span className="font-bold text-[13px] text-gray-800 tracking-wider">
                  {formatMonthYear(rightMonth).month} <span className="ml-2 text-gray-500 font-medium">{formatMonthYear(rightMonth).year}</span>
                </span>
                <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded text-gray-600"><ChevronRight className="w-5 h-5" /></button>
              </div>
              <div className="grid grid-cols-7 text-center mb-2 border-b border-gray-100 pb-2">
                {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(d => (
                  <div key={d} className="text-[11px] font-black text-gray-400 uppercase">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-y-1 text-center">
                {renderBlanks(rightBlanks.length, leftData.days)}
                {rightDays.map(d => renderDay(new Date(rightMonth.getFullYear(), rightMonth.getMonth(), d)))}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
