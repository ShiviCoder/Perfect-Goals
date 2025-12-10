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
    {
      img: Piyush,
      name: "Piyush Verma",
      text: "Your jobs are very simple and different. Just typing work and easy earnings.",
      country: "India",
    },
    {
      img: Aditi,
      name: "Aditi Aggarwal",
      text: "This is one of the simplest ways of earning online. Thanks!",
      country: "India",
    },
    {
      img: Abhay,
      name: "Abhay Tiwari",
      text: "Data typing jobs here are genuine and payments are fast.",
      country: "India",
    },
    {
      img: Tarun,
      name: "Tarun Jaiswal",
      text: "Work is simple, transparent, and trustworthy.",
      country: "India",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center relative">
      <p className="text-base sm:text-lg mb-3 text-blue-700 font-medium">
        Some of our Awesome Testimonials
      </p>
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-10 sm:mb-12">
        Clients Testimonials
      </h2>

      <Swiper
        modules={[Pagination, Navigation, Autoplay]}
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        spaceBetween={24}
        breakpoints={{
          0: { slidesPerView: 1 },
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {testimonials.map((t, idx) => (
          <SwiperSlide key={idx}>
            <blockquote className="bg-white p-6 sm:p-8 rounded-xl shadow-lg flex flex-col items-center text-center mx-auto max-w-sm hover:shadow-xl transition-all duration-300">
              <img
                src={t.img}
                alt={t.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mb-4 object-cover"
              />
              <p className="text-gray-600 text-sm sm:text-base mb-6 italic">
                “{t.text}”
              </p>
              <div className="font-semibold text-gray-800 text-base sm:text-lg">
                {t.name}
              </div>
              <div className="text-xs sm:text-sm text-gray-400">{t.country}</div>
            </blockquote>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ✅ Inline responsive Swiper arrow styling */}
      <style>
        {`
          .swiper-button-next,
          .swiper-button-prev {
            color: #1d4ed8;
            background: white;
            border-radius: 9999px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            width: 2rem;
            height: 2rem;
            transition: all 0.3s ease;
          }

          .swiper-button-next::after,
          .swiper-button-prev::after {
            font-size: 1rem;
            font-weight: bold;
          }

          .swiper-button-next:hover,
          .swiper-button-prev:hover {
            background: #1d4ed8;
            color: white;
            transform: scale(1.1);
          }

          @media (min-width: 768px) {
            .swiper-button-next,
            .swiper-button-prev {
              width: 2.5rem;
              height: 2.5rem;
            }

            .swiper-button-next::after,
            .swiper-button-prev::after {
              font-size: 1.25rem;
            }
          }

          @media (min-width: 1024px) {
            .swiper-button-next,
            .swiper-button-prev {
              width: 3rem;
              height: 3rem;
            }

            .swiper-button-next::after,
            .swiper-button-prev::after {
              font-size: 1.5rem;
            }
          }

          .swiper-button-next {
            right: 5px;
          }

          .swiper-button-prev {
            left: 5px;
          }

          @media (min-width: 768px) {
            .swiper-button-next {
              right: 15px;
            }
            .swiper-button-prev {
              left: 15px;
            }
          }
        `}
      </style>
    </section>
  );
}
