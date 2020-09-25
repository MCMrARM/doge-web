import {createEntityAdapter, createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import ApiClient from "../../ApiClient";
import {RootState} from "../../store";
import {ApiEmbed} from "../../shared/ApiEmbed";

type EmbedListWrapper = {
    id: string,
    guildId: string,
    channelId: string,
    state: "available" | "pending" | "failed",
    list?: ApiEmbed[]
}

const embedListAdapter = createEntityAdapter<EmbedListWrapper>({});

const makeWrapperIdFields = (arg: {guildId: string, channelId: string}) => ({id: arg.guildId + "-" + arg.channelId, guildId: arg.guildId, channelId: arg.channelId});

export const fetchEmbedList = createAsyncThunk(
    'admin/embeds/fetchList',
    async (arg: {guildId: string, channelId: string}) => {
        return ApiClient.instance.getEmbedList(arg.guildId, arg.channelId);
    }
);

const embedListSlice = createSlice({
    name: 'admin/server',
    initialState: embedListAdapter.getInitialState(),
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchEmbedList.pending, (state, action) => {
            embedListAdapter.upsertOne(state, {...makeWrapperIdFields(action.meta.arg), state: "pending"})
        });
        builder.addCase(fetchEmbedList.fulfilled, (state, action) => {
            embedListAdapter.upsertOne(state, {...makeWrapperIdFields(action.meta.arg), state: "available", list: action.payload})
        });
        builder.addCase(fetchEmbedList.rejected, (state, action) => {
            embedListAdapter.upsertOne(state, {...makeWrapperIdFields(action.meta.arg), state: "failed"})
        });
    }
});

export default embedListSlice.reducer

const {
    selectById: selectEmbedListByInternalId
} = embedListAdapter.getSelectors<RootState>((state) => state.embedList);

export const selectEmbedListById = (state: RootState, guildId: string, channelId: string) => selectEmbedListByInternalId(state, guildId + "-" + channelId);