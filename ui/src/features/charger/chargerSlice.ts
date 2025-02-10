import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store.ts';
import { fetchChargers } from './altFuelAPI.ts';
// TODO: integrate favorites in markers
// import { fetchFavorites } from './rechargeAPI';

export interface ChargerState {
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  chargers: any;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: ChargerState = {
  latitude: 34.052235,
  longitude: -118.243683,
  address: "317 S Broadway Los Angeles CA",
  zoom: 15,
  chargers: [],
};

export const getChargers = createAsyncThunk(
  'charger/getChargers',
  async (address: string) => {
    const response = await fetchChargers(address);
    // The value we return becomes the `fulfilled` action payload
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

export const selectLatitude = (state: RootState) => state.charger.latitude;
export const selectLongitude = (state: RootState) => state.charger.longitude;
export const selectAddress = (state: RootState) => state.charger.address;
export const selectZoom = (state: RootState) => state.charger.zoom;
export const selectChargers = (state: RootState) => state.charger.chargers;

export const { setAddress, changeCenter } = chargerSlice.actions

export default chargerSlice.reducer;
