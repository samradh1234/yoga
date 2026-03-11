import React from "react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-[#8B5E3C] to-[#B8860B] text-white px-6 py-10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center md:text-left">
        
        {/* Branding */}
        <div>
          <h2 className="text-2xl font-bold mb-2">KPT Yoga Club</h2>
          <p className="text-sm mb-4">
            A journey towards inner peace, mindfulness, and holistic wellness.
          </p>
          <p className="font-semibold">Contact Us:</p>
          <p>📧 https://gpt.karnataka.gov.in/kptmangalore/public/en</p>
        </div>

        {/* Follow Us */}
        <div>
          <h3 className="font-semibold mb-2">Stay Connected</h3>
          <p className="text-sm mb-4">
            Follow our official pages for updates and inspiration.
          </p>
          <div className="flex justify-center md:justify-start space-x-4 text-xl">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#fff8dc] transition"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#fff8dc] transition"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#fff8dc] transition"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#fff8dc] transition"
            >
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>

        {/* Activities & Wellness Tip */}
        <div>
          <h3 className="font-semibold mb-2">Weekly Activities</h3>
          <ul className="text-sm space-y-1 mb-4">
            <li>🧘 Guided Yoga Sessions</li>
            <li>🌿 Meditation & Mindfulness</li>
            <li>☀️ Sunrise Practice</li>
          </ul>

          <h3 className="font-semibold mb-2">Wellness Tip</h3>
          <p className="text-sm italic">
            “Balance your body, calm your mind, and nurture your soul.”
          </p>
        </div>
      </div>

      {/* Bottom line */}
      <div className="mt-8 text-sm text-center border-t border-white/20 pt-4 text-[#fff8dc]">
        © {year} KPT Yoga Club. All rights reserved.
      </div>
    </footer>
  );
}
