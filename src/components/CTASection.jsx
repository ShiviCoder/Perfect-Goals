export default function CTASection() {
  return (
    <section id="contact" className="bg-blue-700 py-12 px-4 text-center">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between sm:justify-center gap-4 sm:gap-8 bg-indigo-600 p-6 sm:p-8 rounded-xl shadow-lg">

          {/* Heading */}
          <h3 className="text-white text-xl sm:text-2xl lg:text-3xl font-bold leading-snug text-center sm:text-left">
            Become our Digital Contributor
          </h3>

          {/* Button */}
          <a
            href="#"
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg shadow-md transition-all duration-300 text-sm sm:text-base"
          >
            CONTACT US
          </a>
        </div>
      </div>
    </section>
  );
}
