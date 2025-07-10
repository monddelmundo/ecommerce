// store/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  emailAddress: string;
  firstName: string;
  lastName: string;
  profilePhoto: string;
}

interface UserState {
  user: User | null;
}

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
