import { createSlice } from "@reduxjs/toolkit";

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

const secondsSlice = createSlice({
  name: "time", // Slice name in Redux state
  initialState: { seconds: 0 }, // Default starting value
  reducers: {
    seconds_counter: (state) => {
      state.seconds += 1; // Increment seconds by 1
    },
    seconds_reset: (state) => {
      state.seconds = 0; // Reset seconds to 0
    },
  },
});

// Export actions for dispatching from components or middleware
export const { seconds_counter, seconds_reset } = secondsSlice.actions;

// Export reducer for inclusion in the store
export default secondsSlice.reducer;
