import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import AuthApiClient, {LoginResponse} from "../AuthApiClient";
import {RootState, store} from "../store";

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
    async (serverId: string) => {
        return AuthApiClient.instance.login(serverId);
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: loadUser(),
    reducers: {
        logOut: state => {
            state.user = undefined;
        },
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

export const {logOut, clearPendingLoginError} = userSlice.actions;

export default userSlice.reducer;