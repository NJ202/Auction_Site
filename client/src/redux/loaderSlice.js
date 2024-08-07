//showing and hiding the loaders whenever api request is in processing state, like a loading sign between pages
//redux files are called slice as part of convention

import {createSlice} from '@reduxjs/toolkit';

//reducer controls the value of the loading
export const loaderSlice = createSlice({
    name : 'loaders',
    initialState : {
        loading : false,
    },
    reducers: {
        SetLoader : (state,action) => {
            state.loading = action.payload;
        },
    }
});

export const {SetLoader} = loaderSlice.actions;

