import {createEntityAdapter, createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {BotConfig} from "../../shared/BotConfig";
import ApiClient from "../../ApiClient";
import {RootState} from "../../store";

type BotConfigWrapper = {
    id: string,
    state: "available" | "pending" | "failed",
    config?: BotConfig
}

const configAdapter = createEntityAdapter<BotConfigWrapper>({});

export const fetchConfig = createAsyncThunk(
    'admin/config/fetchConfig',
    async (serverId: string) => {
        return ApiClient.instance.getServerConfig(serverId);
    }
);

const configSlice = createSlice({
    name: 'admin/config',
    initialState: configAdapter.getInitialState(),
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchConfig.fulfilled, (state, action) => {
            configAdapter.upsertOne(state, {id: action.meta.arg, state: "available", config: action.payload})
        });
    }
});

export default configSlice.reducer

export const {
    selectById: selectConfigById
} = configAdapter.getSelectors<RootState>((state) => state.config);