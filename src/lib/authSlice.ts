import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

// Helper to safely parse JSON from localStorage
const getStoredUser = (): User | null => {
  try {
    const user = localStorage.getItem("authUser");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  // Use both token presence and user existence to determine auth status
  isAuthenticated: !!localStorage.getItem("authToken"),
  user: getStoredUser(),
  token: localStorage.getItem("authToken") || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token?: string } | any>) => {
      // Normalizing the payload in case your API returns { user, token } or just the user
      const userData = action.payload.user || action.payload;
      const tokenData = action.payload.token || state.token;

      state.isAuthenticated = true;
      state.user = userData;
      state.token = tokenData;

      // Persist to LocalStorage for Safari/Chrome refresh persistence
      localStorage.setItem("authUser", JSON.stringify(userData));
      if (tokenData) {
        localStorage.setItem("authToken", tokenData);
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;

      // Clear all persistence
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      
      // If you are using cookies, they are cleared via the backend, 
      // but we clear storage here for the frontend.
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;