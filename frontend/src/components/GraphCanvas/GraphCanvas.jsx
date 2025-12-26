import React, { useEffect, useRef } from "react";

export default function GraphCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, []);

    return (
        <div>
            <canvas ref={canvasRef} id="graph" width="600" height="600"></canvas>
        </div>
    );
}
