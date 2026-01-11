import React, { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { sendPointThunk } from "../../store/results/resultsThunks"

function round3(v) {
    return Math.round(v * 1000) / 1000
}

function toNumber(v) {
    const n = Number(String(v ?? "").replace(",", "."))
    return Number.isFinite(n) ? n : NaN
}

function getScalePxPerUnit(canvas, rAbs) {
    const w = canvas.width
    const base = w / 3
    return base / rAbs
}

function clientToCanvasPx(canvas, clientX, clientY) {
    const rect = canvas.getBoundingClientRect()
    const xCss = clientX - rect.left
    const yCss = clientY - rect.top
    const sx = canvas.width / rect.width
    const sy = canvas.height / rect.height
    return { x: xCss * sx, y: yCss * sy }
}

function canvasToCoord(canvas, clientX, clientY, rAbs) {
    const { x: xPx, y: yPx } = clientToCanvasPx(canvas, clientX, clientY)

    const cx = canvas.width / 2
    const cy = canvas.height / 2

    const scale = getScalePxPerUnit(canvas, rAbs)

    const x = (xPx - cx) / scale
    const y = (cy - yPx) / scale

    return { x: round3(x), y: round3(y) }
}

function draw(ctx, canvas, rAbs, items) {
    const w = canvas.width
    const h = canvas.height
    const cx = w / 2
    const cy = h / 2

    ctx.clearRect(0, 0, w, h)

    ctx.strokeStyle = "white"
    ctx.fillStyle = "white"
    ctx.lineWidth = 1
    ctx.font = `${Math.max(12, Math.round(w / 50))}px Arial`
    ctx.textBaseline = "middle"

    ctx.beginPath()
    ctx.moveTo(0, cy)
    ctx.lineTo(w, cy)
    ctx.moveTo(cx, 0)
    ctx.lineTo(cx, h)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(cx, 0)
    ctx.lineTo(cx - 6, 14)
    ctx.lineTo(cx + 6, 14)
    ctx.closePath()
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(w, cy)
    ctx.lineTo(w - 14, cy - 6)
    ctx.lineTo(w - 14, cy + 6)
    ctx.closePath()
    ctx.fill()

    const scale = getScalePxPerUnit(canvas, rAbs)

    const xR = cx + scale * rAbs
    const xR2 = cx + scale * (rAbs / 2)
    const xNegR = cx - scale * rAbs
    const xNegR2 = cx - scale * (rAbs / 2)

    const yR = cy - scale * rAbs
    const yR2 = cy - scale * (rAbs / 2)
    const yNegR = cy + scale * rAbs
    const yNegR2 = cy + scale * (rAbs / 2)

    function tick(x1, y1, x2, y2) {
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
    }

    tick(xR, cy - 5, xR, cy + 5)
    tick(xR2, cy - 5, xR2, cy + 5)
    tick(xNegR2, cy - 5, xNegR2, cy + 5)
    tick(xNegR, cy - 5, xNegR, cy + 5)

    tick(cx - 5, yR, cx + 5, yR)
    tick(cx - 5, yR2, cx + 5, yR2)
    tick(cx - 5, yNegR2, cx + 5, yNegR2)
    tick(cx - 5, yNegR, cx + 5, yNegR)

    ctx.fillText("R", xR - 6, cy + 18)
    ctx.fillText("R/2", xR2 - 12, cy + 18)
    ctx.fillText("-R/2", xNegR2 - 16, cy + 18)
    ctx.fillText("-R", xNegR - 10, cy + 18)

    ctx.fillText("R", cx + 10, yR)
    ctx.fillText("R/2", cx + 10, yR2)
    ctx.fillText("-R/2", cx + 10, yNegR2)
    ctx.fillText("-R", cx + 10, yNegR)

    ctx.fillText("X", w - 12, cy + 18)
    ctx.fillText("Y", cx + 10, 10)

    ctx.fillStyle = "rgba(0,255,84,0.14)"
    ctx.fillRect(cx, cy - rAbs * scale, (rAbs / 2) * scale, rAbs * scale)

    ctx.fillStyle = "rgba(0,60,255,0.15)"
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(cx, cy + rAbs * scale)
    ctx.lineTo(cx + (rAbs / 2) * scale, cy)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = "rgba(255,0,0,0.16)"
    const rad = (rAbs / 2) * scale
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, rad, Math.PI / 2, Math.PI, false)
    ctx.closePath()
    ctx.fill()

    const pointRadius = Math.max(3, Math.round(w / 200))
    for (const row of items) {
        const px = cx + row.x * scale
        const py = cy - row.y * scale

        ctx.beginPath()
        ctx.fillStyle = row.hit ? "green" : "red"
        ctx.arc(px, py, pointRadius, 0, Math.PI * 2)
        ctx.fill()
    }
}

function syncCanvasSize(canvas, maxCssSize) {
    const parent = canvas.parentElement
    if (!parent) return

    const parentRect = parent.getBoundingClientRect()
    const cssSize = Math.max(240, Math.min(maxCssSize, Math.floor(parentRect.width)))
    const dpr = window.devicePixelRatio || 1

    canvas.style.width = `${cssSize}px`
    canvas.style.height = `${cssSize}px`

    const pxSize = Math.floor(cssSize * dpr)
    if (canvas.width !== pxSize || canvas.height !== pxSize) {
        canvas.width = pxSize
        canvas.height = pxSize
    }
}

export default function GraphCanvas() {
    const canvasRef = useRef(null)
    const dispatch = useDispatch()
    const rRaw = useSelector((s) => s.params.r)
    const items = useSelector((s) => s.results.items)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ro = new ResizeObserver(() => {
            syncCanvasSize(canvas, 600)
            const ctx = canvas.getContext("2d")
            if (!ctx) return

            const rNum = toNumber(rRaw)
            const absR = Number.isFinite(rNum) && rNum !== 0 ? Math.abs(rNum) : 1
            draw(ctx, canvas, absR, items)
        })

        ro.observe(canvas.parentElement || canvas)

        syncCanvasSize(canvas, 600)
        const ctx = canvas.getContext("2d")
        if (ctx) {
            const rNum = toNumber(rRaw)
            const absR = Number.isFinite(rNum) && rNum !== 0 ? Math.abs(rNum) : 1
            draw(ctx, canvas, absR, items)
        }

        return () => ro.disconnect()
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const rNum = toNumber(rRaw)
        const absR = Number.isFinite(rNum) && rNum !== 0 ? Math.abs(rNum) : 1
        draw(ctx, canvas, absR, items)
    }, [items, rRaw])

    async function onClick(e) {
        const canvas = canvasRef.current
        if (!canvas) return

        const rNum = toNumber(rRaw)
        if (!Number.isFinite(rNum) || rNum === 0) {
            alert("Выбери R")
            return
        }

        const absR = Math.abs(rNum)
        const { x, y } = canvasToCoord(canvas, e.clientX, e.clientY, absR)

        try {
            await dispatch(sendPointThunk({ x, y, r: rNum })).unwrap()
        } catch (_) {
            alert("Ошибка отправки точки")
        }
    }

    return (
        <canvas
            ref={canvasRef}
            id="graph"
            onClick={onClick}
            style={{ display: "block", margin: "15px auto 0 auto" }}
        />
    )
}
