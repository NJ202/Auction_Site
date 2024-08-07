import { configureStore } from "@reduxjs/toolkit";
import { loaderSlice } from "./loaderSlice";
import { usersSlice } from "./usersSlice";

//reducers passed here
const store = configureStore({
    reducer: {
        loaders : loaderSlice.reducer,
        users : usersSlice.reducer,
    },
});

//this data has to accessible to all the pages and all the componenets,therefire it should be called in app.js or index.js
export default store;