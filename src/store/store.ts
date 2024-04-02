import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/user/userSlice";
import storage from "redux-persist/lib/storage";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import tokenSlice from "./features/token/tokenSlice";
import uuidSlice from "./features/uuid/uuidSlice";
import { setupListeners } from "@reduxjs/toolkit/query";

const reducers = combineReducers({
  user: userSlice,
  token: tokenSlice,
  uuid: uuidSlice,
});

const persistConfig = {
  key: "user",
  storage,
  whitelist: ["user", "token", "uuid"],
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
