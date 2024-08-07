//for storing the user data, user data needs to be accessible across the application so we use slices

//showing and hiding the loaders whenever api request is in processing state, like a loading sign between pages
//redux files are called slice as part of convention

import {createSlice} from '@reduxjs/toolkit';

export const usersSlice = createSlice({
    name : 'users',
    initialState : {
        user : null,
    },
    reducers: {
        SetUser : (state,action) => {
            state.user = action.payload;
        },
    }
});

export const {SetUser} = usersSlice.actions;



