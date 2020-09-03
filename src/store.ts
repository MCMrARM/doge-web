import { configureStore } from '@reduxjs/toolkit'

import userReducer, {observeStoreForSaving} from './redux/user'
import configReducer from './admin/redux/serverConfig'
import serverInfoReducer from './admin/redux/serverInfo'

export const store = configureStore({
    reducer: {
        user: userReducer,
        config: configReducer,
        server: serverInfoReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;

observeStoreForSaving(store);