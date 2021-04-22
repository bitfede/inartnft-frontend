import { useContext } from "react";
import Provider from "./provider";
import LoginContext from "./context";

export const useLogin = () => useContext(LoginContext);

export const LoginProvider = Provider;
