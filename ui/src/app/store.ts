import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import chargerReducer from '../features/charger/chargerSlice.ts';

export const store = configureStore({
  reducer: {
    charger: chargerReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
