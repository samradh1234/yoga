import React from "react";
import bg from "./assets/yoga4.jpg"; // ✅ yoga4.jpg inside src/assets

export default function Contact() {
  return (
    <section
      className="relative py-20"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>

      {/* Foreground */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-14 tracking-wide drop-shadow-lg">
          Get in Touch
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-gradient-to-br from-yellow-800 via-yellow-700 to-yellow-600 rounded-2xl shadow-2xl p-8 text-white border border-yellow-500/40">
            <h3 className="text-2xl font-semibold mb-6 text-center">
              Send Us a Message
            </h3>
            <form className="space-y-5">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-300 border border-yellow-500/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-300 border border-yellow-500/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
              <textarea
                placeholder="Your Message"
                rows={5}
                className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-300 border border-yellow-500/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-400 transition-all shadow-md"
              >
                ✉ Send Message
              </button>
            </form>
          </div>

          {/* Location */}
          <div className="bg-gradient-to-br from-yellow-800 via-yellow-700 to-yellow-600 rounded-2xl shadow-2xl p-8 text-white border border-yellow-500/40 flex flex-col justify-center">
            <h3 className="text-2xl font-semibold mb-4 text-center">
              Our Location
            </h3>
            <p className="text-yellow-100 mb-6 text-center">
              Near KPT Junction, Mangalore
            </p>
            <div className="w-full rounded-xl overflow-hidden border border-yellow-400 shadow-md">
              <iframe
                title="KPT Auditorium Location Map"
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d811.5251804741699!2d74.85475093386657!3d12.892030829879943!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba35b2ce9a0bed7%3A0xa2af67194e5f1e4e!2sKPT%20Auditorium!5e1!3m2!1sen!2sin!4v1754644864570!5m2!1sen!2sin"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a
              href="https://maps.app.goo.gl/dWeur6qYVBGrPY1E7"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white font-medium rounded-lg text-center shadow-md transition-all"
            >
              📍 Get Directions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
