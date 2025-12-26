import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage/LoginPage";
import MainPage from "../pages/MainPage/MainPage";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";

export default function App() {
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
