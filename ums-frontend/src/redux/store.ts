import {configureStore} from "@reduxjs/toolkit";
import authReducer from './Slices/userSlice';
import adminReducer from './Slices/adminSlice';
import {persistReducer, persistStore} from 'redux-persist';
import storage from "redux-persist/lib/storage";

const persistConfig = {
    key:'auth',
    storage
}

const adminpersistConfig = {
    key: 'admin',
    storage
}


const persistAuthReducer = persistReducer(persistConfig,authReducer);
const persisitAdminReducer = persistReducer(adminpersistConfig,adminReducer);

export const store = configureStore({
    reducer:{
        auth:persistAuthReducer,
        admin:persisitAdminReducer,
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: false,
        }),
    
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;