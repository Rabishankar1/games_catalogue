import styles from "@/styles/GameCard.module.scss";
import { Game } from "@/types";
import clsx from "clsx";
import Image from "next/image";

export default function GameCard({ game }: { game: Game }) {
  const { borderColor, name, thumbnail, thumbnailBlur } = game;
  return (
    <div
      className={clsx(
        "relative min-w-[104px] min-h-[140px] w-[104px] h-[140px] desk:min-w-[165px] desk:min-h-[221px] desk:w-[165px] desk:h-[221px] filter transition duration-200 ease-out hover:brightness-60",
        styles.card
      )}
      style={{
        borderColor,
      }}
    >
      <Image
        src={thumbnail}
        alt={name}
        blurDataURL={thumbnailBlur}
        fill
        sizes="(min-width: 768px) 165px, 104px"
        style={{ objectFit: "cover" }}
      />
      {name}
    </div>
  );
}
