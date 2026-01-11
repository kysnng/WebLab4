import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import Header from "../../components/Header/Header"
import { loginThunk } from "../../store/auth/authThunks"
import { registerThunk } from "../../store/auth/authThunks"
import "../../styles/style.css"

export default function LoginPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const validateCredentials = (login, password) => {
        if (!login || !password) {
            return "Логин и пароль не могут быть пустыми"
        }

        if (login.length < 3 || login.length > 30) {
            return "Длина логина должна быть от 3 до 30 символов"
        }

        if (password.length < 3 || password.length > 30) {
            return "Длина пароля должна быть от 3 до 30 символов"
        }

        return null
    }

    async function onSubmit(e) {
        e.preventDefault()

        const validationError = validateCredentials(username, password)
        if (validationError) {
            alert(validationError)
            return
        }

        try {
            await dispatch(loginThunk({ username, password })).unwrap()
            navigate("/app")
        } catch (err) {
            alert(err?.message || "Ошибка авторизации")
        }
    }

    async function onRegister(e) {
        e.preventDefault()

        const validationError = validateCredentials(username, password)
        if (validationError) {
            alert(validationError)
            return
        }

        try {
            await dispatch(registerThunk({ username, password })).unwrap()
            navigate("/app")
        } catch (err) {
            alert(err?.message || "Ошибка авторизации")
        }
    }

    return (
        <div className="container">
            <Header />

            <main className="login-grid">
                <section className="card login-card">
                    <h2 className="card__title">Авторизация</h2>

                    <form className="form login-form" onSubmit={onSubmit}>
                        <div className="field">
                            <label className="label">Логин:</label>
                            <input
                                className="input"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                            />
                        </div>

                        <div className="field">
                            <label className="label">Пароль:</label>
                            <input
                                className="input"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="actions login-actions">
                            <button className="btn" type="submit">
                                ВОЙТИ
                            </button>

                            <button
                                className="btn"
                                type="button"
                                onClick={onRegister}
                            >
                                ЗАРЕГИСТРИРОВАТЬСЯ
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    )
}
