import Banner from "../assets/banner.png";

export default function Hero() {
  return (
    <header
      id="home"
      className="pt-16 pb-20 text-center relative"
    >
      <div
        className="bg-cover bg-center bg-no-repeat w-full h-screen"
        style={{ backgroundImage: `url(${Banner})`, backgroundColor: "#89ade1", backgroundBlendMode: "multiply" }}
      >
        <div className="flex items-center gap-2 justify-center">
          <p className="bg-orange-600 text-white text-xs font-medium px-3 py-1 rounded-full mt-6">WHY WAIT?</p>
          <p className="text-xs font-bold uppercase tracking-wider text-yellow-400 mt-6">REGISTER FREE NOW AND START WORKING FROM TODAY.</p>
        </div>
        <h1 className="text-white text-4xl sm:text-5xl font-extrabold leading-tight max-w-4xl mx-auto px-6 mt-10">
          HOW TO EARN FROM DATA ENTRY JOBS FROM HOME?
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-gray-300 text-lg px-6">
          If you are looking for easy and genuine jobs from home. Become our Digital Contributor.
        </p>
      </div>
    </header>
  );
}
