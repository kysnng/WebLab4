package dto

import java.time.LocalDateTime

data class ResultDto(
    val x: Double,
    val y: Double,
    val r: Double,
    val hit: Boolean,
    val execTimeMs: Long,
    val createdAt: String
)
