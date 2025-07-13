import { useEffect, useRef, useState } from "react";
import CustomButton from "./customButton";
import clsx from "clsx";

const DropDown = ({
  buttonText,
  items,
  selectedVal,
}: {
  buttonText: string;
  items: {
    id: string | number;
    name: string;
    action: Function;
    val: any;
  }[];
  selectedVal: any;
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);
  return (
    <div className="filter-dropdown" ref={dropdownRef}>
      <CustomButton
        id="dropdownDefaultButton"
        data-dropdown-toggle="dropdown"
        onClick={() => setShowDropdown((prev) => !prev)}
        className="flex items-center"
      >
        {buttonText}
        <svg
          className="w-2.5 h-2.5 ms-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </CustomButton>
      {showDropdown && (
        <div
          id="dropdown"
          className="absolute z-10 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700"
        >
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDefaultButton"
          >
            {items.map(({ id, name, action, val }) => (
              <li
                key={id}
                onClick={() => {
                  setShowDropdown((prev) => !prev);
                  action();
                }}
                className={clsx(
                  "hover:bg-gray-100 dark:hover:bg-gray-600  dark:hover:text-white ",
                  selectedVal === val
                    ? "bg-[#25222d] hover:bg-[#17151c]!  text-[#fff]"
                    : ""
                )}
              >
                <div className="block px-4 py-2 cursor-pointer">{name}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropDown;
