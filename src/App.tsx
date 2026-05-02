import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import LunarArc from './components/LunarArc';
import MoonViewer from './components/MoonViewer';
import { getHijriDate } from './lib/astronomy';

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Automatically update the date slightly past midnight (or periodically check)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      if (now.getDate() !== currentDate.getDate()) {
        setCurrentDate(now);
      }
    }, 60000); // Check every minute
    return () => clearInterval(timer);
  }, [currentDate]);

  const hijri = getHijriDate(currentDate);

  return (
    <div className="relative min-h-screen w-full bg-black text-white/90 overflow-hidden font-sans selection:bg-white/20">
      
      {/* Dynamic Top Arc Calendar */}
      <LunarArc currentDate={currentDate} />

      {/* Central Realistic Moon */}
      <MoonViewer currentDate={currentDate} />

      {/* Bottom Date Display */}
      <div className="absolute bottom-16 left-0 w-full flex flex-col items-center justify-center pointer-events-none">
         <p className="text-sm md:text-base font-medium tracking-[0.3em] font-sans">
           {hijri.day} {hijri.month.toUpperCase()} {hijri.year} H
         </p>
         <p className="text-xs mt-3 text-white/50 tracking-[0.2em]">
           {format(currentDate, 'dd MMMM yyyy', { locale: id }).toUpperCase()}
         </p>
      </div>

    </div>
  );
}
