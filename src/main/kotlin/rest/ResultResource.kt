package rest

import dto.ResultDto
import exception.ApiException
import jakarta.inject.Inject
import jakarta.ws.rs.DELETE
import jakarta.ws.rs.GET
import jakarta.ws.rs.Path
import jakarta.ws.rs.Produces
import jakarta.ws.rs.core.Context
import jakarta.ws.rs.core.MediaType
import jakarta.ws.rs.core.Response
import jakarta.ws.rs.core.SecurityContext
import security.AuthPrincipal
import service.ResultServiceBean

@Path("/results")
@Produces(MediaType.APPLICATION_JSON)
class ResultsResource {

    @Inject
    private lateinit var service: ResultServiceBean

    private fun principal(sc: SecurityContext): AuthPrincipal =
        sc.userPrincipal as? AuthPrincipal
            ?: throw ApiException(Response.Status.UNAUTHORIZED.statusCode, "Unauthorized")

    @GET
    fun list(@Context sc: SecurityContext): List<ResultDto> {
        val p = principal(sc)
        return service.listForUser(p.userId)
    }

    @DELETE
    fun clear(@Context sc: SecurityContext): Response {
        val p = principal(sc)
        service.clearForUser(p.userId)
        return Response.noContent().build()
    }
}
