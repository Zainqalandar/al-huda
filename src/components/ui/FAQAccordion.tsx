"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import faqs from '@/data/faqs.json'

 interface FAQ {
    question: string;
    answer: string;
  }

export default function IslamicFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };



  return (
    <div className="bg-green-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-green-700 text-center mb-6">
          اسلامی سوال و جواب 🌿
        </h2>
        <div className="space-y-3">
          {faqs.map((faq: FAQ, index) => (
            <div
              key={index}
              className="border border-green-300 rounded-2xl bg-white shadow-sm"
            >
              <button
                className="w-full flex justify-between items-center px-4 py-3 text-green-800 font-medium"
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                <ChevronDown
                  className={`h-5 w-5 text-green-600 transition-transform cursor-pointer ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-4 pb-4 text-green-700 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
