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

   useEffect(() => {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % prayerTimes.length);
      }, 2000);
      return () => clearInterval(interval);
    }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % prayerTimes.length);
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? prayerTimes.length - 1 : prev - 1
    );
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      {/* Card */}
      <div className="relative bg-green-100 dark:bg-green-900 shadow-lg rounded-2xl p-6 flex flex-col items-center transition-all duration-300">
        <Clock className="w-10 h-10 text-yellow-400 mb-3" />

        <h2 className="text-xl font-semibold text-green-800 dark:text-green-100">
          {prayerTimes[current].name}
        </h2>
        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">
          {prayerTimes[current].time}
        </p>

        {/* Navigation */}
        <div className="absolute top-1/2 left-3 -translate-y-1/2">
          <button
            onClick={prevSlide}
            className="p-2 rounded-full bg-white dark:bg-green-800 hover:bg-green-200"
          >
            <ChevronLeft className="w-5 h-5 text-yellow-400" />
          </button>
        </div>

        <div className="absolute top-1/2 right-3 -translate-y-1/2">
          <button
            onClick={nextSlide}
            className="p-2 rounded-full bg-white dark:bg-green-800 hover:bg-green-200"
          >
            <ChevronRight className="w-5 h-5 text-yellow-400" />
          </button>
        </div>
      </div>

      {/* Indicators */}
      <div className="flex justify-center mt-4 space-x-2">
        {prayerTimes.map((_, idx) => (
          <span
            key={idx}
            className={`w-3 h-3 rounded-full ${
              idx === current ? "bg-yellow-400" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
// ...existing code...