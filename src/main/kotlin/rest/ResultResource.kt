package rest

import dto.ResultDto
import jakarta.inject.Inject
import jakarta.ws.rs.DELETE
import jakarta.ws.rs.GET
import jakarta.ws.rs.Path
import jakarta.ws.rs.Produces
import jakarta.ws.rs.container.ContainerRequestContext
import jakarta.ws.rs.core.MediaType
import jakarta.ws.rs.core.Response
import service.ResultServiceBean

@Path("/results")
@Produces(MediaType.APPLICATION_JSON)
class ResultsResource {

    @Inject
    private lateinit var service: ResultServiceBean

    @GET
    fun list(ctx: ContainerRequestContext): List<ResultDto> {
        val userId = (ctx.getProperty("userId") as? Long) ?: throw IllegalStateException("No userId in context")
        return service.listForUser(userId)
    }

    @DELETE
    fun clear(ctx: ContainerRequestContext): Response {
        val userId = (ctx.getProperty("userId") as? Long) ?: throw IllegalStateException("No userId in context")
        service.clearForUser(userId)
        return Response.noContent().build()
    }
}
