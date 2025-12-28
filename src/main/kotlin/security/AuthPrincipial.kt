package security

import java.security.Principal

data class AuthPrincipal(
    val userId: Long,
    val username: String
) : Principal {
    override fun getName(): String = username
}
