// src/components/auth/AuthHero.jsx

import Logo from "../../assets/Logo.png";
import HeroImage from "../../assets/Hero.png";
import HeroMobile from "../../assets/HeroMobile.png";
import HeroTablet from "../../assets/HeroTablet.png";

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
        pt-12
        md:pt-16
        pb-[180px]
        md:pb-[200px]
        lg:px-10
        lg:py-8
      "
    >
      {/* Background Glow */}
      {/* Background Glow - Mobile/Tablet */}
      <div
        className="
          absolute
          top-[-10%]
          left-[-10%]
          w-[120%]
          h-[120%]
          rounded-full
          bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]
          from-violet-300/40
          via-transparent
          to-transparent
          blur-[100px]
          animate-mesh-breathe
          z-0
          lg:hidden
        "
      />
      {/* Background Glow - Desktop */}
      <div
        className="
          hidden lg:block
          absolute
          top-0
          left-0
          w-[700px]
          h-[700px]
          rounded-full
          bg-violet-300/20
          blur-[180px]
          animate-mesh-breathe
          z-0
        "
      />

      {/* Decorative Star */}
      <div
        className="
          absolute
          top-16
          right-8
          md:top-24
          md:right-24
          lg:top-32
          lg:right-56
          text-violet-400/60
          lg:text-white
          text-3xl
          md:text-5xl
          lg:text-4xl
          animate-pulse
          lg:animate-none
        "
      >
        ✦
      </div>


      {/* Content */}
      <div className="relative z-10 w-full flex-1 flex flex-col items-center lg:items-start text-center lg:text-left px-6 md:px-12 lg:px-0">
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
            md:text-6xl
            lg:text-5xl
            font-bold
            leading-[1.1]
            lg:leading-[1.05]
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
            mt-4
            lg:mt-3
            text-lg
            md:text-xl
            lg:text-lg
            leading-relaxed
            text-slate-600
            max-w-xl
            md:max-w-2xl
            lg:max-w-xl
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

      {/* Hero Image - Responsive setup for mobile, tablet, and desktop */}
      <div className="relative w-full flex-1 flex items-center justify-center lg:block mt-8 md:mt-12 lg:mt-0 z-10 animate-float lg:animate-none px-6 lg:px-0">
        {/* Mobile & Tablet image glow */}
        <div className="absolute inset-0 bg-violet-400/20 blur-3xl rounded-full lg:hidden scale-[0.8] md:scale-[0.9]" />
        
        {/* Mobile Image */}
        <img
          src={HeroMobile}
          alt="Travel Group Mobile"
          className="
            block md:hidden
            w-full
            object-cover
            pointer-events-none
            select-none
            mx-auto
            drop-shadow-[0_20px_50px_rgba(124,58,237,0.3)]
            animate-fade-in-up
            delay-300
            rounded-3xl
          "
        />

        {/* Tablet Image */}
        <img
          src={HeroTablet}
          alt="Travel Group Tablet"
          className="
            hidden md:block lg:hidden
            w-full
            max-w-3xl
            object-cover
            pointer-events-none
            select-none
            mx-auto
            drop-shadow-[0_20px_50px_rgba(124,58,237,0.3)]
            animate-fade-in-up
            delay-300
            rounded-3xl
          "
        />

      </div>

      {/* Desktop Image */}
      <img
        src={HeroImage}
        alt="Travel Group"
        className="
          hidden lg:block
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
          opacity-100
          mx-auto
          animate-fade-in-up
          delay-300
        "
      />
    </div>
  );
};

export default AuthHero;