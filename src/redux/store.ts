import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; 
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { Persistor } from "redux-persist/es/types";
import { Reducer } from "redux";


const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth"], 
};

const reducer = combineReducers({
  auth: authReducer,
});


const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
  reducer: persistedReducer as Reducer, 
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});


const persistor: Persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store, persistor };
