// hooks/usePlayBoardLogic.ts
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  match,
  un_match,
  hardest_level_shuffle,
} from "@pexeso/lib/redux/store/reducers/gameSlice";
import type { My_Type_Card_Obj } from "@pexeso/_inc/my_types";

/**
 * usePlayBoardLogic Hook
 *
 * Handles the main game logic for the play board:
 * - Detects when two cards are selected and checks for a match.
 * - Dispatches Redux actions (`match`, `un_match`) based on result.
 * - On hardest level, continuously reshuffles cards with an interval.
 *
 * @hook
 * @param {My_Type_Card_Obj[]} cards - Array of card objects from Redux state.
 * @param {string} level - Current difficulty level ("easy", "medium", "hard").
 *
 * @returns void (side effects only)
 *
 * @dependencies
 * - Redux (`dispatch`, gameSlice actions)
 * - Browser timers (`setTimeout`, `setInterval`)
 *
 * @example
 * ```tsx
 * usePlayBoardLogic(cards, level);
 * ```
 *
 * @remarks
 * - Ensures previous timers are always cleared before new ones are set.
 * - On every render:
 *   - Waits 200ms to allow card flip animation before checking matches.
 *   - Re-enables pointer events after evaluation.
 * - On `hard` level:
 *   - Starts an interval to reshuffle the cards every 400ms.
 *   - Interval is cleared on unmount or dependency change.
 */
export const usePlayBoardLogic = (cards: My_Type_Card_Obj[], level: string) => {
  const dispatch = useDispatch();

  // Refs to persist active timers across re-renders
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Cleanup previous timers before setting new ones
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);

    // --- CASE 1: Card matching logic (after small delay for animations)
    timeoutRef.current = setTimeout(() => {
      // Find selected cards
      const selectedArr = cards.filter((c) =>
        c.classNames.includes("selected_Div_img")
      );

      // If exactly two cards are selected → check for match
      if (selectedArr.length === 2) {
        if (selectedArr[0].name === selectedArr[1].name) {
          dispatch(match()); // Cards match → dispatch success
        } else {
          dispatch(un_match(level)); // Cards do not match → reset selection
        }
      }

      // Re-enable pointer events after evaluation
      document.body.style.pointerEvents = "auto";
    }, 200);

    // --- CASE 2: Hardest level reshuffling ---
    if (level === "hard") {
      intervalRef.current = setInterval(() => {
        dispatch(hardest_level_shuffle());
      }, 400);
    }

    // --- Cleanup on dependency change/unmount ---
    return () => {
      //   clearTimeout(timeout);
      //   if (interval) clearInterval(interval);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [dispatch, cards, level]);
};
