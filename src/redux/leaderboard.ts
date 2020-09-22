import {createEntityAdapter, createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import ApiClient from "../ApiClient";
import {RootState} from "../store";
import {LeaderboardData} from "../shared/LeaderboardData";

type LeaderboardWrapper = {
    id: string,
    state: "available" | "pending" | "failed",
    loadMore?: "pending" | "failed",
    data?: LeaderboardData
}

const leaderboardAdapter = createEntityAdapter<LeaderboardWrapper>({});

export const fetchLeaderboard = createAsyncThunk(
    'leaderboard/fetch',
    async (props: {serverId: string, after?: number|string}) => {
        return ApiClient.instance.getLeaderboard(props.serverId, props.after);
    }
);

const leaderboardSlice = createSlice({
    name: 'leaderboard',
    initialState: leaderboardAdapter.getInitialState(),
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchLeaderboard.pending, (state, action) => {
            if (!action.meta.arg.after)
                leaderboardAdapter.upsertOne(state, {id: action.meta.arg.serverId, state: "pending"});
            else if (state.entities[action.meta.arg.serverId])
                leaderboardAdapter.updateOne(state, {id: action.meta.arg.serverId, changes: {loadMore: "pending"}});
        });
        builder.addCase(fetchLeaderboard.fulfilled, (state, action) => {
            if (!action.meta.arg.after) {
                leaderboardAdapter.upsertOne(state, {id: action.meta.arg.serverId, state: "available", data: action.payload});
            } else {
                const el = state.entities[action.meta.arg.serverId];
                if (!el || !el.data)
                    return;
                el.loadMore = undefined;
                el.data.leaderboard = el.data.leaderboard.concat(action.payload.leaderboard);
                el.data.after = action.payload.after;
            }
        });
        builder.addCase(fetchLeaderboard.rejected, (state, action) => {
            if (!action.meta.arg.after)
                leaderboardAdapter.upsertOne(state, {id: action.meta.arg.serverId, state: "failed"});
            else if (state.entities[action.meta.arg.serverId])
                leaderboardAdapter.updateOne(state, {id: action.meta.arg.serverId, changes: {loadMore: "failed"}});
        });
    }
});

export default leaderboardSlice.reducer

export const {
    selectById: selectLeaderboardById
} = leaderboardAdapter.getSelectors<RootState>((state) => state.leaderboard);