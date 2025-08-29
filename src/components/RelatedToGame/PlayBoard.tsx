import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Typography, Box } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import type { My_Type_Card_Obj } from "@pexeso/_inc/my_types";
import type { RootState } from "@pexeso/lib/redux/store/store";

// Helper function – reveal image on card click
// import { showImg } from "@pexeso/_inc/functions/game_related";
import { usePlayBoardLogic } from "@pexeso/_inc/hooks/UsePlayBoardLogic";

// Card component – renders individual cards
import Card from "./Card";

/**
 * PlayBoard Component
 *
 * Renders the game board containing all playable cards.
 * Delegates core gameplay mechanics to the `usePlayBoardLogic` hook:
 * - Detects and evaluates selected card pairs (match / unmatch).
 * - Handles hardest-level behavior (continuous reshuffling).
 *
 * Responsibilities:
 * - Rendering the card grid
 * - Displaying loading state
 * - Passing click events to `showImg` helper
 *
 * @dependencies
 * - React (hooks)
 * - Redux (state management)
 * - MUI (UI components & styling)
 * - react-i18next (translations)
 *
 * @example
 * <PlayBoard />
 * 
 * @remarks
 * - Game logic previously split into `useGameMatchLogic` and
 *   `useHardLevelShuffle` has been merged into `usePlayBoardLogic`.
 * - `showImg` manages revealing a card and dispatching intermediate state updates.
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

  // const dispatch = useDispatch();

  // Custom hook – encapsulates gameplay logic (match/unmatch + shuffle)
//  usePlayBoardLogic(cards, level);
  const { revealCard } = usePlayBoardLogic(cards, level);

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
              // onClick={(e) =>
              //   showImg(e.currentTarget, oneCard, cards, dispatch)
              // }
                        onClick={(e) => handleCardClick(e, oneCard)}

            />
          )
        )
      )}
    </Box>
  );
};

