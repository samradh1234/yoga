import React, { useState } from "react";

export default function Classes() {
  const yogaClasses = [
    {
      title: "Hatha Yoga",
      level: "Beginner",
      schedule: "Wednesday • 3:00 PM - 5:00 PM",
      desc: "Traditional yoga focusing on basic asanas and breathing.",
    },
    {
      title: "Vinyasa Flow",
      level: "Intermediate",
      schedule: "Wednesday • 3:00 PM - 5:00 PM",
      desc: "Dynamic flow connecting movement with breath.",
    },
    {
      title: "Ashtanga Yoga",
      level: "Advanced",
      schedule: "Wednesday • 3:00 PM - 5:00 PM",
      desc: "Intense and structured sequence of powerful asanas.",
    },
    {
      title: "Meditation & Pranayama",
      level: "All Levels",
      schedule: "Wednesday • 3:00 PM - 5:00 PM",
      desc: "Mindfulness, breathing techniques, and relaxation.",
    },
    {
      title: "Surya Namaskar Practice",
      level: "Beginner",
      schedule: "Wednesday • 3:00 PM - 5:00 PM",
      desc: "Sequence of 12 poses to energize body and mind.",
    },
    {
      title: "Yin Yoga",
      level: "All Levels",
      schedule: "Wednesday • 3:00 PM - 5:00 PM",
      desc: "Slow-paced yoga focusing on deep connective tissue.",
    },
    {
      title: "Restorative Yoga",
      level: "Beginner",
      schedule: "Wednesday • 3:00 PM - 5:00 PM",
      desc: "Gentle poses supported by props for relaxation.",
    },
    {
      title: "Power Yoga",
      level: "Intermediate",
      schedule: "Wednesday • 3:00 PM - 5:00 PM",
      desc: "Energetic yoga style combining cardio and strength.",
    },
    {
      title: "Iyengar Yoga",
      level: "All Levels",
      schedule: "Wednesday • 3:00 PM - 5:00 PM",
      desc: "Focus on alignment and precision with props.",
    },
  ];

  const [search, setSearch] = useState("");

  // Filter classes based on search
  const filteredClasses = yogaClasses.filter((cls) =>
    cls.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="relative w-full min-h-screen bg-gradient-to-b from-white to-[#fdf6e3] dark:from-[#1a1209] dark:to-[#2a1d12] py-16 px-6">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold text-[#b8860b] dark:text-yellow-500 mb-4">
          Yoga Club Classes
        </h2>
        <p className="text-[#a0522d] dark:text-yellow-400 max-w-2xl mx-auto">
          Explore our weekly classes and join to deepen your yoga journey.
        </p>

        {/* Search Bar */}
        <div className="mt-6 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search classes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 rounded-lg border border-[#deb887] dark:border-yellow-700 dark:bg-[#1a1209] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#b8860b] dark:focus:ring-yellow-500"
          />
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {filteredClasses.map((cls, i) => (
          <div
            key={i}
            className="bg-white dark:bg-[#2c1f11] rounded-2xl shadow-lg overflow-hidden border border-[#deb887] dark:border-yellow-800 hover:scale-105 transition-transform duration-300"
          >
            <div className="p-6 text-left">
              <h3 className="text-2xl font-bold text-[#b8860b] dark:text-yellow-500 mb-2">
                {cls.title}
              </h3>
              <p className="text-[#3e2f1c] dark:text-gray-300 mb-3">{cls.desc}</p>
              <p className="text-sm text-[#a0522d] dark:text-yellow-400 font-semibold">
                ⏰ {cls.schedule}
              </p>
              <p className="text-sm text-[#a0522d] dark:text-yellow-400 italic">
                📌 {cls.level}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
