import PersonalDataImg from "../assets/n3.png";
import OnlineTaskImg from "../assets/n5.png";
import PartTimeImg from "../assets/s4.png";
import MapBg from "../assets/map.png";

export default function Services() {
  const services = [
    {
      img: PersonalDataImg,
      title: "Personal Data Fill",
      desc: "Simply copy-paste resumes in our system to maintain data and earn.",
    },
    {
      img: OnlineTaskImg,
      title: "Online Task",
      desc: "Complete company tasks online in a timely manner and get paid.",
    },
    {
      img: PartTimeImg,
      title: "Part Time Jobs",
      desc: "Work in your free time and earn extra income easily.",
    },
  ];

  return (
    <section
      id="services"
      className="relative py-16 sm:py-20"
      style={{
        backgroundImage: `url(${MapBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Optional dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-blue-50 bg-opacity-80"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Header */}
        <h3 className="text-lg sm:text-xl font-bold text-blue-700 uppercase mb-3">
          Our Services / Tasks
        </h3>
        <p className="text-sm sm:text-base text-gray-700 max-w-2xl mx-auto mb-10">
          Whether you are a student, fresher, or housewife, we provide online data
          entry jobs to everyone irrespective of background. Millions already joined
          us during the pandemic.
        </p>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {services.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center text-center"
            >
              <img
                src={item.img}
                alt={item.title}
                className="h-20 sm:h-24 mb-4 object-contain"
              />
              <h4 className="text-base sm:text-lg font-semibold text-blue-700 mb-2">
                {item.title}
              </h4>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
