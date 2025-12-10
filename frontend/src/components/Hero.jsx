import Banner from "../assets/banner.png";

export default function Hero() {
  return (
    <header id="home" className="relative pt-16">
      <div
        className="relative bg-cover bg-center bg-no-repeat w-full min-h-screen flex flex-col justify-center items-center text-center px-4"
        style={{
          backgroundImage: `url(${Banner})`,
          backgroundColor: "#89ade1",
          backgroundBlendMode: "multiply",
        }}
      >
        {/* Overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          {/* Top Labels */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mt-6">
            <p className="bg-orange-600 text-white text-xs sm:text-sm font-medium px-3 py-1 rounded-full">
              WHY WAIT?
            </p>
            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-yellow-400 text-center">
              REGISTER FREE NOW AND START WORKING FROM TODAY.
            </p>
          </div>

          {/* Main Heading */}
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mt-10">
            HOW TO EARN FROM DATA ENTRY JOBS FROM HOME?
          </h1>

          {/* Description */}
          <p className="mt-4 max-w-2xl text-gray-200 text-base sm:text-lg md:text-xl px-2">
            If you are looking for easy and genuine jobs from home, become our Digital Contributor today.
          </p>

          {/* Optional CTA Button */}
          <a
            href="#register"
            className="mt-8 inline-block bg-yellow-500 text-blue-900 font-bold px-6 py-3 rounded-lg hover:bg-yellow-400 transition duration-300"
          >
            Get Started
          </a>
        </div>
      </div>
    </header>
  );
}
