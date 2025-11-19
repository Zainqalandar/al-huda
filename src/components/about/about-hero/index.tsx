export default function AboutHero() {
  return (
    <section className="relative h-[50vh] flex items-center justify-center bg-[url('/banner/Islamic-banner-two.png')] bg-cover bg-center">
      <div className="absolute  " style={{ background: "color-mix(in oklab, #0000008c 60%, #00000000)" }}></div>
      <div className="relative z-10 text-center max-w-2xl px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-4">
          About Us
        </h1>
        <p className="text-lg text-gray-200">
          Spreading Islamic knowledge, peace, and inspiration to the world.
        </p>
      </div>
    </section>
  );
}
