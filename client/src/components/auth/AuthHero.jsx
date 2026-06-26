// src/components/auth/AuthHero.jsx

import Logo from "../../assets/Logo.png";
import HeroImage from "../../assets/Hero.png";

import {
  FaMagic,
  FaReceipt,
  FaGlobe,
  FaBolt,
} from "react-icons/fa";

const features = [
  {
    icon: <FaMagic />,
    text: "Auto-optimize settlements with 1 click",
  },
  {
    icon: <FaReceipt />,
    text: "Scan receipts with OCR — no manual entry",
  },
  {
    icon: <FaGlobe />,
    text: "Multi-currency with live exchange rates",
  },
  {
    icon: <FaBolt />,
    text: "Real-time updates simultaneously across devices",
  },
];

const AuthHero = () => {
  return (
    <div
      className="
        hidden
        lg:flex
        relative
        min-h-screen
        overflow-hidden
        bg-gradient-to-br
        from-violet-100
        via-white
        to-orange-50
        px-10
        py-8
      "
    >
      {/* Background Glow */}
      <div
        className="
          absolute
          top-0
          left-0
          w-[700px]
          h-[700px]
          rounded-full
          bg-violet-300/20
          blur-[180px]
        "
      />

      {/* Decorative Star */}
      <div
        className="
          absolute
          top-32
          right-56
          text-white
          text-4xl
        "
      >
        ✦
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">
        {/* Logo */}
        <div className="flex items-center gap-4 mb-6">
          <img
            src={Logo}
            alt="Triply"
            className="w-14 h-14 object-contain"
          />

          <h1 className="text-3xl font-bold text-slate-900">
            Triply
          </h1>
        </div>

        {/* Heading */}
        <h2
          className="
            text-5xl
            font-bold
            leading-[1.05]
            text-slate-900
            max-w-3xl
          "
        >
          Split expenses.
          <br />

          <span className="text-violet-600">
            Not friendships.
          </span>
        </h2>

        {/* Description */}
        <p
          className="
            mt-3
            text-lg
            leading-relaxed
            text-slate-600
            max-w-xl
          "
        >
          Track every rupee on your group trips
          without awkward money conversations.
        </p>

        {/* Features */}
        <div className="mt-6 space-y-3">
          {features.map((item, index) => (
            <div
              key={index}
              className="
                flex
                items-center
                gap-2
                px-4 
                rounded-2xl
                w-fit
                min-w-[400px]
              "
            >
              <div
                className="
                  w-9
                  h-9
                  rounded-xl
                  bg-violet-100
                  flex
                  items-center
                  justify-center
                  text-violet-600
                "
              >
                {item.icon}
              </div>

              <span className="text-sm font-medium text-slate-700">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Image */}
      <img
        src={HeroImage}
        alt="Travel Group"
        className="
          absolute
          bottom-[-140px]
          left-1/2
          -translate-x-1/2
          w-[105%]
          max-w-5xl
          object-contain
          pointer-events-none
          select-none
          z-0
        "
      />

      
    </div>
  );
};

export default AuthHero;