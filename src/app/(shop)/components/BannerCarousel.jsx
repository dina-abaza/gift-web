"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./BannerCarousel.module.css";
import Image from "next/image";

export default function BannerCarousel() {
  const slides = useMemo(
    () => [
      {
        src: "/بانر.jpg",
        brand: "هدايا راقية",
        title: "قصّة تُهدى",
        subtitle:
          "اختيارات فاخرة تليق بالمناسبات الخاصة وتعكس ذوقكم الرفيع",
      },
      {
        src: "/بانر2.jpg",
        brand: "إكسسوارات الهدايا",
        title: "لحظات لا تُنسى",
        subtitle:
          "صُنعت بعناية لتصبح تذكارًا مميزًا لكل من تحب",
      },
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
  const next = () => goTo((index + 1) % slides.length);
  const prev = () => goTo((index - 1 + slides.length) % slides.length);

  return (
    <section
      className={`${styles.carouselRoot} relative mx-auto mt-4 md:mt-6`}
      style={{
        height: "min(70vh, 620px)",
      }}
      aria-label="بانر عروض وهدايا المتجر"
      onMouseEnter={stopAutoPlay}
      onMouseLeave={startAutoPlay}
    >
      {slides.map((s, i) => (
        <div
          key={s.src}
          className={`${styles.slide} ${i === index ? styles.slideActive : ""}`}
        >
          <div style={{ position: "absolute", inset: 0 }}>
            <Image
              src={s.src}
              alt={s.title}
              fill
              priority={i === 0}
              fetchPriority={i === 0 ? "high" : "auto"}
              sizes="(max-width: 768px) 100vw, 100vw"
              className={styles.slideImg}
            />
          </div>

          <div className={styles.overlay}>
            <div className={styles.contentWrap}>
              <span className={`${styles.brandTag} text-xs md:text-sm uppercase tracking-widest`}>
                {s.brand}
              </span>
              <h2 className={styles.title3D}>
                <span className={styles.titleInner}>{s.title}</span>
              </h2>
              <p className={`${styles.subtitle}`}>
                {s.subtitle}
              </p>
            </div>
          </div>
        </div>
      ))}

      <button
        className={`${styles.arrow} ${styles.left}`}
        onClick={prev}
        aria-label="السابق"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M15 6l-6 6 6 6" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <button
        className={`${styles.arrow} ${styles.right}`}
        onClick={next}
        aria-label="التالي"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M9 6l6 6-6 6" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div className={styles.controls} role="tablist" aria-label="الشرائح">
        {slides.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === index}
            aria-label={`ذهاب إلى الشريحة ${i + 1}`}
            className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </section>
  );
}
