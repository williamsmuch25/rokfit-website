import what from "../assets/WhatsApp Image 2026-01-22 at 12.27.39.jpeg";
import { Link } from "react-router-dom";
import tght from "../assets/WhatsApp Image 2026-01-22 at 12.33.39.jpeg";

const Hero = () => {
  return (
    <section className="relative bg-black text-white overflow-hidden min-h-[85vh]">
      {/* BACKGROUND GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-orange-600/30 z-10" />

      {/* IMAGE RIGHT */}
      <div className="absolute top-0 right-0 h-full w-1/2 z-0">
        <img
          src={what}
          alt="ROKFit Gym Gear"
          className="h-full w-full object-cover"
        />
      </div>

      {/* CONTENT */}
      <div className="relative z-20 max-w-6xl mx-auto px-6 py-24">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Train Hard.
            <br />
            <span className="text-orange-500">Lift Smarter.</span>
          </h1>

          <p className="mt-6 text-gray-300">
            Premium gym gear built for real training.
          </p>

          <Link
            to="#collections"
            className="inline-block mt-8 bg-orange-500 text-black px-8 py-4 rounded-full font-semibold hover:bg-orange-400 transition"
          >
            Browse Collections
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
