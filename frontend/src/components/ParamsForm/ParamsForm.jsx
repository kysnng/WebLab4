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

    const errStyle = { borderColor: "#f44336", boxShadow: "0 0 0 3px rgba(244,67,54,.18)" };
    const hintStyle = { fontSize: "12px", marginTop: "6px" };

    return (
        <form className="form" onSubmit={onSubmit}>
            <div className="field">
                <label className="label">Координата X:</label>
                <select
                    id="x-select"
                    className="x-row"
                    name="x"
                    aria-label="Выбор X"
                    required
                    value={x}
                    style={showX ? errStyle : undefined}
                    onBlur={() => setTouched((t) => ({ ...t, x: true }))}
                    onChange={(e) => dispatch(setX(e.target.value))}
                >
                    <option value="" disabled>
                        Выбери X
                    </option>
                    <option value="-2">-2</option>
                    <option value="-1.5">-1.5</option>
                    <option value="-1">-1</option>
                    <option value="-0.5">-0.5</option>
                    <option value="0">0</option>
                    <option value="0.5">0.5</option>
                    <option value="1">1</option>
                    <option value="1.5">1.5</option>
                    <option value="2">2</option>
                </select>
                {showX ? <div style={hintStyle}>{errors.x}</div> : null}
            </div>

            <div className="field">
                <label htmlFor="y" className="label">Координата Y:</label>
                <input
                    id="y"
                    name="y"
                    className="input"
                    type="text"
                    placeholder="Введите Y от -5 до 5"
                    value={y}
                    style={showY ? errStyle : undefined}
                    onBlur={() => setTouched((t) => ({ ...t, y: true }))}
                    onChange={(e) => dispatch(setY(e.target.value))}
                />
                {showY ? <div style={hintStyle}>{errors.y}</div> : null}
            </div>

            <div className="field">
                <label className="label">Координата R:</label>
                <div
                    className="row"
                    role="group"
                    aria-label="Выбор R"
                    style={showR ? { padding: "8px", borderRadius: "12px", border: "1px solid #f44336" } : undefined}
                    onBlur={() => setTouched((t) => ({ ...t, r: true }))}
                >
                    {["1", "1.5", "2", "2.5", "3"].map((val) => (
                        <label key={val} className="chip">
                            {val}
                            <input
                                type="radio"
                                name="r"
                                value={val}
                                checked={r === val}
                                onChange={(e) => {
                                    dispatch(setR(e.target.value));
                                    setTouched((t) => ({ ...t, r: true }));
                                }}
                            />
                        </label>
                    ))}
                </div>
                {showR ? <div style={hintStyle}>{errors.r}</div> : null}
            </div>

            <div className="actions">
                <button className="btn" type="submit">ПРОВЕРИТЬ ТОЧКУ</button>
            </div>
        </form>
    );
}
