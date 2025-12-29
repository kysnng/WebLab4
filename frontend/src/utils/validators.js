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
        if (!Number.isFinite(xn) || !Number.isInteger(xn) || xn < -4 || xn > 4) errors.x = "X должен быть целым от -4 до 4";
    }

    const yRes = parseWithScaleLimit(y, { min: -3, max: 5, maxScale: 3 });
    if (!yRes.ok) errors.y = yRes.error;

    if (r === "" || r === null || typeof r === "undefined") errors.r = "Выбери R";
    else {
        const rn = Number(String(r).replace(",", "."));
        if (!Number.isFinite(rn) || !Number.isInteger(rn) || rn < -4 || rn > 4)
            errors.r = "R должен быть целым от -4 до 4";
        else if (rn === 0)
            errors.r = "R не может быть 0";
    }

    const ok = !errors.x && !errors.y && !errors.r;

    return {
        ok,
        errors,
        values: {
            x: Number(x),
            y: yRes.ok ? yRes.value : null,
            r: r !== "" ? Number(String(r).replace(",", ".")) : null
        }
    };
}
