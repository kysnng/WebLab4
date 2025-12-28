import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
    name: "params",
    initialState: {
        x: "",
        y: "",
        r: ""
    },
    reducers: {
        setX(state, action) {
            state.x = action.payload;
        },
        setY(state, action) {
            state.y = action.payload;
        },
        setR(state, action) {
            state.r = action.payload;
        },
        resetParams(state) {
            state.x = "";
            state.y = "";
            state.r = "";
        }
    }
});

export const { setX, setY, setR, resetParams } = slice.actions;
export default slice.reducer;
