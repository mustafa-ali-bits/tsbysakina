'use client';

import React, { useState, useEffect, useCallback } from 'react';
import NextImage from 'next/image';
import { Promotion } from '@/types/promotion';

interface HeroSectionProps {
  promotions: Promotion[];
}

const HeroSection: React.FC<HeroSectionProps> = ({ promotions }) => {
  // Filter promotions that should show on site and have images
  const displayPromotions = promotions.filter(p => p.showOnSite && p.imageUrl);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [verifiedImages, setVerifiedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Preload and verify images ONCE on mount - no retries
  useEffect(() => {
    if (displayPromotions.length === 0) {
      setIsLoading(false);
      return;
    }

    const verifyImages = async () => {
      const working: string[] = [];

      // Check each image once with a timeout
      await Promise.all(
        displayPromotions.map(async (promo) => {
          try {
            const img = new Image();
            const loaded = await new Promise<boolean>((resolve) => {
              const timeout = setTimeout(() => resolve(false), 3000); // 3s timeout
              img.onload = () => {
                clearTimeout(timeout);
                resolve(true);
              };
              img.onerror = () => {
                clearTimeout(timeout);
                resolve(false);
              };
              img.src = promo.imageUrl;
            });

            if (loaded) {
              working.push(promo.imageUrl);
            }
          } catch {
            // Failed - don't add to working list
          }
        })
      );

      setVerifiedImages(working);
      setIsLoading(false);
    };

    verifyImages();
  }, []); // Only run once on mount

  // Get promotions with verified images
  const workingPromotions = displayPromotions.filter(p => verifiedImages.includes(p.imageUrl));

  // Auto-rotate carousel every 2.5 seconds
  useEffect(() => {
    if (workingPromotions.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % workingPromotions.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [workingPromotions.length]);

  // Get current promotion or null
  const currentPromotion = workingPromotions[currentIndex] || null;

  // Collect all descriptions for marquee (only from working promotions)
  const descriptions = workingPromotions
    .filter(p => p.description)
    .map(p => p.description);

  return (
    <section className="relative bg-gradient-to-br from-stone-100 via-amber-50 to-stone-100 py-16 overflow-hidden">
      {/* Running text marquee for descriptions */}
      {descriptions.length > 0 && (
        <div className="absolute top-0 left-0 right-0 bg-amber-900 text-white py-2 overflow-hidden">
          <div className="marquee-container">
            <div className="marquee-content">
              {descriptions.map((desc, i) => (
                <span key={i} className="mx-8 inline-block">
                  🎉 {desc}
                </span>
              ))}
              {/* Duplicate for seamless loop */}
              {descriptions.map((desc, i) => (
                <span key={`dup-${i}`} className="mx-8 inline-block">
                  🎉 {desc}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className={`max-w-7xl mx-auto px-4 ${descriptions.length > 0 ? 'pt-8' : ''}`}>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-amber-900 leading-tight">
              Chocolates <br />Brownies<br />Cookies
            </h2>
            <p className="text-lg text-stone-700 leading-relaxed">
              Handcrafted chocolates, brownies & cookies made fresh with premium ingredients and lots of love.
            </p>
            <button
              onClick={() => {
                const element = document.getElementById('product-1');
                if (element) {
                  element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                  });
                }
              }}
              className="bg-amber-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-amber-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Explore Collection
            </button>
          </div>

          {/* Image Section - Carousel or Default */}
          <div className="relative">
            <div className="bg-transparent transform hover:scale-105 transition-transform duration-300">
              {isLoading ? (
                // Show logo while checking images
                <div className="relative aspect-square w-full">
                  <NextImage
                    src="/logo.jpeg"
                    alt="The Sweet Tooth by Sakina Logo"
                    fill
                    className="object-contain drop-shadow-2xl rounded-2xl"
                  />
                </div>
              ) : currentPromotion ? (
                <div className="relative aspect-video md:aspect-square w-full">
                  <NextImage
                    src={currentPromotion.imageUrl}
                    alt={currentPromotion.description || 'Promotion'}
                    fill
                    className="object-cover drop-shadow-2xl rounded-2xl transition-opacity duration-500"
                  />
                </div>
              ) : (
                <div className="relative aspect-square w-full">
                  <NextImage
                    src="/logo.jpeg"
                    alt="The Sweet Tooth by Sakina Logo"
                    fill
                    className="object-contain drop-shadow-2xl rounded-2xl"
                  />
                </div>
              )}
            </div>

            {/* Carousel indicators */}
            {workingPromotions.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {workingPromotions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                      ? 'bg-amber-900 w-4'
                      : 'bg-amber-300 hover:bg-amber-400'
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="absolute top-10 right-10 w-32 h-32 bg-amber-200 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-stone-300 rounded-full blur-3xl opacity-20"></div>

      {/* Marquee styles */}
      <style jsx>{`
        .marquee-container {
          display: flex;
          overflow: hidden;
        }
        .marquee-content {
          display: flex;
          animation: marquee 20s linear infinite;
          white-space: nowrap;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
