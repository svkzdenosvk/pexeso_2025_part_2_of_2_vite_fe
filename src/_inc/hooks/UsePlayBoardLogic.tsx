// // hooks/usePlayBoardLogic.ts
// import { useEffect, useRef } from "react";
// import { useDispatch } from "react-redux";
// import {
//   match,
//   un_match,
//   hardest_level_shuffle,
// } from "@pexeso/lib/redux/store/reducers/gameSlice";
// import type { My_Type_Card_Obj } from "@pexeso/_inc/my_types";

// /**
//  * usePlayBoardLogic Hook
//  *
//  * Handles the main game logic for the play board:
//  * - Detects when two cards are selected and checks for a match.
//  * - Dispatches Redux actions (`match`, `un_match`) based on result.
//  * - On hardest level, continuously reshuffles cards with an interval.
//  *
//  * @hook
//  * @param {My_Type_Card_Obj[]} cards - Array of card objects from Redux state.
//  * @param {string} level - Current difficulty level ("easy", "medium", "hard").
//  *
//  * @returns void (side effects only)
//  *
//  * @dependencies
//  * - Redux (`dispatch`, gameSlice actions)
//  * - Browser timers (`setTimeout`, `setInterval`)
//  *
//  * @example
//  * ```tsx
//  * usePlayBoardLogic(cards, level);
//  * ```
//  *
//  * @remarks
//  * - Ensures previous timers are always cleared before new ones are set.
//  * - On every render:
//  *   - Waits 200ms to allow card flip animation before checking matches.
//  *   - Re-enables pointer events after evaluation.
//  * - On `hard` level:
//  *   - Starts an interval to reshuffle the cards every 400ms.
//  *   - Interval is cleared on unmount or dependency change.
//  */
// export const usePlayBoardLogic = (cards: My_Type_Card_Obj[], level: string) => {
//   const dispatch = useDispatch();

//   // Refs to persist active timers across re-renders
//   const timeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const intervalRef = useRef<NodeJS.Timeout | null>(null);

//   useEffect(() => {
//     // Cleanup previous timers before setting new ones
//     // if (timeoutRef.current) clearTimeout(timeoutRef.current);
//     // if (intervalRef.current) clearInterval(intervalRef.current);

//     // --- CASE 1: Card matching logic (after small delay for animations)
//     timeoutRef.current = setTimeout(() => {
//       // Find selected cards
//       const selectedArr = cards.filter((c) =>
//         c.classNames.includes("selected_Div_img")
//       );

//       // If exactly two cards are selected → check for match
//       if (selectedArr.length === 2) {
//         if (selectedArr[0].name === selectedArr[1].name) {
//           dispatch(match()); // Cards match → dispatch success
//         } else {
//           dispatch(un_match(level)); // Cards do not match → reset selection
//         }
//       }

//       // Re-enable pointer events after evaluation
//       document.body.style.pointerEvents = "auto";
//     }, 200);

//     // --- CASE 2: Hardest level reshuffling ---
//     if (level === "hard") {
//       intervalRef.current = setInterval(() => {
//         dispatch(hardest_level_shuffle());
//       }, 400);
//     }

//     // --- Cleanup on dependency change/unmount ---
//     return () => {
     
//       // if (timeoutRef.current) clearTimeout(timeoutRef.current);
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     };
//   }, [dispatch, cards, level]);
// };

// hooks/usePlayBoardLogic.ts
import { useEffect, useRef , useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import {
  match,
  un_match,
  hardest_level_shuffle,
  showOne
} from "@pexeso/lib/redux/store/reducers/gameSlice";
import type { My_Type_Card_Obj } from "@pexeso/_inc/my_types";

export const usePlayBoardLogic = (cards: My_Type_Card_Obj[], level: string) => {
  const dispatch = useDispatch();

  // Refs to persist active timers across re-renders
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Memoizované pole selected kariet - VYHODNOTE SA LEN PRI ZMENE cards
  //  const selectedCards = useMemo(() => //needs to be tested  to dele 3 cards 3rd open during animation
     const selectedCards = useMemo(() => cards.filter(c => c.classNames.includes("selected_Div_img")),
    [cards])
         // const selectedCards =  cards.filter(c => c.classNames.includes("selected_Div_img"))


  // Memoizovaná funkcia pre reveal karty
  const revealCard = useCallback((
      // const revealCard = (

    element: HTMLDivElement,
    divObject: My_Type_Card_Obj
  ) => {
    if (
      element.classList.contains("mask") &&
      (selectedCards.length === 0 || selectedCards.length === 1)
    ) {
      dispatch(showOne(divObject));
    }
  // }
  }, [selectedCards, dispatch]);

  useEffect(() => {
    // Cleanup previous timers
    // if (timeoutRef.current) clearTimeout(timeoutRef.current);
    // if (intervalRef.current) clearInterval(intervalRef.current);

    // --- Card matching logic ---
    timeoutRef.current = setTimeout(() => {
      // Používame už memoizované selectedCards
      if (selectedCards.length === 2) {
        if (selectedCards[0].name === selectedCards[1].name) {
          dispatch(match());
        } else {
          dispatch(un_match(level));
        }
      }

      document.body.style.pointerEvents = "auto";
    }, 200);

    // --- Hardest level reshuffling ---
    if (level === "hard") {
      intervalRef.current = setInterval(() => {
        dispatch(hardest_level_shuffle());
      }, 400);
    }

    return () => {
      // if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [dispatch, selectedCards, level]); // selectedCards namiesto cards

  // Vrátime reveal funkciu ako súčasť hooku
  return { revealCard };
};