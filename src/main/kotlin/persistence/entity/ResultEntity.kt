package persistence.entity

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "results")
class ResultEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    var user: UserEntity? = null,

    @Column(name = "x", nullable = false)
    var x: Double = 0.0,

    @Column(name = "y", nullable = false)
    var y: Double = 0.0,

    @Column(name = "r", nullable = false)
    var r: Double = 0.0,

    @Column(name = "hit", nullable = false)
    var hit: Boolean = false,

    @Column(name = "exec_time_ms", nullable = false)
    var execTimeMs: Long = 0,

    @Column(name = "created_at", nullable = false)
    var createdAt: String = LocalDateTime.now().toString()
)
