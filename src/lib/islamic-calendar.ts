export interface HijriDate {
  day: number;
  month: number;
  year: number;
}

/** Approximate Gregorian → Hijri conversion (±1 day). Suitable for seasonal widgets. */
export function getApproximateHijriDate(date: Date = new Date()): HijriDate {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  let adjustedMonth = month;
  let adjustedYear = year;

  if (adjustedMonth < 3) {
    adjustedYear -= 1;
    adjustedMonth += 12;
  }

  const century = Math.floor(adjustedYear / 100);
  const b = 2 - century + Math.floor(century / 4);
  const julianDay =
    Math.floor(365.25 * (adjustedYear + 4716)) +
    Math.floor(30.6001 * (adjustedMonth + 1)) +
    day +
    b -
    1524.5;

  const lunarEpoch = julianDay - 1948440 + 10632;
  const cycle = Math.floor((lunarEpoch - 1) / 10631);
  const remainder = lunarEpoch - 10631 * cycle + 354;
  const leap =
    Math.floor((10985 - remainder) / 5316) * Math.floor((50 * remainder) / 17719) +
    Math.floor(remainder / 5670) * Math.floor((43 * remainder) / 15238);
  const lunarDay =
    remainder -
    Math.floor((30 - leap) / 15) * Math.floor((17719 * leap) / 50) -
    Math.floor(leap / 16) * Math.floor((15238 * leap) / 43) +
    29;
  const hijriMonth = Math.floor((24 * lunarDay) / 709);
  const hijriDay = lunarDay - Math.floor((709 * hijriMonth) / 24);
  const hijriYear = 30 * cycle + leap - 30;

  return {
    day: hijriDay,
    month: hijriMonth,
    year: hijriYear,
  };
}

export function isFriday(date: Date = new Date()) {
  return date.getDay() === 5;
}

export function isRamadan(date: Date = new Date()) {
  return getApproximateHijriDate(date).month === 9;
}

export function isMorningTime(date: Date = new Date()) {
  const hour = date.getHours();
  return hour >= 5 && hour < 11;
}

export function isEveningTime(date: Date = new Date()) {
  const hour = date.getHours();
  return hour >= 17 && hour < 21;
}
