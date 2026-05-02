import { addDays } from 'date-fns';
import { getZodiacSign, getHijriDate } from '../lib/astronomy';
import { useMemo } from 'react';

// Simple zodiac symbol mapping
const ZODIAC_SYMBOLS: Record<string, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
  Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓'
};

export default function LunarArc({ currentDate }: { currentDate: Date }) {
  const TOTAL_DAYS = 60; 
  const DAYS_EACH_SIDE = TOTAL_DAYS / 2;
  const ANGLE_PER_DAY = 2; // Each day is 2 degrees apart
  
  const R_TICKS = 450;
  const R_TEXT = 465;
  const R_MOONS = 430;
  const R_ZODIAC = 410;
  const R_MONTH = 495;
  
  const CX = 500;
  const CY = 650; // the center anchor point is pulled down 

  const days = useMemo(() => {
    return Array.from({ length: TOTAL_DAYS + 1 }, (_, i) => {
      const offset = i - DAYS_EACH_SIDE;
      return {
        offset,
        date: addDays(currentDate, offset),
        angle: offset * ANGLE_PER_DAY
      };
    });
  }, [currentDate]);

  return (
    <div className="absolute top-0 left-0 w-full h-[55vh] flex justify-center overflow-hidden pointer-events-none select-none">
      {/* 
        We use an SVG viewBox that centers the arc nicely at the top of the screen.
      */}
      <svg viewBox="0 0 1000 600" className="w-[1200px] max-w-none opacity-90 stroke-current text-white/80">
        
        {/* The main arcs */}
        <circle cx={CX} cy={CY} r={R_TICKS} fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.4" />
        <circle cx={CX} cy={CY} r={R_ZODIAC} fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 8" strokeOpacity="0.2" />

        {/* The Today Indicator Triangle */}
        <path d={`M ${CX} ${CY - R_TICKS - 20} l -5 -6 l 10 0 z`} fill="#fff" />
        <circle cx={CX} cy={CY - R_TICKS + 10} r="2" fill="#fff" />

        {days.map(({ offset, date, angle }) => {
          const isToday = offset === 0;
          
          // Hijri Date
          const myHijri = getHijriDate(date);
          
          // In a purely lunar calendar (Hijri), phases map directly to days!
          const isNewMoon = myHijri.day === 1;
          const isFirstQuarter = myHijri.day === 8;
          const isFullMoon = myHijri.day === 15;
          const isLastQuarter = myHijri.day === 22;
          const hasMoonIcon = isNewMoon || isFirstQuarter || isFullMoon || isLastQuarter;

          // Center the Hijri Month text on the 15th day (Full Moon)
          const isMonthCenter = myHijri.day === 15;
          
          // Zodiac changes (Solar)
          const prevDay = addDays(date, -1);
          const myZodiac = getZodiacSign(date);
          const prevZodiac = getZodiacSign(prevDay);
          const isNewZodiac = myZodiac !== prevZodiac;

          return (
            <g key={offset} transform={`rotate(${angle}, ${CX}, ${CY})`}>
              {/* Tick Mark */}
              <line 
                x1={CX} y1={CY - R_TICKS} 
                x2={CX} y2={CY - R_TICKS + (isToday || myHijri.day % 5 === 0 ? 8 : 4)} 
                stroke="currentColor" 
                strokeWidth={isToday ? "1.5" : "0.5"} 
              />
              
              {/* Date Text (Hijri Day) */}
              <text 
                x={CX} y={CY - R_TEXT} 
                textAnchor="middle" 
                fontSize={isToday ? "10" : "8"} 
                fill={isToday ? "#fff" : "currentColor"}
                fontWeight={isToday ? "600" : "300"}
                transform={`rotate(${-angle}, ${CX}, ${CY - R_TEXT})`} 
              >
                {myHijri.day.toString().padStart(2, '0')}
              </text>

              {/* Month LabeL (Centered on Full Moon!) */}
              {isMonthCenter && (
                 <text 
                   x={CX} y={CY - R_MONTH} 
                   textAnchor="middle" 
                   fontSize="14" 
                   letterSpacing="0.4em"
                   fontWeight="400"
                   transform={`rotate(${-angle}, ${CX}, ${CY - R_MONTH})`}
                 >
                   {myHijri.month.toUpperCase()}
                 </text>
              )}

              {/* Moon Phase Icons */}
              {hasMoonIcon && (
                <circle 
                  cx={CX} 
                  cy={CY - R_MOONS} 
                  r="4" 
                  fill={isFullMoon ? "#fff" : "transparent"} 
                  stroke="#fff"
                  strokeWidth="1"
                />
              )}
              {hasMoonIcon && isFirstQuarter && (
                <path d={`M ${CX} ${CY - R_MOONS - 4} A 4 4 0 0 1 ${CX} ${CY - R_MOONS + 4} Z`} fill="#fff" />
              )}
              {hasMoonIcon && isLastQuarter && (
                <path d={`M ${CX} ${CY - R_MOONS - 4} A 4 4 0 0 0 ${CX} ${CY - R_MOONS + 4} Z`} fill="#fff" />
              )}

              {/* Zodiac / Astrology Markers */}
              {isNewZodiac && (
                <g>
                  <line x1={CX} y1={CY - R_TICKS} x2={CX} y2={CY - R_ZODIAC} stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.3" />
                  <text 
                    x={CX} y={CY - R_ZODIAC + 12} 
                    textAnchor="middle" 
                    fontSize="12" 
                    fill="currentColor"
                    fontFamily="serif"
                    transform={`rotate(${-angle}, ${CX}, ${CY - R_ZODIAC + 12})`}
                  >
                    {ZODIAC_SYMBOLS[myZodiac]}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
