import {createEntityAdapter, createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit'
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
    reducers: {
        updateEmbed(state, action: PayloadAction<{guildId: string, channelId: string, messageId: string, embed: ApiEmbed}>) {
            const entity = state.entities[action.payload.guildId + "-" + action.payload.channelId];
            if (!entity || !entity.list)
                return;
            const idx = entity.list.findIndex(x => x.id === action.payload.messageId);
            if (idx !== -1) {
                entity.list[idx] = action.payload.embed;
            } else {
                entity.list.push(action.payload.embed);
            }
        },
        deleteEmbed(state, action: PayloadAction<{guildId: string, channelId: string, messageId: string}>) {
            const entity = state.entities[action.payload.guildId + "-" + action.payload.channelId];
            if (!entity || !entity.list)
                return;
            const idx = entity.list.findIndex(x => x.id === action.payload.messageId);
            if (idx !== -1)
                entity.list = [...entity.list.slice(0, idx), ...entity.list.slice(idx + 1)];
        }
    },
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

export const {
    updateEmbed,
    deleteEmbed
} = embedListSlice.actions;

const {
    selectById: selectEmbedListByInternalId
} = embedListAdapter.getSelectors<RootState>((state) => state.embedList);

export const selectEmbedListById = (state: RootState, guildId: string, channelId: string) => selectEmbedListByInternalId(state, guildId + "-" + channelId);