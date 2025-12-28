export function parseWithScaleLimit(raw, { min, max, maxScale }) {
    const norm = String(raw ?? "").trim().replace(",", ".");
    if (!/^[-+]?\d+(?:[.]\d+)?$/.test(norm)) return { ok: false, value: null, error: "Неверный формат числа" };

    const dot = norm.indexOf(".");
    const scale = dot === -1 ? 0 : norm.length - dot - 1;
    if (scale > maxScale) return { ok: false, value: null, error: `Слишком много знаков после запятой (макс ${maxScale})` };

    const value = Number(norm);
    if (!Number.isFinite(value)) return { ok: false, value: null, error: "Неверное число" };
    if (value < min || value > max) return { ok: false, value: null, error: `Диапазон: от ${min} до ${max}` };

    return { ok: true, value, error: "" };
}

export function validateParams({ x, y, r }) {
    const errors = { x: "", y: "", r: "" };

    if (x === "" || x === null || typeof x === "undefined") errors.x = "Выбери X";
    else {
        const xn = Number(x);
        if (!Number.isFinite(xn) || xn < -5 || xn > 5) errors.x = "Некорректный X";
    }

    const yRes = parseWithScaleLimit(y, { min: -5, max: 5, maxScale: 3 });
    if (!yRes.ok) errors.y = yRes.error;

    if (!r) errors.r = "Выбери R";
    else {
        const rRes = parseWithScaleLimit(r, { min: 1, max: 3, maxScale: 3 });
        if (!rRes.ok) errors.r = rRes.error;
    }

    const ok = !errors.x && !errors.y && !errors.r;

    return {
        ok,
        errors,
        values: {
            x: Number(x),
            y: yRes.ok ? yRes.value : null,
            r: r ? Number(String(r).replace(",", ".")) : null
        }
    };
}
