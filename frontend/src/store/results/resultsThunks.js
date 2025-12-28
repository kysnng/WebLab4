import { createAsyncThunk } from "@reduxjs/toolkit";
import { loadResults, sendPoint, clearResults } from "../../api/endpoints";

export const loadResultsThunk = createAsyncThunk(
    "results/load",
    async (_, { getState }) => {
        const token = getState().auth.token;
        return await loadResults(token);
    }
);

export const sendPointThunk = createAsyncThunk(
    "results/sendPoint",
    async ({ x, y, r }, { getState }) => {
        const token = getState().auth.token;
        return await sendPoint({ x, y, r }, token);
    }
);

export const clearResultsThunk = createAsyncThunk(
    "results/clear",
    async (_, { getState }) => {
        const token = getState().auth.token;
        await clearResults(token);
        return true;
    }
);
