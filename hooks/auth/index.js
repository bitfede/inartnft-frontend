import { useContext } from "react";
import Provider from "./provider";
import AuthContext from "./context";

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = Provider;
