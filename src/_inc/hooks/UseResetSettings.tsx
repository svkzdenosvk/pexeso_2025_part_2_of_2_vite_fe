// hooks/useResetSettings.ts
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { reset_settings } from "@pexeso/lib/redux/store/reducers/gameSlice";
import { seconds_reset } from "@pexeso/lib/redux/store/reducers/secondsSlice";

/**
 * useResetSettings Hook
 *
 * Resets game state and timer when invoked.
 * Runs automatically on component mount and clears
 * both the game configuration and the elapsed time.
 *
 * @hook
 * @returns void (side effects only)
 *
 * @dependencies
 * - Redux (dispatch actions for game & timer reset)
 *
 * @example
 * ```tsx
 * // Inside a component that should always reset the game on mount
 * useResetSettings();
 * ```
 *
 * @remarks
 * - Designed to ensure a clean start whenever the user navigates
 *   to a screen requiring fresh game state (e.g., settings page).
 * - Resets are dispatched only once on mount.
 */
export const useResetSettings = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(seconds_reset()); // reset game timer
    dispatch(reset_settings()); // reset game configuration
    
  }, [dispatch]);
};