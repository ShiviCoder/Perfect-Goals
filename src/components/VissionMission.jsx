// ✅ Import images safely
import VisionImage from "../assets/vision-mission.png";
import WhyChooseUsImage from "../assets/s55.png";
import CheckIcon from "../assets/check.png";

export default function VissionMission() {
  const visionPoints = [
    {
      title: "Genuine Work",
      desc: "Work on simple and genuine jobs that can be done by everyone.",
    },
    {
      title: "Anyone Anywhere",
      desc: "Anyone can work from anywhere and earn a good income.",
    },
    {
      title: "High Earnings",
      desc: "You can earn unlimited income from home.",
    },
    {
      title: "Fast Review",
      desc: "Get your work reviewed within 24 hours.",
    },
  ];

  return (
    <section
      id="about"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-28 sm:mt-36 md:mt-44"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
        {/* ✅ Left Image */}
        <div className="flex justify-center">
          <img
            src={VisionImage || "/assets/vision-mission.png"}
            alt="Vision Mission"
            className="h-56 sm:h-64 md:h-72 w-auto object-contain"
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>

        {/* ✅ Middle: Why Choose Us */}
        <div className="bg-blue-600 rounded-xl px-6 py-8 text-white text-center shadow-md order-last md:order-none">
          <img
            src={WhyChooseUsImage || "/assets/s55.png"}
            alt="Why choose us"
            className="mx-auto mb-4 h-14 sm:h-16"
            onError={(e) => (e.target.style.display = "none")}
          />
          <h3 className="text-lg sm:text-xl font-bold mb-3">Why Choose Us?</h3>
          <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
            We are one of India’s most trusted data entry companies, providing
            online data entry work globally. Over{" "}
            <span className="font-bold text-yellow-300">30,000+</span> users are
            earning with us daily.
          </p>
          <a
            href="#"
            className="underline font-semibold inline-block mt-4 hover:text-orange-400 transition"
          >
            Register Now!
          </a>
        </div>

        {/* ✅ Right: Vision List */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-5 text-center md:text-left">
            OUR VISION
          </h2>
          <p className="text-gray-700 text-sm sm:text-base mb-6 text-center md:text-left leading-relaxed">
            Our vision is to connect every Indian and provide genuine work
            opportunities so they can earn money from home. This platform is
            open to everyone.
          </p>

          {Array.isArray(visionPoints) && visionPoints.length > 0 ? (
            <ul className="space-y-4 text-gray-700 text-sm sm:text-base">
              {visionPoints.map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <img
                    src={CheckIcon || "/assets/check.png"}
                    alt="check"
                    className="h-5 w-5 mr-3 mt-1 sm:h-6 sm:w-6"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-xs sm:text-sm">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No vision data available.</p>
          )}
        </div>
      </div>
    </section>
  );
}
