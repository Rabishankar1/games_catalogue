"use client";
import SearchBar from "./SearchBar";
import { useLobbyStore } from "@/store/lobbyStore";
import HomeCategoryList from "./HomeCategoryList";
import { categoryTypes, sortTypes } from "@/types";
import HomeProvidersList from "./HomeProvidersList";
import { useDebounce } from "use-debounce";
import { useEffect } from "react";
const Home = () => {
  const {
    searchQuery,
    expandedCategory,
    expandedVendor,
    expandedSort,
    initializeFromStorage,
  } = useLobbyStore();
  useEffect(() => {
    initializeFromStorage();
  }, []);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  return (
    <div>
      <SearchBar />
      {debouncedSearchQuery ? (
        <HomeCategoryList
          key={`search-${expandedCategory || "all"}`}
          category={expandedCategory}
          vendor={expandedVendor}
          sort={expandedSort}
          searchOnly
          searchQuery={debouncedSearchQuery}
        />
      ) : expandedCategory ? (
        <HomeCategoryList category={expandedCategory} />
      ) : expandedVendor ? (
        <HomeCategoryList vendor={expandedVendor} />
      ) : expandedSort ? (
        <HomeCategoryList sort={expandedSort} />
      ) : (
        <>
          {(
            [
              "featuredPriority",
              "name",
              "createdAt",
              "popularity",
              "theoreticalPayOut",
            ] as sortTypes[]
          ).map((sortType) => (
            <HomeCategoryList key={sortType} sort={sortType} />
          ))}
          <HomeCategoryList vendor={"JackpotOriginal"} />
          <HomeProvidersList />
          {(
            [
              "VIDEOSLOTS",
              "BACCARAT",
              "BLACKJACK",
              "GAMESHOWSLIVEDEALER",
              "CASINO",
            ] as categoryTypes[]
          ).map((category) => (
            <HomeCategoryList category={category} key={category} />
          ))}
        </>
      )}
    </div>
  );
};

export default Home;
