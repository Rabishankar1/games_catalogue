import { useLobbyStore } from "@/store/lobbyStore";
import { fetchGames } from "@/utils/api";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import GameCard from "./GameCard";
import { categoryTypes, Game, sortTypes, vendorTypes } from "@/types";
import Image from "next/image";
import { returnImageUrl, returnSectionName } from "@/utils/helpers";
import styles from "@/styles/Home.module.scss";
import CustomButton from "./ui/customButton";
import clsx from "clsx";
import DropDown from "./ui/dropDown";

const HomeCategoryList = ({
  category,
  vendor,
  sort,
  searchOnly = false,
  searchQuery = "",
}: {
  category?: categoryTypes;
  vendor?: vendorTypes;
  sort?: sortTypes;
  searchOnly?: boolean;
  searchQuery?: string;
}) => {
  const {
    order,
    excludeCategory,
    limit,
    setExpandedVendor,
    setExpandedCategory,
    setExpandedSort,
    expandedCategory,
    expandedVendor,
    expandedSort,
    setLimit,
    setSearchQuery,
    setOrder,
  } = useLobbyStore();
  const {
    data: response,
    isLoading,
    isFetching,
    isFetchingNextPage,
    isError,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: [
      searchOnly ? "search" : "category",
      searchQuery,
      category,
      vendor,
      sort,
      order,
      limit,
    ],
    queryFn: ({ pageParam = 0 }) =>
      fetchGames({
        query: searchQuery,
        limit: limit || 10,
        offset: pageParam * (limit || 10),
        // sort: fixedSort || sort,
        sort,
        order,
        vendor: vendor ? [vendor] : [],
        category,
        excludeCategory,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const hasTotal =
        typeof lastPage.data.total === "number" &&
        typeof lastPage.data.count === "number";

      if (hasTotal) {
        const itemsSoFar = allPages.reduce(
          (sum, page) => sum + page.data.count,
          0
        );
        return itemsSoFar >= lastPage.data.total ? undefined : allPages.length;
      }

      return undefined;
    },
    initialPageParam: 0,
  });

  const isFetchingRef = useRef(false);
  const expandedTotalRef = useRef<number | null>(null);
  const totalFetchedRef = useRef<number>(0);
  const hasNextPageRef = useRef(hasNextPage);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [showLeftBlur, setShowLeftBlur] = useState(false);
  const [showRightBlur, setShowRightBlur] = useState(true);

  const items = response?.pages.flatMap((page) => page.data.items) ?? [];

  useEffect(() => {
    hasNextPageRef.current = hasNextPage;
  }, [hasNextPage]);
  useEffect(() => {
    if (!expandedVendor && !expandedCategory && !expandedSort && !searchOnly) {
      expandedTotalRef.current = null;
      totalFetchedRef.current = 0;
    }
  }, [expandedVendor, expandedCategory, searchOnly]);
  useEffect(() => {
    if (
      (expandedVendor || expandedCategory || expandedSort || searchOnly) &&
      response?.pages?.length &&
      typeof response.pages[0].data.total === "number"
    ) {
      expandedTotalRef.current = response.pages[0].data.total;
    }
    const el = scrollRef.current;
    if (!el) return;
    checkScrollPosition(); // Run once on mount

    el.addEventListener("scroll", checkScrollPosition);
    return () => el.removeEventListener("scroll", checkScrollPosition);
  }, [items, expandedVendor, expandedCategory, expandedSort, searchOnly]);

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
  const checkScrollPosition = () => {
    const el = scrollRef.current;
    if (!el || !hasNextPageRef.current || isFetchingRef.current) return;

    if (!searchOnly && !expandedCategory && !expandedVendor && !expandedSort) {
      const nearEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 5;
      setShowLeftBlur(el.scrollLeft > 0);
      setShowRightBlur(!nearEnd);

      if (nearEnd) {
        isFetchingRef.current = true;
        fetchNextPage().finally(() => {
          isFetchingRef.current = false;
        });
      }
    }

    if (searchOnly || expandedCategory || expandedVendor || expandedSort) {
      const nearBottom =
        el.scrollTop + el.clientHeight >= el.scrollHeight - 100;
      const expandedDone =
        (expandedVendor || expandedCategory || expandedSort) &&
        expandedTotalRef.current !== null &&
        totalFetchedRef.current >= expandedTotalRef.current;

      if (nearBottom && !expandedDone) {
        isFetchingRef.current = true;
        fetchNextPage().finally(() => {
          isFetchingRef.current = false;
        });
      }
    }
  };

  const isEmpty = !items || items.length === 0 || items.every((item) => !item);

  if (searchOnly && !isLoading && isEmpty) {
    return (
      <p className="text-center text-white">
        No games found for "{searchQuery}"
      </p>
    );
  }

  if (isEmpty && (isLoading || isFetching)) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className={styles.loading_dots}></div>
      </div>
    );
  }
  if (isEmpty) {
    return null;
  }

  return (
    <div className="mb-4">
      {(isLoading || (isFetching && items.length === 0)) && (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className={styles.loading_dots}></div>
        </div>
      )}
      {/* {isError && <p>Error loading games.</p>} */}
      <div className="each-category-container">
        <div className="flex  mb-2 w-full justify-between items-center">
          <div className="flex gap-2">
            <Image
              src={returnImageUrl(
                category ||
                  (vendor === "JackpotOriginal" ? "JackpotLogo" : vendor) ||
                  sort ||
                  "All Games"
              )}
              alt="category"
              width={24}
              height={24}
              className="w-6 h-6"
            />
            <div className="font-bold text-xl">
              {returnSectionName(
                expandedVendor ||
                  expandedCategory ||
                  expandedSort ||
                  category ||
                  vendor ||
                  sort ||
                  "All Games"
              )}
            </div>
          </div>
          <div className="flex m-2">
            {(expandedVendor || expandedCategory || expandedSort) && (
              <>
                <DropDown
                  buttonText={"Filter"}
                  items={[
                    {
                      id: "asc",
                      name: "Ascending",
                      action: () => setOrder("asc"),
                      val: "asc",
                    },
                    {
                      id: "desc",
                      name: "Descending",
                      action: () => setOrder("desc"),
                      val: "desc",
                    },
                  ]}
                  selectedVal={order}
                />

                <CustomButton
                  onClick={() => {
                    setExpandedVendor(undefined);
                    setExpandedCategory(undefined);
                    setExpandedSort(undefined);
                    setLimit(10);
                    setSearchQuery("");
                  }}
                >
                  Go Back
                </CustomButton>
              </>
            )}
            {!searchOnly &&
              !expandedCategory &&
              !expandedVendor &&
              !expandedSort && (
                <>
                  <CustomButton
                    onClick={() => {
                      if (category) {
                        setExpandedCategory(category);
                        setLimit(100);
                      } else if (vendor) {
                        setExpandedVendor(vendor);
                        setLimit(100);
                      } else if (sort) {
                        setExpandedSort(sort);
                        setLimit(100);
                      }
                    }}
                  >
                    View All
                  </CustomButton>
                  <CustomButton
                    onClick={() => scroll("left")}
                    className="rounded-r-0"
                  >
                    {!showLeftBlur ? (
                      <img
                        src="prev-disabled.svg"
                        className="text-white w-5 h-5"
                      />
                    ) : (
                      <img
                        src="next.svg"
                        className="text-white w-5 h-5 rotate-180"
                      />
                    )}
                  </CustomButton>
                  <CustomButton
                    onClick={() => scroll("right")}
                    className="rounded-l-0"
                  >
                    {!showRightBlur ? (
                      <img
                        src="prev-disabled.svg"
                        className="text-white w-5 h-5 rotate-180"
                      />
                    ) : (
                      <img src="next.svg" className="text-white w-5 h-5" />
                    )}
                  </CustomButton>
                </>
              )}
          </div>
        </div>
        <div className="scrolling-list relative">
          <div
            className={`flex ${
              searchOnly || expandedCategory || expandedVendor || expandedSort
                ? "flex-wrap justify-center overflow-y-auto max-h-[80vh]"
                : "overflow-x-auto"
            } gap-4 no-scrollbar scroll-smooth`}
            ref={scrollRef}
          >
            {items?.map((game: Game) =>
              game ? <GameCard key={game.slug} game={game} /> : null
            )}
          </div>

          {!searchOnly &&
            !expandedCategory &&
            !expandedVendor &&
            !expandedSort && (
              <>
                {/* Horizontal mode: Right Blur */}
                {hasNextPageRef.current && showRightBlur && (
                  <div className="absolute right-[-2px] top-0 h-full w-10 bg-gradient-to-l from-[#25222D] via-[#1e1e1e]/90 to-transparent pointer-events-none z-10" />
                )}
                {/* Horizontal mode: Left Blur */}
                {showLeftBlur && (
                  <div className="absolute left-[-2px] top-0 h-full w-10 bg-gradient-to-r from-[#25222D] via-[#1e1e1e]/90 to-transparent pointer-events-none z-10" />
                )}
              </>
            )}

          {(searchOnly ||
            expandedCategory ||
            expandedVendor ||
            expandedSort) && (
            <>
              {/* Vertical mode: Top Blur */}
              {showLeftBlur && (
                <div className="absolute top-[-2px] left-0 w-full h-6 bg-gradient-to-b from-[#25222D] via-[#1e1e1e]/90 to-transparent pointer-events-none z-10" />
              )}
              {/* Vertical mode: Bottom Blur */}
              {hasNextPageRef.current && showRightBlur && (
                <div className="absolute bottom-[-2px] left-0 w-full h-6 bg-gradient-to-t from-[#25222D] via-[#1e1e1e]/90 to-transparent pointer-events-none z-10" />
              )}
            </>
          )}

          {!isLoading && (isFetchingRef.current || isFetchingNextPage) && (
            <div
              className={`absolute ${
                searchOnly || expandedCategory || expandedVendor || expandedSort
                  ? "bottom-4 left-1/2 -translate-x-1/2"
                  : "right-0 top-1/2 -translate-y-1/2"
              } z-20`}
            >
              <div className={styles.loading_dots}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeCategoryList;
