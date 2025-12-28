import { createSlice } from "@reduxjs/toolkit";
import { loadResultsThunk, sendPointThunk, clearResultsThunk } from "./resultsThunks";

const slice = createSlice({
    name: "results",
    initialState: {
        items: [],
        loading: false,
        error: ""
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadResultsThunk.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(loadResultsThunk.fulfilled, (state, action) => {
                state.loading = false;
                const arr = action.payload || [];
                arr.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
                state.items = arr;
            })
            .addCase(loadResultsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error?.message || "Load error";
            })
            .addCase(sendPointThunk.fulfilled, (state, action) => {
                if (action.payload) state.items = [action.payload, ...state.items];
            })
            .addCase(sendPointThunk.rejected, (state, action) => {
                state.error = action.error?.message || "Send error";
            })
            .addCase(clearResultsThunk.fulfilled, (state) => {
                state.items = [];
            });
    }
});

export default slice.reducer;
