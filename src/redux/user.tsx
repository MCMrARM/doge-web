import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import AuthApiClient, {LoginResponse} from "../AuthApiClient";
import {store} from "../store";

type UserState = {
    user?: LoginResponse,
    hasPendingError?: boolean
};

const initialState: UserState = {};

let loadUser = (): UserState => {
    let item = localStorage.getItem("user");
    return item ? JSON.parse(item) : initialState;
};

export const login = createAsyncThunk(
    'user/login',
    async (code: string) => {
        return AuthApiClient.instance.login(code);
    }
);

export const logout = createAsyncThunk(
    'user/logout',
    async () => {
        return AuthApiClient.instance.logout();
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: loadUser(),
    reducers: {
        clearPendingLoginError: state => {
            state.hasPendingError = false;
        }
    },
    extraReducers: builder => {
        builder.addCase(login.pending, (state) => {
            state.hasPendingError = false;
            state.user = undefined;
        });
        builder.addCase(login.fulfilled, (state, action) => {
            console.log(action.payload);
            state.user = action.payload;
        });
        builder.addCase(login.rejected, (state) => {
            state.hasPendingError = false;
        });
        builder.addCase(logout.pending, (state) => {
            state.hasPendingError = false;
            state.user = undefined;
        });
    }
});

export function observeStoreForSaving(st: typeof store) {
    let currentState: UserState|undefined;
    let handleChange = () => {
        let state = st.getState();
        if (state.user !== currentState) {
            localStorage.setItem("user", JSON.stringify(state.user));
            currentState = state.user;
        }
    };

    return st.subscribe(handleChange);
}

export const {clearPendingLoginError} = userSlice.actions;

export default userSlice.reducer;