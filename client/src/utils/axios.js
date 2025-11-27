import axios from "axios";
import {getAccessToken, getRefreshToken, logout} from "@/auth/jwtService.js";
import toast from "react-hot-toast";

const instance = axios.create({
	baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
	timeout: 20000,
});

instance.interceptors.request.use(
	(config) => {
		// let token = getAccessToken();
		let token = getAccessToken();
		if (token && config.headers) {
			config.headers.Authorization = "Bearer " + token;
		}
		
		return config;
	},
	(error) => {
		toast.error(error?.response?.data?.error)
		console.log("error", error)
		// toast.error(error?.message)
		return Promise.reject(error);
	}
);

instance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const status = error.response?.status;
		
		const refresh = getRefreshToken();
		const access = getAccessToken()
		
		if (status === 401) {
			if (
				window.location.pathname !== "/login" &&
				window.location.pathname !== "/register" &&
				window.location.pathname !== "/"
			) {
				try {
					await logout({refresh, headers: {Authorization: `Bearer ${access}`}});
				} catch (e) {
					const refresh = getRefreshToken();
					await logout({refresh, headers: {Authorization: `Bearer ${access}`}});
					console.error("Logout error:", e);
				} finally {
					const refresh = getRefreshToken();
					await logout({refresh, headers: {Authorization: `Bearer ${access}`}});
					window.location.href = "/login";
				}
			}
		}
		
		if (status && status !== 401) {
			// store.dispatch(
			// 	showNotification({
			// 		status: 0,
			// 		message: error?.response?.data?.message || "Server error",
			// 	})
			// );
		}
		toast.error(error?.response?.data?.error)
		return Promise.reject(error);
	}
);

export default instance;