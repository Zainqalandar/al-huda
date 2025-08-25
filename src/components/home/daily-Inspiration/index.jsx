import React from 'react'

const DailyInspiration = () => {
  return (
    <>
    <section className="py-16 bg-green-950 text-white text-center">
      <h2 className="text-3xl font-bold text-yellow-400 mb-8">🌙 Daily Inspiration</h2>
      <div className="max-w-2xl mx-auto bg-white/10 border border-yellow-500/30 p-6 rounded-xl shadow-lg">
        <p className="text-lg italic">
          "The best among you are those who learn the Qur’an and teach it."
        </p>
        <span className="block mt-4 text-sm text-yellow-300">~ Sahih al-Bukhari</span>
      </div>
    </section>
    </>
  )
}

export default DailyInspiration