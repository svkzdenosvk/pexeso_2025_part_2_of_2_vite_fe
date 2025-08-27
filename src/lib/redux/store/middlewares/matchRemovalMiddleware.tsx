import type { Middleware } from "@reduxjs/toolkit";
import {
  remove_after_match,
  match,
  end_game,
} from "@pexeso/lib/redux/store/reducers/gameSlice";

/**
 * Match Removal Middleware
 *
 * Custom Redux middleware that listens for the `match` action and
 * performs additional side effects after matching two images.
 *
 * **Flow:**
 * 1. Waits for the `match` action to be dispatched.
 * 2. Passes the action to reducers to update state.
 * 3. Forces a reflow (via `document.body.offsetHeight`) to ensure animations run smoothly.
 * 4. After a short delay (200 ms):
 *    - Dispatches `remove_after_match` to visually remove matched cards.
 *    - Checks if all cards are removed; if yes, dispatches `end_game`.
 *
 * @dependencies
 * redux-toolkit (Middleware)
 */

export const matchRemovalMiddleware: Middleware<unknown> =
  (storeAPI) => (next) => (action) => {
    if (
      typeof action === "object" &&
      action !== null &&
      "type" in action &&
      action.type === match.type
    ) {
      // Step 1: Let reducers trigger match action
      next(action);

      // Step 2: Force reflow to ensure CSS animations trigger
     // void document.body.offsetHeight;

      // Step 3: Delay removal to allow animations to complete
      setTimeout(() => {
        // After match -> hide pictures
        storeAPI.dispatch(remove_after_match());

        const state = storeAPI.getState();
        const allImgs = state.game.cards;

        const disabledImgs = document.getElementsByClassName("disabled");

        // If all images are disabled → game over
        if (allImgs.length === disabledImgs.length + 2) {
          storeAPI.dispatch(end_game());
        }
      }, 200);
    } else {
      // Pass through other actions without modification
      next(action);
    }
  };
