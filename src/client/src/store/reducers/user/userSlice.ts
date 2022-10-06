import {AnyAction, createSlice, Draft} from '@reduxjs/toolkit';
import userAsyncThunks, {auth, getUserInfo, launchGame} from './userAPI';
import History from '@/utils/history';

type NullOr<T = any> = null | T;

export interface UserState {
    error: NullOr<string>;
    isPending: boolean;
    isGameLaunched: boolean;
    authorized: boolean;
    accessToken: NullOr<string>;
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
        }>;
    };
}

export const initialState: UserState = {
    error: null,
    isPending: false,
    isGameLaunched: false,
    authorized: false,
    accessToken: null,
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
            state.accessToken = action.payload.accessToken
            state.authorized = true;
            if (
                location.pathname === '/' ||
                !localStorage.getItem('puuid') ||
                !localStorage.getItem('puuids') ||
                JSON.parse(localStorage.getItem('puuids')!).length === 0
            ) {
                History.push('/profile');
            }
            localStorage.setItem('accessToken', action.payload.accessToken);
            handleFulfilled(state);
        };

        builder.addCase(auth.fulfilled, handleAuth);

        builder.addCase(
            getUserInfo.fulfilled,
            (state: Draft<UserState>, action) => {
                state.user = action.payload as any;
                const accounts = JSON.parse(localStorage.getItem('accounts') as string).filter(u => u === state.accessToken);
                accounts.push({
                    username: state.user.username,
                    accessToken: state.accessToken,
                    avatar: state.user.playerCard?.displayIcon
                });
                localStorage.setItem('accounts', JSON.stringify(accounts));
                handleFulfilled(state);
            }
        );

        builder.addCase(launchGame.fulfilled, (state: Draft<UserState>, action) => {
            state.isGameLaunched = action.payload;
            handleFulfilled(state);
        });
    },
});

export const {updateUser} = userSlice.actions;

export default userSlice.reducer;
