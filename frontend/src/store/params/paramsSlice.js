import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
    name: "params",
    initialState: {
        x: "",
        y: "",
        r: "1"
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
            state.r = "1";
        }
    }
});

export const { setX, setY, setR, resetParams } = slice.actions;
export default slice.reducer;
