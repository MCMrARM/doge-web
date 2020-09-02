import {createEntityAdapter, createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import ApiClient from "../../ApiClient";
import {RootState} from "../../store";
import {ServerInfo} from "../../shared/ServerInfo";

type ServerInfoWrapper = {
    id: string,
    state: "available" | "pending" | "failed",
    info?: ServerInfo
}

const serverAdapter = createEntityAdapter<ServerInfoWrapper>({});

export const fetchServerInfo = createAsyncThunk(
    'admin/server/fetchInfo',
    async (serverId: string) => {
        return ApiClient.instance.getServerInfo(serverId);
    }
);

const serverSlice = createSlice({
    name: 'admin/server',
    initialState: serverAdapter.getInitialState(),
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchServerInfo.fulfilled, (state, action) => {
            serverAdapter.upsertOne(state, {id: action.meta.arg, state: "available", info: action.payload})
        });
    }
});

export default serverSlice.reducer

export const {
    selectById: selectServerInfoById
} = serverAdapter.getSelectors<RootState>((state) => state.server);