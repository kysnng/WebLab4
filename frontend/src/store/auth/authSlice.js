import { createSlice } from "@reduxjs/toolkit";

const tokenKey = "token";

const initialState = {
    token: localStorage.getItem(tokenKey) || "",
    username: ""
};

const slice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth(state, action) {
            state.token = action.payload.token;
            state.username = action.payload.username || "";
            localStorage.setItem(tokenKey, state.token);
        },
        clearAuth(state) {
            state.token = "";
            state.username = "";
            localStorage.removeItem(tokenKey);
        }
    }
});

export const { setAuth, clearAuth } = slice.actions;
export default slice.reducer;
