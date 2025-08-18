// store/authSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { My_Type_User, My_Type_AuthState } from "@pexeso/_inc/my_types";

/**
 * Auth Slice
 *
 * Redux Toolkit slice responsible for managing authentication state.
 *
 * 1. **State Structure**
 *    - `user` → Information about the currently logged-in user.
 *      `null` means no user is authenticated.
 *
 * 2. **Reducers (Actions)**
 *    - `setUser` → Stores the provided user object in state (login).
 *    - `clearUser` → Removes the user from state (logout).
 *
 * @dependencies
 * redux-toolkit (createSlice, PayloadAction)
 */

const initialState: My_Type_AuthState = {
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /** Sets the currently authenticated user */
    setUser(state, action: PayloadAction<My_Type_User>) {
      state.user = action.payload;
    },
    
    /** Clears the authenticated user (logs out) */
    clearUser(state) {
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
