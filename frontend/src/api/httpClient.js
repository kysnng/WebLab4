import { API_BASE } from "../api/config";
import { contextRoot } from "./config";



export async function httpRequest(url, options = {}, token = null) {
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE}${url}`, {
        ...options,
        headers
    });

    if (response.status === 204) return null;

    if (!response.ok) {
        let message = "HTTP error";
        try {
            const body = await response.json();
            message = body.message || message;
        } catch (_) {}

        const err = new Error(message);
        err.status = response.status;
        throw err;
    }

    return response.json();
}
