package exception

import dto.ErrorDto
import jakarta.ws.rs.core.MediaType
import jakarta.ws.rs.core.Response
import jakarta.ws.rs.ext.ExceptionMapper
import jakarta.ws.rs.ext.Provider

@Provider
class ApiExceptionMapper : ExceptionMapper<Throwable> {

    override fun toResponse(exception: Throwable): Response {
        val root = unwrap(exception)

        val (status, msg) = when (root) {
            is ApiException -> root.status to root.message
            is IllegalArgumentException -> Response.Status.BAD_REQUEST.statusCode to (root.message ?: "Bad request")
            else -> Response.Status.INTERNAL_SERVER_ERROR.statusCode to "Internal server error"
        }

        return Response.status(status)
            .type(MediaType.APPLICATION_JSON)
            .entity(ErrorDto(msg))
            .build()
    }

    private fun unwrap(t: Throwable): Throwable {
        var cur: Throwable = t
        var guard = 0
        while (cur.cause != null && cur.cause !== cur && guard < 20) {
            if (cur is ApiException) return cur
            cur = cur.cause!!
            guard++
        }
        return if (cur is ApiException) cur else t
    }
}
