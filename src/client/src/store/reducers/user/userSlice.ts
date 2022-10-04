import {AnyAction, createSlice, Draft} from '@reduxjs/toolkit';
import userAsyncThunks, {auth, getUserInfo, launchGame} from './userAPI';
import History from '@/utils/history';

type NullOr<T = any> = null | T;

export interface UserState {
    error: NullOr<string>;
    isPending: boolean;
    isGameLaunched: boolean;
    authorized: boolean;
    user: {
        puuid: NullOr<string>;
        username: NullOr<string>;
        tag: NullOr<string>;
        playerTitle: NullOr<string>;
        playerCard: NullOr<{
            displayIcon: string;
            smallArt: string;
            wideArt: string;
            largeArt: string;
        }>;
        playerProgress: NullOr<{
            xp: number;
            level: number;
        }>
    };
}

export const initialState: UserState = {
    error: null,
    isPending: false,
    isGameLaunched: false,
    authorized: false,
    user: {
        puuid: null,
        username: null,
        tag: null,
        playerTitle: null,
        playerCard: null,
        playerProgress: null,
    },
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser(state, action) {
            return {...state, ...action.payload};
        },
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
            state.user = {...initialState.user, puuid: action.payload.puuid};
            state.authorized = true;
            if (
                location.pathname === '/' ||
                !localStorage.getItem('puuid') ||
                !localStorage.getItem('puuids') ||
                JSON.parse(localStorage.getItem('puuids')!).length === 0
            ) {
                History.push('/profile');
            }
            localStorage.setItem('puuid', action.payload.puuid);
            handleFulfilled(state);
        };

        builder.addCase(auth.fulfilled, handleAuth);

        builder.addCase(
            getUserInfo.fulfilled,
            (state: Draft<UserState>, action) => {
                state.user = action.payload as any;
                const users = JSON.parse(localStorage.getItem('puuids') as string);
                if (!users.find((u) => u.puuid === state.user.puuid)) {
                    users.push({...state.user});
                }
                localStorage.setItem('puuids', JSON.stringify(users));
                handleFulfilled(state);
            }
        );

        builder.addCase(
            launchGame.fulfilled,
            (state: Draft<UserState>, action) => {
                state.isGameLaunched = action.payload;
                handleFulfilled(state)
            }
        );
    },
});

export const {updateUser} = userSlice.actions;

export default userSlice.reducer;
