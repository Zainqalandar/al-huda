"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "اسلام میں نماز کی اہمیت کیا ہے؟",
    answer: "نماز دین اسلام کا ستون ہے اور ہر مسلمان پر فرض ہے۔ قرآن میں بار بار نماز قائم کرنے کا حکم آیا ہے۔",
  },
  {
    question: "روزہ رکھنے کے فوائد کیا ہیں؟",
    answer: "روزہ روحانی پاکیزگی اور جسمانی صحت کا ذریعہ ہے۔ یہ تقویٰ پیدا کرتا ہے اور نفس کو قابو میں رکھتا ہے۔",
  },
  {
    question: "صدقہ دینے کی فضیلت کیا ہے؟",
    answer: "صدقہ دل کو نرم کرتا ہے، محتاج کی مدد کرتا ہے اور اللہ کی رضا حاصل ہوتی ہے۔ یہ بلاؤں کو دور کرتا ہے۔",
  },
];

export default function IslamicFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-green-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-green-700 text-center mb-6">
          اسلامی سوال و جواب 🌿
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
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
                  className={`h-5 w-5 text-green-600 transition-transform ${
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
