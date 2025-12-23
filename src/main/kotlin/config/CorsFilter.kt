package config

import jakarta.ws.rs.container.ContainerRequestContext
import jakarta.ws.rs.container.ContainerResponseContext
import jakarta.ws.rs.container.ContainerResponseFilter
import jakarta.ws.rs.ext.Provider

@Provider
class CorsFilter : ContainerResponseFilter {

    override fun filter(requestContext: ContainerRequestContext, responseContext: ContainerResponseContext) {
        val headers = responseContext.headers

        headers.putSingle("Access-Control-Allow-Origin", requestContext.getHeaderString("Origin") ?: "*")
        headers.putSingle("Vary", "Origin")

        headers.putSingle("Access-Control-Allow-Credentials", "true")
        headers.putSingle("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization")
        headers.putSingle("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        headers.putSingle("Access-Control-Max-Age", "3600")
    }
}
