import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ✅ Define user type
interface User {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
}

// ✅ Define initial state type
interface AuthState {
   user: Partial<User> | null;
}

// ✅ Initial state
const initialState: AuthState = {
  user: null,
};

// ✅ Create slice with types
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserLogin: (state, action: PayloadAction<Partial<User>>) => {  // ✅ Accept Partial<User>
      state.user = action.payload; 
    },
    logoutUser: (state) => {
      state.user = null;
    },
  },
});

// ✅ Export actions and reducer
export const { setUserLogin, logoutUser } = authSlice.actions;
export default authSlice.reducer;
