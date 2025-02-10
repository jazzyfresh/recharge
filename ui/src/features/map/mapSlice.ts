import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store.ts';
import { fetchChargers } from './altFuelAPI.ts';
// TODO: integrate favorites in markers
// import { fetchFavorites } from './rechargeAPI';

export interface MapState {
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  chargers: any;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: MapState = {
  latitude: 34.052235,
  longitude: -118.243683,
  address: "317 S Broadway Los Angeles CA",
  zoom: 13,
  chargers: [],
};

export const getChargers = createAsyncThunk(
  'map/getChargers',
  async (address: string) => {
    const response = await fetchChargers(address);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    changeCenter: (state, action: PayloadAction<any>) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
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

export const { changeCenter } = mapSlice.actions;

export const selectLatitude = (state: RootState) => state.map.latitude;
export const selectLongitude = (state: RootState) => state.map.longitude;
export const selectAddress = (state: RootState) => state.map.address;
export const selectZoom = (state: RootState) => state.map.zoom;
export const selectChargers = (state: RootState) => state.map.chargers;

export default mapSlice.reducer;
