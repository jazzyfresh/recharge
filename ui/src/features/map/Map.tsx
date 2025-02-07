import React from 'react';
import { useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
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

const DEFAULT_CENTER = [34.052235, -118.243683]
const DEFAULT_ZOOM = 13;

function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom = 12);
  return null;
}
function ChargerMarkers(chargers) {
  const map = useMap();
  chargers.fuel_stations.forEach((charger) => {
      <Marker position={[charger.latitude, charger.longitude]}>
        <Popup>
          <b>${charger.station_name}</b><br />
          ID: ${charger.id}<br />
          ${charger.station_phone}<br />
          ${charger.ev_network}
        </Popup>
      </Marker>
  })
}


export function Map() {
  const dispatch = useAppDispatch();
  const latitude = useAppSelector(selectLatitude);
  const longitude = useAppSelector(selectLongitude);
  const zoom = useAppSelector(selectZoom);
  const chargers = useAppSelector(selectChargers);
  const [address, setAddress] = useState('');
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
      <MapContainer center={DEFAULT_CENTER} zoom={DEFAULT_ZOOM} scrollWheelZoom={false} style={style}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
)};
