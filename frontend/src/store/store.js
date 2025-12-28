import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import resultsReducer from "./results/resultsSlice";
import paramsReducer from "./params/paramsSlice";

export default configureStore({
    reducer: {
        auth: authReducer,
        results: resultsReducer,
        params: paramsReducer
    }
});
