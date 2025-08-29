import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Typography, Box } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import type { My_Type_Card_Obj } from "@pexeso/_inc/my_types";
import type { RootState } from "@pexeso/lib/redux/store/store";
import { usePlayBoardLogic } from "@pexeso/_inc/hooks/UsePlayBoardLogic";
import Card from "./Card";

/**
 * PlayBoard Component
 *
 * Renders the grid of cards and delegates game logic to `usePlayBoardLogic`.
 *
 * Responsibilities:
 * - Render card grid with click interactions.
 * - Show loading state until cards are ready.
 * - Pass card clicks to the `revealCard` handler from the hook.
 *
 * @dependencies
 * - React (hooks)
 * - Redux (state management)
 * - MUI (UI components & styling)
 * - react-i18next (translations)
 *
 * @example
 * <PlayBoard />
 */

// ---------- Sx styles

// Layout for the row of cards
const rowStyles = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-evenly",
  flexWrap: "wrap",
  flex: "1 1 50%",
  mt: "1.5%",
} as const;

// Dynamic text color based on current theme
const colorTextThemeStyles = (theme: Theme) => ({
  color: theme.palette.text.primary,
});

// ---------- Component

export const PlayBoard = () => {
  const { t } = useTranslation();

  // Redux – get game state values
  const { cards, isLoading, level } = useSelector(
    (state: RootState) => state.game
  ); //-------------with destructuring

  // Hook: encapsulates card match/unmatch + shuffle logic
  const { revealCard } = usePlayBoardLogic(cards, level);

  // Handle click on single card → delegate to hook
  const handleCardClick = (e: React.MouseEvent, card: My_Type_Card_Obj) => {
    const element = e.currentTarget as HTMLDivElement;
    revealCard(element, card);
  };
  return (
    <Box className="row" id="row" sx={rowStyles}>
      {/* Show loading message while images are being prepared */}
      {isLoading ? (
        <Typography variant="h2" component="h2" sx={colorTextThemeStyles}>
          {t("images_page.loading")}
        </Typography>
      ) : (
        // Render all game cards
        cards.map(
          (
            oneCard: My_Type_Card_Obj //-------------------------------------------array of img names -> div>img
          ) => (
            <Card
              key={oneCard.id}
              card={oneCard}
              onClick={(e) => handleCardClick(e, oneCard)}
            />
          )
        )
      )}
    </Box>
  );
};
