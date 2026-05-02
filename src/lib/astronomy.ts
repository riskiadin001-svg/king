/**
 * Astronomical utility functions for the Lunar App
 */

// Cycle of the moon in days
const LUNAR_MONTH = 29.53058867;

/**
 * Calculates the rough phase of the moon for a given date.
 * Returns a value from 0.0 to 1.0.
 * 0.0 = New Moon
 * 0.25 = First Quarter
 * 0.5 = Full Moon
 * 0.75 = Last Quarter
 */
export function getMoonPhase(date: Date): number {
  // Known new moon reference: Jan 6, 2000, ~18:14 UTC
  const newMoon2000 = new Date(Date.UTC(2000, 0, 6, 18, 14, 0));
  const diffMs = date.getTime() - newMoon2000.getTime();
  const cycleMs = LUNAR_MONTH * 24 * 60 * 60 * 1000;
  let phase = (diffMs % cycleMs) / cycleMs;
  if (phase < 0) {
    phase += 1;
  }
  return phase;
}

const HIJRI_MONTHS = [
  "Muharram", "Safar", "Rabi'ul Awal", "Rabi'ul Akhir",
  "Jumadil Awal", "Jumadil Akhir", "Rajab", "Sya'ban",
  "Ramadhan", "Syawal", "Dzulqa'dah", "Dzulhijjah"
];

export function getHijriDate(date: Date) {
  // We use the standard Islamic calendar provided by the Intl API. 
  // It gives a very close approximation to the Kalender Hijriah Global Tunggal (KHGT).
  const formatter = new Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura-nu-latn', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
  });
  
  const parts = formatter.formatToParts(date);
  let day = '1';
  let monthIndex = 0;
  let year = '';

  for (const part of parts) {
      if (part.type === 'day') day = part.value;
      if (part.type === 'month') {
          const m = parseInt(part.value, 10);
          if (!isNaN(m) && m >= 1 && m <= 12) {
              monthIndex = m - 1;
          }
      }
      if (part.type === 'year') year = part.value;
  }
  
  // Clean up year string just in case it contains "H" or "AH"
  year = year.replace(/\D/g, '');

  return { 
    day: parseInt(day, 10) || 1, 
    month: HIJRI_MONTHS[monthIndex], 
    year: parseInt(year, 10) || 1445 
  };
}

/**
 * Returns the zodiac sign for a given date.
 */
export function getZodiacSign(date: Date): string {
  const d = date.getDate();
  const m = date.getMonth() + 1; // 1-12

  if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) return "Aquarius";
  if ((m === 2 && d >= 19) || (m === 3 && d <= 20)) return "Pisces";
  if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) return "Aries";
  if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) return "Taurus";
  if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) return "Gemini";
  if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) return "Cancer";
  if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return "Leo";
  if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return "Virgo";
  if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) return "Libra";
  if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) return "Scorpio";
  if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) return "Sagittarius";
  return "Capricorn"; 
}

// Convert a phase number (0-1) into a readable string
export function getPhaseName(phase: number): string {
  if (phase < 0.03 || phase > 0.97) return 'New Moon';
  if (phase < 0.22) return 'Waxing Crescent';
  if (phase < 0.28) return 'First Quarter';
  if (phase < 0.47) return 'Waxing Gibbous';
  if (phase < 0.53) return 'Full Moon';
  if (phase < 0.72) return 'Waning Gibbous';
  if (phase < 0.78) return 'Last Quarter';
  return 'Waning Crescent';
}
