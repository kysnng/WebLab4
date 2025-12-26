import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { logoutThunk } from "../../store/auth/authThunks";

export default function Header() {
    const token = useSelector((s) => s.auth.token);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    async function onLogout() {
        await dispatch(logoutThunk());
        navigate("/", { replace: true, state: { from: location.pathname } });
    }

    return (
        <header className="header">
            <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", alignItems: "flex-start" }}>
                <div>
                    <h1 className="header__title">Лабораторная работа 2</h1>
                    <p className="header__meta">
                        <span><strong>ФИО:</strong> Соловьев Даниил Дмитриевич</span>
                        <span><strong>Группа:</strong> Р3222</span>
                        <span><strong>ИСУ:</strong> 467550</span>
                    </p>
                </div>

                {token ? (
                    <button className="btn" type="button" onClick={onLogout} style={{ width: "220px" }}>
                        ВЫЙТИ
                    </button>
                ) : null}
            </div>
        </header>
    );
}
