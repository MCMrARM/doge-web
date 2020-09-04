import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import AuthApiClient, {GuildListEntry} from "../AuthApiClient";

const initialState: GuildListEntry[] = [];

export const fetchGuildList = createAsyncThunk(
    'guildList/fetchGuildList',
    async (code: string) => {
        return AuthApiClient.instance.getGuilds();
    }
);

const guildListSlice = createSlice({
    name: 'guildList',
    initialState: initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchGuildList.fulfilled, (state, action) => {
            return action.payload;
        });
    }
});

export default guildListSlice.reducer;