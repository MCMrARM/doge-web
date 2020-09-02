import { configureStore } from '@reduxjs/toolkit'

import configReducer from './admin/redux/serverConfig'

export const store = configureStore({
    reducer: {
        config: configReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;