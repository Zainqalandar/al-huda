"use client"
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

const prayerTimes = [
  { name: "Fajr", time: "05:10 AM" },
  { name: "Dhuhr", time: "01:15 PM" },
  { name: "Asr", time: "04:45 PM" },
  { name: "Maghrib", time: "06:30 PM" },
  { name: "Isha", time: "08:00 PM" },
];

export default function PrayerTimeSlider() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      handleSlide((current + 1) % prayerTimes.length);
    }, 2000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [current]);

  const handleSlide = (nextIdx) => {
    setAnimating(true);
    setTimeout(() => {
      setCurrent(nextIdx);
      setAnimating(false);
    }, 300); // duration matches transition
  };

  const nextSlide = () => {
    handleSlide((current + 1) % prayerTimes.length);
  };

  const prevSlide = () => {
    handleSlide(current === 0 ? prayerTimes.length - 1 : current - 1);
  };

  return (
    <div className="w-full max-w-md mx-auto px-2 py-4 sm:p-4">
      {/* Card */}
      <div
        className={`relative bg-green-100 dark:bg-green-900 shadow-lg rounded-2xl p-4 sm:p-6 flex flex-col items-center transition-opacity duration-300
          ${animating ? "opacity-0" : "opacity-100"}
        `}
        style={{ willChange: "opacity" }}
      >
        <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400 mb-2 sm:mb-3" />

        <h2 className="text-lg sm:text-xl font-semibold text-green-800 dark:text-green-100">
          {prayerTimes[current].name}
        </h2>
        <p className="text-xl sm:text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1 sm:mt-2">
          {prayerTimes[current].time}
        </p>

        {/* Navigation */}
        <div className="absolute top-1/2 left-2 sm:left-3 -translate-y-1/2">
          <button
            onClick={prevSlide}
            className="p-1 sm:p-2 rounded-full bg-white dark:bg-green-800 hover:bg-green-200"
            disabled={animating}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
          </button>
        </div>

        <div className="absolute top-1/2 right-2 sm:right-3 -translate-y-1/2">
          <button
            onClick={nextSlide}
            className="p-1 sm:p-2 rounded-full bg-white dark:bg-green-800 hover:bg-green-200"
            disabled={animating}
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
          </button>
        </div>
      </div>

      {/* Indicators */}
      <div className="flex justify-center mt-3 sm:mt-4 space-x-1 sm:space-x-2">
        {prayerTimes.map((_, idx) => (
          <span
            key={idx}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
              idx === current ? "bg-yellow-400" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
// ...existing code...