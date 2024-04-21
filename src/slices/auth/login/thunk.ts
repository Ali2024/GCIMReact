import { loginError, loginSuccess, logoutSuccess } from "./reducer";
import { ThunkAction } from "redux-thunk";
import { Action, Dispatch } from "redux";
import { RootState } from "slices";
import { getFirebaseBackend } from "helpers/firebase_helper";

interface User {
  Mobile: string;
  Password: string;
  RememberMe: boolean;
}

export const loginUser =
  (user: User): ThunkAction<void, RootState, unknown, Action<string>> =>
  async (dispatch: Dispatch) => {
    try {
      const response = await fetch("https://chekadbamapi.ir/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Mobile: user.Mobile,
          Password: user.Password,
          RememberMe: user.RememberMe,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error); // Handle API-specific error messages
      }

      const jwtToken = data.accessToken; // Assuming the API response includes a JWT token

      // Securely store the JWT token in localStorage
      localStorage.setItem("authToken", jwtToken);

      dispatch(loginSuccess(data)); // Dispatch login success action with relevant data
    } catch (error) {
      dispatch(loginError(error));
    }
  };

export const logoutUser = () => async (dispatch: Dispatch) => {
  try {
    localStorage.removeItem("authToken");

    let fireBaseBackend = await getFirebaseBackend();

    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response = fireBaseBackend.logout;
      dispatch(logoutSuccess(response));
    } else {
      dispatch(logoutSuccess(true));
    }
  } catch (error) {
    dispatch(loginError(error));
  }
};

export const socialLogin =
  (type: any, history: any) => async (dispatch: any) => {
    try {
      let response: any;

      if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
        const fireBaseBackend = getFirebaseBackend();
        response = fireBaseBackend.socialLoginUser(type);
      }

      const socialData = await response;

      if (socialData) {
        sessionStorage.setItem("authToken", JSON.stringify(socialData));
        dispatch(loginSuccess(socialData));
        history("/dashboard");
      }
    } catch (error) {
      dispatch(loginError(error));
    }
  };
