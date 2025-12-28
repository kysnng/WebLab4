const contextRoot = (() => {
    const p = window.location.pathname || "/";
    const parts = p.split("/").filter(Boolean);
    return parts.length ? `/${parts[0]}` : "";
})();

const API_BASE = `${contextRoot}/api`;

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
        throw new Error(message);
    }

    return response.json();
}
