package persistence.repo

import jakarta.ejb.Stateless
import jakarta.persistence.EntityManager
import jakarta.persistence.PersistenceContext
import persistence.entity.ResultEntity

@Stateless
class ResultRepositoryBean {

    @PersistenceContext(unitName = "appPU")
    private lateinit var em: EntityManager

    fun persist(result: ResultEntity): ResultEntity {
        em.persist(result)
        return result
    }

    fun findAllByUserId(userId: Long): List<ResultEntity> =
        em.createQuery(
            "select r from ResultEntity r where r.user.id = :userId order by r.createdAt desc",
            ResultEntity::class.java
        )
            .setParameter("userId", userId)
            .resultList

    fun deleteAllByUserId(userId: Long): Int =
        em.createQuery("delete from ResultEntity r where r.user.id = :userId")
            .setParameter("userId", userId)
            .executeUpdate()
}
