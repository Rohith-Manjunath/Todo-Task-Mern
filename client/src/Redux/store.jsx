import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { setupListeners } from "@reduxjs/toolkit/query";
import { myApi } from "./authApi";

const persistConfig = {
  key: "root",
  storage,
  //   whitelist: ["user", "gallery"],
};

const rootReducer = combineReducers({
  [myApi.reducerPath]: myApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(myApi.middleware),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);
