package rest

import dto.CheckRequestDto
import dto.ResultDto
import exception.ApiException
import jakarta.inject.Inject
import jakarta.ws.rs.Consumes
import jakarta.ws.rs.POST
import jakarta.ws.rs.Path
import jakarta.ws.rs.Produces
import jakarta.ws.rs.core.Context
import jakarta.ws.rs.core.MediaType
import jakarta.ws.rs.core.Response
import jakarta.ws.rs.core.SecurityContext
import security.AuthPrincipal
import service.ResultServiceBean

@Path("/area")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
class AreaResource {

    @Inject
    private lateinit var service: ResultServiceBean

    private fun principal(sc: SecurityContext): AuthPrincipal =
        sc.userPrincipal as? AuthPrincipal
            ?: throw ApiException(Response.Status.UNAUTHORIZED.statusCode, "Unauthorized")

    @POST
    @Path("/check")
    fun check(req: CheckRequestDto, @Context sc: SecurityContext): ResultDto {
        val p = principal(sc)
        println("REQ x=${req.x} y=${req.y} r=${req.r}")
        return service.checkAndSave(p.userId, req)
    }
}
