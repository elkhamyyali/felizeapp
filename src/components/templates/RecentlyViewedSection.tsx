"use client";

import React, { useRef } from "react";
import Slider from "react-slick";
import { useRecentlyViewed } from "@/contexts/recently-viewed-context";
import Image from "next/image";
import Link from "next/link";
import { Luggage, MapPin, Heart } from "lucide-react";
import { useWishlist } from "@/contexts/wishlist-context";
import { useRouter } from "next/router";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const RecentlyViewedSection = () => {
  const router = useRouter();
  const cardRef = useRef<Slider>(null);
  const startPos = useRef<{ x: number; y: number } | null>(null);

  const { recentlyViewed } = useRecentlyViewed();
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (recentlyViewed.length === 0) {
    return null;
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    startPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (startPos.current) {
      const dx = Math.abs(e.clientX - startPos.current.x);
      const dy = Math.abs(e.clientY - startPos.current.y);

      if (dx < 5 && dy < 5) {
        const target = e.target as HTMLElement;
        if (!target.closest("button")) {
          const item =
            recentlyViewed[
              parseInt(
                target.closest("[data-index]")?.getAttribute("data-index") ||
                  "0"
              )
            ];
          router.push(
            `/${
              item.type === "tour_package" ? "top-packages" : "top-excursions"
            }/${item.id}`
          );
        }
      }
      startPos.current = null;
    }
  };

  const handleWishlistClick = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(item);
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    rtl: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, recentlyViewed.length),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white">
      <div className="">
        <div className="text-left mb-4 text-black font-segoe sm:font-semi-bold font-medium text-2xl md:text-special-offer ">
          Recently Viewed
        </div>
        <div className="relative -mx-4">
          <Slider {...settings} className="slick-carousel" ref={cardRef}>
            {recentlyViewed.map((item, index) => (
              <div key={item.id} className="px-2 pb-4" data-index={index}>
                <div
                  className="bg-white rounded-2xl cursor-pointer overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full"
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                >
                  <div className="relative">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={item.image || item.main_image?.url}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>

                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={(e) => handleWishlistClick(e, item)}
                        className="p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200 shadow-lg"
                        aria-label={
                          isInWishlist(item.id)
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            isInWishlist(item.id)
                              ? "fill-red-500 text-red-500"
                              : "text-gray-700"
                          }`}
                        />
                      </button>
                    </div>

                    {item.isFeatured && (
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-600 text-white shadow-lg">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-2">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate font-medium">
                        {item.location || item.destination}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {item.title}
                    </h3>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Luggage className="h-4 w-4" />
                        <span>Age: {item.ageRange || item.age_range}</span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          {item.isOnSale && (
                            <div className="text-sm">
                              <span className="line-through text-gray-400">
                                ${(item.price || item.min_price) + 20}
                              </span>
                            </div>
                          )}
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-blue-600">
                              ${item.price || item.min_price}
                            </span>
                            <span className="text-sm text-gray-600">
                              / person
                            </span>
                          </div>
                        </div>
                        <Link
                          href={`/${
                            item.type === "tour_package"
                              ? "top-packages"
                              : "top-excursions"
                          }/${item.id}`}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewedSection;
