import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Piyush from "../assets/Piyush-Verma.jpeg";
import Aditi from "../assets/Aditi-Agrawal.jpeg";
import Abhay from "../assets/Abhay-Tiwari.jpeg";
import Tarun from "../assets/pp.jpg";

export default function Testimonials() {
  const testimonials = [
    { img: Piyush, name: "Piyush Verma", text: "Your jobs are very simple and different. Just typing work and easy earnings.", country: "India" },
    { img: Aditi, name: "Aditi Aggarwal", text: "This is one of the simplest ways of earning online. Thanks!", country: "India" },
    { img: Abhay, name: "Abhay Tiwari", text: "Data typing jobs here are genuine and payments are fast.", country: "India" },
    { img: Tarun, name: "Tarun Jaiswal", text: "Work is simple, transparent, and trustworthy.", country: "India" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <p className="text-lg mb-3 text-blue-700">Some of our Awesome Testimonials</p>
      <h2 className="text-3xl font-bold text-gray-800 mb-12">Clients Testimonials</h2>

      <Swiper
        modules={[Pagination, Navigation, Autoplay]}
        loop
        autoplay={{ delay: 8000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        spaceBetween={20}
        breakpoints={{ 768: { slidesPerView: 2 } }}
      >
        {testimonials.map((t, idx) => (
          <SwiperSlide key={idx}>
            <blockquote className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
              <img src={t.img} alt={t.name} className="w-20 h-20 rounded-full mb-4" />
              <p className="text-gray-600 text-sm mb-6">"{t.text}"</p>
              <div className="font-semibold">{t.name}</div>
              <div className="text-xs text-gray-400">{t.country}</div>
            </blockquote>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
