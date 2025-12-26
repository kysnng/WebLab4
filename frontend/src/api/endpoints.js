import { httpRequest } from "./httpClient";

export function login(username, password) {
    return httpRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password })
    });
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
