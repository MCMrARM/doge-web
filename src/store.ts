import { configureStore } from '@reduxjs/toolkit'

import userReducer, {observeStoreForSaving} from './redux/user'
import guildListReducer from './redux/guildList'
import configReducer from './admin/redux/serverConfig'
import serverInfoReducer from './admin/redux/serverInfo'

export const store = configureStore({
    reducer: {
        user: userReducer,
        guildList: guildListReducer,
        config: configReducer,
        server: serverInfoReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;

observeStoreForSaving(store);