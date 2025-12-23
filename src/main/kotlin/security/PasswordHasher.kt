package security

import java.security.MessageDigest

object PasswordHasher {

    fun hash(password: String): String =
        sha256(password)

    fun hashWithSalt(password: String, salt: String): String =
        sha256(password + salt)

    private fun sha256(input: String): String {
        val bytes = MessageDigest.getInstance("SHA-256").digest(input.toByteArray(Charsets.UTF_8))
        val sb = StringBuilder(bytes.size * 2)
        for (b in bytes) sb.append(((b.toInt() and 0xff) + 0x100).toString(16).substring(1))
        return sb.toString()
    }
}
