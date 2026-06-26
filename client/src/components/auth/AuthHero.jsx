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
        flex
        flex-col
        lg:flex-row
        relative
        h-full
        flex-1
        lg:min-h-screen
        overflow-hidden
        bg-gradient-to-br
        from-violet-100
        via-white
        to-orange-50
        px-6
        lg:px-10
        py-8
        lg:py-8
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
          animate-mesh-breathe
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

      {/* Hero Image */}
      <img
        src={HeroImage}
        alt="Travel Group"
        className="
          relative
          lg:absolute
          mt-4
          lg:mt-0
          mb-6
          lg:mb-0
          lg:bottom-[-140px]
          lg:left-1/2
          lg:-translate-x-1/2
          w-full
          lg:w-[105%]
          max-w-md
          lg:max-w-5xl
          object-contain
          pointer-events-none
          select-none
          z-0
          opacity-100
          mx-auto
          animate-fade-in-up
          delay-300
        "
      />

      {/* Content */}
      <div className="relative z-10 w-full flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
        {/* Logo */}
        <div className="flex items-center gap-4 mb-6 animate-fade-in-up">
          <img
            src={Logo}
            alt="Triply"
            className="w-14 h-14 object-contain drop-shadow-xl"
          />

          <h1 className="text-3xl font-bold text-slate-900 drop-shadow-sm">
            Triply
          </h1>
        </div>

        <h2
          className="
            text-4xl
            lg:text-5xl
            font-bold
            leading-[1.05]
            text-slate-900
            max-w-3xl
            animate-fade-in-up
            delay-100
          "
        >
          Split expenses.
          <br />

          <span className="text-violet-600 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-purple-500">
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
            animate-fade-in-up
            delay-200
          "
        >
          Track every rupee on your group trips
          without awkward money conversations.
        </p>

        {/* Features */}
        <div className="mt-6 hidden lg:block space-y-3">
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

      {/* Hero Image - Absolute on desktop, but rendered right after text in DOM (Wait, if it's absolute, it doesn't matter where it is. But on mobile we want it at the top). Let's put it at the very top of the parent div. */}
    </div>
  );
};

export default AuthHero;