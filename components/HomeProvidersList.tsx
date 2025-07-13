import { useEffect, useRef, useState } from "react";
import { vendorTypes } from "@/types";
import Image from "next/image";
import { returnImageUrl } from "@/utils/helpers";
import styles from "@/styles/Home.module.scss";
import clsx from "clsx";
import { useLobbyStore } from "@/store/lobbyStore";

const HomeProvidersList = () => {
  const [showLeftBlur, setShowLeftBlur] = useState(false);
  const [showRightBlur, setShowRightBlur] = useState(true);
  const { setExpandedVendor, setLimit } = useLobbyStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const items: (vendorTypes | "JackpotOriginal")[] = [
    "EvolutionGaming",
    "PragmaticPlay",
    "Play'nGo",
    "RelaxGaming",
    "JackpotOriginal",
  ];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScrollPosition();

    el.addEventListener("scroll", checkScrollPosition);
    return () => el.removeEventListener("scroll", checkScrollPosition);
  }, [items]);
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
      scrollRef.current.scrollTo({
        left: scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };
  const isFetchingRef = useRef(false);
  const checkScrollPosition = () => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const nearEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 5;

    setShowLeftBlur(el.scrollLeft > 0);
    setShowRightBlur(!nearEnd);
  };

  if (!items || items.length === 0 || items.every((item) => !item)) {
    return null;
  }
  return (
    <div className="mb-4">
      <div className="each-category-container">
        <div className="flex  mb-2 w-full justify-between items-center">
          <div className="flex gap-2">
            <Image
              src={returnImageUrl("providers")}
              alt="category"
              width={24}
              height={24}
              className="w-6 h-6"
            />
            <div className="font-bold text-xl">Providers</div>
          </div>
          <div className="flex m-2">
            <button
              onClick={() => scroll("left")}
              className="p-2 bg-[#2a2a2a] rounded hover:bg-[#444] cursor-pointer"
            >
              {!showLeftBlur ? (
                <img src="prev-disabled.svg" className="text-white w-5 h-5" />
              ) : (
                <img src="next.svg" className="text-white w-5 h-5 rotate-180" />
              )}
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2 bg-[#2a2a2a] rounded hover:bg-[#444] cursor-pointer  "
            >
              {!showRightBlur ? (
                <img
                  src="prev-disabled.svg"
                  className="text-white w-5 h-5 rotate-180"
                />
              ) : (
                <img src="next.svg" className="text-white w-5 h-5" />
              )}
            </button>
          </div>
        </div>
        <div className="scrolling-list relative">
          <div
            className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth"
            ref={scrollRef}
          >
            {items.map((game, i) => (
              <div
                key={game}
                className={clsx(
                  "relative min-w-160px min-h-100px h-100px w-160px",
                  styles.card
                )}
                style={{
                  borderColor:
                    game === "EvolutionGaming"
                      ? "#3f84fa"
                      : game === "PragmaticPlay"
                      ? "#dde36d"
                      : game === "Play'nGo"
                      ? "#f04544"
                      : game === "RelaxGaming"
                      ? "#5c5c5c"
                      : "#106ec6",
                }}
              >
                <Image
                  src={returnImageUrl(game)}
                  alt={game}
                  height={100}
                  width={160}
                  style={{
                    minHeight: 100,
                    minWidth: 160,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setExpandedVendor(game);
                    setLimit(100);
                  }}
                  className="filter transition duration-200 ease-out hover:brightness-60"
                />
              </div>
            ))}
          </div>
          {showRightBlur && (
            <div className="absolute right-[-2px] top-0 h-full w-10 bg-gradient-to-l from-[#25222D] via-[#1e1e1e]/90 to-transparent pointer-events-none z-10" />
          )}

          {showLeftBlur && (
            <div className="absolute left-[-2px] top-0 h-full w-10 bg-gradient-to-r from-[#25222D] via-[#1e1e1e]/90 to-transparent pointer-events-none z-10" />
          )}

          {isFetchingRef.current && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <div className={styles.loading_dots}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeProvidersList;
