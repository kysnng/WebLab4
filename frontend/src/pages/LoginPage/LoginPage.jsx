import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import { loginThunk } from "../../store/auth/authThunks";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";


export default function LoginPage() {
    const token = useSelector((s) => s.auth.token);
    if (token) return <Navigate to="/app" replace />;
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function onSubmit(e) {
        e.preventDefault();
        try {
            await dispatch(loginThunk({ username, password })).unwrap();
            navigate("/app");
        } catch (err) {
            alert("Ошибка авторизации");
        }
    }

    return (
        <div className="container">
            <Header />

            <main className="grid">
                <section className="card">
                    <h2 className="card__title">Авторизация</h2>

                    <form className="form" onSubmit={onSubmit}>
                        <div className="field">
                            <label className="label">Логин:</label>
                            <input className="input" value={username}
                                   onChange={e => setUsername(e.target.value)} />
                        </div>

                        <div className="field">
                            <label className="label">Пароль:</label>
                            <input className="input" type="password"
                                   value={password}
                                   onChange={e => setPassword(e.target.value)} />
                        </div>

                        <div className="actions">
                            <button className="btn">ВОЙТИ</button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    );
}
