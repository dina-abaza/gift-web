"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function BannerCarousel() {
  const slides = useMemo(
    () => [
      { src: "/banner1.jpg", brand: "هدايا راقية", title: "قصّة تُهدى", subtitle: "اختيارات فاخرة تليق بالمناسبات الخاصة وتعكس ذوقكم الرفيع" },
      { src: "/banner2.jpg", brand: "إكسسوارات الهدايا", title: "لحظات لا تُنسى", subtitle: "صُنعت بعناية لتصبح تذكارًا مميزًا لكل من تحب" },
      { src: "/banner3.jpg", brand: "عروض đặc biệt", title: "سعر مناسب", subtitle: "احصل على أفضل العروض وخصومات على هداياك المفضلة" },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  const stopAutoPlay = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };
  const startAutoPlay = () => {
    stopAutoPlay();
    timerRef.current = setTimeout(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
  };

  useEffect(() => {
    startAutoPlay();
    return stopAutoPlay;
  }, [index]);

  const goTo = (i) => {
    stopAutoPlay();
    setIndex(i);
  };

 

  return (
    <section className="relative mx-auto mt-4 md:mt-6 overflow-hidden rounded-2xl" style={{ height: "min(70vh, 620px)" }}>
      {/* Stack all slides */}
      {slides.map((slide, i) => (
        <motion.div
          key={slide.src}
          initial={{ opacity: 0 }}
          animate={{ opacity: i === index ? 1 : 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image src={slide.src} alt={slide.title} fill className="object-cover" priority={i===0} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex items-center">
            <div className="container mx-auto px-6 md:px-12 max-w-7xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: i === index ? 1 : 0, y: i === index ? 0 : 20 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              >
                <span className="inline-block text-xs md:text-sm uppercase tracking-widest text-white mb-4 bg-amber-500/20 backdrop-blur-sm px-4 py-1 rounded-full">{slide.brand}</span>
                <h2 className="text-[clamp(2rem,5vw,4rem)] font-bold text-white mb-4 leading-tight">{slide.title}</h2>
                <p className="text-[clamp(1rem,2vw,1.25rem)] text-gray-100 max-w-2xl">{slide.subtitle}</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      ))}


      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3" suppressHydrationWarning>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-500 ease-out h-3 rounded-full ${i===index ? 'w-12 bg-white':'w-3 bg-white/50 hover:bg-white/80'}`}
            aria-label={`اذهب إلى الشريحة ${i+1}`}
            suppressHydrationWarning
          />
        ))}
      </div>
    </section>
  );
}
