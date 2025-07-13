export function capitalize(string: string): string {
  console.log(string, "input");
  if (string.length === 0) {
    return "";
  }

  return string
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
export function returnImageUrl(value: string): string {
  switch (value) {
    case "BACCARAT":
      return "baccarat.svg";
    case "BLACKJACK":
      return "blackjack.svg";
    case "GAMESHOWSLIVEDEALER":
      return "game-shows.svg";
    case "VIDEOSLOTS":
      return "slots.svg";
    case "JackpotOriginal":
      return "jackpotOriginalsProvider.svg";
    case "providers":
      return "providers.svg";
    case "JackpotLogo":
      return "jackpot.svg";
    case "PragmaticPlay":
      return "pragmaticPlayProvider.svg";
    case "EvolutionGaming":
      return "evolutionGamingProvider.svg";
    case "Play'nGo":
      return "play'nGoProvider.svg";
    case "RelaxGaming":
      return "relaxGamingProvider.svg";

    default:
      return "fire.svg";
  }
}

export const returnSectionName = (value: string): string => {
  switch (value) {
    case "BACCARAT":
      return "Baccarat";
    case "BLACKJACK":
      return "Blackjack";
    case "GAMESHOWSLIVEDEALER":
      return "Game Shows";
    case "VIDEOSLOTS":
      return "Slots";
    case "JackpotOriginal":
      return "Jackpot Originals";
    case "PragmaticPlay":
      return "Pragmatic Play";
    case "EvolutionGaming":
      return "Evolution Gaming";
    case "JackpotOriginal":
      return "Jackpot Original";
    case "Play'nGo":
      return "Play And Go";
    case "RelaxGaming":
      return "Relax Gaming";
    case "theoreticalPayOut":
      return "Highest Payouts";
    case "popularity":
      return "Most Popular";
    case "createdAt":
      return "Latest";
    case "featuredPriority":
      return "Featured Games";
    default:
      return "All Games";
  }
};

export const returnNonDuplicatedObjectArray = <T extends Record<string, any>>(
  array: T[]
): T[] => {
  const seen = new Set();
  return array.filter((item) => {
    const key = JSON.stringify(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};
