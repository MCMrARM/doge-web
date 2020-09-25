import { configureStore } from '@reduxjs/toolkit'

import userReducer, {observeStoreForSaving} from './redux/user'
import guildListReducer from './redux/guildList'
import configReducer from './admin/redux/serverConfig'
import serverInfoReducer from './admin/redux/serverInfo'
import embedListReducer from './admin/redux/embedList'
import leaderboardReducer from './redux/leaderboard'
import ApiClient from "./ApiClient";

export const store = configureStore({
    reducer: {
        user: userReducer,
        guildList: guildListReducer,
        config: configReducer,
        server: serverInfoReducer,
        embedList: embedListReducer,
        leaderboard: leaderboardReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;

observeStoreForSaving(store);

ApiClient.instance.authProvider = {
    getAppJwt(): string | undefined {
        return store.getState().user.user?.appJwt;
    }
};