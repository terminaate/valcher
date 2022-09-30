import { createAsyncThunk } from '@reduxjs/toolkit';
import UserService, { createPostProps } from '@/services/UserService';

export const logError = (e: any) => console.log(getErrorObject(e).message);

export const getErrorObject = (e: any) => {
	if (Array.isArray(e.response!.data.message)) {
		return {
			...e.response!.data,
			message: e.response!.data.message[0],
		};
	} else {
		return {
			...e.response!.data,
			message: e.response!.data.message,
		};
	}
};

export const getUser = createAsyncThunk(
	'user/get-user',
	async (userId: string, thunkAPI) => {
		try {
			const { data } = await UserService.getUser(userId);
			return data;
		} catch (e: any) {
			logError(e);
			return thunkAPI.rejectWithValue(getErrorObject(e).message);
		}
	}
);

export type editUserProps = {
	id: string;
	email?: string;
	avatar?: string;
	username?: string;
	bio?: string;
};

export const editUser = createAsyncThunk(
	'user/edit-user',
	async (userData: editUserProps, thunkAPI) => {
		try {
			const { data } = await UserService.patchUser(userData);
			return data;
		} catch (e: any) {
			logError(e);
			return thunkAPI.rejectWithValue(getErrorObject(e).message);
		}
	}
);

export const createPost = createAsyncThunk(
	'user/create-post',
	async (postData: createPostProps, thunkAPI) => {
		try {
			const { data } = await UserService.createNewPost(postData);
			return data;
		} catch (e: any) {
			logError(e);
			return thunkAPI.rejectWithValue(getErrorObject(e).message);
		}
	}
);

export const getUserPosts = createAsyncThunk(
	'user/get-posts',
	async (_, thunkAPI) => {
		try {
			const { data } = await UserService.getUserPosts('@me');
			return data;
		} catch (e: any) {
			logError(e);
			return thunkAPI.rejectWithValue(getErrorObject(e).message);
		}
	}
);

export const likePost = createAsyncThunk(
	'user/like-post',
	async (postId: string, thunkAPI) => {
		try {
			const { data } = await UserService.likePost(postId);
			return data;
		} catch (e: any) {
			logError(e);
			return thunkAPI.rejectWithValue(getErrorObject(e).message);
		}
	}
);

export const deletePost = createAsyncThunk(
	'user/delete-post',
	async (postId: string, thunkAPI) => {
		try {
			const { data } = await UserService.deletePost(postId);
			return data;
		} catch (e: any) {
			logError(e);
			return thunkAPI.rejectWithValue(getErrorObject(e).message);
		}
	}
);

export default [
	getUser,
	editUser,
	createPost,
	getUserPosts,
	likePost,
	deletePost,
];
