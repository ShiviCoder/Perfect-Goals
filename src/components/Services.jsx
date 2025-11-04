import PersonalDataImg from "../assets/n3.png";
import OnlineTaskImg from "../assets/n5.png";
import PartTimeImg from "../assets/s4.png";
import MapBg from "../assets/map.png";

export default function Services() {
  return (
    <section
      id="services"
      className="bg-blue-50 py-16"
      style={{
        backgroundImage: `url(${MapBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-xl font-bold text-blue-700 uppercase mb-2">Our Services/Task</h3>
        <p className="text-sm mb-6 max-w-2xl mx-auto text-gray-600">
          Whether you are a student, fresher, or housewife, we provide online data
          entry jobs to everyone irrespective of background. Millions already
          joined us during the pandemic.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
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
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-lg flex flex-col items-center py-6 px-4"
            >
              <img src={item.img} alt={item.title} className="h-20 mb-4" />
              <h4 className="text-lg font-semibold text-blue-700">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
