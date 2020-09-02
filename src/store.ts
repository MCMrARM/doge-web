import { configureStore } from '@reduxjs/toolkit'

import configReducer from './admin/redux/serverConfig'
import serverInfoReducer from './admin/redux/serverInfo'

export const store = configureStore({
    reducer: {
        config: configReducer,
        server: serverInfoReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;