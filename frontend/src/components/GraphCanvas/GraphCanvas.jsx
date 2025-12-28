import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendPointThunk } from "../../store/results/resultsThunks";

function round3(v) {
    return Math.round(v * 1000) / 1000;
}

function canvasToCoord(canvas, clientX, clientY, r) {
    const rect = canvas.getBoundingClientRect();
    const xPx = clientX - rect.left;
    const yPx = clientY - rect.top;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const scale = 200 / r;

    const x = (xPx - cx) / scale;
    const y = (cy - yPx) / scale;

    return { x: round3(x), y: round3(y) };
}

function draw(ctx, canvas, r, items) {
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = "white";
    ctx.fillStyle = "white";
    ctx.lineWidth = 1;
    ctx.font = "12px Arial";
    ctx.textBaseline = "middle";

    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(w, cy);
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, h);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx - 6, 14);
    ctx.lineTo(cx + 6, 14);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(w, cy);
    ctx.lineTo(w - 14, cy - 6);
    ctx.lineTo(w - 14, cy + 6);
    ctx.closePath();
    ctx.fill();

    const scale = 200 / r;

    const xR = cx + scale * r;
    const xR2 = cx + scale * (r / 2);
    const xNegR = cx - scale * r;
    const xNegR2 = cx - scale * (r / 2);

    const yR = cy - scale * r;
    const yR2 = cy - scale * (r / 2);
    const yNegR = cy + scale * r;
    const yNegR2 = cy + scale * (r / 2);

    function tick(x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    tick(xR, cy - 5, xR, cy + 5);
    tick(xR2, cy - 5, xR2, cy + 5);
    tick(xNegR2, cy - 5, xNegR2, cy + 5);
    tick(xNegR, cy - 5, xNegR, cy + 5);

    tick(cx - 5, yR, cx + 5, yR);
    tick(cx - 5, yR2, cx + 5, yR2);
    tick(cx - 5, yNegR2, cx + 5, yNegR2);
    tick(cx - 5, yNegR, cx + 5, yNegR);

    ctx.fillText("R", xR - 6, cy + 18);
    ctx.fillText("R/2", xR2 - 12, cy + 18);
    ctx.fillText("-R/2", xNegR2 - 16, cy + 18);
    ctx.fillText("-R", xNegR - 10, cy + 18);

    ctx.fillText("R", cx + 10, yR);
    ctx.fillText("R/2", cx + 10, yR2);
    ctx.fillText("-R/2", cx + 10, yNegR2);
    ctx.fillText("-R", cx + 10, yNegR);

    ctx.fillText("X", w - 12, cy + 18);
    ctx.fillText("Y", cx + 10, 10);

    ctx.fillStyle = "rgba(0,255,84,0.14)";
    ctx.fillRect(
        cx,
        cy - r * scale,
        (r / 2) * scale,
        r * scale
    );

    ctx.fillStyle = "rgba(0,60,255,0.15)";
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx, cy + r * scale);
    ctx.lineTo(cx + (r / 2) * scale, cy);
    ctx.closePath();
    ctx.fill();


    ctx.fillStyle = "rgba(255,0,0,0.16)";
    const rad = (r / 2) * scale;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, rad, Math.PI / 2, Math.PI, false);
    ctx.closePath();
    ctx.fill();


    for (const row of items) {
        const px = cx + row.x * scale;
        const py = cy - row.y * scale;

        ctx.beginPath();
        ctx.fillStyle = row.hit ? "green" : "red";
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

export default function GraphCanvas() {
    const canvasRef = useRef(null);
    const dispatch = useDispatch();
    const r = useSelector((s) => s.params.r);
    const items = useSelector((s) => s.results.items);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rNum = Number(r);
        const effectiveR = Number.isFinite(rNum) && rNum > 0 ? rNum : 1;

        draw(ctx, canvas, effectiveR, items);
    }, [items, r]);

    async function onClick(e) {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rNum = Number(r);
        if (!Number.isFinite(rNum) || rNum <= 0) {
            alert("Выбери R");
            return;
        }

        const { x, y } = canvasToCoord(canvas, e.clientX, e.clientY, rNum);

        try {
            await dispatch(sendPointThunk({ x, y, r: rNum })).unwrap();
        } catch (_) {
            alert("Ошибка отправки точки");
        }
    }

    return (
        <canvas
            ref={canvasRef}
            id="graph"
            width="600"
            height="600"
            onClick={onClick}
            style={{ display: "block" }}
        />
    );
}
