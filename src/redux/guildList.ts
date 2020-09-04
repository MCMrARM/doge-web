import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import AuthApiClient, {GuildListEntry} from "../AuthApiClient";

type GuildListState = {
    state?: "available" | "pending" | "failed",
    list?: GuildListEntry[]
}

const initialState: GuildListState = {};

export const fetchGuildList = createAsyncThunk(
    'guildList/fetchGuildList',
    async () => {
        return AuthApiClient.instance.getGuilds();
    }
);

const guildListSlice = createSlice({
    name: 'guildList',
    initialState: initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchGuildList.pending, (state) => {
            return {state: "pending"};
        });
        builder.addCase(fetchGuildList.rejected, (state) => {
            return {state: "failed"};
        });
        builder.addCase(fetchGuildList.fulfilled, (state, action) => {
            return {
                state: "available",
                list: action.payload
            };
        });
    }
});

export default guildListSlice.reducer;