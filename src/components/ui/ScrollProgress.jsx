"use client";
import React, { useEffect, useState } from "react";

const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const scrolled = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setProgress(scrolled);
    };

    window.addEventListener("scroll", updateProgress);
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-[9999]">
      <div
        className="h-full bg-green-500 transition-all duration-150 ease-linear"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ScrollProgress;
