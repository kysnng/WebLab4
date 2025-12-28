import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoginPage from "../pages/LoginPage/LoginPage";
import MainPage from "../pages/MainPage/MainPage";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import { restoreSessionThunk } from "../store/auth/authThunks";

export default function App() {
    const dispatch = useDispatch();
    const [ready, setReady] = useState(false);
    const token = useSelector((s) => s.auth.token);

    useEffect(() => {
        Promise.resolve(dispatch(restoreSessionThunk()))
            .finally(() => setReady(true));
    }, [dispatch]);

    if (!ready) return null;

    return (
        <Routes>
            <Route path="/" element={token ? <Navigate to="/app" replace /> : <LoginPage />} />
            <Route
                path="/app"
                element={
                    <ProtectedRoute>
                        <MainPage />
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
