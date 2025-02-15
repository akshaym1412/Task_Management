import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
}

interface AuthState {
   user: Partial<User> | null;
}

const initialState: AuthState = {
  user: null,
};

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

export const { setUserLogin, logoutUser } = authSlice.actions;
export default authSlice.reducer;
