import { categoryTypes, orderTypes, sortTypes, vendorTypes } from "@/types";
import { create } from "zustand";

interface LobbyState {
  searchQuery: string;
  selectedType: string;
  limit?: number;
  offset?: number;
  sort?: sortTypes;
  order?: orderTypes;
  category?: categoryTypes;
  vendor?: vendorTypes[];
  excludeCategory?: categoryTypes[];
  expandedCategory?: categoryTypes;
  expandedVendor?: vendorTypes;
  expandedSort?: sortTypes;
  setSearchQuery: (query: string) => void;
  initializeFromStorage: () => void;
  setExpandedCategory: (category?: categoryTypes) => void;
  setExpandedVendor: (vendor?: vendorTypes) => void;
  setExpandedSort: (sort?: sortTypes) => void;
  setLimit: (limit: number) => void;
  setOffset: (offset: number) => void;
  setSort: (sort: sortTypes) => void;
  setOrder: (order: orderTypes) => void;
  setCategory: (category: categoryTypes) => void;
  setVendors: (vendors: vendorTypes[]) => void;
  setExcludeCategory: (excludeCategory: categoryTypes[]) => void;
}

export const useLobbyStore = create<LobbyState>((set, get) => {
  const persist = (updates: Partial<LobbyState>) =>
    set((state) => {
      const next = { ...state, ...updates };
      localStorage.setItem("filters", JSON.stringify(next));
      return updates;
    });

  return {
    searchQuery: "",
    selectedType: "",
    limit: 0,
    offset: 0,
    sort: "name",
    order: "asc",
    category: undefined,
    vendor: [],
    excludeCategory: [],

    initializeFromStorage: () => {
      const storedFilters = localStorage.getItem("filters");
      if (storedFilters) {
        const parsed = JSON.parse(storedFilters);
        set({
          searchQuery: parsed.searchQuery || "",
          selectedType: parsed.selectedType || "",
          sort: parsed.sort || "name",
          order: parsed.order || "asc",
          category: parsed.category || undefined,
          vendor: parsed.vendor || [],
          excludeCategory: parsed.excludeCategory || [],
          offset: parsed.offset || 0,
          limit: parsed.limit || 20,
          expandedCategory: parsed.expandedCategory,
          expandedVendor: parsed.expandedVendor,
          expandedSort: parsed.expandedSort,
        });
      }
    },

    setSearchQuery: (q) => persist({ searchQuery: q }),
    setExpandedCategory: (c) => persist({ expandedCategory: c }),
    setExpandedVendor: (v) => persist({ expandedVendor: v }),
    setExpandedSort: (s) => persist({ expandedSort: s }),
    setLimit: (n) => persist({ limit: n }),
    setOffset: (n) => persist({ offset: n }),
    setSort: (s) => persist({ sort: s }),
    setOrder: (o) => persist({ order: o }),
    setCategory: (c) => persist({ category: c }),
    setVendors: (vs) => persist({ vendor: vs }),
    setExcludeCategory: (es) => persist({ excludeCategory: es }),
  };
});
