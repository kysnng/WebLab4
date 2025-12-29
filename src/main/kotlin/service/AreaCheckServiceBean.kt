package service

import dto.CheckRequestDto
import jakarta.ejb.Stateless

@Stateless
class AreaCheckServiceBean {

    fun check(x: Double, y: Double, r: Double): Boolean =
        when {
            x <= 0.0 && y <= 0.0 -> checkCircle(x, y, r)
            x >= 0.0 && y >= 0.0 -> checkRectangle(x, y, r)
            x >= 0.0 && y <= 0.0 -> checkTriangle(x, y, r)
            else -> false
        }

    private fun checkTriangle(x: Double, y: Double, r: Double): Boolean =
        y >= (2*x - r)

    private fun checkCircle(x: Double, y: Double, r: Double): Boolean =
        (x * x + y * y) <= (0.25 * r * r)

    private fun checkRectangle(x: Double, y: Double, r: Double): Boolean =
        (x <= 0.5 * r) && (y <= r)

    private fun validate(req: CheckRequestDto) {
        if (req.x.isNaN() || req.y.isNaN() || req.r.isNaN()) throw IllegalArgumentException("Invalid numbers")
        if (req.x.isInfinite() || req.y.isInfinite() || req.r.isInfinite()) throw IllegalArgumentException("Invalid numbers")

        if (req.x < -5.0 || req.x > 5.0) throw IllegalArgumentException("X out of range")
        if (req.y < -5.0 || req.y > 5.0) throw IllegalArgumentException("Y out of range")
        if (req.r < -4.0 || req.r > 4.0) throw IllegalArgumentException("R out of range")
    }
    private fun parseWithScaleLimit(raw: String, min: Double, max: Double, maxScale: Int): Double? {
        val norm = raw.trim().replace(',', '.')
        if (!Regex("^[-+]?\\d+(?:[.]\\d+)?$").matches(norm)) return null
        val bd = norm.toBigDecimalOrNull() ?: return null
        if (bd.scale() > maxScale) return null
        val d = bd.toDouble()
        if (d !in min..max) return null
        return d
    }

}
