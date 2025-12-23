package security

import jakarta.ejb.Stateless
import java.nio.charset.StandardCharsets
import java.security.MessageDigest
import java.time.Instant
import javax.crypto.Mac
import javax.crypto.spec.SecretKeySpec
import java.util.Base64

@Stateless
class TokenServiceBean {

    private val ttlSeconds = 60L * 60L * 6L

    fun issue(userId: Long, username: String): String {
        val exp = Instant.now().epochSecond + ttlSeconds
        val payload = "${userId}:${username}:${exp}"
        val sig = sign(payload)
        val tokenRaw = "$payload:$sig"
        return Base64.getUrlEncoder().withoutPadding().encodeToString(tokenRaw.toByteArray(StandardCharsets.UTF_8))
    }

    fun verify(token: String): TokenPayload? {
        val raw = try {
            String(Base64.getUrlDecoder().decode(token), StandardCharsets.UTF_8)
        } catch (_: Exception) {
            return null
        }

        val parts = raw.split(":")
        if (parts.size != 4) return null

        val userId = parts[0].toLongOrNull() ?: return null
        val username = parts[1]
        val exp = parts[2].toLongOrNull() ?: return null
        val sig = parts[3]

        if (Instant.now().epochSecond > exp) return null

        val payload = "${userId}:${username}:${exp}"
        if (!constantTimeEquals(sig, sign(payload))) return null

        return TokenPayload(userId, username, exp)
    }

    private fun sign(payload: String): String {
        val secret = resolveSecret()
        val mac = Mac.getInstance("HmacSHA256")
        mac.init(SecretKeySpec(secret.toByteArray(StandardCharsets.UTF_8), "HmacSHA256"))
        val out = mac.doFinal(payload.toByteArray(StandardCharsets.UTF_8))
        return Base64.getUrlEncoder().withoutPadding().encodeToString(out)
    }

    private fun resolveSecret(): String {
        val fromSysProp = System.getProperty("APP_TOKEN_SECRET")?.trim()
        if (!fromSysProp.isNullOrEmpty()) return fromSysProp

        val fromEnv = System.getenv("APP_TOKEN_SECRET")?.trim()
        if (!fromEnv.isNullOrEmpty()) return fromEnv

        return "DEV_ONLY_CHANGE_ME"
        /* TODO("После тестов надо поменять на строку ниже, чтобы всегда запрашивал secret") */
        // throw IllegalStateException("APP_TOKEN_SECRET is not configured")
    }

    private fun constantTimeEquals(a: String, b: String): Boolean {
        val ab = a.toByteArray(StandardCharsets.UTF_8)
        val bb = b.toByteArray(StandardCharsets.UTF_8)
        return MessageDigest.isEqual(ab, bb)
    }
}

data class TokenPayload(
    val userId: Long,
    val username: String,
    val exp: Long
)
