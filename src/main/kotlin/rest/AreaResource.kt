package rest

import dto.CheckRequestDto
import dto.ResultDto
import jakarta.inject.Inject
import jakarta.ws.rs.Consumes
import jakarta.ws.rs.POST
import jakarta.ws.rs.Path
import jakarta.ws.rs.Produces
import jakarta.ws.rs.container.ContainerRequestContext
import jakarta.ws.rs.core.MediaType
import service.ResultServiceBean
import jakarta.ws.rs.core.Context

@Path("/area")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
class AreaResource {

    @Inject
    private lateinit var service: ResultServiceBean

    @POST
    @Path("/check")
    fun check(req: CheckRequestDto, @Context ctx: ContainerRequestContext): ResultDto {
        val userId = (ctx.getProperty("userId") as? Long) ?: throw IllegalStateException("No userId in context")
        return service.checkAndSave(userId, req)
    }
}
