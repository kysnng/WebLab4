import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearResultsThunk } from "../../store/results/resultsThunks";

function formatDateTime(value) {
    if (!value) return "";
    const s = String(value);
    return s.replace("T", " ").split(".")[0];
}

export default function ResultsTable() {
    const items = useSelector((s) => s.results.items);
    const dispatch = useDispatch();

    return (
        <div className="results">
            <div className="actions" style={{ marginTop: 0, marginBottom: "12px" }}>
                <button className="btn" type="button" onClick={() => dispatch(clearResultsThunk())}>
                    ОЧИСТИТЬ
                </button>
            </div>

            <div className="table-scroll">
                <table aria-label="История попаданий">
                    <thead>
                    <tr>
                        <th style={{ textAlign: "center" }}>Результат</th>
                        <th style={{ textAlign: "center" }}>X</th>
                        <th style={{ textAlign: "center" }}>Y</th>
                        <th style={{ textAlign: "center" }}>R</th>
                        <th style={{ textAlign: "center" }}>Время</th>
                        <th style={{ textAlign: "center" }}>Создано</th>
                    </tr>
                    </thead>
                    <tbody id="results-body">
                    {items.map((row, idx) => (
                        <tr
                            key={`${row.createdAt}-${row.x}-${row.y}-${row.r}-${idx}`}
                            className={row.hit ? "hit" : "miss"}
                        >
                            <td>{row.hit ? "Попадание" : "Промах"}</td>
                            <td>{row.x}</td>
                            <td>{row.y}</td>
                            <td>{row.r}</td>
                            <td>{row.execTimeMs} ms</td>
                            <td>{formatDateTime(row.createdAt)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
