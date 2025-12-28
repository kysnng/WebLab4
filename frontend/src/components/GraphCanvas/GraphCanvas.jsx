import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendPointThunk } from "../../store/results/resultsThunks";

function canvasToCoord(canvas, clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const xPx = clientX - rect.left;
    const yPx = clientY - rect.top;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const scale = 100;

    const x = (xPx - cx) / scale;
    const y = (cy - yPx) / scale;

    return { x, y };
}

export default function GraphCanvas() {
    const canvasRef = useRef(null);
    const r = useSelector((s) => s.params.r);
    const items = useSelector((s) => s.results.items);
    const dispatch = useDispatch();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (const row of items) {
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const scale = 100;

            const px = cx + row.x * scale;
            const py = cy - row.y * scale;

            ctx.beginPath();
            ctx.arc(px, py, 4, 0, Math.PI * 2);
            ctx.fill();
        }
    }, [items]);

    async function onClick(e) {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rNum = Number(r);
        if (!Number.isFinite(rNum)) return;


        const { x, y } = canvasToCoord(canvas, e.clientX, e.clientY);

        try {
            await dispatch(sendPointThunk({ x, y, r: rNum })).unwrap();
        } catch (_) {
            alert("Ошибка отправки точки");
        }
    }

    return (
        <div>
            <canvas ref={canvasRef} id="graph" width="600" height="600" onClick={onClick}></canvas>
        </div>
    );
}
