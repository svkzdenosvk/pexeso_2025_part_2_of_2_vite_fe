import React from "react";
import { Box } from "@mui/material";
import type { My_Type_Card_Obj } from "@pexeso/_inc/my_types";

/**
 * Card Component
 *
 * Renders a single card for the memory game with an image.
 * Uses class names to control card appearance and animation.
 *
 * @component
 * @example
 * <Card key={cardObject.id} card={cardObject} onClick={handleClick} />
 *
 * @remarks
 * Receives a card object (with id, name and classNames) and a click handler.
 * Images are loaded immediately (no lazy loading) to ensure smooth gameplay.
 *
 * @dependencies
 * MUI
 */

// ---------- Sx styles

// Image styling (hidden at start)
const imgStyles = {
  width: "107px",
  height: "107px",
  opacity: "0%",
} as const;

// Wrapper box styling for the clickable card
const divOnClickBoxStyles = {
  width: "107px",
  height: "107px",
  position: "relative",
  borderRadius: 2,
  overflow: "hidden",
} as const;

// ---------- Component

const Card = React.memo(
  ({
    card,
    onClick,
  }: {
    card: My_Type_Card_Obj;
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  }) => (
    <Box
      sx={divOnClickBoxStyles}
      onClick={onClick}
      className={card.classNames.join(" ")}
      key={card.id}
    >
      <Box
        component="img"
        src={`/pictures/pexeso/${card.name}.jpg`}
        alt={`Card ${card.name}`}
        sx={imgStyles}
      />
    </Box>
  )
);

export default Card;

Card.displayName = "Card"; // Better debug name in React DevTools


