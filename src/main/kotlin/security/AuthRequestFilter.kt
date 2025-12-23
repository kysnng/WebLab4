package security

import jakarta.annotation.Priority
import jakarta.inject.Inject
import jakarta.ws.rs.Priorities
import jakarta.ws.rs.container.ContainerRequestContext
import jakarta.ws.rs.container.ContainerRequestFilter
import jakarta.ws.rs.core.Response
import jakarta.ws.rs.core.SecurityContext
import jakarta.ws.rs.ext.Provider
import java.security.Principal

@Provider
@Priority(Priorities.AUTHENTICATION)
class AuthRequestFilter : ContainerRequestFilter {

    @Inject
    private lateinit var tokenService: TokenServiceBean

    override fun filter(requestContext: ContainerRequestContext) {
        val path = requestContext.uriInfo.path

        if (requestContext.method.equals("OPTIONS", true)) return
        if (path.startsWith("auth/login")) return
        if (path.startsWith("auth/register")) return


        val header = requestContext.getHeaderString("Authorization") ?: run {
            requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED).build())
            return
        }

        val token = header.removePrefix("Bearer ").takeIf { it != header } ?: run {
            requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED).build())
            return
        }

        val payload = tokenService.verify(token) ?: run {
            requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED).build())
            return
        }

        requestContext.setProperty("userId", payload.userId)
        requestContext.setProperty("username", payload.username)

        val original = requestContext.securityContext
        requestContext.securityContext = object : SecurityContext {
            override fun getUserPrincipal(): Principal = Principal { payload.username }
            override fun isUserInRole(role: String?): Boolean = false
            override fun isSecure(): Boolean = original?.isSecure ?: false
            override fun getAuthenticationScheme(): String = "Bearer"
        }
    }
}
