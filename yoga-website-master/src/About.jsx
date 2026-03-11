import React from "react";

export default function About() {
  return (
    <section className="relative w-full min-h-screen bg-white dark:bg-[#1a1209] text-gray-900 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-12">
      <div className="relative max-w-6xl mx-auto text-center mb-12">
        {/* Club Name & Tagline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#b8860b] dark:text-yellow-500 mb-4">
          KPT Yoga Club
        </h1>
        <p className="text-base sm:text-lg italic text-gray-600 dark:text-gray-400">
          "Harmony of Mind, Body, and Spirit"
        </p>
      </div>

      {/* Vision & Mission */}
      <div className="relative grid sm:grid-cols-2 gap-6 sm:gap-10 max-w-5xl mx-auto mb-16">
        <div className="bg-gradient-to-br from-[#fff8dc] to-[#f5deb3] dark:from-[#2a1d12] dark:to-[#3e2b1b] rounded-2xl shadow-lg p-8 border border-[#b8860b] dark:border-yellow-700 text-[#3e2f1c] dark:text-gray-300">
          <h2 className="text-xl sm:text-2xl font-semibold text-[#a0522d] mb-3">
            🌿 Vision
          </h2>
          <p>
            To inspire students and faculty to embrace yoga as a way of life,
            fostering holistic wellness and inner peace within our college
            community.
          </p>
        </div>
        <div className="bg-gradient-to-br from-[#fff8dc] to-[#f5deb3] dark:from-[#2a1d12] dark:to-[#3e2b1b] rounded-2xl shadow-lg p-8 border border-[#b8860b] dark:border-yellow-700 text-[#3e2f1c] dark:text-gray-300">
          <h2 className="text-xl sm:text-2xl font-semibold text-[#a0522d] mb-3">
            ☀️ Mission
          </h2>
          <p>
            To provide accessible yoga sessions, workshops, and wellness events
            that nurture both physical health and mental clarity for all
            members.
          </p>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="relative max-w-3xl mx-auto text-center mb-16">
        <div className="bg-gradient-to-br from-[#fff8dc] to-[#f5deb3] rounded-2xl shadow-lg p-8 border border-[#b8860b]">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#b8860b] mb-6">
            🗓 Weekly Schedule
          </h2>
          <p className="text-base sm:text-lg mb-4 text-[#3e2f1c]">
            Every <span className="font-semibold">Wednesday</span> <br />
            <span className="text-[#a0522d]">3:00 PM – 5:00 PM</span>
          </p>
          <p className="italic text-xs sm:text-sm text-gray-700">
            Sessions include Asanas, Meditation, and Wellness Practices
          </p>
        </div>
      </div>

      {/* Instructors */}
      <div className="relative max-w-5xl mx-auto mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#b8860b] mb-8">
          👩‍🏫 Our Co-Ordinators
        </h2>
        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
          <div className="bg-gradient-to-br from-[#fff8dc] to-[#f5deb3] dark:from-[#2a1d12] dark:to-[#3e2b1b] p-8 rounded-xl shadow-md border border-[#b8860b] dark:border-yellow-700 text-center text-[#3e2f1c] dark:text-gray-300">
            <img
              src="/images/01.jpg"
              alt="Jyothi"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full mx-auto mb-4 object-cover border-4 border-[#deb887]"
            />
            <h3 className="text-lg sm:text-xl font-semibold text-[#a0522d]">
              Jyothi
            </h3>
            <p className="text-sm text-[#6b4226]">Yoga Co-Ordinator</p>
          </div>
          <div className="bg-gradient-to-br from-[#fff8dc] to-[#f5deb3] dark:from-[#2a1d12] dark:to-[#3e2b1b] p-8 rounded-xl shadow-md border border-[#b8860b] dark:border-yellow-700 text-center text-[#3e2f1c] dark:text-gray-300">
            <img
              src="/images/04.jpg"
              alt="Devaraj"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full mx-auto mb-4 object-cover border-4 border-[#deb887]"
            />
            <h3 className="text-lg sm:text-xl font-semibold text-[#a0522d]">
              Devaraj
            </h3>
            <p className="text-sm text-[#6b4226]">
              Yoga Co-Ordinator            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="relative max-w-6xl mx-auto text-center mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#b8860b] mb-8">
          🌟 Club Features
        </h2>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 text-left">
          {[
            "🧘 All Asanas Practice Sessions",
            "🌱 Stress Relief & Meditation ",
            "🎉 Cultural & Wellness Events",
            "📚 Student Wellness Programs",
            "🤝 Health Service Through Yoga",
          ].map((feature, index) => (
            <li
              key={index}
              className="bg-gradient-to-br from-[#fff8dc] to-[#f5deb3] dark:from-[#2a1d12] dark:to-[#3e2b1b] p-6 rounded-lg shadow border border-[#b8860b] dark:border-yellow-700 text-[#3e2f1c] dark:text-gray-300"
            >
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Facilities */}
      <div className="relative max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-br from-[#fff8dc] to-[#f5deb3] p-8 rounded-2xl shadow-lg border border-[#b8860b]">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#b8860b] mb-6">
            🏛 Facilities
          </h2>
          <p className="text-sm sm:text-base text-gray-700">
            All yoga sessions and events are conducted in the{" "}
            <span className="font-semibold text-[#a0522d]">
              College Auditorium
            </span>
            , a spacious and peaceful environment perfect for group wellness
            activities.
          </p>
        </div>
      </div>
    </section>
  );
}
