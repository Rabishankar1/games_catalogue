import { useLobbyStore } from "@/store/lobbyStore";
import styles from "@/styles/SearchBar.module.scss";
import clsx from "clsx";
import Image from "next/image";
import DropDown from "./ui/dropDown";

export default function SearchBar() {
  const {
    searchQuery,
    setSearchQuery,
    setOrder,
    order,
    expandedCategory,
    expandedVendor,
    expandedSort,
  } = useLobbyStore();
  return (
    <div className="flex gap-2 items-center mb-4">
      <div
        className={clsx(
          styles.searchBar,
          "relative flex-1",
          "sticky top-20 bg-[#25222d] z-99"
        )}
      >
        <Image
          src="/search.svg"
          alt="search"
          height={16}
          width={16}
          className="absolute left-4 top-1/2 -translate-y-1/2"
        />
        <input
          type="text"
          placeholder="Search a game..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10!"
        />
      </div>
      {!expandedCategory && !expandedVendor && !expandedSort && (
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
      )}
    </div>
  );
}
