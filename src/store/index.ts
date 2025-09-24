import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';
import casesSlice from './slices/casesSlice';
import appSlice from './slices/appSlice';
import authSlice from './slices/authSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['cases'], // Temporarily remove auth from persistence
};

const rootReducer = combineReducers({
  cases: casesSlice,
  app: appSlice,
  auth: authSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;