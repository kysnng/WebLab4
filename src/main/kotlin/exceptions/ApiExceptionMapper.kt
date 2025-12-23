package exception

import dto.ErrorDto
import jakarta.ws.rs.core.MediaType
import jakarta.ws.rs.core.Response
import jakarta.ws.rs.ext.ExceptionMapper
import jakarta.ws.rs.ext.Provider

@Provider
class ApiExceptionMapper : ExceptionMapper<Throwable> {

    override fun toResponse(exception: Throwable): Response {
        val (status, msg) = when (exception) {
            is ApiException -> exception.status to exception.message
            is IllegalArgumentException -> Response.Status.BAD_REQUEST.statusCode to (exception.message ?: "Bad request")
            else -> Response.Status.INTERNAL_SERVER_ERROR.statusCode to "Internal server error"
        }

        return Response.status(status)
            .type(MediaType.APPLICATION_JSON)
            .entity(ErrorDto(msg))
            .build()
    }
}
