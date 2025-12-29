package dto

data class ResultDto(
    val x: Double,
    val y: Double,
    val r: Double,
    val hit: Boolean,
    val execTimeMs: Double,
    val createdAt: String
)
