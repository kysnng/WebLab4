import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setX, setY, setR } from "../../store/params/paramsSlice";
import { sendPointThunk } from "../../store/results/resultsThunks";
import { validateParams } from "../../utils/validators";

export default function ParamsForm() {
    const { x, y, r } = useSelector((s) => s.params);
    const dispatch = useDispatch();

    const [touched, setTouched] = useState({ x: false, y: false, r: false });

    const validation = useMemo(() => validateParams({ x, y, r }), [x, y, r]);
    const { errors } = validation;

    const showX = touched.x && errors.x;
    const showY = touched.y && errors.y;
    const showR = touched.r && errors.r;

    async function onSubmit(e) {
        e.preventDefault();
        setTouched({ x: true, y: true, r: true });

        const v = validateParams({ x, y, r });
        if (!v.ok) return;

        try {
            await dispatch(sendPointThunk({ x: v.values.x, y: v.values.y, r: v.values.r })).unwrap();
        } catch (_) {}
    }

    function onYChange(e) {
        const raw = e.target.value;

        if (raw === "" || raw === "-" || raw === "." || raw === "-." || raw === "," || raw === "-,") {
            dispatch(setY(raw));
            return;
        }

        if (!/^-?\d+(?:[.,]\d{0,3})?$/.test(raw)) return;

        dispatch(setY(raw));
    }

    const errStyle = { borderColor: "#f44336", boxShadow: "0 0 0 3px rgba(244,67,54,.18)" };
    const hintStyle = { fontSize: "12px", marginTop: "6px" };

    return (
        <form className="form" onSubmit={onSubmit}>
            <div className="field">
                <label className="label">Координата X:</label>
                <select
                    className="select"
                    name="x"
                    required
                    value={x}
                    style={showX ? errStyle : undefined}
                    onBlur={() => setTouched((t) => ({ ...t, x: true }))}
                    onChange={(e) => dispatch(setX(e.target.value))}
                >
                    <option value="" disabled>
                        Выбери X
                    </option>
                    {Array.from({ length: 9 }, (_, i) => i - 4).map((v) => (
                        <option key={v} value={String(v)}>
                            {v}
                        </option>
                    ))}
                </select>
                {showX ? <div style={hintStyle}>{errors.x}</div> : null}
            </div>

            <div className="field">
                <label className="label">Координата Y:</label>
                <input
                    name="y"
                    className="input"
                    type="text"
                    inputMode="decimal"
                    placeholder="Введите Y от -3 до 5"
                    value={y}
                    style={showY ? errStyle : undefined}
                    onBlur={() => setTouched((t) => ({ ...t, y: true }))}
                    onChange={onYChange}
                />
                {showY ? <div style={hintStyle}>{errors.y}</div> : null}
            </div>

            <div className="field">
                <label className="label">Координата R:</label>
                <select
                    className="select"
                    name="r"
                    required
                    value={r}
                    style={showR ? errStyle : undefined}
                    onBlur={() => setTouched((t) => ({ ...t, r: true }))}
                    onChange={(e) => dispatch(setR(e.target.value))}
                >
                    <option value="" disabled>
                        Выбери R
                    </option>
                    {Array.from({ length: 9 }, (_, i) => i - 4)
                        .filter((v) => v !== 0)
                        .map((v) => (
                            <option key={v} value={String(v)}>
                                {v}
                            </option>
                        ))}
                </select>
                {showR ? <div style={hintStyle}>{errors.r}</div> : null}
            </div>

            <button className="btn" type="submit">
                ПРОВЕРИТЬ ТОЧКУ
            </button>
        </form>
    );
}
