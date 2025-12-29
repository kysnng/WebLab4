package rest

import jakarta.ws.rs.core.MediaType
import jakarta.ws.rs.core.Response
import jakarta.ws.rs.ext.ExceptionMapper
import jakarta.ws.rs.ext.Provider
import java.util.logging.Level
import java.util.logging.Logger

@Provider
class GlobalExceptionMapper : ExceptionMapper<Throwable> {
    private val log = Logger.getLogger(GlobalExceptionMapper::class.java.name)

    override fun toResponse(ex: Throwable): Response {
        val id = System.currentTimeMillis().toString()
        log.log(Level.SEVERE, "Unhandled exception id=$id", ex)

        val payload = mapOf(
            "error" to "internal_error",
            "id" to id,
            "type" to (ex::class.qualifiedName ?: "Throwable"),
            "message" to (ex.message ?: "")
        )

        return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
            .type(MediaType.APPLICATION_JSON)
            .entity(payload)
            .build()
    }
}
