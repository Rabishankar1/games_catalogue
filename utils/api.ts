const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
console.log("Base URL:", baseUrl);
export const fetchGames = async (params: {
  query?: string;
  limit?: number;
  offset?: number;
  sort?:
    | "name"
    | "theoreticalPayOut"
    | "popularity"
    | "createdAt"
    | "featuredPriority";
  order?: "asc" | "desc";
  category?: "VIDEOSLOTS" | "BLACKJACK" | "BACCARAT" | "GAMESHOWSLIVEDEALER";
  vendor?: (
    | "PragmaticPlay"
    | "EvolutionGaming"
    | "JackpotOriginal"
    | "Play'nGo"
    | "RelaxGaming"
  )[];
  excludeCategory?: string[];
}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      if (value.length > 0) {
        searchParams.set(key, value.join(","));
      }
    } else if (value !== undefined) {
      searchParams.set(key, String(value));
    }
  });

  const res = await fetch(
    `${baseUrl}/casino/games${
      params.query ? `/search` : ""
    }?${searchParams.toString()}`,
    {
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch games");
  }

  return res.json();
};

export const searchGames = async (query: string) => {
  const res = await fetch(
    `${baseUrl}/casino/games/search?query=${encodeURIComponent(query)}`,
    {
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to search games");
  }

  return res.json();
};
