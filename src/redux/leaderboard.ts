import {createEntityAdapter, createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import ApiClient from "../ApiClient";
import {RootState} from "../store";
import {LeaderboardData} from "../shared/LeaderboardData";

type LeaderboardWrapper = {
    id: string,
    state: "available" | "pending" | "failed",
    data?: LeaderboardData
}

const leaderboardAdapter = createEntityAdapter<LeaderboardWrapper>({});

export const fetchLeaderboard = createAsyncThunk(
    'leaderboard/fetch',
    async (serverId: string) => {
        return ApiClient.instance.getLeaderboard(serverId);
    }
);

const leaderboardSlice = createSlice({
    name: 'leaderboard',
    initialState: leaderboardAdapter.getInitialState(),
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchLeaderboard.pending, (state, action) => {
            leaderboardAdapter.upsertOne(state, {id: action.meta.arg, state: "pending"})
        });
        builder.addCase(fetchLeaderboard.fulfilled, (state, action) => {
            leaderboardAdapter.upsertOne(state, {id: action.meta.arg, state: "available", data: action.payload})
        });
        builder.addCase(fetchLeaderboard.rejected, (state, action) => {
            leaderboardAdapter.upsertOne(state, {id: action.meta.arg, state: "failed"})
        });
    }
});

export default leaderboardSlice.reducer

export const {
    selectById: selectLeaderboardById
} = leaderboardAdapter.getSelectors<RootState>((state) => state.leaderboard);