import {configureStore} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import userSlice from './reducers/user/userSlice';
import notificationSlice from "@/store/reducers/notificationSlice";

const store = configureStore({
    reducer: {
        userSlice,
        notificationSlice
    },
});
export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
