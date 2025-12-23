package persistence.repo

import jakarta.ejb.Stateless
import jakarta.persistence.EntityManager
import jakarta.persistence.PersistenceContext
import persistence.entity.UserEntity

@Stateless
class UserRepositoryBean {

    @PersistenceContext(unitName = "appPU")
    private lateinit var em: EntityManager

    fun findById(id: Long): UserEntity? =
        em.find(UserEntity::class.java, id)

    fun findByUsername(username: String): UserEntity? =
        em.createQuery(
            "select u from UserEntity u where u.username = :username",
            UserEntity::class.java
        )
            .setParameter("username", username)
            .resultList
            .firstOrNull()

    fun existsByUsername(username: String): Boolean =
        em.createQuery(
            "select count(u) from UserEntity u where u.username = :username",
            java.lang.Long::class.java
        )
            .setParameter("username", username)
            .singleResult > 0L

    fun persist(user: UserEntity): UserEntity {
        em.persist(user)
        return user
    }

    fun merge(user: UserEntity): UserEntity =
        em.merge(user)
}
