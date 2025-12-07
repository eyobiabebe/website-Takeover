import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

// Define the User type (customize based on your app)
interface User {
  id: string
  name: string
  email: string
  // Add more fields if needed
}

// Define the initial state type
interface AuthState {
  isAuthenticated: boolean
  user: User | null
}

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
}

// Create the slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true
      state.user = action.payload
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
    },
    
  },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer
