const values = [
  { id: 1, title: "Faith (Iman)", desc: "Living with strong belief in Allah and His Messenger ﷺ." },
  { id: 2, title: "Knowledge (Ilm)", desc: "Spreading authentic knowledge from Qur’an and Sunnah." },
  { id: 3, title: "Brotherhood (Ukhuwwah)", desc: "Encouraging love, unity, and peace among Muslims." },
  { id: 4, title: "Peace (Salam)", desc: "Promoting peace and kindness for all humanity." }
];

export default function Values() {
  return (
    <section className="py-16 bg-green-950 text-white">
      <h2 className="text-3xl font-bold text-yellow-400 text-center mb-10">💎 Our Core Values</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 container mx-auto px-6">
        {values.map((val) => (
          <div key={val.id} className="bg-white/10 border border-yellow-500/30 p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold text-yellow-300 mb-3">{val.title}</h3>
            <p className="text-gray-200">{val.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
