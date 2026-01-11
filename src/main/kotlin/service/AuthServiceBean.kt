package service

import dto.LoginRequestDto
import dto.LoginResponseDto
import dto.RegisterRequestDto
import dto.RegisterResponseDto
import exception.ApiException
import jakarta.ejb.Stateless
import jakarta.inject.Inject
import jakarta.ws.rs.core.Response
import persistence.entity.UserEntity
import persistence.repo.UserRepositoryBean
import security.PasswordHasher
import security.SaltGenerator
import security.TokenServiceBean

@Stateless
class AuthServiceBean {

    @Inject
    private lateinit var users: UserRepositoryBean

    @Inject
    private lateinit var tokens: TokenServiceBean

    fun register(req: RegisterRequestDto) : RegisterResponseDto {
        val username = req.username.trim()
        val password = req.password

        if (username.isEmpty() || password.isEmpty()) {
            throw ApiException(Response.Status.BAD_REQUEST.statusCode, "Username and password are required")
        }

        if (username.length < 3) {
            throw ApiException(Response.Status.BAD_REQUEST.statusCode, "Username is too short")
        }

        if (password.length < 4) {
            throw ApiException(Response.Status.BAD_REQUEST.statusCode, "Password is too short")
        }

        if (users.existsByUsername(username)) {
            throw ApiException(Response.Status.CONFLICT.statusCode, "Username already exists")
        }

        val salt = SaltGenerator.generate()
        val hash = PasswordHasher.hashWithSalt(password, salt)

        val user = UserEntity(
            username = username,
            passwordHash = hash,
            salt = salt
        )

        users.persist(user)

        val token = tokens.issue(user.id!!, user.username)

        return RegisterResponseDto(
            token = token,
            username = user.username
        )
    }

    fun login(req: LoginRequestDto): LoginResponseDto {
        val username = req.username.trim()
        val password = req.password

        if (username.isEmpty() || password.isEmpty()) {
            throw ApiException(Response.Status.BAD_REQUEST.statusCode, "Требуется имя и пароль")
        }

        val user = users.findByUsername(username)
            ?: throw ApiException(Response.Status.UNAUTHORIZED.statusCode, "Нет такого пользователя")

        val computed = PasswordHasher.hashWithSalt(password, user.salt)

        if (computed != user.passwordHash) {
            throw ApiException(Response.Status.UNAUTHORIZED.statusCode, "Неверный пароль. Попробуйте снова")
        }

        val token = tokens.issue(user.id!!, user.username)
        return LoginResponseDto(token = token, username = user.username)
    }
    fun me(userId: Long, username: String): dto.MeResponseDto =
        dto.MeResponseDto(userId = userId, username = username)

    fun logout(): Unit = Unit

}
