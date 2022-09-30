import {AnyAction, createSlice, Draft} from '@reduxjs/toolkit';
import userAsyncThunks, {auth, getUserInfo} from './userAPI';

type NullOr<T = any> = null | T;

export interface UserState {
    error: NullOr<string>;
    isPending: boolean,
    authorized: boolean;
    user: {
        puuid: NullOr<string>;
        username: NullOr<string>;
        tag: NullOr<string>;
        profileTitle: NullOr<string>;
        profileCard: NullOr<{
            displayIcon: string;
            smallArt: string;
            wideArt: string;
            largeArt: string;
        }>
    };
}

export const initialState: UserState = {
    error: null,
    isPending: false,
    authorized: false,
    user: {
        puuid: null,
        username: null,
        tag: null,
        profileTitle: null,
        profileCard: null
    }
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser(state, action) {
            return {...state, ...action.payload};
        }
    },
    extraReducers: (builder) => {
        const handleReject = (state: Draft<UserState>, action: AnyAction) => {
            state.error = action.payload;
            state.isPending = false;
        };

        const handlePending = (state: Draft<UserState>) => {
            state.error = null;
            state.isPending = true;
        };

        const handleFulfilled = (state: Draft<UserState>) => {
            state.error = null;
            state.isPending = false;
        };

        for (const asyncThunk of [...userAsyncThunks]) {
            builder.addCase(asyncThunk.pending, handlePending);
            builder.addCase(asyncThunk.rejected, handleReject);
        }

        const handleAuth = (state: Draft<UserState>, action: AnyAction) => {
            localStorage.setItem("puuid", action.payload.puuid);
            state.user = {...initialState.user, puuid: action.payload.puuid};
            state.authorized = true;
            handleFulfilled(state)
        };

        builder.addCase(auth.fulfilled, handleAuth);

        builder.addCase(getUserInfo.fulfilled, (state: Draft<UserState>, action) => {
            state.user = action.payload;
            const users = JSON.parse(localStorage.getItem("puuids")!);
            users.push(state.user);
            localStorage.setItem("puuids", JSON.stringify(users))
            handleFulfilled(state)
        });
    }
});

export const {updateUser} = userSlice.actions;

export default userSlice.reducer;
