import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NotificationState {
  text: string;
  timeout: number;
}

export const initialState: NotificationState = {
  text: '',
  timeout: 1500,
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotificationText(state, action: PayloadAction<string>) {
      state.text = action.payload;
    },
    setNotificationTimeout(state, action: PayloadAction<number>) {
      state.timeout = action.payload;
    },
    setNotification(state, action: PayloadAction<{ text: string; timeout: number }>) {
      return action.payload;
    },
  },
});

export const { setNotificationText, setNotificationTimeout, setNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
