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
import java.util.logging.Level
import java.util.logging.Logger

@Provider
@Priority(Priorities.AUTHENTICATION)
class AuthRequestFilter : ContainerRequestFilter {

    private val log = Logger.getLogger(AuthRequestFilter::class.java.name)

    @Inject
    private lateinit var tokenService: TokenServiceBean

    override fun filter(requestContext: ContainerRequestContext) {
        val path = requestContext.uriInfo.path
        val method = requestContext.method

        log.info("AUTH FILTER IN  method=$method path=/$path")

        val p = path.trimStart('/')

        if (method.equals("OPTIONS", true)) {
            log.fine("AUTH FILTER SKIP (OPTIONS)")
            return
        }

        if (p.endsWith("auth/login") || p.endsWith("auth/register")) {
            log.fine("AUTH FILTER SKIP (public endpoint: $p)")
            return
        }

        val header = requestContext.getHeaderString("Authorization")
        if (header == null) {
            log.warning("AUTH FILTER FAIL: Authorization header is missing")
            requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED).build())
            return
        }

        val token = header.removePrefix("Bearer ").takeIf { it != header }
        if (token == null) {
            log.warning("AUTH FILTER FAIL: Authorization is not Bearer")
            requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED).build())
            return
        }

        val payload = try {
            log.fine("AUTH FILTER: verifying token...")
            tokenService.verify(token)
        } catch (e: Exception) {
            log.log(Level.SEVERE, "AUTH FILTER ERROR: tokenService.verify threw exception", e)
            null
        }

        if (payload == null) {
            log.warning("AUTH FILTER FAIL: token verification failed")
            requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED).build())
            return
        }

        log.info("AUTH FILTER OK: userId=${payload.userId}, username=${payload.username}")

        val original = requestContext.securityContext
        val principal = AuthPrincipal(payload.userId, payload.username)

        requestContext.securityContext = object : SecurityContext {
            override fun getUserPrincipal(): Principal = principal
            override fun isUserInRole(role: String?): Boolean = false
            override fun isSecure(): Boolean = original?.isSecure ?: false
            override fun getAuthenticationScheme(): String = "Bearer"
        }

        requestContext.setProperty("userId", payload.userId)
        requestContext.setProperty("username", payload.username)
    }
}
