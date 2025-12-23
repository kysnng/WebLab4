package service

import dto.CheckRequestDto
import dto.ResultDto
import exception.ApiException
import jakarta.ejb.Stateless
import jakarta.inject.Inject
import jakarta.ws.rs.core.Response
import persistence.entity.ResultEntity
import persistence.repo.ResultRepositoryBean
import persistence.repo.UserRepositoryBean
import java.time.LocalDateTime
import kotlin.system.measureNanoTime

@Stateless
class ResultServiceBean {

    @Inject
    private lateinit var users: UserRepositoryBean

    @Inject
    private lateinit var results: ResultRepositoryBean

    @Inject
    private lateinit var area: AreaCheckServiceBean

    fun checkAndSave(userId: Long, req: CheckRequestDto): ResultDto {
        validate(req)

        var hit = false
        val elapsedNs = measureNanoTime {
            hit = area.check(req.x, req.y, req.r)
        }
        val execMs = elapsedNs / 1_000_000

        val user = users.findById(userId)
            ?: throw ApiException(Response.Status.UNAUTHORIZED.statusCode, "User not found")

        val entity = ResultEntity(
            user = user,
            x = req.x,
            y = req.y,
            r = req.r,
            hit = hit,
            execTimeMs = execMs,
            createdAt = LocalDateTime.now()
        )

        results.persist(entity)

        return entity.toDto()
    }

    fun listForUser(userId: Long): List<ResultDto> =
        results.findAllByUserId(userId).map { it.toDto() }

    fun clearForUser(userId: Long) {
        results.deleteAllByUserId(userId)
    }


    private fun validate(req: CheckRequestDto) {
        if (req.r <= -4.0) throw IllegalArgumentException("R must be > -4")
        if (req.x.isNaN() || req.y.isNaN() || req.r.isNaN()) throw IllegalArgumentException("Invalid numbers")
        if (req.x.isInfinite() || req.y.isInfinite() || req.r.isInfinite()) throw IllegalArgumentException("Invalid numbers")
    }


    private fun ResultEntity.toDto(): ResultDto =
        ResultDto(
            x = x,
            y = y,
            r = r,
            hit = hit,
            execTimeMs = execTimeMs,
            createdAt = createdAt
        )
}
