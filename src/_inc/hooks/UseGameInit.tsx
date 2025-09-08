// hooks/useGameInit.ts
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  my_Type_Guard_function,
  my_Type_Guard_function_number,
} from "@pexeso/_inc/functions/general";
import { createCardsArray } from "@pexeso/_inc/functions/game_related";
import { create_cards_arr } from "@pexeso/lib/redux/store/reducers/gameSlice";
import type { RootState } from "@pexeso/lib/redux/store/store";
import type { My_Type_Card_Obj } from "@pexeso/_inc/my_types";

/**
 * useGameInit Hook
 *
 * Handles initialization and validation of game settings.
 * Validates difficulty level and selected image count. If invalid,
 * redirects user back to settings. If valid, creates shuffled card array
 * from image names and stores it in Redux.
 *
 * @hook
 * @returns void (side effects only)
 *
 * @dependencies
 * - Redux (game state, dispatch)
 * - react-router-dom (navigation, params)
 * - Internal utilities (type guards, card array generation)
 *
 * @example
 * ```tsx
 * // Inside Game component
 * useGameInit();
 * ```
 *
 * @remarks
 * - Runs automatically on mount and when `level`, `selectedImgCount`, `imgNames` change.
 * - Ensures the game always starts with valid settings and card data.
 */
export const useGameInit = () => {
  const { lang } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get only the necessary state for initialization
  const { imgNames, level, selectedImgCount } = useSelector(
    (state: RootState) => state.game
  );

  useEffect(() => {
    // Validate game settings
    if (
      !my_Type_Guard_function(level, ["easy", "medium", "hard"]) ||
      !my_Type_Guard_function_number(selectedImgCount, [5, 6, 7, 8])
    ) {
      navigate(`/${lang}/settings`);
      return;
    }

    // Initialize game if settings are valid
    const cards: My_Type_Card_Obj[] = createCardsArray(
      selectedImgCount,
      imgNames
    );
    dispatch(create_cards_arr(cards));
  }, [level, selectedImgCount, navigate, dispatch, imgNames, lang]);
};
