package security

import java.security.SecureRandom

object SaltGenerator {

    private val rnd = SecureRandom()

    fun generate(length: Int = 16): String {
        val bytes = ByteArray(length)
        rnd.nextBytes(bytes)
        val sb = StringBuilder(bytes.size * 2)
        for (b in bytes) sb.append(((b.toInt() and 0xff) + 0x100).toString(16).substring(1))
        return sb.toString()
    }
}
