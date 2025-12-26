import React, { useState } from "react";

export default function ParamsForm() {
    const [x, setX] = useState("");
    const [y, setY] = useState("");
    const [r, setR] = useState("");

    function onSubmit(e) {
        e.preventDefault();
    }

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
                    onChange={(e) => setX(e.target.value)}
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
                    onChange={(e) => setY(e.target.value)}
                />
            </div>

            <div className="field">
                <label className="label">Координата R:</label>
                <div className="row" role="group" aria-label="Выбор R">
                    {["1", "1.5", "2", "2.5", "3"].map((val) => (
                        <label key={val} className="chip">
                            {val}
                            <input
                                type="radio"
                                name="r"
                                value={val}
                                checked={r === val}
                                onChange={(e) => setR(e.target.value)}
                            />
                        </label>
                    ))}
                </div>
            </div>

            <div className="actions">
                <button className="btn" type="submit">ПРОВЕРИТЬ ТОЧКУ</button>
            </div>
        </form>
    );
}
