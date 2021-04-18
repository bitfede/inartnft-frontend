import React, { useState, useEffect } from "react";
import AuthContext from "./context";

// Provider
const AuthProvider = ({ children }) => {
	const [authToken, setAuthToken] = useState(null);
	const [userId, setUserId] = useState(null);

	// Load data from localstorage on page load
	useEffect(() => {
		if (typeof window !== "undefined") {
			if (localStorage.authToken) {
				setAuthToken(localStorage.authToken);
			}
			if (localStorage.userId) {
				setUserId(localStorage.userId);
			}
		}
	});

	const saveAuth = (token, profileId) => {
		console.log("LOGIN");
		setAuthToken(token);
		setUserId(profileId);
		if (typeof window !== "undefined") {
			localStorage.setItem("authToken", token);
			localStorage.setItem("userId", profileId);
		}
	};

	const logout = () => {
		console.log("LOGOUT");
		if (typeof window !== "undefined") {
			localStorage.removeItem("authToken");
			localStorage.removeItem("userId");
		}
		setAuthToken(undefined);
		setUserId(undefined);
		window.location.href = "/";
	};

	return <AuthContext.Provider value={{ authToken, userId, saveAuth, logout }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
