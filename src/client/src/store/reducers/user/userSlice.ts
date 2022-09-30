import { AnyAction, createSlice, Draft } from '@reduxjs/toolkit';
import authAsyncThunks, { login, logout, refresh, register } from './authAPI';
import userAsyncThunks, { createPost, deletePost, editUser, getUser, getUserPosts, likePost } from './userAPI';
import useUserAvatar from '@/hooks/useUserAvatar';
import { PostProps } from '@/types/Post';
import usePostImage from '@/hooks/usePostImage';

type NullOrString = null | string;

export interface UserState {
	error: NullOrString;
	authorized: boolean;
	user: {
		id: NullOrString;
		avatar: NullOrString;
		email: NullOrString;
		username: NullOrString;
		posts: PostProps[];
		accessToken: NullOrString;
	};
}

export const initialState: UserState = {
	error: null,
	authorized: false,
	user: {
		id: null,
		avatar: null,
		email: null,
		username: null,
		posts: [] as PostProps[],
		accessToken: null
	}
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		updateUser(state, action) {
			return { ...state, ...action.payload };
		}
	},
	extraReducers: (builder) => {
		const handleAuthReject = (state: Draft<UserState>, action: AnyAction) => {
			state.error = action.payload;
		};

		const handleAuthPending = (state: Draft<UserState>) => {
			state.error = null;
		};

		for (let asyncThunk of [...userAsyncThunks, ...authAsyncThunks]) {
			builder.addCase(asyncThunk.pending, handleAuthPending);
			builder.addCase(asyncThunk.rejected, handleAuthReject);
		}

		const handleAuth = (state: Draft<UserState>, action: AnyAction) => {
			state.user = {
				...action.payload.user,
				accessToken: action.payload.accessToken,
				avatar: useUserAvatar(action.payload.user.id)
			};
			state.authorized = true;
			localStorage.setItem('accessToken', state.user.accessToken!);
		};

		builder.addCase(login.fulfilled, handleAuth);
		builder.addCase(register.fulfilled, handleAuth);

		builder.addCase(refresh.fulfilled, (state: Draft<UserState>, action) => {
			state.user.accessToken = action.payload.accessToken;
			state.authorized = true;
			localStorage.setItem('accessToken', state.user.accessToken!);
		});

		builder.addCase(getUser.fulfilled, (state: Draft<UserState>, action) => {
			state.user = {
				...state.user,
				...action.payload,
				avatar: useUserAvatar(action.payload.id)
			};
		});

		builder.addCase(editUser.fulfilled, (state: Draft<UserState>, action) => {
			state.user = {
				...state.user,
				...action.payload,
				avatar: useUserAvatar(action.payload.id)
			};
		});

		builder.addCase(createPost.fulfilled, (state: Draft<UserState>, action) => {
			state.user.posts = [
				{
					...action.payload,
					image: usePostImage(state.user.id!, action.payload.id!)
				},
				...state.user.posts
			];
		});

		builder.addCase(
			getUserPosts.fulfilled,
			(state: Draft<UserState>, action) => {
				state.user.posts = action.payload;
			}
		);

		builder.addCase(likePost.fulfilled, (state: Draft<UserState>, action) => {
			const postIndex = state.user.posts.findIndex(
				(post) => post.id === action.payload.id!
			);
			state.user.posts[postIndex].likes = action.payload.likes;
		});

		builder.addCase(deletePost.fulfilled, (state: Draft<UserState>, action) => {
			state.user.posts = state.user.posts.filter(
				(post) => post.id !== action.payload.id
			);
		});

		builder.addCase(logout.fulfilled, () => {
			return initialState;
		});
	}
});

export const { updateUser } = userSlice.actions;

export default userSlice.reducer;
