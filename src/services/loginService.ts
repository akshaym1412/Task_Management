import { auth, provider, signInWithPopup, signOut } from "../firebaseConfig";
import { setUserLogin, logoutUser } from "../redux/authSlice";
import { Dispatch } from "@reduxjs/toolkit";
import { NavigateFunction } from "react-router-dom";

type AuthFunctionProps = {
  dispatch: Dispatch;
  navigate: NavigateFunction;
};


interface User {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
}

export const handleLogin = async ({ dispatch, navigate }: AuthFunctionProps) => {
  try {
    const result = await signInWithPopup(
      auth,
      provider.setCustomParameters({ prompt: "select_account" })
    );

    if (!result.user?.uid) {
      throw new Error("User data is missing UID");
    }

    const userData: Partial<User> = {
      uid: result.user.uid, 
      email: result.user.email ?? "",
      displayName: result.user.displayName ?? "",
      photoURL: result.user.photoURL ?? "",
    };

    dispatch(setUserLogin(userData)); 
    navigate("/home");

    console.log("User Logged In:", userData);
  } catch (error) {
    console.error("Login Error:", error);
  }
};

export const handleLogout = async ( dispatch: Dispatch<any>, navigate: NavigateFunction) => {
  try {
    await signOut(auth);
    dispatch(logoutUser());
    navigate("/");
    console.log("User Logged Out");
  } catch (error) {
    console.error("Logout Error:", error);
  }
};
