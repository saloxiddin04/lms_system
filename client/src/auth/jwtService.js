import instance from "@/utils/axios.js";

export function login(...args) {
	return instance.post("/auth/login", ...args).then((res) => {
		setAccessToken(res.data.token);
	});
}

export function register(...args) {
	return instance.post("/auth/register", ...args);
}

export function verify(...args) {
	return instance.post("/auth/verify", ...args)
}

export function fetchMe() {
	return instance.get("/auth/me").then((res) => {
		setUserData(res.data?.user)
	})
}

export function reSendVerify(...args) {
	return instance.post("/auth/resend-verification", ...args)
}

export function changePassword(...args) {
	return instance.patch("/auth/change-password", ...args)
}

function clearCookies() {
	document.cookie = "access=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	document.cookie = "refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	document.cookie = "permissions=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export function logout() {
	clearCookies()
	window.location.href = '/'
}

export function setAccessToken(value) {
	setCookie("access", value, 7);
}

export function getAccessToken() {
	return getCookie("access");
}

export function setRefreshToken(value) {
	setCookie("refresh", value, 7);
}

export function getRefreshToken() {
	return getCookie("refresh");
}

export function parseJwt(token) {
	const base64Url = token.split('.')[1];
	const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
		return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
	}).join(''));
	setUserData(JSON.parse(jsonPayload))
	return JSON.parse(jsonPayload);
}

export function setUserData(value) {
	setCookie("user", JSON.stringify(value), 7);
}

export function getUserData() {
	const cookies = document.cookie.split(";");
	const userCookie = cookies.find((cookie) => cookie.includes("user="));
	
	if (userCookie) return JSON.parse(userCookie.split("=")[1] || '{}');
}

export function setCookie(name, value, expirationDays) {
	const date = new Date();
	date.setTime(date.getTime() + expirationDays * 24 * 60 * 60 * 1000);
	const expires = "expires=" + date.toUTCString();
	// document.cookie = `${name}=${value};${expires};path=/;SameSite=None;Secure`;
	document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

export function getCookie(name) {
	const cookieString = document.cookie;
	const cookieArray = cookieString.split("; ");
	for (const cookie of cookieArray) {
		const [key, value] = cookie.split("=");
		if (key === name) {
			return value;
		}
	}
	return null;
}