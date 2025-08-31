"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const quotes = [
  {
    text: "Indeed, with hardship comes ease. (Quran 94:6)",
    author: "Al-Quran"
  },
  {
    text: "The best among you are those who have the best manners and character.",
    author: "Prophet Muhammad ﷺ"
  },
  {
    text: "Do not lose hope, nor be sad. (Quran 3:139)",
    author: "Al-Quran"
  },
  {
    text: "Speak good or remain silent.",
    author: "Prophet Muhammad ﷺ"
  },
];

export default function DailyInspirationSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // Auto slide after 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Fade effect on index change
  useEffect(() => {
    setFade(false);
    const timeout = setTimeout(() => setFade(true), 100);
    return () => clearTimeout(timeout);
  }, [currentIndex]);

  const handlePrev = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
    }, 100);
  };

  const handleNext = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, 100);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-green-100 p-6 rounded-2xl shadow-lg relative text-center mb-8">
      <h2 className="text-2xl font-bold text-green-700 mb-4">🌿 Daily Inspiration</h2>
      
      <div
        className={`transition-opacity duration-700 ease-in-out ${fade ? "opacity-100" : "opacity-0"}`}
      >
        <p className="text-lg italic text-gray-700">
          "{quotes[currentIndex].text}"
        </p>
        <span className="block mt-3 text-green-600 font-semibold">
          — {quotes[currentIndex].author}
        </span>
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={handlePrev} 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full cursor-pointer shadow hover:bg-green-100"
      >
        <ChevronLeft className="w-5 h-5 text-green-700" />
      </button>
      
      <button 
        onClick={handleNext} 
        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full cursor-pointer shadow hover:bg-green-100"
      >
        <ChevronRight className="w-5 h-5 text-green-700" />
      </button>

      {/* Dots indicator */}
      <div className="flex justify-center mt-4 space-x-2">
        {quotes.map((_, i) => (
          <span
            key={i}
            className={`w-3 h-3 rounded-full ${i === currentIndex ? "bg-green-600" : "bg-gray-300"}`}
          ></span>
        ))}
      </div>
    </div>
  );
}