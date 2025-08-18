import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "./reducers/gameSlice";
import secondsReducer from "./reducers/secondsSlice";
import authReducer from "./reducers/authSlice";

import { matchRemovalMiddleware } from "@pexeso/lib/redux/store/middlewares/matchRemovalMiddleware";

/**
 * Redux Store Configuration
 *
 * Centralized store setup for the Pexeso application using Redux Toolkit.
 * Combines all application slices and custom middleware into a single store instance.
 *
 * Features:
 * 1. **Reducers**
 *    - `game` → Manages game state (board, cards, matches, game status, etc.)
 *    - `time` → Handles countdown or elapsed time tracking for a game session
 *    - `auth` → Stores user authentication state and profile data
 *
 * 2. **Middleware**
 *    - Extends Redux Toolkit's default middleware with `matchRemovalMiddleware`,
 *      which listens for specific match-removal actions and triggers side effects
 *      (e.g., animations, score updates, or audio feedback).
 *
 * 3. **Type Safety**
 *    - `RootState` → Infers the global state type for useSelector hooks
 *    - `AppDispatch` → Typed dispatch for useDispatch hooks
 *
 * @dependencies
 * redux-toolkit, custom reducers (gameSlice, secondsSlice, authSlice),
 * custom middleware (matchRemovalMiddleware)
 *
 * @usage
 * Import `store` into your app's entry point and wrap the root component with Redux `<Provider>`.
 */

export const store = configureStore({
  reducer: {
    game: gameReducer, // Game-related state
    time: secondsReducer, // Timer-related state
    auth: authReducer, // Authentication-related state
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(matchRemovalMiddleware),
});
// -------- Types --------

// Inferred type for the entire Redux state object
export type RootState = ReturnType<typeof store.getState>;
// Inferred type for dispatch function with middleware support
export type AppDispatch = typeof store.dispatch;
