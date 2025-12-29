package rest

import jakarta.ws.rs.container.ContainerRequestContext
import jakarta.ws.rs.container.ContainerRequestFilter
import jakarta.ws.rs.container.ContainerResponseContext
import jakarta.ws.rs.container.ContainerResponseFilter
import jakarta.ws.rs.ext.Provider
import java.util.logging.Logger

@Provider
class RequestLoggingFilter : ContainerRequestFilter, ContainerResponseFilter {
    private val log = Logger.getLogger(RequestLoggingFilter::class.java.name)

    override fun filter(requestContext: ContainerRequestContext) {
        requestContext.setProperty("t0", System.nanoTime())
        log.info("HTTP IN  ${requestContext.method} ${requestContext.uriInfo.requestUri}")
    }

    override fun filter(requestContext: ContainerRequestContext, responseContext: ContainerResponseContext) {
        val t0 = requestContext.getProperty("t0") as? Long ?: System.nanoTime()
        val dtMs = (System.nanoTime() - t0) / 1_000_000
        log.info("HTTP OUT ${requestContext.method} ${requestContext.uriInfo.requestUri} -> ${responseContext.status} (${dtMs}ms)")
    }
}
