import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import LoginPage from "../pages/LoginPage/LoginPage";
import MainPage from "../pages/MainPage/MainPage";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import { restoreSessionThunk } from "../store/auth/authThunks";

export default function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(restoreSessionThunk());
    }, [dispatch]);

    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
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
