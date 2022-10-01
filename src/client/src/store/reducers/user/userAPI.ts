import {createAsyncThunk} from '@reduxjs/toolkit';
import UserService from '../../../services/UserService';
import AuthService from "../../../services/AuthService";

export const logError = (e: any) => console.log(getErrorMessage(e));

export const getErrorMessage = (e: any) => e.response!.data.message;

export const getUserInfo = createAsyncThunk(
    'user/get-user-info',
    async (_, thunkAPI) => {
        try {
            const {data} = await UserService.getUserInfo();
            return data;
        } catch (e: any) {
            logError(e);
            return thunkAPI.rejectWithValue(getErrorMessage(e));
        }
    }
);

export const auth = createAsyncThunk(
    'auth',
    async ({username, password, puuid}: { puuid?: string, username?: string, password?: string }, thunkAPI) => {
        try {
            const {data} = puuid ? await AuthService.auth(puuid) : await AuthService.auth("", username, password)
            return data;
        } catch (e: any) {
            logError(e);
            return thunkAPI.rejectWithValue(getErrorMessage(e));
        }
    }
);


export default [
    getUserInfo,
    auth
];
