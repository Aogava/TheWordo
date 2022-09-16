import { configureStore } from "@reduxjs/toolkit";
import pagesReducer from "./../features/Pages/pagesSlice.js";

export default configureStore({
    reducer: {
        pagesInfo: pagesReducer,
    },
})