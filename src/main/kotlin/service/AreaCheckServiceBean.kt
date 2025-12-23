package service

import dto.CheckRequestDto
import jakarta.ejb.Stateless

@Stateless
class AreaCheckServiceBean {

    fun check(x: Double, y: Double, r: Double): Boolean =
        when {
            x >= 0.0 && y >= 0.0 -> checkCircle(x, y, r)
            x <= 0.0 && y <= 0.0 -> checkRectangle(x, y, r)
            x <= 0.0 && y >= 0.0 -> checkTriangle(x, y, r)
            else -> false
        }

    private fun checkTriangle(x: Double, y: Double, r: Double): Boolean =
        y <= (x + 0.5 * r)

    private fun checkCircle(x: Double, y: Double, r: Double): Boolean =
        (x * x + y * y) <= (r * r)

    private fun checkRectangle(x: Double, y: Double, r: Double): Boolean =
        (x >= -r) && (y >= -0.5 * r)

    private fun validate(req: CheckRequestDto) {
        if (req.x.isNaN() || req.y.isNaN() || req.r.isNaN()) throw IllegalArgumentException("Invalid numbers")
        if (req.x.isInfinite() || req.y.isInfinite() || req.r.isInfinite()) throw IllegalArgumentException("Invalid numbers")

        if (req.x < -5.0 || req.x > 5.0) throw IllegalArgumentException("X out of range")
        if (req.y < -5.0 || req.y > 5.0) throw IllegalArgumentException("Y out of range")
        if (req.r < 1.0 || req.r > 3.0) throw IllegalArgumentException("R out of range")
    }

}
