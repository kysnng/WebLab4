import { httpRequest } from "./httpClient";
import { API_BASE } from "../api/config";

export function login(username, password) {
    return httpRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password })
    });
}

export async function register(username, password) {
    const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    if (res.status === 204) return {};
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Register failed");
    return data;
}



export function me(token) {
    return httpRequest("/auth/me", {
        method: "GET"
    }, token);
}

export function logout(token) {
    return httpRequest("/auth/logout", {
        method: "POST"
    }, token);
}

export function sendPoint(data, token) {
    return httpRequest("/area/check", {
        method: "POST",
        body: JSON.stringify(data)
    }, token);
}

export function loadResults(token) {
    return httpRequest("/results", {
        method: "GET"
    }, token);
}

export function clearResults(token) {
    return httpRequest("/results", {
        method: "DELETE"
    }, token);
}
