import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoginState {
  accessToken: string;
  refreshToken: string;
  error: string;
  success: boolean;
  isUserLogout: boolean;
}

const initialState: LoginState = {
  accessToken: "",
  refreshToken: "",
  error: "",
  success: false,
  isUserLogout: false,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    loginSuccess(state: LoginState, action: PayloadAction<string>) {
      state.accessToken = action.payload;
      state.refreshToken = action.payload;
      state.success = true;
      console.log("login success");
    },
    loginError(state: LoginState, action: PayloadAction<string | any>) {
      state.error = action.payload;
      state.success = false;
      console.log("login Error1");
    },
    logoutSuccess(state: LoginState, action: PayloadAction<boolean>) {
      state.isUserLogout = action.payload;
    },
  },
});

export const { loginSuccess, loginError, logoutSuccess } = loginSlice.actions;
export default loginSlice.reducer;
