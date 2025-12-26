import React from "react";

export default function ResultsTable() {
    return (
        <div className="results">
            <table aria-label="История попаданий">
                <thead>
                <tr>
                    <th style={{ textAlign: "center" }}>Попадания</th>
                    <th style={{ textAlign: "center" }}>X</th>
                    <th style={{ textAlign: "center" }}>Y</th>
                    <th style={{ textAlign: "center" }}>R</th>
                </tr>
                </thead>
                <tbody id="results-body">
                <tr className="hit">
                    <td>Тест попадания</td>
                    <td>1</td>
                    <td>0.5</td>
                    <td>2</td>
                </tr>
                <tr className="miss">
                    <td>Тест промаха</td>
                    <td>-2</td>
                    <td>2.3</td>
                    <td>2.5</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}
