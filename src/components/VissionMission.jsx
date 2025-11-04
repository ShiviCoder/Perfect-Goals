// ✅ Import images safely (recommended way)
import VisionImage from "../assets/vision-mission.png";
import WhyChooseUsImage from "../assets/s55.png";
import CheckIcon from "../assets/check.png";

export default function VissionMission() {
  console.log("Loaded file : Vission mission");

  // ✅ Define data safely
  const visionPoints = [
    {
      title: "Genuine Work",
      desc: "Work on simple and genuine jobs that can be done by everyone",
    },
    {
      title: "Anyone Anywhere",
      desc: "Anyone can work from anywhere and earn good income",
    },
    {
      title: "High earnings",
      desc: "You can earn unlimited income from home",
    },
    {
      title: "Fast Review",
      desc: "Get your work reviewed within 24 hours.",
    },
  ];

  return (
    <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-52">
      <div className="grid md:grid-cols-3 gap-8 items-center">
        {/* ✅ Left image with fallback */}
        <img
          src={VisionImage || "/assets/vision-mission.png"}
          alt="Vision Mission"
          className="h-72 w-72 object-contain mx-auto"
          onError={(e) => (e.target.style.display = "none")}
        />

        {/* ✅ Middle: Why Choose Us */}
        <div className="bg-blue-600 rounded-md px-4 py-4 text-white text-center">
          <img
            src={WhyChooseUsImage || "/assets/s55.png"}
            alt="Why choose us"
            className="mx-auto mb-4 h-16"
            onError={(e) => (e.target.style.display = "none")}
          />
          <h3 className="text-xl font-bold mb-3">Why choose us?</h3>
          <p className="text-sm text-gray-200">
            We are the highly acclaimed and most trusted data entry company in India,
            providing online data entry work worldwide. Over 30,000+ users are working
            and earning with us daily.&nbsp;
            <a
              href="#"
              className="underline font-semibold inline-block mt-3 hover:text-orange-400"
            >
              Register Now!
            </a>
          </p>
        </div>

        {/* ✅ Right: Vision List */}
        <div>
          <h2 className="text-2xl font-bold mb-6">OUR VISION</h2>
          <p className="text-gray-700 mb-6">
            Our vision is to connect every Indian and give them work so that they can
            earn money. This website is open to everyone.
          </p>

          {/* ✅ Safe mapping with fallback */}
          {Array.isArray(visionPoints) && visionPoints.length > 0 ? (
            <ul className="space-y-4 text-gray-700 text-sm">
              {visionPoints.map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <img
                    src={CheckIcon || "/assets/check.png"}
                    alt="check"
                    className="h-6 w-6 mr-3 mt-1"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                  <div>
                    <p className="font-bold">{item?.title || "No title"}</p>
                    <p className="text-xs">{item?.desc || "Description missing"}</p>
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