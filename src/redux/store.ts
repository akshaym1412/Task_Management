import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; // ✅ Import authSlice
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { Persistor } from "redux-persist/es/types";
import { Reducer } from "redux";

// ✅ Define persist configuration
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth"], // ✅ Persist only auth state
};

// ✅ Combine reducers
const reducer = combineReducers({
  auth: authReducer,
});

// ✅ Define persisted reducer with proper types
const persistedReducer = persistReducer(persistConfig, reducer);

// ✅ Create store with type enforcement
const store = configureStore({
  reducer: persistedReducer as Reducer, // ✅ Type assertion to match Redux types
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// ✅ Create persistor
const persistor: Persistor = persistStore(store);

// ✅ Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store, persistor };
