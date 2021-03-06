import axios from "axios";
import settings from "../settings";

const httpClient = axios.create({
	baseURL: settings.Endpoints.ApiUrl,
	headers: {
		"content-type": "application/json",
	},
	responseType: "json",
});

httpClient.interceptors.request.use(
	config => {
		if (typeof window !== "undefined") {
			const token = localStorage.getItem("authToken");
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		}
		return config;
	},
	error => Promise.reject(error)
);

export default httpClient;
