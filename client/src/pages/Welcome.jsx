import React, { useState } from "react";
import { Network, Store, ShoppingCart, Book } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const WelcomePage = () => {
  const navigate = useNavigate();

  // Navigation buttons with routes
  const navigationButtons = [
    {
      label: "Networking",
      icon: <Network size={20} />,
      route: "/network",
    },
    {
      label: "Sell Products",
      icon: <Store size={20} />,
      route: "/sell",
    },
    {
      label: "Buy Products",
      icon: <ShoppingCart size={20} />,
      route: "/products",
    },
    {
      label: "Take Courses",
      icon: <Book size={20} />,
      route: "/courses",
    },
  ];

  return (
    <div className="relative min-h-screen bg-gray-50 font-noto-nastaliq">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source
          src="/bgvid1.mp4" // Replace with the path to your video
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Overlay Content */}
      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[80vh]">
          {/* Title */}
          <h1 className="text-5xl font-bold text-white mb-8 text-center">
            Empowering Rural Women Entrepreneurs
          </h1>

          {/* Navigation Buttons */}
          <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
            {navigationButtons.map((button) => (
              <button
                key={button.label}
                onClick={() => navigate(button.route)}
                className="bg-white/70 text-indigo-700 px-6 py-4 rounded-lg flex items-center justify-center space-x-3
                shadow-lg hover:bg-indigo-50 hover:text-indigo-800 transition-colors backdrop-blur-md"
              >
                {button.icon}
                <span className="font-semibold">{button.label}</span>
              </button>
            ))}
          </div>
        </main>
      </div>

      {/* Overlay to Darken Video */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-0"></div>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-100 py-7">
        <div className="container mx-auto text-center">
          <p className="text-gray-600">
            © 2024 امید | Umeed. Empowering Rural Women Entrepreneurs
          </p>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;
