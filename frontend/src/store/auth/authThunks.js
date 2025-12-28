import { createAsyncThunk } from "@reduxjs/toolkit";
import { login, me, logout as logoutApi, register } from "../../api/endpoints";
import { setAuth, clearAuth } from "./authSlice";

export const loginThunk = createAsyncThunk(
    "auth/login",
    async ({ username, password }, { dispatch }) => {
        const result = await login(username, password);
        dispatch(setAuth({ token: result.token, username }));
    }
);

export const registerThunk = createAsyncThunk(
    "auth/register",
    async ({ username, password }, { dispatch }) => {
        await register(username, password);
        const result = await login(username, password);
        dispatch(setAuth({ token: result.token, username }));
    }
);



export const restoreSessionThunk = createAsyncThunk(
    "auth/restore",
    async (_, { getState, dispatch }) => {
        const token = getState().auth.token;
        if (!token) return;
        try {
            const info = await me(token);
            dispatch(setAuth({ token, username: info.username }));
        } catch (e) {
            if (e && (e.status === 401 || e.status === 403)) {
                dispatch(clearAuth());
            }
        }
    }
);

export const logoutThunk = createAsyncThunk(
    "auth/logout",
    async (_, { getState, dispatch }) => {
        const token = getState().auth.token;
        try {
            if (token) await logoutApi(token);
        } catch (_) {}
        dispatch(clearAuth());
    }
);
