import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store.ts';
import { fetchChargers } from './altFuelAPI.ts';
import {
  fetchFavorites,
  postFavorite,
  postFeedback,
} from './rechargeAPI';

export interface ChargerState {
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  chargers: any;
  user: any;
  favorites: any;
  feedbackSubmitted: 'idle' | 'loading' | 'success' | 'failed';
  status: 'idle' | 'loading' | 'failed';
}

const initialState: ChargerState = {
  latitude: 34.052235,
  longitude: -118.243683,
  address: "317 S Broadway Los Angeles CA",
  zoom: 15,
  chargers: [],
  user: "jazzyfresh",
  favorites: [],
};

export const getChargers = createAsyncThunk(
  'charger/getChargers',
  async (address: string) => {
    const response = await fetchChargers(address);
    return response.data;
  }
);

export const getFavorites = createAsyncThunk(
  'charger/getFavorites',
  async (address: string) => {
    const response = await fetchFavorites(address);
    return response.data;
  }
);

export const addFavorite = createAsyncThunk(
  'charger/addFavorite',
  async ({ user, chargerId }) => {
    const response = await postFavorite(user, chargerId);
    return response.data;
  }
);

export const addFeedback = createAsyncThunk(
  'charger/addFeedback',
  async ({ user, chargerId, rating, description }) => {
    const response = await postFeedback(user, chargerId, rating, description);
    return response.data;
  }
);

export const chargerSlice = createSlice({
  name: 'charger',
  initialState,
  reducers: {
    changeCenter: (state, action: PayloadAction<any>) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
    },
    setAddress: (state, action: PayloadAction<string>) => {
      state.address = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFavorites.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getFavorites.fulfilled, (state, action) => {
        state.status = 'idle';
        state.favorites = action.payload;
      })
      .addCase(getFavorites.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(addFavorite.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.status = 'idle';
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.status = 'failed';
      })
      .addCase(addFeedback.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addFeedback.fulfilled, (state, action) => {
        state.feedbackSubmitted = 'success';
      })
      .addCase(addFeedback.rejected, (state, action) => {
        state.feedbackSubmitted = 'failed';
      })
      .addCase(getChargers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getChargers.fulfilled, (state, action) => {
        state.status = 'idle';
        state.chargers = action.payload;
        state.latitude = action.payload.latitude;
        state.longitude = action.payload.longitude;
      })
      .addCase(getChargers.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const selectUser = (state: RootState) => state.charger.user;
export const selectLatitude = (state: RootState) => state.charger.latitude;
export const selectLongitude = (state: RootState) => state.charger.longitude;
export const selectAddress = (state: RootState) => state.charger.address;
export const selectZoom = (state: RootState) => state.charger.zoom;
export const selectChargers = (state: RootState) => state.charger.chargers;
export const selectFavorites = (state: RootState) => state.charger.favorites;

export const { setAddress, changeCenter } = chargerSlice.actions

export default chargerSlice.reducer;
