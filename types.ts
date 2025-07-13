export type categoryTypes =
  | "VIDEOSLOTS"
  | "BLACKJACK"
  | "BACCARAT"
  | "GAMESHOWSLIVEDEALER";
export type vendorTypes =
  | "PragmaticPlay"
  | "EvolutionGaming"
  | "JackpotOriginal"
  | "Play'nGo"
  | "RelaxGaming";
export type sortTypes =
  | "name"
  | "theoreticalPayOut"
  | "popularity"
  | "createdAt"
  | "featuredPriority";
export type orderTypes = "asc" | "desc";
export interface Game {
  borderColor: string;
  categories: categoryTypes[];
  description: string;
  enabled: boolean;
  favorite: boolean;
  featured: boolean;
  hasFunMode: boolean;
  maxBetUSD: number;
  maxWinUSD: number;
  name: string;
  restrictedTerritories: string[];
  slug: number;
  theoreticalPayOut: number;
  thumbnail: string;
  thumbnailBlur: string;
  vendor: vendorTypes;
}
