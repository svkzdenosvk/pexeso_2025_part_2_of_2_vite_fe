import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { My_Type_BE } from "@pexeso/_inc/my_types";
import type { RootState } from "../store"; // adjust path

/**
 * Seconds Slice
 *
 * Redux Toolkit slice responsible for tracking elapsed time in seconds.
 *
 * Features:
 * 1. **State Structure**
 *    - `seconds` → Number representing elapsed seconds since the timer started.
 *
 * 2. **Reducers (Actions)**
 *    - `seconds_counter` → Increments the `seconds` value by 1.
 *      Intended to be called every second (e.g., via `setInterval` or game loop).
 *    - `seconds_reset` → Resets `seconds` to 0.
 *      Used when starting a new game, restarting, or resetting timers.
 *
 * @example
 * // Increment seconds every second
 * dispatch(seconds_counter());
 *
 * @dependencies
 * redux-toolkit (createSlice)
 */

//---------------redux toolkit
type BackendState = {
  active: My_Type_BE;
  url: string;
};
const initialState: BackendState = {
  active: "express",
  url: "https://pexeso-2025-part-1-of-2-express-be.onrender.com/api",
};

export const backendUrls: Record<My_Type_BE, string> = {
  express: "https://pexeso-2025-part-1-of-2-express-be.onrender.com/api",
  nest: "https://pexeso-2025-part-1-of-2-nest-be.vercel.app/api",
};

const backendSlice = createSlice({
  name: "backend", // Slice name in Redux state
  initialState, // Default starting value
  reducers: {
    set_backend: (state, action: PayloadAction<"express" | "nest">) => {
      state.active = action.payload; // set express | nest
      state.url = backendUrls[action.payload];
    },
  },
});

// Export actions for dispatching from components or middleware
export const { set_backend } = backendSlice.actions;

// Export reducer for inclusion in the store
export default backendSlice.reducer;

export const selectBackendUrl = (state: RootState) => state.backend.url;
export const selectBackend = (state: RootState) => state.backend.active;