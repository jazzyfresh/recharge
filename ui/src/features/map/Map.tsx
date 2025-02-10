import React from 'react';
import { useState, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  selectAddress,
  selectLatitude,
  selectLongitude,
  selectZoom,
  selectChargers,
  getChargers,
} from './mapSlice';

const style = {
  height:"650px",
  width: "900px",
};

const DEFAULT_ADDRESS = "317 S Broadway Los Angeles CA"

function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export function Map() {
  const [address, setAddress] = useState(DEFAULT_ADDRESS);
  const latitude = useAppSelector(selectLatitude);
  const longitude = useAppSelector(selectLongitude);
  const zoom = useAppSelector(selectZoom);
  const chargers = useAppSelector(selectChargers);
  const dispatch = useAppDispatch();

  const center = [latitude, longitude];

  useEffect(() => {
    dispatch(getChargers(address));
  }, []);

  return (
    <div id="mapid">
      <TextField 
        id="outlined-basic" 
        label="Address" 
        variant="outlined" 
        value={address} 
        onChange={(e) => setAddress(e.target.value)}
      />
      <Button 
        type="submit" 
        onClick={() => dispatch(getChargers(address))}
      >
        Find Chargers
      </Button>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={style}>
        <ChangeView center={center} zoom={zoom} /> 
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {chargers && chargers.fuel_stations && chargers.fuel_stations.map((charger) => {
            return (
              <Marker key={charger.id} position={[charger.latitude, charger.longitude]}>
                <Popup>
                  <b>{charger.station_name}</b><br />
                  ID: {charger.id}<br />
                  {charger.station_phone}<br />
                  {charger.ev_network}
                </Popup>
              </Marker>
            )
        })}
      </MapContainer>
    </div>
)};
