package rest

import dto.LoginRequestDto
import dto.LoginResponseDto
import dto.MeResponseDto
import dto.RegisterRequestDto
import jakarta.inject.Inject
import jakarta.ws.rs.Consumes
import jakarta.ws.rs.GET
import jakarta.ws.rs.POST
import jakarta.ws.rs.Path
import jakarta.ws.rs.Produces
import jakarta.ws.rs.container.ContainerRequestContext
import jakarta.ws.rs.core.MediaType
import jakarta.ws.rs.core.Response
import service.AuthServiceBean
import jakarta.ws.rs.core.Context

@Path("/auth")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
class AuthResource {

    @Inject
    private lateinit var auth: AuthServiceBean

    @POST
    @Path("/register")
    fun register(req: RegisterRequestDto): Response {
        auth.register(req)
        return Response.status(Response.Status.CREATED).build()
    }

    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    fun login(req: LoginRequestDto): LoginResponseDto =
        auth.login(req)

    @GET
    @Path("/me")
    fun me(@Context ctx: ContainerRequestContext): MeResponseDto {
        val userId = (ctx.getProperty("userId") as? Long) ?: throw IllegalStateException("No userId in context")
        val username = (ctx.getProperty("username") as? String) ?: throw IllegalStateException("No username in context")
        return auth.me(userId, username)
    }

    @POST
    @Path("/logout")
    fun logout(): Response {
        auth.logout()
        return Response.ok().build()
    }
}
