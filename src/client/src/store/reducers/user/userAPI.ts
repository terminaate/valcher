import {createAsyncThunk} from '@reduxjs/toolkit';
import UserService from '@/services/UserService';
import AuthService from '@/services/AuthService';
import store from "@/store";
import {setNotificationText} from "@/store/reducers/notificationSlice";
import {AxiosError} from "axios";

export const logError = (e: AxiosError<{ message: string }>): void => {
    const errorMessage = getErrorMessage(e)
    if (!import.meta.env.PROD) {
        console.log(errorMessage)
    }
    store.dispatch(setNotificationText(errorMessage))
};

export const getErrorMessage = (e: AxiosError<{ message: string }>): string => e.response!.data.message;

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
    async (
        {
            username,
            password,
            accessToken,
        }: { accessToken?: string; username?: string; password?: string },
        thunkAPI
    ) => {
        try {
            const {data} = accessToken
                ? await AuthService.auth(accessToken)
                : await AuthService.auth('', username, password);
            return data;
        } catch (e: any) {
            logError(e);
            return thunkAPI.rejectWithValue(getErrorMessage(e));
        }
    }
);

export const launchGame = createAsyncThunk(
    'user/launch-game',
    async (_, thunkAPI) => {
        try {
            const {data} = await UserService.launchGame();
            return data.launched;
        } catch (e: any) {
            logError(e);
            return thunkAPI.rejectWithValue(getErrorMessage(e));
        }
    }
);

export default [getUserInfo, auth, launchGame];
